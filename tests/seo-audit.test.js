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

const robots = read(path.join(PUBLIC, 'robots.txt'));
checkTrue('robots is plain ASCII', /^[\x00-\x7F]*$/.test(robots));

if (failed) {
  console.error(failures.join('\n'));
  console.error(`\n${failed} failed, ${passed} passed`);
  process.exit(1);
}

console.log(`${passed} checks passed across ${pages.length} pages`);
