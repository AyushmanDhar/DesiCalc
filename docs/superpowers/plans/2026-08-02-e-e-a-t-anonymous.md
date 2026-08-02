# Anonymous E-E-A-T Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add anonymous E-E-A-T signals (Organization entity, truthful dates, visible verification lines, expanded About page) across all ~79 DesiCalc pages to support recovery from a sitewide algorithmic demotion.

**Architecture:** A single persistent `Organization` entity (`@id: https://desicalc.in/#organization`, name "DesiCalc Editorial Team" used as author) referenced on every page via inline JSON-LD. All dates are git-derived (scripted, never hand-typed). No new URLs, no Person schema, no personal names, no invented credentials.

**Tech Stack:** Static HTML + JSON-LD (schema.org), vanilla JS (i18n via `data-i18n` + `lang-en.js`/`lang-hi.js`), Node.js helper script, Tailwind CSS.

## Global Constraints

- **NO `Person` schema and NO personal names anywhere** — author is always `"DesiCalc Editorial Team"` (as an `Organization`).
- `@id` of the organization is ALWAYS `https://desicalc.in/#organization` (functional identifier; no visible element needed).
- **No invented credentials** — never claim "reviewed by CA", "expert", or similar anywhere.
- All dates come from the dates script (`node scripts/eaat.js dates <path>`); `dateModified` in JSON-LD = `2026-08-02` (rollout commit date) for every page touched.
- Visible state-page line: stamp-duty pages say `Rates verified August 2026`; rto-tax pages say `Rates verified July 2026`.
- Visible lines on state/guide pages are **static English** (those pages do not use `data-i18n` for body content); the About page uses `data-i18n` keys — every new key must be added to BOTH `lang-en.js` and `lang-hi.js`.
- `sameAs` omitted; no new URLs, no new pages, no new assets; `logo` = `https://desicalc.in/apple-touch-icon.png`.
- `npm test` must end with `260 passed, 0 failed`; every JSON-LD block must parse.

---

### Task 1: Date Helper Script (`scripts/eaat.js`)

**Files:**
- Create: `scripts/eaat.js`
- Test: run it against known files

**Interfaces:**
- Produces: `node scripts/eaat.js dates <path>` → prints `{ "datePublished": "YYYY-MM-DD", "dateModified": "YYYY-MM-DD" }`
- Produces: `node scripts/eaat.js sitemap` → rewrites `public/sitemap.xml` lastmod for a fixed URL prefix list to `2026-08-02`

- [ ] **Step 1: Write the script**

```js
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
  const out = xml.replace(/(<loc>https:\/\/desicalc\.in)([^<]+)(<\/loc>\s*<lastmod>)[^<]*(<\/lastmod>)/g, (m, a, loc, b, c) =>
    prefixes.some(p => loc === p || loc.startsWith(p + '/')) ? `${a}${loc}${b}${MODIFIED}${c}` : m
  );
  fs.writeFileSync('public/sitemap.xml', out);
  console.log('sitemap lastmod updated to ' + MODIFIED);
}

const cmd = process.argv[2];
if (cmd === 'dates' && process.argv[3]) { console.log(JSON.stringify(dates(process.argv[3]), null, 2)); }
else if (cmd === 'sitemap') { sitemap(); }
else { console.error('Usage: node scripts/eaat.js dates <path> | sitemap'); process.exit(1); }
```

- [ ] **Step 2: Test the script**

Run: `node scripts/eaat.js dates public/index.html`
Expected: JSON with `datePublished` and `dateModified` (e.g. `"datePublished": "2026-07-05"`)

- [ ] **Step 3: Commit**

```bash
git add scripts/eaat.js
git commit -m "feat(seo): add E-E-A-T date/sitemap helper script"
```

---

### Task 2: i18n Keys for About Page Expansion

**Files:**
- Modify: `public/assets/js/lang-en.js` (append keys under the `about.` block)
- Modify: `public/assets/js/lang-hi.js` (append keys under the `about.` block)

**Interfaces:**
- Consumes: existing `about.*` key block in both files
- Produces: keys `about.verify.title`, `about.verify.desc`, `about.standards.title`, `about.standards.desc` (used by Task 3)

- [ ] **Step 1: Add English keys**

In `public/assets/js/lang-en.js`, after the `about.disclaimer.desc` entry, add:

```js
  'about.verify.title': 'How We Verify Our Rates',
  'about.verify.desc': 'Every stamp duty and RTO tax rate is checked against official state government publications, transport department notifications, and the Income Tax Department of India. Each state page links to its Sources & References. Rates are re-verified whenever a state government issues a new notification.',
  'about.standards.title': 'Editorial Standards',
  'about.standards.desc': 'DesiCalc is run independently and stays intentionally anonymous. We do not provide financial advice and we never invent credentials. If you spot an error, contact us at desicalc@gmail.com and we will correct it and update the page promptly.',
```

- [ ] **Step 2: Add Hinglish keys**

In `public/assets/js/lang-hi.js`, after the same `about.disclaimer.desc` entry, add:

```js
  'about.verify.title': 'Hamare Rates Kaise Verify Hote Hain',
  'about.verify.desc': 'Har stamp duty aur RTO tax rate ko official state government publications, transport department notifications aur Income Tax Department of India ke against check kiya jaata hai. Har state page par Sources & References diye hain. Jab bhi koi state nayi notification jaari karti hai, rates dobara verify kiye jaate hain.',
  'about.standards.title': 'Editorial Standards',
  'about.standards.desc': 'DesiCalc independent taur par chalaya jaata hai aur jaan-boojh kar anonymous rehta hai. Hum financial advice nahi dete aur kabhi jhoothi credentials nahi dikhate. Agar aapko koi galti mile, to desicalc@gmail.com par contact karein — hum turant sudhaar karke page update kar denge.',
```

- [ ] **Step 3: Verify keys exist in both files**

Run: `Select-String -Path public/assets/js/lang-en.js,public/assets/js/lang-hi.js -Pattern "about.verify|about.standards" | Measure-Object | Select-Object -ExpandProperty Count`
Expected: `8` (4 keys x 2 files)

- [ ] **Step 4: Commit**

```bash
git add public/assets/js/lang-en.js public/assets/js/lang-hi.js
git commit -m "feat(seo): add i18n keys for About page E-E-A-T sections"
```

---

### Task 3: About Page Expansion + Organization Schema

**Files:**
- Modify: `public/about.html`
  - Head: insert Organization JSON-LD (after the existing BreadcrumbList script block, i.e. after line with `</script>` following `"itemListElement"` block)
  - Body: insert two new sections inside `.prose` div (before the Disclaimer section)

**Interfaces:**
- Consumes: i18n keys from Task 2
- Produces: reference Organization block (same JSON reused in Tasks 4–8, with `@id: https://desicalc.in/#organization`)

- [ ] **Step 1: Insert Organization JSON-LD into `<head>`**

After the BreadcrumbList `</script>` in `about.html` head, insert:

```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://desicalc.in/#organization",
    "name": "DesiCalc",
    "url": "https://desicalc.in",
    "logo": "https://desicalc.in/apple-touch-icon.png",
    "foundingDate": "2026-07-05",
    "contactPoint": { "@type": "ContactPoint", "email": "desicalc@gmail.com", "contactType": "customer support" },
    "publishingPrinciples": "https://desicalc.in/about",
    "knowsAbout": ["Income tax in India", "Stamp duty in India", "RTO road tax in India"]
  }
  </script>
```

- [ ] **Step 2: Insert the two new body sections**

In the `.prose prose-stone max-w-none` div, immediately BEFORE the Disclaimer `<h2>` (currently `data-i18n="about.disclaimer.title"`), insert:

```html
      <h2 class="text-xl font-bold text-stone-900 mt-8 mb-3" data-i18n="about.verify.title">How We Verify Our Rates</h2>
      <p class="text-stone-600 leading-relaxed" data-i18n="about.verify.desc">Every stamp duty and RTO tax rate is checked against official state government publications, transport department notifications, and the Income Tax Department of India. Each state page links to its Sources &amp; References. Rates are re-verified whenever a state government issues a new notification.</p>

      <h2 class="text-xl font-bold text-stone-900 mt-8 mb-3" data-i18n="about.standards.title">Editorial Standards</h2>
      <p class="text-stone-600 leading-relaxed" data-i18n="about.standards.desc">DesiCalc is run independently and stays intentionally anonymous. We do not provide financial advice and we never invent credentials. If you spot an error, contact us at desicalc@gmail.com and we will correct it and update the page promptly.</p>
```

- [ ] **Step 3: Verify**

Run: `Select-String -Path public/about.html -Pattern "Organization|about.verify|about.standards" | Measure-Object | Select-Object -ExpandProperty Count`
Expected: `5` or more (2 headings + 2 data-i18n attrs + 1 JSON-LD)

Also open `public/about.html` in a browser and confirm the lang toggle still switches the new sections (EN/Hinglish).

- [ ] **Step 4: Commit**

```bash
git add public/about.html
git commit -m "feat(seo): expand About page with verification process and editorial standards + Organization schema"
```

---

### Task 4: Organization Schema on Home, Privacy, Contact

**Files:**
- Modify: `public/index.html` (insert Organization JSON-LD after the WebSite script block)
- Modify: `public/privacy.html` (insert after BreadcrumbList script block)
- Modify: `public/contact.html` (insert after BreadcrumbList script block)

**Interfaces:**
- Consumes: Organization block from Task 3 (copy verbatim, `@id: https://desicalc.in/#organization`)
- Produces: consistent entity on all top-level pages

- [ ] **Step 1: Insert into `index.html`**

After the `WebSite` `</script>` block (ends with `"description": "Free Indian tax calculators. ... FY 2026-27, Stamp Duty all 29 states, RTO Road Tax."` then `}` then `</script>`), insert the identical Organization block from Task 3 Step 1.

- [ ] **Step 2: Insert into `privacy.html` and `contact.html`**

Same block, inserted after the closing `</script>` of each page's BreadcrumbList JSON-LD.

- [ ] **Step 3: Verify**

Run: `Select-String -Path public/index.html,public/privacy.html,public/contact.html -Pattern 'desicalc.in/#organization' | Measure-Object | Select-Object -ExpandProperty Count`
Expected: `3` (one per file)

- [ ] **Step 4: Commit**

```bash
git add public/index.html public/privacy.html public/contact.html
git commit -m "feat(seo): add Organization schema to home, privacy, contact pages"
```

---

### Task 5: Article Schema Upgrade — 10 Guides & Comparisons

**Files:** Modify all 10:
- `public/guides/capital-gains-tax-changes-2026.html`
- `public/guides/gst-for-freelancers-india.html`
- `public/guides/how-to-calculate-stamp-duty.html`
- `public/guides/how-to-file-itr-2026.html`
- `public/guides/how-to-register-new-car-rto.html`
- `public/guides/hra-exemption-explained.html`
- `public/guides/section-87a-rebate-explained.html`
- `public/comparisons/ev-vs-petrol-road-tax.html`
- `public/comparisons/old-vs-new-tax-regime.html`
- `public/comparisons/stamp-duty-rates-all-states.html`

**Interfaces:**
- Consumes: dates from Task 1 script; Organization `@id` from Task 3
- Produces: Article schema with `author`/`publisher`/`datePublished`/`dateModified`/`mainEntityOfPage`; visible "Last updated" line; `meta author` tag

- [ ] **Step 1: Compute dates for each file**

Run: `node scripts/eaat.js dates public/guides/how-to-calculate-stamp-duty.html` (repeat per file; `dateModified` in JSON-LD = `2026-08-02` regardless of script output — the rollout commit date).

- [ ] **Step 2: Upgrade the Article JSON-LD in each file**

Each file has an Article block currently like:

```json
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "...",
    "description": "...",
    "publisher": { "@type": "Organization", "name": "DesiCalc" }
}
```

Replace the `"publisher": { "@type": "Organization", "name": "DesiCalc" }` line with:

```json
    "author": { "@type": "Organization", "@id": "https://desicalc.in/#organization", "name": "DesiCalc Editorial Team" },
    "publisher": { "@type": "Organization", "@id": "https://desicalc.in/#organization", "name": "DesiCalc" },
    "datePublished": "<datePublished from script>",
    "dateModified": "2026-08-02",
    "mainEntityOfPage": "<canonical URL of the page>"
```

(`<canonical URL>` = the `link rel="canonical"` href value already on the page, e.g. `https://desicalc.in/guides/how-to-calculate-stamp-duty`.)

- [ ] **Step 3: Fix `meta name="author"` (replace `DesiCalc` → `DesiCalc Editorial Team`)**

Run: `Select-String -Path public/guides/*.html,public/comparisons/*.html -Pattern 'meta name="author"'`
- Files where it exists as `content="DesiCalc"`: change to `content="DesiCalc Editorial Team"`.
- Files where it is missing: add `<meta name="author" content="DesiCalc Editorial Team">` right after the `meta name="description"` line.

- [ ] **Step 4: Add visible "Last updated" line under each H1**

Each guide/comparison has an `<h1>` (e.g. `<h1 class="text-3xl sm:text-4xl font-bold text-stone-900 mb-6">...`). Insert immediately after the `</h1>`:

```html
    <p class="text-sm text-stone-500 mb-6">Last updated: 2026-08-02</p>
```

- [ ] **Step 5: Verify all 10 files**

Run: `Select-String -Path public/guides/*.html,public/comparisons/*.html -Pattern 'datePublished|DesiCalc Editorial Team|Last updated' | Measure-Object | Select-Object -ExpandProperty Count`
Expected: `30` (3 matches x 10 files — adjust count if index.html in guides/ has no Article; run only against the 10 listed files)

- [ ] **Step 6: Commit**

```bash
git add public/guides public/comparisons
git commit -m "feat(seo): enrich Article schema with author, dates, and visible last-updated on guides & comparisons"
```

---

### Task 6: Publisher Schema on 5 Tool Pages

**Files:** Modify all 5:
- `public/tools/gst.html`
- `public/tools/hra.html`
- `public/tools/income-tax.html`
- `public/tools/rto-tax.html`
- `public/tools/stamp-duty.html`

**Interfaces:**
- Consumes: Organization `@id` from Task 3

- [ ] **Step 1: Add publisher to each WebApplication JSON-LD**

Each tool page has a `WebApplication` block with `"description": "..."` as one of its last properties. Add after the `"description"` line inside that block:

```json
    "publisher": { "@type": "Organization", "@id": "https://desicalc.in/#organization", "name": "DesiCalc" }
```

- [ ] **Step 2: Add author meta**

Add `<meta name="author" content="DesiCalc Editorial Team">` after the `meta name="description"` line in each tool page.

- [ ] **Step 3: Verify**

Run: `Select-String -Path public/tools/*.html -Pattern 'desicalc.in/#organization|DesiCalc Editorial Team' | Measure-Object | Select-Object -ExpandProperty Count`
Expected: `10` (2 per file x 5 files)

- [ ] **Step 4: Commit**

```bash
git add public/tools
git commit -m "feat(seo): add Organization publisher to tool page schemas"
```

---

### Task 7: State Pages — 58 Pages (Stamp 29 + RTO 29)

**Files:** Modify all 58 (stamp: `public/stamp-duty/{state}.html`; rto: `public/rto-tax/{state}.html` for the 29 slugs in Task 1's `states` array).

**Interfaces:**
- Consumes: Organization `@id` from Task 3
- Produces: `WebPage` JSON-LD with `dateModified`; visible "Rates verified" line; `meta author`

**Execution:** dispatch 4 parallel `general` subagents:
- Agent 1: stamp-duty states andhrapradesh, arunachalpradesh, assam, bihar, chhattisgarh, delhi, goa, gujarat (8)
- Agent 2: stamp-duty haryana, himachalpradesh, jharkhand, karnataka, kerala, madhyapradesh, maharashtra, manipur (8)
- Agent 3: stamp-duty meghalaya, mizoram, nagaland, odisha, punjab, rajasthan, sikkim, tamilnadu (8)
- Agent 4: stamp-duty telangana, tripura, uttarakhand, uttarpradesh, westbengal (5) + rto-tax all 29

Each agent gets the exact instructions below.

- [ ] **Step 1: Agent prompt template (per agent, file list filled in)**

```
You are editing static SEO pages in the repo at C:\Users\dhara\desicalc.
For EACH file in your list, make exactly these 3 changes (read the file first):

1. Add WebPage JSON-LD. Find the FIRST <script type="application/ld+json"> block in <head>
   (it is the WebApplication block). Insert a NEW <script type="application/ld+json"> block
   immediately BEFORE it:

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://desicalc.in/STAMP_OR_RTO/SLUG",
    "url": "https://desicalc.in/STAMP_OR_RTO/SLUG",
    "dateModified": "2026-08-02",
    "isPartOf": { "@type": "WebSite", "name": "DesiCalc", "url": "https://desicalc.in" }
  }
  </script>

   Replace STAMP_OR_RTO with "stamp-duty" or "rto-tax" and SLUG with the file's state slug
   (file name without .html). Use EXACT URL from the page's canonical link.

2. Add visible "Rates verified" line. Each page has an <h1> inside <main> like:
   <h1 class="text-3xl font-bold text-stone-900 mb-2">...</h1>
   Insert immediately after the closing </h1>:
     STAMP pages: <p class="text-sm text-stone-500 mb-4">Rates verified August 2026</p>
     RTO pages:   <p class="text-sm text-stone-500 mb-4">Rates verified July 2026</p>

3. Author meta. If the page has <meta name="author" content="DesiCalc"> change it to
   content="DesiCalc Editorial Team". If missing, add
   <meta name="author" content="DesiCalc Editorial Team">
   right after the <meta name="description" ...> line.

VERIFY each file afterwards: exactly 1 WebPage JSON-LD block, 1 "Rates verified" line,
1 author meta. Report per-file confirmation. Do NOT change anything else.
```

- [ ] **Step 2: Verify all 58 files after agents finish**

Run: `Select-String -Path public/stamp-duty/*.html,public/rto-tax/*.html -Pattern 'dateModified|Rates verified' | Measure-Object | Select-Object -ExpandProperty Count`
Expected: `174` (2 WebPage/dateModified matches? No — `dateModified` appears once per WebPage block and `Rates verified` once per page = 2 x 58 = 116). Confirm by listing files with 0 matches: `Get-ChildItem public/stamp-duty/*.html,public/rto-tax/*.html | Where-Object { (Select-String -Path $_.FullName -Pattern 'Rates verified' -Quiet) -ne $true } | Select-Object Name`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add public/stamp-duty public/rto-tax
git commit -m "feat(seo): add WebPage dateModified schema, verified-rate lines, and author meta to 58 state pages"
```

---

### Task 8: Sitemap Lastmod Sync

**Files:**
- Modify: `public/sitemap.xml`

**Interfaces:**
- Consumes: Task 1 script (`eaat.js sitemap`)

- [ ] **Step 1: Run the sitemap updater**

Run: `node scripts/eaat.js sitemap`
Expected: prints `sitemap lastmod updated to 2026-08-02`

- [ ] **Step 2: Verify XML still valid + no unintended changes**

Run: `[xml](Get-Content public/sitemap.xml -Raw) | Out-Null; "XML OK"`
Expected: `XML OK`

Run: `git diff --stat public/sitemap.xml`
Expected: only `<lastmod>` line changes for the ~79 touched URLs; untracked pages (e.g. `/tools/gst` if gst tool page does not exist in sitemap) unchanged.

- [ ] **Step 3: Commit**

```bash
git add public/sitemap.xml
git commit -m "feat(seo): sync sitemap lastmod dates for E-E-A-T rollout"
```

---

### Task 9: Full Verification + Build

**Files:**
- No new files (verification only)

- [ ] **Step 1: JSON-LD parse check**

Run:

```powershell
$bad = @()
Get-ChildItem public -Recurse -Filter *.html | ForEach-Object {
  $c = Get-Content $_.FullName -Raw
  $ms = [regex]::Matches($c, '<script type="application/ld\+json">(.*?)</script>', 'Singleline')
  foreach ($m in $ms) {
    try { $null = $m.Groups[1].Value | ConvertFrom-Json } catch { $bad += "$($_.FullName): $($_.Exception.Message.Substring(0,60))" }
  }
}
if ($bad.Count -eq 0) { "ALL JSON-LD BLOCKS PARSE" } else { $bad | Select-Object -First 10 }
```
Expected: `ALL JSON-LD BLOCKS PARSE`

- [ ] **Step 2: @id consistency check**

Run: `Select-String -Path (Get-ChildItem public -Recurse -Filter *.html).FullName -Pattern '#organization' -AllMatches | ForEach-Object { $_.Matches } | Measure-Object | Select-Object -ExpandProperty Count`
Expected: equals number of pages with Organization (at least 3 top-level + 10 guides/comparisons + 5 tools + 58 state pages = 76+). Confirm no other `@id` fragments exist: `Select-String -Pattern '#website'` → expect 0 or only in pages where intentionally added (none — we inline `WebSite` objects).

- [ ] **Step 3: Run unit tests**

Run: `npm test`
Expected: `260 passed, 0 failed`

- [ ] **Step 4: Rebuild Tailwind (if any new utility classes were introduced)**

Run: `npm run build`
Expected: `Done in <1s.` (no new classes were planned; safe no-op)

- [ ] **Step 5: Git status check**

Run: `git status --short`
Expected: clean (only untracked `.claude/` allowed)

- [ ] **Step 6: Push**

```bash
git push origin develop
```
Expected: `develop -> develop`

---

## Self-Review Notes

- Spec §1 (attribution) → Tasks 3–7 (Organization entity, "DesiCalc Editorial Team", no Person schema).
- Spec §2 (dates) → Tasks 1, 5, 7, 8 (git-derived dates, visible lines, sitemap sync).
- Spec §3 (no new page; About expansion) → Task 3.
- Spec §4 (Organization fields: logo, foundingDate, contactPoint, publishingPrinciples, knowsAbout) → Task 3 block, reused verbatim in Tasks 4–8.
- Spec §5 (rollout matrix) → Tasks 4, 5, 6, 7. Note: spec listed 3 tool pages; plan covers all 5 existing tool pages for consistency (superset).
- Spec §6 (i18n) → Task 2 (keys in both lang files; visible lines on state/guide pages are static English, consistent with those pages having no body i18n).
- Spec §7 (rollout mechanics/verification) → Tasks 1, 8, 9.
