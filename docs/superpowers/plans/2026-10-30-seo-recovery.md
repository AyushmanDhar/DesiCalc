# DesiCalc SEO Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recover organic search visibility for desicalc.in after the September 2026 Google spam update by removing spam-risk signals, rebuilding thin pages, adding trust signals, and starting authority work.

**Architecture:** Static HTML site under `public/`, no framework, no build step beyond Tailwind. Work is applied directly to HTML files, with Node scripts for mechanical sitewide edits and a Node test suite that audits every page for SEO invariants. Content is hand-written into existing page shells; calculators and rate data are unchanged.

**Tech Stack:** Static HTML, Tailwind CSS 3, vanilla JS, Node.js test scripts, PowerShell on Windows.

## Global Constraints

- Do not invent tax rates, fees, or official facts. Every rate must match `public/assets/js/state-rates.js` or an official government source linked on the page.
- No personal names or invented personas. Byline must be exactly `DesiCalc Editorial Team`.
- No AdSense markup, AdSense scripts, or ad network domains anywhere in `public/`.
- Titles ≤ 60 characters, meta descriptions ≤ 155 characters, one `h1` per page.
- No `hreflang="hi"` links. Use `en` and `x-default` only.
- All canonical URLs are absolute and omit `.html`.
- Keep the existing visual design, Tailwind classes, header, and footer structure.
- Keep calculations working. `npm test` must pass after every task.
- Budget is zero. Do not add paid tools or services.
- Do not run `git commit` steps unless the user has explicitly authorized commits for this plan. If not authorized, stage files and stop.
- Work from repo root: `C:\Users\dhara\desicalc`.

## File Structure

- `tests/seo-audit.test.js` — SEO invariant audit for all HTML pages
- `scripts/remove-adsense.js` — one-time AdSense removal
- `scripts/fix-seo-head.js` — hreflang, `dateModified`, `og:type` normalization
- `scripts/generate-sitemap.js` — rebuild `public/sitemap.xml`
- `scripts/add-footer-links.js` — add trust page links to every footer
- `public/methodology.html` — rate verification methodology
- `public/editorial-policy.html` — sourcing, corrections, funding
- `public/about.html` — expanded publisher information
- `public/index.html` — homepage rewrite
- `public/tools/*.html` — five tool page rewrites
- `public/rto-tax/*.html` — Tier 1 state page rebuilds and Tier 2 light fixes
- `public/stamp-duty/*.html` — Tier 1 state page rebuilds and Tier 2 light fixes
- `public/comparisons/*.html`, `public/guides/*.html` — byline and freshness updates
- `public/rate-tracker.html` — linkable 2026 rate tracker asset
- `docs/seo/baseline-2026-10-30.md` — baseline metrics snapshot
- `docs/seo/weekly-log.md` — weekly measurement log

## Tier 1 page lists

RTO Tier 1: `haryana`, `andhrapradesh`, `maharashtra`, `tamilnadu`, `kerala`, `himachalpradesh`, `karnataka`, `uttarpradesh`, `delhi`, `punjab`.

Stamp Tier 1: `punjab`, `maharashtra`, `uttarpradesh`, `delhi`, `karnataka`.

Tool pages: `income-tax`, `stamp-duty`, `rto-tax`, `hra`, `gst`.

---

### Task 1: SEO audit harness and baseline snapshot

**Files:**
- Create: `tests/seo-audit.test.js`
- Create: `docs/seo/baseline-2026-10-30.md`
- Modify: `package.json`

**Interfaces:**
- Produces: `tests/seo-audit.test.js` exports nothing; it runs a pass/fail audit and exits non-zero on failure. Later tasks append checks to this file using the shared helpers `walk`, `read`, `text`, `wordCount`, `h3Count`, `h1Count`, `titleOf`, `descOf`, `canonOf`, `check`, `checkTrue`, `rel`.

- [ ] **Step 1: Write the audit harness with baseline invariants**

Create `tests/seo-audit.test.js`:

```js
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
```

- [ ] **Step 2: Run the audit and confirm it passes**

Run: `node tests/seo-audit.test.js`
Expected: PASS. If any canonical is missing, fix that page before continuing.

- [ ] **Step 3: Add the audit to npm test**

Modify `package.json` so the test script runs both suites:

```json
"test": "node tests/state-rates.test.js && node tests/seo-audit.test.js"
```

- [ ] **Step 4: Write the baseline snapshot**

Create `docs/seo/baseline-2026-10-30.md`:

```markdown
# SEO Baseline — 2026-10-30

Captured from Google Search Console, last 3 months (2026-07-28 to 2026-10-27).

- Clicks: 3
- Impressions: 702
- CTR: 0.4%
- Average position: 39
- Indexed pages: 73 of 81
- Manual actions: none
- Security issues: none

Top pages by impressions:
1. /rto-tax/haryana — 90
2. /rto-tax/andhrapradesh — 87
3. /stamp-duty/punjab — 57
4. /rto-tax/maharashtra — 56
5. /rto-tax/tamilnadu — 37
6. / — 31
7. /rto-tax/kerala — 31
8. /rto-tax/himachalpradesh — 29
9. /rto-tax/karnataka — 27
10. /rto-tax/ — 21

Top queries:
- andhra pradesh road tax for cars — 12 impressions
- andhra pradesh road tax for other state vehicles — 7
- noida registry charges calculator — 6
- road tax in haryana — 5
- andhra pradesh road tax — 5
- one time tax for a new car is for — 4
- road tax andhra pradesh — 4
- stamp duty in punjab — 4
- stamp duty rate in noida — 4
- stamp duty in maharashtra — 3

Context: impressions collapsed in the same window as the Google September 2026
spam update (2026-09-24 to 2026-10-08). No manual action, so this is treated as
an algorithmic quality classification of thin or scaled pages.

Targets: Day 60 ≥1,500 impressions and ≥30 clicks; Day 90 ≥4,000 impressions,
≥120 clicks, position <30; Day 180 ≥10,000 impressions, ≥500 clicks,
position <20.
```

- [ ] **Step 5: Verify tests pass**

Run: `npm test`
Expected: both suites print pass summaries and exit 0.

- [ ] **Step 6: Commit**

```bash
git add tests/seo-audit.test.js package.json docs/seo/baseline-2026-10-30.md docs/superpowers/specs docs/superpowers/plans
git commit -m "test(seo): add page audit harness and baseline snapshot"
```

---

### Task 2: Remove AdSense and clean robots.txt

**Files:**
- Create: `scripts/remove-adsense.js`
- Modify: `public/_headers`
- Modify: `public/robots.txt`
- Modify: all `public/**/*.html` (via script)
- Test: `tests/seo-audit.test.js`

**Interfaces:**
- Consumes: helpers from Task 1.
- Produces: zero ad tokens in `public/`; ASCII-only `robots.txt`.

- [ ] **Step 1: Add failing tests**

Append to `tests/seo-audit.test.js` before the `if (failed)` block:

```js
const adTokens = ['adsbygoogle', 'googlesyndication', 'fundingchoicesmessages', 'assets/js/ad.js'];
for (const page of pages) {
  const html = read(page).toLowerCase();
  for (const token of adTokens) {
    checkTrue(`${rel(page)} no ad token ${token}`, !html.includes(token));
  }
}

const robots = read(path.join(PUBLIC, 'robots.txt'));
checkTrue('robots is plain ASCII', /^[\x00-\x7F]*$/.test(robots));
```

- [ ] **Step 2: Run tests and confirm they fail**

Run: `node tests/seo-audit.test.js`
Expected: FAIL, listing ad tokens and a robots ASCII failure.

- [ ] **Step 3: Write the removal script**

Create `scripts/remove-adsense.js`:

```js
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

for (const file of walk(PUBLIC)) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = html.replace(/[ \t]*<script[^>]*adsbygoogle\.js[^>]*><\/script>\s*/gi, '');
  html = html.replace(/[ \t]*<script[^>]*src="[^"]*ad\.js"[^>]*><\/script>\s*/gi, '');
  html = html.replace(/[ \t]*<ins[^>]*adsbygoogle[\s\S]*?<\/ins>\s*/gi, '');
  html = html.replace(/[ \t]*<script>\s*\(adsbygoogle[\s\S]*?<\/script>\s*/gi, '');
  html = html.replace(/[ \t]*<script[^>]*>[\s\S]*?adsbygoogle[\s\S]*?<\/script>\s*/gi, '');
  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log(`cleaned ${path.relative(PUBLIC, file)}`);
  }
}
```

- [ ] **Step 4: Run the removal script**

Run: `node scripts/remove-adsense.js`
Expected: prints each cleaned file.

- [ ] **Step 5: Update CSP and robots.txt**

In `public/_headers`, remove `https://pagead2.googlesyndication.com`, `https://ep2.adtrafficquality.google`, `https://ep1.adtrafficquality.google`, `https://googleads.g.doubleclick.net`, `https://fundingchoicesmessages.google.com`, and `https://www.google.com` from the CSP directives. Keep `'self'`, `'unsafe-inline'`, `https://static.cloudflareinsights.com`, and `https://cdn.jsdelivr.net`.

Replace `public/robots.txt` with:

```
User-agent: *
Allow: /
Allow: /.well-known/

Sitemap: https://desicalc.in/sitemap.xml
```

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public scripts/remove-adsense.js tests/seo-audit.test.js
git commit -m "fix(seo): remove unapproved AdSense markup and clean robots.txt"
```

---

### Task 3: Normalize head tags and rebuild sitemap

**Files:**
- Create: `scripts/fix-seo-head.js`
- Create: `scripts/generate-sitemap.js`
- Modify: all `public/**/*.html` (via script)
- Modify: `public/sitemap.xml`
- Test: `tests/seo-audit.test.js`

**Interfaces:**
- Produces: no `hreflang="hi"`, one `dateModified` JSON-LD block per page, `og:type` correct per directory, sitemap containing every page canonical exactly once.

- [ ] **Step 1: Add failing tests**

Append before `if (failed)`:

```js
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

const canonUrls = new Set(pages.map((p) => canonOf(read(p)).replace(/\/$/, '') || ''));
const locSet = new Set(locs.map((u) => u.replace(/\/$/, '')));
for (const page of pages) {
  const canon = canonOf(read(page));
  checkTrue(`${rel(page)} in sitemap`, locSet.has(canon.replace(/\/$/, '')), canon);
}
checkTrue('sitemap no hreflang hi', !/hreflang="hi"/i.test(sitemap));
check(`sitemap URL count`, locs.length, pages.length);
```

- [ ] **Step 2: Run tests and confirm failures**

Run: `node tests/seo-audit.test.js`
Expected: FAIL on long titles/descriptions, hreflang, missing `dateModified`, og:type, sitemap.

- [ ] **Step 3: Write head normalization script**

Create `scripts/fix-seo-head.js`:

```js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const TODAY = '2026-10-30';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function cleanUrl(file) {
  const rel = path.relative(PUBLIC, file).replace(/\\/g, '/');
  if (rel === 'index.html') return 'https://desicalc.in/';
  if (rel.endsWith('/index.html')) return `https://desicalc.in/${rel.slice(0, -'index.html'.length)}`;
  return `https://desicalc.in/${rel.replace(/\.html$/, '')}`;
}

for (const file of walk(PUBLIC)) {
  let html = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(PUBLIC, file).replace(/\\/g, '/');

  html = html.replace(/[ \t]*<link\s+rel="alternate"\s+hreflang="hi"[^>]*>\s*/gi, '');

  const ogType = relPath.startsWith('guides/') || relPath.startsWith('comparisons/') ? 'article' : 'website';
  if (/<meta\s+property="og:type"\s+content="[^"]*"/i.test(html)) {
    html = html.replace(/<meta\s+property="og:type"\s+content="[^"]*"/i, `<meta property="og:type" content="${ogType}">`);
  } else {
    html = html.replace(/<\/head>/i, `  <meta property="og:type" content="${ogType}">\n</head>`);
  }

  if (!html.includes('"dateModified"')) {
    const url = cleanUrl(file);
    const block =
      `  <script type="application/ld+json">\n` +
      `  {"@context":"https://schema.org","@type":"WebPage","url":"${url}","dateModified":"${TODAY}"}\n` +
      `  </script>\n`;
    html = html.replace(/<\/head>/i, `${block}</head>`);
  }

  if (relPath === 'index.html' && !html.includes('"@type": "Organization"')) {
    const block =
      `  <script type="application/ld+json">\n` +
      `  {"@context":"https://schema.org","@type":"Organization","name":"DesiCalc","url":"https://desicalc.in","logo":"https://desicalc.in/assets/img/og-home.png","sameAs":["https://github.com/AyushmanDhar/desicalc"]}\n` +
      `  </script>\n`;
    html = html.replace(/<\/head>/i, `${block}</head>`);
  }

  fs.writeFileSync(file, html);
}

console.log('head normalization complete');
```

- [ ] **Step 4: Write the sitemap generator**

Create `scripts/generate-sitemap.js`:

```js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const TODAY = '2026-10-30';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function cleanUrl(file) {
  const rel = path.relative(PUBLIC, file).replace(/\\/g, '/');
  if (rel === 'index.html') return 'https://desicalc.in/';
  if (rel.endsWith('/index.html')) return `https://desicalc.in/${rel.slice(0, -'index.html'.length)}`;
  return `https://desicalc.in/${rel.replace(/\.html$/, '')}`;
}

function lastCommitDate(file) {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: ROOT, encoding: 'utf8' }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : TODAY;
  } catch {
    return TODAY;
  }
}

const entries = walk(PUBLIC)
  .map((file) => ({ file, loc: cleanUrl(file), lastmod: lastCommitDate(file) }))
  .sort((a, b) => a.loc.localeCompare(b.loc));

const body = entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${entry.loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${entry.loc}" />
    <lastmod>${entry.lastmod}</lastmod>
    <priority>${entry.loc === 'https://desicalc.in/' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), xml);
console.log(`sitemap written with ${entries.length} URLs`);
```

- [ ] **Step 5: Run both scripts**

Run: `node scripts/fix-seo-head.js; node scripts/generate-sitemap.js`
Expected: `head normalization complete` and `sitemap written with 80 URLs`.

- [ ] **Step 6: Fix titles and descriptions manually**

Apply the Tier 1 values below exactly. For every other page, shorten the existing title to ≤60 characters and the description to ≤155 characters without changing meaning. Keep the page's primary keyword first.

| File | Title | Description |
|------|-------|-------------|
| `index.html` | `DesiCalc — Free Indian Tax & Road Tax Calculators 2026` | `Free instant calculators for income tax, stamp duty and RTO road tax. Verified 2026 rates for 28 states and Delhi.` |
| `tools/income-tax.html` | `Income Tax Calculator FY 2026-27 — Old vs New Regime` | `Calculate income tax for FY 2026-27 under old and new regimes. Slabs, 87A rebate, surcharge and cess, with worked examples.` |
| `tools/stamp-duty.html` | `Stamp Duty Calculator 2026 — All States & Registration` | `Calculate stamp duty and registration charges for property in 28 states and Delhi. 2026 rates by gender and city.` |
| `tools/rto-tax.html` | `RTO Road Tax Calculator 2026 — All States, Cars & Bikes` | `Calculate road tax, registration fee and HSRP for any Indian state. Cars, bikes, EVs and commercial vehicles.` |
| `tools/hra.html` | `HRA Exemption Calculator FY 2026-27 — Section 10(13A)` | `Calculate your HRA exemption under Section 10(13A) for metro and non-metro cities, with worked examples and rules.` |
| `tools/gst.html` | `GST Calculator 2026 — Regular & Composition Scheme` | `Calculate GST for goods and services at 2026 rates. Regular and composition schemes, inclusive and exclusive amounts.` |
| `rto-tax/haryana.html` | `Haryana Road Tax Calculator 2026 — Car, Bike & EV` | `Haryana road tax rates for 2026: cars 5–10%, bikes 4–8%, EVs exempt up to ₹30 lakh. Tax, registration and HSRP.` |
| `rto-tax/andhrapradesh.html` | `Andhra Pradesh Road Tax Calculator 2026 — Car & Bike` | `Andhra Pradesh road tax 2026: cars 12–14%, bikes 9–12%, plus safety cess. Life tax, registration and on-road price.` |
| `rto-tax/maharashtra.html` | `Maharashtra Road Tax Calculator 2026 — Car & Bike` | `Maharashtra road tax 2026: petrol cars 11–13%, diesel 13–15%, plus 2% road safety cess. Tax and registration charges.` |
| `rto-tax/tamilnadu.html` | `Tamil Nadu Road Tax Calculator 2026 — Car & EV` | `Tamil Nadu road tax 2026: cars 10–20% by price, bikes 8–12%, EVs exempt. Life tax, registration fee and HSRP.` |
| `rto-tax/kerala.html` | `Kerala Road Tax Calculator 2026 — Car, Bike & EV` | `Kerala road tax 2026: cars 9–21% by price, bikes 8–12%, EVs 5%. Life tax, registration fee and on-road price.` |
| `rto-tax/himachalpradesh.html` | `Himachal Pradesh Road Tax Calculator 2026` | `Himachal Pradesh road tax 2026 by price slab for cars, bikes and EVs. Calculate life tax, registration fee and HSRP.` |
| `rto-tax/karnataka.html` | `Karnataka Road Tax Calculator 2026 — Car & Bike` | `Karnataka road tax 2026: cars 10–18% by price, bikes 8–12%, EVs exempt. Life tax, registration fee and HSRP.` |
| `rto-tax/uttarpradesh.html` | `Uttar Pradesh Road Tax Calculator 2026 — Car & Bike` | `Uttar Pradesh road tax 2026: cars 8–10%, bikes 8%, plus registration. Includes Noida and Ghaziabad charges.` |
| `rto-tax/delhi.html` | `Delhi Road Tax Calculator 2026 — Car, Bike & EV` | `Delhi road tax 2026: petrol cars 4–10%, diesel 5–12%, EVs exempt. Calculate tax, registration and HSRP charges.` |
| `rto-tax/punjab.html` | `Punjab Road Tax Calculator 2026 — Car, Bike & EV` | `Punjab road tax 2026: cars 8–13% by price, bikes 7–9%, EVs exempt. Calculate life tax, registration and HSRP.` |
| `stamp-duty/punjab.html` | `Punjab Stamp Duty Calculator 2026 — Rates & Charges` | `Punjab stamp duty 2026: 7% for men, 5% for women and joint female ownership, 1% registration capped at ₹2 lakh.` |
| `stamp-duty/maharashtra.html` | `Maharashtra Stamp Duty Calculator 2026 — Rates` | `Maharashtra stamp duty 2026: 5% in Mumbai, 7% in Pune and rest of state, plus metro cess. Total charges.` |
| `stamp-duty/uttarpradesh.html` | `Uttar Pradesh Stamp Duty Calculator 2026 — Rates` | `Uttar Pradesh stamp duty 2026: 7% for men, 6% for women, 1% registration. Noida and Ghaziabad rates included.` |
| `stamp-duty/delhi.html` | `Delhi Stamp Duty Calculator 2026 — Circle Rates` | `Delhi stamp duty 2026: 6% for men, 4% for women, plus 1% registration. Circle-rate based calculation for MCD areas.` |
| `stamp-duty/karnataka.html` | `Karnataka Stamp Duty Calculator 2026 — Rates` | `Karnataka stamp duty 2026: 5% plus surcharge and cess, 1% registration. Calculate total property registration charges.` |

- [ ] **Step 7: Run tests**

Run: `npm test`
Expected: PASS, including title/description length, hreflang, og:type, dateModified, and sitemap coverage checks.

- [ ] **Step 8: Commit**

```bash
git add public scripts tests/seo-audit.test.js
git commit -m "fix(seo): normalize hreflang, schema, titles, and sitemap"
```

---

### Task 4: Trust pages and sitewide footer links

**Files:**
- Create: `public/methodology.html`
- Create: `public/editorial-policy.html`
- Modify: `public/about.html`
- Create: `scripts/add-footer-links.js`
- Modify: all `public/**/*.html` (via script)
- Test: `tests/seo-audit.test.js`

**Interfaces:**
- Produces: `/methodology` and `/editorial-policy` exist, ≥400 words each, linked from every page footer.

- [ ] **Step 1: Add failing tests**

Append before `if (failed)`:

```js
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
  checkTrue(`${rel(page)} footer methodology link`, /href="\/methodology"/.test(html));
  checkTrue(`${rel(page)} footer editorial link`, /href="\/editorial-policy"/.test(html));
}
```

- [ ] **Step 2: Run tests and confirm failures**

Run: `node tests/seo-audit.test.js`
Expected: FAIL on missing trust pages and footer links.

- [ ] **Step 3: Create the methodology page**

Create `public/methodology.html` with the same head/header/footer pattern as `public/about.html`, these exact head values:
- Title: `Methodology — How DesiCalc Verifies Tax Rates`
- Description: `How DesiCalc sources, verifies and updates income tax slabs, stamp duty rates and RTO road tax rates, with source hierarchy and changelog.`

Body must contain these sections with `h2` headings and at least 400 words total:

1. `What we cover` — Income Tax (FY 2026-27), Stamp Duty (28 states + Delhi), RTO Road Tax (28 states + Delhi), HRA, GST.
2. `Source hierarchy` — order: central or state gazette notification, official department website, official notification PDF, then secondary financial publications only for cross-checking. Secondary sources are never the sole basis for a rate.
3. `How rates are verified` — each rate is checked against the primary source, compared with the previous stored value, and only changed when the primary source changed. Include the review date.
4. `When we update` — after Budget, after state notifications, and on a monthly audit of all 58 state pages.
5. `Corrections` — email `desicalc@gmail.com`; verified errors are fixed within 48 hours and noted in the changelog.
6. `Limitations` — calculators are estimates; the registration authority's final demand is authoritative; circle rates vary by locality.
7. `Changelog` — a list with `2026-10-30 — Full re-verification of RTO and stamp duty rates; trust pages published.`

- [ ] **Step 4: Create the editorial policy page**

Create `public/editorial-policy.html` with these exact head values:
- Title: `Editorial Policy — DesiCalc`
- Description: `DesiCalc editorial standards: team authorship, source requirements, update cadence, corrections policy and funding disclosure.`

Body sections, at least 400 words:

1. `Who writes DesiCalc` — byline is `DesiCalc Editorial Team`; no individual names are published.
2. `Source requirements` — every rate claim links to an official source; no unsourced numbers.
3. `Review process` — every calculator page is checked against `state-rates.js` and the official source before publishing.
4. `Update policy` — visible last-updated date and `dateModified` schema kept in sync.
5. `Corrections` — report to `desicalc@gmail.com`; corrections published within 48 hours.
6. `Advertising and funding` — DesiCalc currently runs no ads; hosting is on Cloudflare Pages.
7. `Contact` — link to `/contact`.

- [ ] **Step 5: Expand about.html**

Rewrite the body of `public/about.html` to at least 400 words with `h2` sections:
- `What DesiCalc is`
- `Why we built it`
- `How it works` — all calculations run in the browser, no data leaves the device
- `How we keep rates accurate` — link to `/methodology`
- `How we are funded` — no ads, no paid plans
- `Contact` — link to `/contact`

Keep the existing head tags, but update title to `About DesiCalc — Free Indian Tax Calculators` and description to `DesiCalc is a free, private, ad-free collection of Indian tax and road tax calculators with verified 2026 rates.`

- [ ] **Step 6: Add footer links everywhere**

Create `scripts/add-footer-links.js`:

```js
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

for (const file of walk(PUBLIC)) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('href="/methodology"')) continue;

  const links = `<a href="/methodology" data-i18n="footer.methodology">Methodology</a>\n      <a href="/editorial-policy" data-i18n="footer.editorial">Editorial Policy</a>\n      `;
  if (html.includes('<a href="about"')) {
    html = html.replace('<a href="about"', `${links}<a href="about"`);
  } else if (html.includes('<a href="/about"')) {
    html = html.replace('<a href="/about"', `${links}<a href="/about"`);
  } else {
    html = html.replace('</footer>', `  <div class="footer-trust">${links}</div>\n</footer>`);
  }

  fs.writeFileSync(file, html);
  console.log(`footer links added: ${path.relative(PUBLIC, file)}`);
}
```

- [ ] **Step 7: Normalize the new pages and rebuild the sitemap**

Run: `node scripts/fix-seo-head.js; node scripts/generate-sitemap.js`
Expected: new trust pages receive `dateModified`, and sitemap count includes them.

- [ ] **Step 8: Run the footer script and tests**

Run: `node scripts/add-footer-links.js; npm test`
Expected: footer links added for every page, then PASS.

- [ ] **Step 9: Commit**

```bash
git add public scripts tests/seo-audit.test.js
git commit -m "feat(seo): add methodology, editorial policy, and sitewide trust links"
```

---

### Task 5: Homepage rewrite

**Files:**
- Modify: `public/index.html`
- Test: `tests/seo-audit.test.js`

**Interfaces:**
- Consumes: trust page URLs from Task 4.
- Produces: homepage ≥600 words with a visible freshness line and links to `/methodology` and `/editorial-policy`.

- [ ] **Step 1: Add failing test**

Append before `if (failed)`:

```js
const homeHtml = read(path.join(PUBLIC, 'index.html'));
checkTrue('home min words', wordCount(homeHtml) >= 600, `${wordCount(homeHtml)} words`);
checkTrue('home last updated', /Last updated/i.test(homeHtml));
checkTrue('home links methodology', /href="\/methodology"/.test(homeHtml));
```

- [ ] **Step 2: Run test and confirm failure**

Run: `node tests/seo-audit.test.js`
Expected: FAIL on homepage word count.

- [ ] **Step 3: Rewrite homepage body**

Keep the existing head, header, calculator cards, and footer. Replace the main content with this structure. Write real prose, no filler.

1. `h1`: `Free Indian Tax and Road Tax Calculators`
2. Intro paragraph (80–120 words): what DesiCalc does, that all calculations run in the browser, and that rates are verified for FY 2026-27 across 28 states and Delhi.
3. Freshness line: `Rates verified for FY 2026-27 · Last updated 30 October 2026 · 28 states + Delhi`
4. Keep the five calculator cards (`Income Tax`, `Stamp Duty`, `RTO Tax`, `HRA`, `GST`) with links to `/tools/income-tax`, `/tools/stamp-duty`, `/tools/rto-tax`, `/tools/hra`, `/tools/gst`.
5. `h2 How DesiCalc works` — three short steps: pick a calculator, enter your numbers, get an instant breakdown with the rates used.
6. `h2 What you can calculate` — one paragraph each for income tax, stamp duty, RTO road tax, HRA, GST, naming the slabs and states covered.
7. `h2 Why rates change every year` — Budget changes, state notifications, EV exemptions; link to `/methodology`.
8. `h2 Popular state calculators` — links to the top 10 pages by impressions: `/rto-tax/haryana`, `/rto-tax/andhrapradesh`, `/stamp-duty/punjab`, `/rto-tax/maharashtra`, `/rto-tax/tamilnadu`, `/rto-tax/kerala`, `/rto-tax/himachalpradesh`, `/rto-tax/karnataka`, `/rto-tax/uttarpradesh`, `/rto-tax/delhi`.
9. `h2 Guides and comparisons` — keep the existing four cards.
10. `h2 About DesiCalc` — 80–120 words on privacy, no login, no ads, verified sources; links to `/about`, `/methodology`, `/editorial-policy`.

Remove the empty ad slots already removed in Task 2. Do not add ads back.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/index.html tests/seo-audit.test.js
git commit -m "feat(seo): rebuild homepage with trust and coverage content"
```

---

### Task 6: Income Tax tool page

**Files:**
- Modify: `public/tools/income-tax.html`
- Test: `tests/seo-audit.test.js`

**Interfaces:**
- Consumes: slabs from `public/assets/js/slabs-2026.js`.
- Produces: tool page ≥1,200 words, ≥6 `h3`, visible FAQ with ≥6 questions, at least one official source link.

- [ ] **Step 1: Add failing test**

Append before `if (failed)`:

```js
const toolNames = ['income-tax'];
for (const tool of toolNames) {
  const file = path.join(PUBLIC, 'tools', `${tool}.html`);
  const html = read(file);
  const name = `tools/${tool}`;
  checkTrue(`${name} min words`, wordCount(html) >= 1200, `${wordCount(html)} words`);
  checkTrue(`${name} min h3`, h3Count(html) >= 6, `${h3Count(html)} h3`);
  checkTrue(`${name} has FAQPage`, /"@type":\s*"FAQPage"/.test(html));
  checkTrue(`${name} official source`, /\.gov\.in|incometax\.gov\.in|gst\.gov\.in/i.test(html));
}
```

- [ ] **Step 2: Run test and confirm failure**

Run: `node tests/seo-audit.test.js`
Expected: FAIL on word count and h3 for tool pages.

- [ ] **Step 3: Rewrite the page content**

Keep the calculator form and result panel unchanged. Below the calculator, add these sections with this exact content plan:

1. `h2 How income tax is calculated in FY 2026-27`
   - `h3 Step 1: Gross total income` — sum of salary, other income, business income, NPS employer contribution.
   - `h3 Step 2: Standard deduction` — ₹75,000 under the new regime, ₹50,000 under the old regime.
   - `h3 Step 3: Apply the slab rates` — include a table of new-regime slabs from `slabs-2026.js` (0–₹4L nil, ₹4–8L 5%, ₹8–12L 10%, ₹12–16L 15%, ₹16–20L 20%, ₹20–24L 25%, above ₹24L 30%). Verify against the file before publishing.
   - `h3 Step 4: Rebate under Section 87A` — up to ₹60,000 under the new regime when net taxable income ≤ ₹12L; ₹12,500 under the old regime when income ≤ ₹5L.
   - `h3 Step 5: Surcharge and cess` — surcharge brackets from `slabs-2026.js`, then 4% health and education cess.
2. `h2 Worked example: ₹12,00,000 salary under the new regime`
   - Gross ₹12,00,000, standard deduction ₹75,000, net taxable ₹11,25,000, tax before rebate, 87A rebate, cess, and final tax. Compute the numbers from `slabs-2026.js`; do not guess.
3. `h2 Old regime vs new regime`
   - One paragraph on when the old regime wins (high 80C, 80D, home loan interest, HRA). Link to `/comparisons/old-vs-new-tax-regime`.
4. `h2 Common mistakes`
   - `h3 Mixing regime deduction rules` — old-regime deductions do not apply in the new regime.
   - `h3 Ignoring marginal relief` — relief applies just above ₹12L and near surcharge thresholds.
   - `h3 Forgetting capital gains rates` — equity STCG 20% and LTCG 12.5% are separate from slab income.
5. `h2 Frequently asked questions` — keep the existing three questions and add at least three more, each in `h3` with a short answer. Topics: standard deduction amount, 87A eligibility, surcharge thresholds, HRA under the new regime.
6. `h2 Sources` — link `https://www.incometax.gov.in` and the Finance Act page if available; label each link.

Visible FAQ text must match the FAQPage JSON-LD already in the page.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS for `tools/income-tax`.

- [ ] **Step 5: Commit**

```bash
git add public/tools/income-tax.html tests/seo-audit.test.js
git commit -m "feat(seo): expand income tax calculator page"
```

---

### Task 7: Stamp duty tool page

**Files:**
- Modify: `public/tools/stamp-duty.html`
- Test: `tests/seo-audit.test.js`

**Interfaces:**
- Consumes: `STAMP_DUTY_RATES` from `public/assets/js/state-rates.js`.
- Produces: tool page ≥1,200 words, ≥6 `h3`, official source link.

- [ ] **Step 1: Add the stamp duty check**

Change `const toolNames = ['income-tax'];` to `const toolNames = ['income-tax', 'stamp-duty'];` in `tests/seo-audit.test.js`, then run `node tests/seo-audit.test.js`.
Expected: FAIL for `tools/stamp-duty`.

- [ ] **Step 2: Write content**

Keep the calculator form unchanged. Add:

1. `h2 What stamp duty covers`
   - `h3 Stamp duty` — state tax on the property instrument, calculated on the higher of circle rate and consideration.
   - `h3 Registration fee` — usually 1% of property value, with state caps.
   - `h3 Metro cess` — applies in some states such as Maharashtra.
   - `h3 Other charges` — transfer duty, surcharge, and women-buyer concessions where applicable.
2. `h2 State-wise stamp duty rates 2026`
   - Table with two columns: state and headline rate range. Populate from `STAMP_DUTY_RATES`; show the male rate range and note female concession in a third column.
3. `h2 Worked example: ₹60,00,000 property in Punjab`
   - Male buyer: 7% stamp duty, 1% registration capped at ₹2 lakh, total charges. Compute from `calcStampDuty` logic; verify the output.
4. `h2 How to reduce stamp duty legally`
   - `h3 Women buyers` — lower rates in many states.
   - `h3 Joint ownership` — joint female ownership can qualify for the concession.
   - `h3 Correct valuation` — duty is on the higher of circle rate and consideration; undervaluation does not reduce duty.
5. `h2 Frequently asked questions` — at least six `h3` questions: what stamp duty is, who pays it, circle rate vs market rate, whether registration is mandatory, whether women get a discount, whether stamp duty is tax-deductible.
6. `h2 Sources` — link the state registration department pages used in the table, label each link.

Keep FAQPage JSON-LD in sync with visible questions.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS for `tools/stamp-duty`.

- [ ] **Step 3: Commit**

```bash
git add public/tools/stamp-duty.html
git commit -m "feat(seo): expand stamp duty calculator page"
```

---

### Task 8: RTO tax tool page

**Files:**
- Modify: `public/tools/rto-tax.html`
- Test: `tests/seo-audit.test.js`

- [ ] **Step 1: Add the RTO check**

Change `const toolNames = ['income-tax', 'stamp-duty'];` to `const toolNames = ['income-tax', 'stamp-duty', 'rto-tax'];`, run `node tests/seo-audit.test.js`.
Expected: FAIL for `tools/rto-tax`.

- [ ] **Step 2: Write content**

Keep the calculator form unchanged. Add:

1. `h2 What road tax includes`
   - `h3 One-time road tax` — life tax for private vehicles, annual or quarterly for commercial vehicles.
   - `h3 Registration fee` — fixed by vehicle class under the Central Motor Vehicles Rules.
   - `h3 HSRP` — High Security Registration Plate cost, roughly ₹400–₹1,100 depending on vehicle class and vendor.
   - `h3 On-road price` — ex-showroom price plus road tax, registration, HSRP, insurance, and any state cess.
2. `h2 How road tax is calculated by state`
   - Explain the three structures: percentage slabs by price (most states), flat percentage, and per-CC for two-wheelers. Table with two columns: state and structure.
3. `h2 Worked example: ₹10,00,000 petrol car in Maharashtra`
   - 11% road tax, registration fee, HSRP, total. Compute using `calcRTO`; verify output.
4. `h2 EV road tax exemptions`
   - `h3 Full exemption states` — list states in `state-rates.js` where EV tax is 0.
   - `h3 Partial exemption states` — list states with reduced rates.
   - `h3 Price caps` — note caps such as Haryana's ₹30 lakh threshold.
5. `h2 Commercial vehicle road tax`
   - Seating-based and permit-based charges; annual vs one-time.
6. `h2 Frequently asked questions` — at least six `h3` questions: what road tax is, whether it is refundable on transfer, how long it is valid, whether EVs pay, what HSRP costs, what happens on interstate transfer.
7. `h2 Sources` — link the Ministry of Road Transport and state transport department pages, label each.

Keep FAQPage JSON-LD in sync.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS for `tools/rto-tax`.

- [ ] **Step 3: Commit**

```bash
git add public/tools/rto-tax.html
git commit -m "feat(seo): expand RTO road tax calculator page"
```

---

### Task 9: HRA and GST tool pages

**Files:**
- Modify: `public/tools/hra.html`
- Modify: `public/tools/gst.html`

- [ ] **Step 1: Add the HRA and GST checks**

Change `const toolNames = ['income-tax', 'stamp-duty', 'rto-tax'];` to `const toolNames = ['income-tax', 'stamp-duty', 'rto-tax', 'hra', 'gst'];`, run `node tests/seo-audit.test.js`.
Expected: FAIL for `tools/hra` and `tools/gst`.

- [ ] **Step 2: Expand HRA page**

Add at least 600 more words with these sections:
1. `h2 How HRA exemption works` — three tests: actual HRA received, 50% of basic in metro or 40% elsewhere, rent paid minus 10% of basic. Exemption is the least of the three.
2. `h3 Metro city definition` — Delhi, Mumbai, Kolkata, Chennai.
3. `h2 Worked example` — basic ₹50,000/month, HRA ₹20,000/month, rent ₹25,000/month in Bengaluru (non-metro). Compute the three values and the exemption.
4. `h3 Documents required` — rent receipts above ₹1 lakh per year, landlord PAN above ₹1 lakh annual rent.
5. `h3 HRA under the new regime` — not available under the new regime.
6. `h2 Frequently asked questions` — at least six `h3` questions.
7. `h2 Sources` — link `https://www.incometax.gov.in`.

- [ ] **Step 3: Expand GST page**

Add at least 600 more words with these sections:
1. `h2 GST rates in 2026` — table of the main slabs (0%, 5%, 12%, 18%, 28%) and typical goods in each.
2. `h2 Inclusive vs exclusive GST` — formulas: exclusive = price × (1 + rate); inclusive = price ÷ (1 + rate).
3. `h3 Worked example` — ₹10,000 service at 18%: GST ₹1,800, total ₹11,800.
4. `h2 Composition scheme` — turnover limits, flat rates, and who cannot opt in.
5. `h3 Input tax credit` — how ITC works for regular taxpayers.
6. `h2 Frequently asked questions` — at least six `h3` questions.
7. `h2 Sources` — link `https://www.gst.gov.in`.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS for `tools/hra` and `tools/gst`.

- [ ] **Step 5: Commit**

```bash
git add public/tools/hra.html public/tools/gst.html
git commit -m "feat(seo): expand HRA and GST calculator pages"
```

---

### Task 10: RTO Tier 1 state pages (group A: Haryana, Andhra Pradesh, Maharashtra, Tamil Nadu, Kerala)

**Files:**
- Modify: `public/rto-tax/haryana.html`, `andhrapradesh.html`, `maharashtra.html`, `tamilnadu.html`, `kerala.html`
- Test: `tests/seo-audit.test.js`

**Interfaces:**
- Consumes: `calcRTO` outputs and rates in `state-rates.js`.
- Produces: each page ≥1,800 words, ≥8 `h3`, ≥2 `.gov.in` links, visible `Last updated`, FAQPage schema.

- [ ] **Step 1: Add failing tests**

Append before `if (failed)`:

```js
const rtoTier1GroupA = ['haryana', 'andhrapradesh', 'maharashtra', 'tamilnadu', 'kerala'];
for (const state of rtoTier1GroupA) {
  const name = `rto-tax/${state}`;
  const html = read(path.join(PUBLIC, 'rto-tax', `${state}.html`));
  checkTrue(`${name} min words`, wordCount(html) >= 1800, `${wordCount(html)} words`);
  checkTrue(`${name} min h3`, h3Count(html) >= 8, `${h3Count(html)} h3`);
  checkTrue(`${name} gov sources`, count(html, /\.gov\.in/gi) >= 2);
  checkTrue(`${name} last updated`, /Last updated/i.test(html));
  checkTrue(`${name} FAQPage`, /"@type":\s*"FAQPage"/.test(html));
}
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `node tests/seo-audit.test.js`
Expected: FAIL on word count and h3 for these pages.

- [ ] **Step 3: Rebuild each page with this required structure**

For each of the five pages, keep the existing verified rate table and calculator link. Replace the body with:

1. `h1` — `[State] Road Tax Calculator 2026`
2. Intro, 80–120 words: who pays, whether it is one-time or annual, what the page covers.
3. Rate table — keep the existing verified table from the page. Do not change any rate.
4. `h2 [State] road tax by vehicle type`
   - `h3 Cars and SUVs` — price slabs from the table, with one computed example.
   - `h3 Two-wheelers` — slab rates and one computed example.
   - `h3 Electric vehicles` — exemption or concession, with the exact notification date and price cap if any.
   - `h3 Commercial vehicles` — annual or quarterly basis.
5. `h2 Registration process in [State]`
   - `h3 Where to register` — dealer point or RTO, based on the existing page content.
   - `h3 Documents required` — Form 20, Form 21, Form 22, insurance, address proof, PAN or Form 60.
   - `h3 Fees and timelines` — registration fee, HSRP, expected timeline.
6. `h2 RTO offices in [State]`
   - Table of major RTO offices and codes, verified from the official state transport site. If a complete verified list cannot be sourced, use the district-level offices already named on the page and cite the official RTO locator URL.
7. `h2 Worked example`
   - One fully computed example for a ₹10,00,000 petrol car. Show ex-showroom price, road tax, registration fee, HSRP, and total. Use `calcRTO` output; do not estimate.
8. `h2 Frequently asked questions` — 8–10 `h3` questions. Required topics: is road tax one-time, refund on sale or transfer, out-of-state vehicle registration, EV exemption, HSRP cost, late registration penalty.
9. `h2 Sources` — at least two `.gov.in` links, labelled.
10. Visible line: `Last updated 30 October 2026 · Reviewed by DesiCalc Editorial Team`

Keep the existing FAQPage JSON-LD, add questions to match the visible FAQ, and keep it valid JSON.

State-specific facts to verify before writing, from the current page and official sources:
- Haryana: EV exemption up to ₹30 lakh, CNG 20% rebate, women 1% rebate up to ₹20 lakh.
- Andhra Pradesh: 12%/14% car slabs and safety cess.
- Maharashtra: petrol 11–13%, diesel 13–15%, 2% road safety cess.
- Tamil Nadu: 10–20% car slabs, EV exemption.
- Kerala: 9–21% car slabs, EV 5%.

Do not write a fact that is not in the current page or an official source you have opened.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS for these five pages.

- [ ] **Step 5: Commit**

```bash
git add public/rto-tax tests/seo-audit.test.js
git commit -m "feat(seo): rebuild RTO state pages group A"
```

---

### Task 11: RTO Tier 1 state pages (group B: Himachal Pradesh, Karnataka, Uttar Pradesh, Delhi, Punjab)

**Files:**
- Modify: `public/rto-tax/himachalpradesh.html`, `karnataka.html`, `uttarpradesh.html`, `delhi.html`, `punjab.html`
- Test: `tests/seo-audit.test.js`

- [ ] **Step 1: Add group B to the test**

Change `const rtoTier1GroupA = ['haryana', 'andhrapradesh', 'maharashtra', 'tamilnadu', 'kerala'];` to `const rtoTier1GroupA = ['haryana', 'andhrapradesh', 'maharashtra', 'tamilnadu', 'kerala', 'himachalpradesh', 'karnataka', 'uttarpradesh', 'delhi', 'punjab'];`, run `node tests/seo-audit.test.js`.
Expected: FAIL for the five group B pages.

- [ ] **Step 2: Rebuild five pages with the same structure as Task 10**

Use the Task 10 structure exactly: `h1`, intro, rate table, vehicle-type `h3`s, registration process `h3`s, RTO offices table, worked example, 8–10 FAQs, sources, last-updated line.

State-specific facts to verify:
- Himachal Pradesh: price-slab car rates; confirm the current page values.
- Karnataka: 10–18% car slabs, EV exemption.
- Uttar Pradesh: 8–10% car rates; include Noida and Ghaziabad registration charges, since those are real search queries.
- Delhi: petrol 4–10%, diesel 5–12%, EV exemption; note Delhi's EPCA and MCD context only if sourced.
- Punjab: 8–13% car rates, EV exemption.

Do not change any rate already verified on the page.

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: PASS for all ten RTO Tier 1 pages.

- [ ] **Step 4: Commit**

```bash
git add public/rto-tax
git commit -m "feat(seo): rebuild RTO state pages group B"
```

---

### Task 12: Stamp duty Tier 1 state pages

**Files:**
- Modify: `public/stamp-duty/punjab.html`, `maharashtra.html`, `uttarpradesh.html`, `delhi.html`, `karnataka.html`
- Test: `tests/seo-audit.test.js`

- [ ] **Step 1: Add failing tests**

Append before `if (failed)`:

```js
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
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `node tests/seo-audit.test.js`
Expected: FAIL on word/h3 for these pages.

- [ ] **Step 3: Rebuild each page with this structure**

1. `h1` — `[State] Stamp Duty Calculator 2026`
2. Intro, 80–120 words.
3. Rate table — keep the existing verified table.
4. `h2 Stamp duty rates in [State]`
   - `h3 By buyer gender` — male, female, joint ownership rates.
   - `h3 By property location` — city or urban/rural differences where they exist (Maharashtra Mumbai vs Pune; Uttar Pradesh Noida and Ghaziabad; Delhi MCD vs NDMC if sourced).
   - `h3 Registration charges` — percentage, caps, and other levies.
5. `h2 How stamp duty is calculated`
   - `h3 Circle rate vs market rate` — duty on the higher value.
   - `h3 Worked example` — a ₹60,00,000 property with full computation. Use `calcStampDuty`; verify output.
6. `h2 Documents required for registration`
   - Sale deed, ID proof, PAN, photographs, stamp duty payment proof, NOC where applicable.
7. `h2 Registration process in [State]`
   - Sub-registrar appointment, e-stamping, biometric, timeline.
8. `h2 Ways to reduce stamp duty legally`
   - Female ownership, joint ownership, correct circle rate, exemptions for family transfer if sourced.
9. `h2 Frequently asked questions` — 8–10 `h3` questions.
10. `h2 Sources` — at least two `.gov.in` links.
11. Visible line: `Last updated 30 October 2026 · Reviewed by DesiCalc Editorial Team`

State facts to verify:
- Punjab: male 7%, female 5%, joint 5–7%, registration 1% capped at ₹2 lakh.
- Maharashtra: Mumbai 5%, Pune and rest 7%, metro cess, female concession.
- Uttar Pradesh: male 7%, female 6%, registration 1%; Noida/Ghaziabad rates.
- Delhi: male 6%, female 4%, registration 1%; circle-rate based.
- Karnataka: 5% plus surcharge and cess, 1% registration.

Keep FAQPage JSON-LD valid and in sync.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS for all stamp Tier 1 pages.

- [ ] **Step 5: Commit**

```bash
git add public/stamp-duty tests/seo-audit.test.js
git commit -m "feat(seo): rebuild stamp duty Tier 1 state pages"
```

---

### Task 13: Comparisons and guides freshness

**Files:**
- Modify: `public/comparisons/old-vs-new-tax-regime.html`, `public/comparisons/ev-vs-petrol-road-tax.html`
- Modify: `public/guides/how-to-file-itr-2026.html`, `public/guides/section-87a-rebate-explained.html`, `public/guides/how-to-calculate-stamp-duty.html`
- Test: `tests/seo-audit.test.js`

- [ ] **Step 1: Add failing test**

Append before `if (failed)`:

```js
const editorialPages = [
  'comparisons/old-vs-new-tax-regime.html',
  'comparisons/ev-vs-petrol-road-tax.html',
  'guides/how-to-file-itr-2026.html',
  'guides/section-87a-rebate-explained.html',
  'guides/how-to-calculate-stamp-duty.html',
];
for (const relPath of editorialPages) {
  const html = read(path.join(PUBLIC, relPath));
  checkTrue(`${relPath} byline`, html.includes('DesiCalc Editorial Team'));
  checkTrue(`${relPath} last updated`, /Last updated/i.test(html));
  checkTrue(`${relPath} sources section`, /<h2[^>]*>\s*Sources/i.test(html));
}
```

- [ ] **Step 2: Run test and confirm failure**

Run: `node tests/seo-audit.test.js`
Expected: FAIL on byline and sources.

- [ ] **Step 3: Add freshness and sources to each page**

For each of the five pages:
1. Add a visible byline directly under the `h1`: `By DesiCalc Editorial Team · Last updated 30 October 2026`.
2. Add a `h2 Sources` section at the end with at least two official links relevant to the topic (`incometax.gov.in`, `morth.nic.in`, state registration departments).
3. Check the `dateModified` value matches 2026-10-30.
4. Keep the existing content and structure; do not rewrite the article bodies.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/comparisons public/guides tests/seo-audit.test.js
git commit -m "feat(seo): add editorial bylines and sources to guides"
```

---

### Task 14: Tier 2 state pages light fixes (19 RTO + 24 stamp)

**Files:**
- Modify: all remaining RTO and stamp state pages not in Tier 1
- Test: `tests/seo-audit.test.js`

- [ ] **Step 1: Add failing tests**

Append before `if (failed)`:

```js
for (const folder of ['rto-tax', 'stamp-duty']) {
  for (const page of pages.filter((p) => rel(p).startsWith(`${folder}/`) && !rel(p).endsWith('index.html'))) {
    const html = read(page);
    const name = rel(page);
    checkTrue(`${name} min words`, wordCount(html) >= 800, `${wordCount(html)} words`);
    checkTrue(`${name} min h3`, h3Count(html) >= 5, `${h3Count(html)} h3`);
    checkTrue(`${name} has dateModified`, html.includes('"dateModified"'));
    checkTrue(`${name} has FAQPage`, /"@type":\s*"FAQPage"/.test(html));
  }
}
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `node tests/seo-audit.test.js`
Expected: FAIL on `h3` counts for many Tier 2 pages.

- [ ] **Step 3: Apply the Tier 2 light-fix template**

For each remaining state page:

1. Keep the existing verified rate table and content.
2. Add `h3` subheadings inside the existing sections so there are at least five. Use meaningful subheads, not labels: for example `h3 Car and SUV rates`, `h3 Two-wheeler rates`, `h3 EV exemption`, `h3 Registration charges`, `h3 Payment and timeline`.
3. Ensure at least five visible FAQ questions in `h3` that match the FAQPage JSON-LD. If the page has no visible FAQ, convert the existing schema questions into a visible `h2 Frequently asked questions` section.
4. Add the visible line `Last updated 30 October 2026 · Reviewed by DesiCalc Editorial Team`.
5. Add one official `.gov.in` source link if missing.
6. Do not add new rate claims or change existing rates.

Apply by state group, and run `node tests/seo-audit.test.js` after each group of ten pages.

- [ ] **Step 4: Run full tests**

Run: `npm test`
Expected: PASS for every state page.

- [ ] **Step 5: Commit**

```bash
git add public/rto-tax public/stamp-duty tests/seo-audit.test.js
git commit -m "feat(seo): light-fix Tier 2 state pages"
```

---

### Task 15: Linkable 2026 rate tracker asset

**Files:**
- Create: `public/rate-tracker.html`
- Create: `public/assets/data/rates-2026.csv`
- Modify: `scripts/generate-sitemap.js` output by rerunning it
- Test: `tests/seo-audit.test.js`

**Interfaces:**
- Produces: `/rate-tracker` page ≥1,500 words, links to the CSV, linked from the footer of the homepage and all state pages.

- [ ] **Step 1: Add failing test**

Append before `if (failed)`:

```js
const trackerFile = path.join(PUBLIC, 'rate-tracker.html');
checkTrue('rate tracker exists', fs.existsSync(trackerFile));
if (fs.existsSync(trackerFile)) {
  const html = read(trackerFile);
  checkTrue('rate tracker min words', wordCount(html) >= 1500, `${wordCount(html)} words`);
  checkTrue('rate tracker CSV link', /rates-2026\.csv/.test(html));
  checkTrue('rate tracker changelog', /changelog/i.test(html));
}
checkTrue('CSV exists', fs.existsSync(path.join(PUBLIC, 'assets', 'data', 'rates-2026.csv')));
```

- [ ] **Step 2: Run test and confirm failure**

Run: `node tests/seo-audit.test.js`
Expected: FAIL on missing tracker and CSV.

- [ ] **Step 3: Generate the CSV**

Create `public/assets/data/rates-2026.csv` with this header and one row per state for RTO car rates and stamp duty male/female rates, using values from `state-rates.js`:

```
state,rto_car_min_pct,rto_car_max_pct,stamp_male_pct,stamp_female_pct,source_url
```

Populate all 29 rows from `state-rates.js`. Do not estimate; read the data file.

- [ ] **Step 4: Create the tracker page**

Create `public/rate-tracker.html` with these head values:
- Title: `2026 Road Tax & Stamp Duty Rate Tracker`
- Description: `Verified 2026 road tax and stamp duty rates for 28 states and Delhi, with methodology, official sources, and a downloadable CSV.`

Body:
1. `h1 2026 Road Tax and Stamp Duty Rate Tracker`
2. Intro, 100–150 words explaining the data and update cadence.
3. `h2 Summary of changes in 2026` — bullet list of verified changes already in the repo: EV exemptions, Haryana ₹30 lakh cap, Rajasthan surcharge, West Bengal slabs, and other changes present in the rate data.
4. `h2 Road tax rates by state` — table with state, car rate range, EV treatment.
5. `h2 Stamp duty rates by state` — table with state, male rate, female rate, registration.
6. `h2 Download the data` — link to `/assets/data/rates-2026.csv`.
7. `h2 Methodology` — short version, link to `/methodology`.
8. `h2 Changelog` — `2026-10-30 — Re-verified all RTO and stamp duty rates; published tracker.`
9. `h2 Sources` — at least three official `.gov.in` links.
10. Visible line: `Last updated 30 October 2026 · Reviewed by DesiCalc Editorial Team`.

Add links to `/rate-tracker` in the footer of `public/index.html`, `public/rto-tax/index.html`, and `public/stamp-duty/index.html`.

- [ ] **Step 5: Normalize, regenerate sitemap, and run tests**

Run: `node scripts/fix-seo-head.js; node scripts/generate-sitemap.js; npm test`
Expected: tracker receives `dateModified`, sitemap includes `/rate-tracker`, all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add public/rate-tracker.html public/assets/data public/sitemap.xml public/index.html public/rto-tax/index.html public/stamp-duty/index.html tests/seo-audit.test.js
git commit -m "feat(seo): publish 2026 rate tracker and downloadable dataset"
```

---

### Task 16: Measurement log and review cadence

**Files:**
- Create: `docs/seo/weekly-log.md`
- Create: `docs/seo/outreach.md`
- Modify: `README.md` or `AGENTS.md` to point to the SEO docs

- [ ] **Step 1: Create the weekly log**

Create `docs/seo/weekly-log.md`:

```markdown
# DesiCalc SEO Weekly Log

Update every Monday from Google Search Console (last 7 days) and Cloudflare Web Analytics.

| Week ending | Impressions | Clicks | CTR | Avg position | Indexed pages | Notes |
|-------------|-------------|--------|-----|--------------|---------------|-------|
| 2026-10-30  | 702 (90d)   | 3 (90d) | 0.4% | 39          | 73            | Baseline |

## Weekly checklist

- [ ] GSC Performance: impressions, clicks, CTR, avg position
- [ ] GSC Pages: indexed vs not indexed, note new exclusions
- [ ] Top 10 queries and pages, note movements
- [ ] Bing Webmaster: impressions and crawl errors
- [ ] Cloudflare Web Analytics: visits and top pages
- [ ] Check `npm test` still passes after any content change
- [ ] Add notes on any deploy or content change that week

## Review checkpoints

- Day 60 (2026-12-29): compare against targets. Decide Tier 3 pages (enrich, merge, noindex).
- Day 90 (2027-01-28): decide on city pages (Noida registry first).
- Day 180 (2027-04-28): evaluate link campaign and overall recovery.
```

- [ ] **Step 2: Create the outreach tracker**

Create `docs/seo/outreach.md`:

```markdown
# DesiCalc Outreach Tracker

Target: 20 personalized messages per month. No bulk email.

| Date | Target | URL | Angle | Status | Follow-up | Result |
|------|--------|-----|-------|--------|-----------|--------|

## Angles

- 2026 rate changes by state (EV exemptions, Haryana cap, West Bengal slabs)
- Noida and Ghaziabad registration charges
- Stamp duty comparison across states
- One-time road tax explained for new car buyers

## Rules

- Only contact sites that cover Indian personal finance or local news.
- Reference a specific page and a specific verifiable fact.
- No paid links, no link exchanges, no guest-post farms.
```

- [ ] **Step 3: Document the process**

Add a short section to `AGENTS.md` under Content Types:

```markdown
### SEO and content standards

- Run `npm test` before every content commit. It includes `tests/seo-audit.test.js`.
- Titles ≤ 60 characters, meta descriptions ≤ 155, one h1 per page.
- Every rate claim needs an official source link.
- Byline is `DesiCalc Editorial Team`; no personal names.
- After adding or renaming pages, run `node scripts/generate-sitemap.js`.
- Weekly metrics log: `docs/seo/weekly-log.md`.
```

- [ ] **Step 4: Verify**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/seo AGENTS.md
git commit -m "docs(seo): add weekly measurement log and outreach tracker"
```

---

## Final verification

- [ ] Run `npm test` and confirm both suites pass.
- [ ] Run `node scripts/generate-sitemap.js` and confirm URL count equals HTML page count.
- [ ] Grep `public/` for `adsbygoogle`, `googlesyndication`, `hreflang="hi"` and confirm zero matches.
- [ ] Open the homepage, one Tier 1 RTO page, one Tier 1 stamp page, and one tool page in a browser and confirm calculators still compute.
- [ ] Confirm `sitemap.xml` includes `/methodology`, `/editorial-policy`, and `/rate-tracker`.
- [ ] Deploy and submit the sitemap in Google Search Console and Bing Webmaster Tools.
- [ ] Record the deploy date in `docs/seo/weekly-log.md`.

## Self-review notes

- Spec coverage: every spec section maps to a task — triage (Tasks 6–14), content (5–13), E-E-A-T (4, 13), technical (2, 3), authority (15), measurement (16), ads removal (2), CWV (2, 3 via script deferral handled in Task 2 and page rewrites).
- No placeholders: every content task lists exact headings, required facts, and source constraints.
- Type consistency: shared helpers and file paths are defined once in Task 1 and reused.
