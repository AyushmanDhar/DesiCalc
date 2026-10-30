// SEO invariant audit for every HTML page in public/
// Run: node tests/seo-audit.test.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = walk(PUBLIC);
const rel = (p) => path.relative(PUBLIC, p).replace(/\\/g, '/');
const read = (p) => fs.readFileSync(p, 'utf8');
const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const wordCount = (html) => text(html).split(/\s+/).filter((w) => /\w/.test(w)).length;
const count = (html, re) => (html.match(re) || []).length;
const h1Count = (html) => count(html, /<h1\b/gi);
const h3Count = (html) => count(html, /<h3\b/gi);
const titleOf = (html) => (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
const attr = (tag, name) => {
  const re = new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i');
  const match = tag.match(re);
  return match ? match[1] ?? match[2] ?? match[3] ?? '' : '';
};
const tags = (html, tagName) => html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || [];
const descOf = (html) => {
  for (const tag of tags(html, 'meta')) {
    if (attr(tag, 'name').toLowerCase() === 'description') return attr(tag, 'content');
  }
  return '';
};
const canonOf = (html) => {
  for (const tag of tags(html, 'link')) {
    const rels = attr(tag, 'rel').toLowerCase().split(/\s+/);
    if (rels.includes('canonical')) return attr(tag, 'href');
  }
  return '';
};
const canonHostOk = (canon) => canon === 'https://desicalc.in' || canon.startsWith('https://desicalc.in/');
const canonHasHtmlSuffix = (canon) => /\.html\/?$/i.test(canon.split(/[?#]/)[0]);

let passed = 0;
let failed = 0;
const failures = [];

function check(name, actual, expected) {
  if (actual === expected) passed++;
  else {
    failed++;
    failures.push(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function checkTrue(name, condition, detail) {
  if (condition) passed++;
  else {
    failed++;
    failures.push(`${name}${detail ? `: ${detail}` : ''}`);
  }
}

for (const page of pages) {
  const name = rel(page);
  const html = read(page);

  check(`${name} h1 count`, h1Count(html), 1);
  checkTrue(`${name} viewport`, /<meta\s+name="viewport"/i.test(html));

  const canon = canonOf(html);
  checkTrue(`${name} canonical exists`, canonHostOk(canon), canon);
  checkTrue(`${name} canonical has no .html`, !canonHasHtmlSuffix(canon), canon);

  const jsonLd = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of jsonLd) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      checkTrue(`${name} valid JSON-LD`, false, error.message);
    }
  }
}

const titles = pages.map((p) => titleOf(read(p)));
checkTrue('titles unique', new Set(titles).size === titles.length);

for (const page of pages) {
  const html = read(page);
  const titleTag = (html.match(/<title\b[^>]*>/i) || [''])[0];
  checkTrue(`${rel(page)} title has no data-i18n`, !/data-i18n/i.test(titleTag), titleTag);
}

const sitemap = read(path.join(PUBLIC, 'sitemap.xml'));
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
checkTrue('sitemap has locs', locs.length > 0, `${locs.length} locs`);
checkTrue('sitemap locs unique', new Set(locs).size === locs.length);
checkTrue(
  'sitemap absolute URLs',
  locs.every((url) => url.startsWith('https://desicalc.in')),
);

const adTokens = [
  'adsbygoogle',
  'googlesyndication',
  'fundingchoicesmessages',
  'assets/js/ad.js',
  'ca-pub',
  'data-ad-',
  'doubleclick',
  'pagead2',
  'adtrafficquality',
  'ad-slot',
];
for (const page of pages) {
  const html = read(page).toLowerCase();
  for (const token of adTokens) {
    checkTrue(`${rel(page)} no ad token ${token}`, !html.includes(token));
  }
}

for (const asset of ['_headers', 'assets/css/style.css', 'sitemap.xml']) {
  const content = read(path.join(PUBLIC, asset)).toLowerCase();
  for (const token of adTokens) {
    checkTrue(`${asset} no ad token ${token}`, !content.includes(token));
  }
}

const jsFiles = fs
  .readdirSync(path.join(PUBLIC, 'assets', 'js'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => path.join(PUBLIC, 'assets', 'js', f));
jsFiles.push(path.join(PUBLIC, 'sw.js'));
for (const file of jsFiles) {
  const content = read(file).toLowerCase();
  for (const token of adTokens) {
    checkTrue(`${path.basename(file)} no ad token ${token}`, !content.includes(token));
  }
}

const normalizeFaq = (value) =>
  value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\+/g, ' ')
    .replace(/^\s*\d+\.\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

function visibleFaqQuestions(html) {
  const raw = [];
  for (const match of html.matchAll(/<button[^>]*class="[^"]*faq-question[^"]*"[^>]*>([\s\S]*?)<\/button>/gi)) {
    raw.push(match[1]);
  }
  if (raw.length === 0) {
    for (const match of html.matchAll(/<div[^>]*class="[^"]*faq-item[^"]*"[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/gi)) {
      raw.push(match[1]);
    }
  }
  if (raw.length === 0) {
    const section = html.match(/<h2[^>]*>[^<]*Frequently asked[\s\S]*?(?=<h2\b|<\/main>)/i);
    if (section) {
      for (const match of section[0].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)) {
        raw.push(match[1]);
      }
    }
  }
  return raw.map(normalizeFaq).filter(Boolean);
}

function schemaFaqQuestions(html) {
  const raw = [];
  for (const block of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(block[1]);
    } catch {
      continue;
    }
    const nodes = Array.isArray(data) ? data : [data];
    for (const node of nodes) {
      if (node['@type'] === 'FAQPage' && Array.isArray(node.mainEntity)) {
        for (const question of node.mainEntity) {
          if (question.name) raw.push(question.name);
        }
      }
    }
  }
  return raw.map(normalizeFaq).filter(Boolean);
}

for (const page of pages) {
  const html = read(page);
  const schemaQuestions = schemaFaqQuestions(html);
  if (schemaQuestions.length === 0) continue;
  const name = rel(page);
  const visibleQuestions = visibleFaqQuestions(html);
  checkTrue(`${name} visible FAQ count matches schema`, visibleQuestions.length === schemaQuestions.length, `visible ${visibleQuestions.length}, schema ${schemaQuestions.length}`);
  const visibleSet = new Set(visibleQuestions);
  const schemaSet = new Set(schemaQuestions);
  for (const question of schemaQuestions) {
    checkTrue(`${name} visible FAQ matches schema: ${question}`, visibleSet.has(question));
  }
  for (const question of visibleQuestions) {
    checkTrue(`${name} schema FAQ matches visible: ${question}`, schemaSet.has(question));
  }
}

const robots = read(path.join(PUBLIC, 'robots.txt'));
checkTrue('robots is plain ASCII', /^[\x00-\x7F]*$/.test(robots));

const longTitles = [];
const longDescs = [];
for (const page of pages) {
  const name = rel(page);
  const html = read(page);
  const title = titleOf(html).trim();
  const desc = descOf(html);
  checkTrue(`${name} title length`, title.length >= 15 && title.length <= 60, `${title.length} chars`);
  checkTrue(`${name} description length`, desc.length >= 50 && desc.length <= 155, `${desc.length} chars`);
  if (title.length > 60) longTitles.push(name);
  if (desc.length > 155) longDescs.push(name);
  checkTrue(`${name} no hreflang hi`, !/hreflang="hi"/i.test(html));
  checkTrue(`${name} has dateModified`, html.includes('"dateModified"'));
}

const home = read(path.join(PUBLIC, 'index.html'));
checkTrue('home has Organization schema', home.includes('"@type": "Organization"'));

const expectedType = (name) => (name.startsWith('guides/') || name.startsWith('comparisons/') ? 'article' : 'website');
for (const page of pages) {
  const name = rel(page);
  const html = read(page);
  const og = (html.match(/<meta\s+property="og:type"\s+content="([^"]*)"/i) || [])[1];
  check(`${name} og:type`, og, expectedType(name));
}

const ogAttr = (html, prop) => {
  for (const tag of tags(html, 'meta')) {
    if (attr(tag, 'property').toLowerCase() === prop) return attr(tag, 'content');
  }
  return '';
};
for (const page of pages) {
  const name = rel(page);
  const html = read(page);
  check(`${name} og:title matches title`, ogAttr(html, 'og:title'), titleOf(html).trim());
  check(`${name} og:description matches description`, ogAttr(html, 'og:description'), descOf(html));
}

const canonUrls = new Set(pages.map((p) => canonOf(read(p)).replace(/\/$/, '') || ''));
const locSet = new Set(locs.map((u) => u.replace(/\/$/, '')));
for (const page of pages) {
  const canon = canonOf(read(page));
  checkTrue(`${rel(page)} in sitemap`, locSet.has(canon.replace(/\/$/, '')), canon);
}
checkTrue('sitemap no hreflang hi', !/hreflang="hi"/i.test(sitemap));
check(`sitemap URL count`, locs.length, pages.length);

for (const trust of ['methodology', 'editorial-policy']) {
  const file = path.join(PUBLIC, `${trust}.html`);
  checkTrue(`${trust}.html exists`, fs.existsSync(file));
  if (fs.existsSync(file)) {
    const html = read(file);
    checkTrue(`${trust} min words`, wordCount(html) >= 400, `${wordCount(html)} words`);
    check(`${trust} h1`, h1Count(html), 1);
  }
}

for (const page of pages) {
  const html = read(page);
  const footer = (html.match(/<footer[\s\S]*?<\/footer>/i) || [''])[0];
  checkTrue(`${rel(page)} has footer block`, footer.length > 0);
  checkTrue(`${rel(page)} footer methodology link`, /href="\/methodology"/.test(footer));
  checkTrue(`${rel(page)} footer editorial link`, /href="\/editorial-policy"/.test(footer));
}

const homeHtml = read(path.join(PUBLIC, 'index.html'));
checkTrue('home min words', wordCount(homeHtml) >= 600, `${wordCount(homeHtml)} words`);
checkTrue('home last updated', /Last updated/i.test(homeHtml));
checkTrue('home links methodology', /href="\/methodology"/.test(homeHtml));

const toolNames = ['income-tax', 'stamp-duty', 'rto-tax', 'hra', 'gst'];
for (const tool of toolNames) {
  const file = path.join(PUBLIC, 'tools', `${tool}.html`);
  const html = read(file);
  const name = `tools/${tool}`;
  checkTrue(`${name} min words`, wordCount(html) >= 1200, `${wordCount(html)} words`);
  checkTrue(`${name} min h3`, h3Count(html) >= 6, `${h3Count(html)} h3`);
  checkTrue(`${name} has FAQPage`, /"@type":\s*"FAQPage"/.test(html));
  checkTrue(`${name} official source`, /\.gov\.in|incometax\.gov\.in|gst\.gov\.in/i.test(html));
}

const rtoTier1 = ['haryana', 'andhrapradesh', 'maharashtra', 'tamilnadu', 'kerala', 'himachalpradesh', 'karnataka', 'uttarpradesh', 'delhi', 'punjab'];
for (const state of rtoTier1) {
  const name = `rto-tax/${state}`;
  const html = read(path.join(PUBLIC, 'rto-tax', `${state}.html`));
  checkTrue(`${name} min words`, wordCount(html) >= 1800, `${wordCount(html)} words`);
  checkTrue(`${name} min h3`, h3Count(html) >= 8, `${h3Count(html)} h3`);
  checkTrue(`${name} gov sources`, count(html, /\.gov\.in/gi) >= 2);
  checkTrue(`${name} last updated`, /Last updated/i.test(html));
  checkTrue(`${name} FAQPage`, /"@type":\s*"FAQPage"/.test(html));
}

const stampTier1 = ['punjab', 'maharashtra', 'uttarpradesh', 'delhi', 'karnataka'];
for (const state of stampTier1) {
  const name = `stamp-duty/${state}`;
  const html = read(path.join(PUBLIC, 'stamp-duty', `${state}.html`));
  checkTrue(`${name} min words`, wordCount(html) >= 1800, `${wordCount(html)} words`);
  checkTrue(`${name} min h3`, h3Count(html) >= 8, `${h3Count(html)} h3`);
  checkTrue(`${name} gov sources`, count(html, /\.gov\.in/gi) >= 2);
  checkTrue(`${name} last updated`, /Last updated/i.test(html));
  checkTrue(`${name} FAQPage`, /"@type":\s*"FAQPage"/.test(html));
}

const editorialPages = pages.filter((p) => {
  const name = rel(p);
  return name.startsWith('guides/') || name.startsWith('comparisons/');
});
for (const page of editorialPages) {
  const name = rel(page);
  const html = read(page);
  checkTrue(`${name} byline`, html.includes('DesiCalc Editorial Team'));
  checkTrue(`${name} last updated`, /Last updated 30 October 2026/i.test(html));
  checkTrue(`${name} sources section`, /<h2[^>]*>\s*Sources/i.test(html));
  checkTrue(`${name} dateModified matches visible date`, /"dateModified"\s*:\s*"2026-10-30"/.test(html));
}

for (const folder of ['rto-tax', 'stamp-duty']) {
  for (const page of pages.filter((p) => rel(p).startsWith(`${folder}/`) && !rel(p).endsWith('index.html'))) {
    const html = read(page);
    const name = rel(page);
    const faqHeadingIndex = html.search(/<h2[^>]*>[^<]*Frequently asked/i);
    const bodyHtml = faqHeadingIndex === -1 ? html : html.slice(0, faqHeadingIndex);
    checkTrue(`${name} min words`, wordCount(html) >= 800, `${wordCount(html)} words`);
    checkTrue(`${name} min body h3`, h3Count(bodyHtml) >= 5, `${h3Count(bodyHtml)} body h3`);
    checkTrue(`${name} has dateModified`, html.includes('"dateModified"'));
    checkTrue(`${name} has FAQPage`, /"@type":\s*"FAQPage"/.test(html));
  }
}

const trackerFile = path.join(PUBLIC, 'rate-tracker.html');
checkTrue('rate tracker exists', fs.existsSync(trackerFile));
if (fs.existsSync(trackerFile)) {
  const html = read(trackerFile);
  checkTrue('rate tracker min words', wordCount(html) >= 1500, `${wordCount(html)} words`);
  checkTrue('rate tracker CSV link', /rates-2026\.csv/.test(html));
  checkTrue('rate tracker changelog', /changelog/i.test(html));
}
checkTrue('CSV exists', fs.existsSync(path.join(PUBLIC, 'assets', 'data', 'rates-2026.csv')));

for (const page of pages) {
  const html = read(page);
  checkTrue(`${rel(page)} links tailwind.css`, /href="[^"]*assets\/css\/tailwind\.css"/.test(html));
  checkTrue(`${rel(page)} links style.css`, /href="[^"]*assets\/css\/style\.css"/.test(html));
}

const i18nTokens = ['data-i18n', 'lang-toggle', 'setLang', 'initLang', 'onLangChange', 'lang-hi.js', 'lang-en.js', 'DESICALC_LANG'];
for (const page of pages) {
  const html = read(page);
  for (const token of i18nTokens) {
    checkTrue(`${rel(page)} no i18n token ${token}`, !html.includes(token));
  }
}
for (const page of pages) {
  checkTrue(`${rel(page)} no t() i18n call`, !/\bt\('/.test(read(page)));
}
for (const file of fs.readdirSync(path.join(PUBLIC, 'assets', 'js')).filter((f) => f.endsWith('.js'))) {
  checkTrue(`assets/js/${file} no t() i18n call`, !/\bt\('/.test(read(path.join(PUBLIC, 'assets', 'js', file))));
}

checkTrue('lang-en.js removed', !fs.existsSync(path.join(PUBLIC, 'assets', 'js', 'lang-en.js')));
checkTrue('lang-hi.js removed', !fs.existsSync(path.join(PUBLIC, 'assets', 'js', 'lang-hi.js')));

for (const page of pages) {
  const html = read(page);
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [index, match] of scripts.entries()) {
    try {
      new Function(match[1]);
    } catch (error) {
      checkTrue(`${rel(page)} inline script ${index + 1} parses`, false, error.message);
    }
  }
}

if (failed) {
  console.error(failures.join('\n'));
  console.error(`\n${failed} failed, ${passed} passed`);
  process.exit(1);
}

console.log(`${passed} checks passed across ${pages.length} pages`);
