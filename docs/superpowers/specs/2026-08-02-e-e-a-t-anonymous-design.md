# Design: Anonymous E-E-A-T Infrastructure

**Date:** 2026-08-02
**Status:** Approved (sections 1–6; Section 3 "new editorial-policy page" dropped per user review)
**Context:** desicalc.in suffered a sitewide algorithmic demotion (~July 24, 2026). Duplicate-content theory ruled out. Recovery focuses on E-E-A-T signals. Operator must remain anonymous; no fake personas; nothing illegal or spammy.

## 1. Attribution Model

- **No `Person` schema, no personal names anywhere on the site.**
- Author = `"DesiCalc Editorial Team"`, modeled as an **Organization entity**.
- Persistent `@id`: `https://desicalc.in/#organization` — a pure functional identifier. No visible element, no anchor, no page required for it. Reused identically on every page's JSON-LD so Google merges all authors into one entity.
- `publisher` = the same Organization on all content pages.
- `<meta name="author" content="DesiCalc Editorial Team">` on all content pages (currently only 4 pages have any author meta).
- Honest framing everywhere: "independent calculator", "rates cross-checked against official government publications". No invented credentials, no "reviewed by CA" claims.

## 2. Truthful Dates (freshness signal)

- Every content page gets `datePublished` + `dateModified` derived **from git history**:
  - `datePublished` = first commit date for the file (`git log --diff-filter=A -1 --format=%aI`)
  - `dateModified` = last commit date for the file (`git log -1 --format=%aI`)
- All dates truthful and recent (site launched 2026-07-05; pages touched through 2026-08-02).
- Visible **"Last updated: <date>"** line under the H1 on guides and comparisons.
- State pages get a **"Rates verified <month> <year>"** line: stamp-duty pages say "August 2026" (verification completed this session); rto-tax pages say "August 2026" (rates applied/verified in the 2026-08-01 rewrite). Both truthful, strong freshness signals.
- Keep `public/sitemap.xml` lastmod in sync with dateModified.

## 3. About Page Expansion (no new page)

- **No new `/editorial-policy` URL.** New content lives on the existing `public/about.html`.
- Add sections to `about.html`:
  - **"How We Verify"** — primary government sources, cross-checking, per-state gazettes/notifications, Sources & References on every state page.
  - **"Editorial Standards"** — correction process (contact email), update cadence, independent and intentionally anonymous operation.
- Add `Organization` JSON-LD to about page.

## 4. Organization Schema Entity

Used on home, about, privacy, contact, and referenced as `publisher`/`author` elsewhere:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://desicalc.in/#organization",
  "name": "DesiCalc",
  "url": "https://desicalc.in",
  "logo": "https://desicalc.in/apple-touch-icon.png",
  "foundingDate": "2026-07-05",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "desicalc@gmail.com",
    "contactType": "customer support"
  },
  "publishingPrinciples": "https://desicalc.in/about",
  "knowsAbout": ["Income tax in India", "Stamp duty in India", "RTO road tax in India"]
}
```

- `sameAs` omitted (anonymity).
- `logo` = existing `/apple-touch-icon.png` (no new asset).

## 5. Schema Rollout

| Page type | Pages | Changes |
|---|---|---|
| Home `index.html` | 1 | Add Organization block (currently WebSite + BreadcrumbList only) |
| Guides/comparisons | 9 | Existing Article schema: add `author` (Org ref), `datePublished`, `dateModified`, `mainEntityOfPage` |
| State pages (stamp-duty + rto-tax) | 58 | Visible "Rates verified <month> <year>" line; `WebPage` JSON-LD block with `dateModified` + `@id` (page URL) + `isPartOf` (WebSite); author meta |
| Tools (`tools/income-tax`, `tools/stamp-duty`, `tools/rto-tax`) | 3 | `publisher` Organization on WebApplication schema where present |
| About / privacy / contact | 3 | Organization entity; about gets expanded content; footer stays as-is |

- No new URLs, no new pages, no new assets.

## 6. i18n

- Site has EN/Hinglish toggle (`lang-en.js` / `lang-hi.js`, keys on `window.DESICALC_LANG`, elements use `data-i18n`).
- All new visible text needs keys in BOTH files:
  - `about.verify.title`, `about.verify.desc` (How We Verify)
  - `about.standards.title`, `about.standards.desc` (Editorial Standards)
  - `lastUpdated` label ("Last updated:")
  - `ratesVerified` label ("Rates verified <month> <year>")
- Hidden JSON-LD content needs no i18n.

## 7. Rollout Mechanics & Verification

- Dates computed via git log (first/last commit per file) — scripted, not hand-typed.
- Parallel subagents for the 58 state pages (pattern proven with Sources sections); direct edits for guides/tools/top-level pages.
- Verification:
  - Every JSON-LD block parses (node JSON.parse on extracted blocks).
  - No duplicate/conflicting `@id` values.
  - New i18n keys present in both lang files; no missing-key warnings in browser check.
  - `npm test` → 260 passed.
  - Tailwind rebuild if any new utility classes introduced (likely none).
  - `git status` clean of unintended files; commit + push to develop → preview deploy.

## Out of Scope

- RTO page content rewrite (separate effort)
- New URLs/pages
- Person schema, author bios, photos
- External profiles (`sameAs`)
- Search Console data pull
