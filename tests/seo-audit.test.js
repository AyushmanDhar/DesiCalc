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
const descOf = (html) => (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || '';
const canonOf = (html) => (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';

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
  checkTrue(`${name} canonical exists`, canon.startsWith('https://desicalc.in'), canon);
  checkTrue(`${name} canonical has no .html`, !canon.endsWith('.html'), canon);

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
checkTrue('sitemap locs unique', new Set(locs).size === locs.length);
checkTrue(
  'sitemap absolute URLs',
  locs.every((url) => url.startsWith('https://desicalc.in')),
);

if (failed) {
  console.error(failures.join('\n'));
  console.error(`\n${failed} failed, ${passed} passed`);
  process.exit(1);
}

console.log(`${passed} checks passed across ${pages.length} pages`);
