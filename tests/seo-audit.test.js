// Technical SEO audit for every HTML page in public/
// Run: node tests/seo-audit.test.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html') && !entry.name.startsWith('startupranking')) out.push(full);
  }
  return out;
}

const pages = walk(PUBLIC);
const rel = (p) => path.relative(PUBLIC, p).replace(/\\/g, '/');
const read = (p) => fs.readFileSync(p, 'utf8');
const count = (html, re) => (html.match(re) || []).length;
const h1Count = (html) => count(html, /<h1\b/gi);
const titleOf = (html) => (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
const descOf = (html) => (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || '';
const canonOf = (html) => (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';
const footerOf = (html) => (html.match(/<footer[\s\S]*?<\/footer>/i) || [''])[0];

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
  checkTrue(`${name} title`, titleOf(html).trim().length > 0);
  checkTrue(`${name} description`, descOf(html).trim().length > 0);

  const canon = canonOf(html);
  checkTrue(`${name} canonical origin`, /^https:\/\/desicalc\.in(\/|$)/.test(canon), canon);
  checkTrue(`${name} canonical has no .html`, !/\.html\/?$/i.test(canon), canon);

  checkTrue(`${name} no hreflang hi`, !/hreflang="hi"/i.test(html));
  checkTrue(`${name} has dateModified`, html.includes('"dateModified"'));
  checkTrue(`${name} links tailwind.css`, /href="[^"]*assets\/css\/tailwind\.css"/.test(html));
  checkTrue(`${name} links style.css`, /href="[^"]*assets\/css\/style\.css"/.test(html));
  checkTrue(`${name} footer methodology`, /href="\/methodology"/.test(footerOf(html)));
  checkTrue(`${name} footer editorial`, /href="\/editorial-policy"/.test(footerOf(html)));

  const jsonLd = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of jsonLd) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      checkTrue(`${name} valid JSON-LD`, false, error.message);
    }
  }

  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [index, match] of scripts.entries()) {
    try {
      new Function(match[1]);
    } catch (error) {
      checkTrue(`${name} inline script ${index + 1} parses`, false, error.message);
    }
  }
}

const titles = pages.map((p) => titleOf(read(p)).trim());
checkTrue('titles unique', new Set(titles).size === titles.length);

const adTokens = ['adsbygoogle', 'googlesyndication', 'fundingchoicesmessages', 'assets/js/ad.js'];
const i18nTokens = ['data-i18n', 'lang-toggle', 'setLang', 'initLang', 'onLangChange', 'lang-hi.js', 'lang-en.js', 'DESICALC_LANG'];
for (const page of pages) {
  const html = read(page).toLowerCase();
  for (const token of adTokens) checkTrue(`${rel(page)} no ad token ${token}`, !html.includes(token));
  for (const token of i18nTokens) checkTrue(`${rel(page)} no i18n token ${token}`, !html.includes(token));
  checkTrue(`${rel(page)} no t() i18n call`, !/\bt\('/.test(read(page)));
}

for (const file of fs.readdirSync(path.join(PUBLIC, 'assets', 'js')).filter((f) => f.endsWith('.js'))) {
  const name = `assets/js/${file}`;
  const source = read(path.join(PUBLIC, 'assets', 'js', file));
  checkTrue(`${name} no t() i18n call`, !/\bt\('/.test(source));
  for (const token of ['adsbygoogle', 'googlesyndication', 'DESICALC_LANG']) {
    checkTrue(`${name} no token ${token}`, !source.includes(token));
  }
}

checkTrue('lang-en.js removed', !fs.existsSync(path.join(PUBLIC, 'assets', 'js', 'lang-en.js')));
checkTrue('lang-hi.js removed', !fs.existsSync(path.join(PUBLIC, 'assets', 'js', 'lang-hi.js')));
checkTrue('rate tracker exists', fs.existsSync(path.join(PUBLIC, 'rate-tracker.html')));
checkTrue('rate CSV exists', fs.existsSync(path.join(PUBLIC, 'assets', 'data', 'rates-2026.csv')));
checkTrue('methodology exists', fs.existsSync(path.join(PUBLIC, 'methodology.html')));
checkTrue('editorial policy exists', fs.existsSync(path.join(PUBLIC, 'editorial-policy.html')));

const sitemap = read(path.join(PUBLIC, 'sitemap.xml'));
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const locSet = new Set(locs.map((url) => url.replace(/\/$/, '')));
checkTrue('sitemap locs unique', new Set(locs).size === locs.length);
checkTrue('sitemap absolute URLs', locs.every((url) => { try { return new URL(url).origin === 'https://desicalc.in'; } catch { return false; } }));
checkTrue('sitemap no hreflang hi', !/hreflang="hi"/i.test(sitemap));
check(`sitemap URL count`, locs.length, pages.length);
for (const page of pages) {
  const canon = canonOf(read(page)).replace(/\/$/, '');
  checkTrue(`${rel(page)} in sitemap`, locSet.has(canon), canon);
}

if (failed) {
  console.error(failures.join('\n'));
  console.error(`\n${failed} failed, ${passed} passed`);
  process.exit(1);
}

console.log(`${passed} checks passed across ${pages.length} pages`);
