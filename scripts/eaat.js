// scripts/eaat.js
const { execSync } = require('child_process');
const fs = require('fs');

const MODIFIED = '2026-08-02';

function dates(file) {
  const first = execSync(`git log --diff-filter=A -1 --format=%ad --date=short -- "${file}"`, { encoding: 'utf8' }).trim();
  const last = execSync(`git log -1 --format=%ad --date=short -- "${file}"`, { encoding: 'utf8' }).trim();
  return { datePublished: first, dateModified: last };
}

function sitemap() {
  const prefixes = [
    '/about', '/privacy', '/contact',
    '/tools/gst', '/tools/hra', '/tools/income-tax', '/tools/rto-tax', '/tools/stamp-duty',
    '/guides/capital-gains-tax-changes-2026', '/guides/gst-for-freelancers-india',
    '/guides/how-to-calculate-stamp-duty', '/guides/how-to-file-itr-2026',
    '/guides/how-to-register-new-car-rto', '/guides/hra-exemption-explained',
    '/guides/section-87a-rebate-explained',
    '/comparisons/ev-vs-petrol-road-tax', '/comparisons/old-vs-new-tax-regime',
    '/comparisons/stamp-duty-rates-all-states',
  ];
  const states = ['andhrapradesh','arunachalpradesh','assam','bihar','chhattisgarh','delhi','goa','gujarat','haryana','himachalpradesh','jharkhand','karnataka','kerala','madhyapradesh','maharashtra','manipur','meghalaya','mizoram','nagaland','odisha','punjab','rajasthan','sikkim','tamilnadu','telangana','tripura','uttarakhand','uttarpradesh','westbengal'];
  states.forEach(s => { prefixes.push('/stamp-duty/' + s); prefixes.push('/rto-tax/' + s); });
  const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
  const out = xml.replace(/(<loc>https:\/\/desicalc\.in)([^<]+)(<\/loc>)([\s\S]*?)(<lastmod>)[^<]*(<\/lastmod>)/g, (m, a, loc, b, links, d, e) =>
    prefixes.some(p => loc === p || loc.startsWith(p + '/')) ? `${a}${loc}${b}${links}${d}${MODIFIED}${e}` : m
  );
  fs.writeFileSync('public/sitemap.xml', out);
  console.log('sitemap lastmod updated to ' + MODIFIED);
}

const cmd = process.argv[2];
if (cmd === 'dates' && process.argv[3]) { console.log(JSON.stringify(dates(process.argv[3]), null, 2)); }
else if (cmd === 'sitemap') { sitemap(); }
else { console.error('Usage: node scripts/eaat.js dates <path> | sitemap'); process.exit(1); }
