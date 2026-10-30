const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const RATE_FILE = path.join(PUBLIC, 'assets', 'js', 'state-rates.js');
const HTML_FILE = path.join(PUBLIC, 'rate-tracker.html');
const CSV_FILE = path.join(PUBLIC, 'assets', 'data', 'rates-2026.csv');
const TODAY = '2026-10-31';

const source = fs.readFileSync(RATE_FILE, 'utf8');
const { RTO_RATES, STAMP_DUTY_RATES } = eval(`${source}\n;({RTO_RATES, STAMP_DUTY_RATES});`);

function clampNumber(value) {
  return Math.round(value * 100) / 100;
}

function collectRateValues(node, out = []) {
  if (node == null) return out;
  if (Array.isArray(node)) {
    for (const item of node) {
      if (item && typeof item === 'object' && typeof item.rate === 'number') out.push(item.rate);
      else collectRateValues(item, out);
    }
    return out;
  }
  if (typeof node === 'object') {
    if (typeof node.rate === 'number') out.push(node.rate);
    else for (const value of Object.values(node)) collectRateValues(value, out);
  }
  return out;
}

function carRange(entry) {
  const rates = collectRateValues(entry.slabs || entry.rateSlabs || []);
  if (typeof entry.rate === 'number') rates.push(entry.rate);
  const percentages = rates.filter((rate) => Number.isFinite(rate) && rate > 0 && rate <= 100);
  if (!percentages.length) return { min: '', max: '', display: 'Fixed amount by engine capacity' };
  const min = Math.min(...percentages);
  const max = Math.max(...percentages);
  return { min: clampNumber(min), max: clampNumber(max), display: min === max ? `${min}%` : `${min}-${max}%` };
}

function stampRange(entry) {
  let male = [];
  let female = [];

  if (entry.rate && typeof entry.rate === 'object') {
    for (const value of Object.values(entry.rate)) {
      if (typeof value === 'number') {
        male.push(value);
        female.push(value);
      } else if (value && typeof value === 'object') {
        if (typeof value.male === 'number') male.push(value.male);
        if (typeof value.female === 'number') female.push(value.female);
      }
    }
  }

  if (entry.rateSlabs) collectRateValues(entry.rateSlabs, male), collectRateValues(entry.rateSlabs, female);
  if (entry.firstSaleFlatSlabs) collectRateValues(entry.firstSaleFlatSlabs, male), collectRateValues(entry.firstSaleFlatSlabs, female);
  if (entry.rateSlabsByGender) {
    collectRateValues(entry.rateSlabsByGender.male, male);
    collectRateValues(entry.rateSlabsByGender.female, female);
  }
  male = male.filter((rate) => Number.isFinite(rate) && rate >= 0 && rate <= 100);
  female = female.filter((rate) => Number.isFinite(rate) && rate >= 0 && rate <= 100);

  const span = (values) => {
    if (!values.length) return '';
    const min = Math.min(...values);
    const max = Math.max(...values);
    return min === max ? `${min}` : `${min}-${max}`;
  };

  return { male: span(male), female: span(female) };
}

function evTreatment(entry) {
  const ev = entry.evExemption;
  if (!ev) return 'No separate EV concession in the rate file';

  let text;
  if (ev.lifeTax === 'full') {
    text = 'Full life-tax exemption';
    if (ev.evPriceCap) text += ` up to Rs ${ev.evPriceCap / 100000} lakh`;
    if (ev.evAboveCapConcession) text += `, then ${ev.evAboveCapConcession}% concession above the cap`;
  } else if (ev.lifeTax === 'concession') {
    text = `${ev.concessionPercent}% concession on life tax`;
  } else if (ev.lifeTax === 'partial') {
    text = `EV rate ${ev.evRate}%`;
  } else if (ev.lifeTax === 'slabbed') {
    const rates = collectRateValues(entry.evSlabs || entry.evExemption.evSlabs || []).filter((rate) => Number.isFinite(rate) && rate > 0 && rate <= 100);
    text = rates.length ? `EV slabs ${Math.min(...rates)}-${Math.max(...rates)}%` : 'EV slab rates apply';
  } else {
    text = 'EV treatment recorded in the rate file';
  }

  if (ev.registration) text += '; registration fee waived';
  return text;
}

function registrationText(entry) {
  const registration = entry.registration;
  if (!registration) return 'Not recorded';
  if (registration.slabs) return 'Fixed slab fee';
  if (typeof registration.rate === 'number') {
    let text = `${registration.rate}%`;
    if (registration.cap) text += ` (cap Rs ${registration.cap.toLocaleString('en-IN')})`;
    return text;
  }
  return 'Not recorded';
}

const sourceMap = new Map();
if (fs.existsSync(CSV_FILE)) {
  const lines = fs.readFileSync(CSV_FILE, 'utf8').trim().split(/\r?\n/).slice(1);
  for (const line of lines) {
    const [state, , , , , url] = line.split(',');
    sourceMap.set(state, url);
  }
}

const states = Object.entries(RTO_RATES);

const rtoRows = states.map(([id, entry]) => {
  const range = carRange(entry);
  return `<tr><td class="px-3 py-2 border-b border-stone-200">${entry.name}</td><td class="px-3 py-2 border-b border-stone-200">${range.display}</td><td class="px-3 py-2 border-b border-stone-200">${evTreatment(entry)}</td></tr>`;
});

const stampRows = states.map(([id, entry]) => {
  const stamp = STAMP_DUTY_RATES[id];
  const range = stampRange(stamp || {});
  return `<tr><td class="px-3 py-2 border-b border-stone-200">${entry.name}</td><td class="px-3 py-2 border-b border-stone-200">${range.male || '—'}</td><td class="px-3 py-2 border-b border-stone-200">${range.female || '—'}</td><td class="px-3 py-2 border-b border-stone-200">${registrationText(stamp || {})}</td></tr>`;
});

let html = fs.readFileSync(HTML_FILE, 'utf8');
const replaceBody = (caption, rows) => {
  const pattern = new RegExp(`(<caption[^>]*>${caption}</caption>[\\s\\S]*?<tbody>)[\\s\\S]*?(</tbody>)`);
  if (!pattern.test(html)) throw new Error(`Table not found: ${caption}`);
  html = html.replace(pattern, `$1\n${rows.join('\n')}\n$2`);
};
replaceBody('2026 private car road tax rates and EV treatment by state', rtoRows);
replaceBody('2026 stamp duty and registration rates by state', stampRows);

const fullEvCount = states.filter(([, entry]) => entry.evExemption && entry.evExemption.lifeTax === 'full').length;
const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
html = html.replace(/[A-Za-z]+ of the 29 jurisdictions/, `${words[fullEvCount]} of the 29 jurisdictions`);
html = html.replace(/"dateModified":"2026-10-30"/g, `"dateModified":"${TODAY}"`);
html = html.replace(/Last updated 30 October 2026/g, 'Last updated 31 October 2026');
if (!html.includes('2026-10-31 &mdash;')) {
  html = html.replace(
    '<h2 class="text-xl font-bold text-stone-900 mt-10 mb-3">Changelog</h2>\n      <ul class="space-y-2 text-stone-600">',
    `<h2 class="text-xl font-bold text-stone-900 mt-10 mb-3">Changelog</h2>\n      <ul class="space-y-2 text-stone-600">\n        <li>2026-10-31 &mdash; Regenerated the tracker and CSV from the latest rate audit.</li>`,
  );
}
fs.writeFileSync(HTML_FILE, html);

const csv = ['state,rto_car_min_pct,rto_car_max_pct,stamp_male_pct,stamp_female_pct,source_url'];
for (const [id, entry] of states) {
  const range = carRange(entry);
  const stamp = stampRange(STAMP_DUTY_RATES[id] || {});
  const url = sourceMap.get(entry.name) || '';
  csv.push([entry.name, range.min, range.max, stamp.male, stamp.female, url].join(','));
}
fs.writeFileSync(CSV_FILE, `${csv.join('\n')}\n`);

console.log(`regenerated ${states.length} rows; ${fullEvCount} full EV exemptions`);
