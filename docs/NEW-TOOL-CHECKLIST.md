# New Tool Checklist

Use this checklist when adding a new calculator tool. Steps are ordered and grouped by dependency.

## Step 0: Define your tool's identity

Pick these upfront — they're referenced everywhere:

| Property | Example | Convention |
|----------|---------|------------|
| **Tool key** | `gst` | Short snake_case, used in i18n, ad slots, localStorage |
| **Tool slug** | `gst-calculator` | kebab-case URL path under `/tools/` |
| **Tool name** | `GST Calculator` | Human-readable, used in titles & headings |
| **OG image name** | `og-gst-calculator.png` | Must match Open Graph meta tag |
| **Has state pages?** | yes/no | If yes, step 4 adds ~60 files |
| **Neighbors concept?** | yes/no | Only if state pages reference neighboring states |

## Step 1: Central data & constants

- [ ] **`state-data.js`** — Add `GST_RATES` constant with per-state summary rates (if state-level)
- [ ] **`api-config.js`** — Add entry to `APIS` array with `id`, `name`, `description`, `anchor`, `serviceDoc`, `serviceDesc`, `inputSchema`, `outputSchema`
- [ ] **`public/assets/js/state-rates.js`** — Add full `GST_RATES` data object (if state-level, with slab/rate structures)
- [ ] **`public/assets/js/calc-core.js`** — Add `calcGst()` function with full calculation logic
- [ ] **`public/assets/js/ad.js`** — Add ad slots: `sidebar_top_gst` and `in_content_gst` to `AD_TAGS` and `PAGE_SLOTS`; add `gst-calculator` to `getPageKey()`

## Step 2: i18n strings

Add translations in both files with key prefix `gst.*`:

| Key pattern | Purpose | Count |
|-------------|---------|-------|
| `gst.title` | Page title + H1 | 1 |
| `gst.subtitle` | Subtitle paragraph | 1 |
| `gst.label.*` | Form field labels | per-field |
| `gst.result.*` | Result row labels | per-row |
| `gst.faq.title` | FAQ section heading | 1 |
| `gst.faq.q1..q3` | FAQ questions | 3 |
| `gst.faq.a1..a3` | FAQ answers | 3 |

- [ ] **`public/assets/js/lang-en.js`** — Add all English translations
- [ ] **`public/assets/js/lang-hi.js`** — Add all Hindi/Hinglish translations

## Step 3: Tool HTML page

- [ ] **`public/tools/gst-calculator.html`** — Create tool page following this skeleton:

  ```
  DOCTYPE html<html lang="en" data-lang="en">
  <head>
    Meta charset + viewport
    i18n title + meta description
    Favicons (4x link tags + apple-mobile-web-app-title + manifest)
    Canonical + hreflang (en + x-default)
    Open Graph (title, description, url, image: 1200x630 png, twitter:card)
    JSON-LD: WebApplication + SoftwareApplication
    JSON-LD: FAQPage (3 Q&A)
    JSON-LD: BreadcrumbList (Home / Tool)
    CSS: tailwind.css, style.css
    JS: common.js, calc-core.js, lang-en.js, ad.js  (+ state-rates.js / slabs-*.js if needed)
  </head>
  <body>
    Skip link → #calc-form
    Sticky header (Back link + logo + greeting + lang toggle)
    Two-column layout:
      LEFT: H1 + subtitle + form (label + input pairs, reset button)
      RIGHT: ad sidebar_top_gst + share/copy buttons + result card (staggerReveal) + ad in_content_gst
    Related pages section (grid of links)
    FAQ section (3 toggle items, toggleFaq)
    Footer ad slot footer_main
    Footer (About / Privacy / Contact links)
    Toast div#toast + Back-to-top button#backToTop
    Inline <script>:
      getVal(id), setText(id, val)
      calcGst() to gather inputs → call shared calc → setText results
      populateStates() if dropdown
      resetForm()
      initLang(), initScrollReveal(), initTooltips(), initOnboarding(), initGreeting(), initBackToTop()
      applyUrlParams(), then calcGst()
  </body>
  ```
  
  **Form input conventions:**
  - `type="text" inputmode="numeric"` for numbers
  - `<select>` for enums (state, type, etc.)
  - IDs: camelCase like `gstRate`, `invoiceValue`
  - Labels wrapped in `<span data-i18n="gst.label.{field}">` with optional `?` tooltip

  **Result card conventions:**
  - IDs: prefix `r` + PascalCase — `rTotal`, `rGstAmount`
  - Classes: `result-row`, `result-row total` for the total row
  - `data-i18n="gst.result.{field}"` on labels
  - Use `staggerReveal('resultBox')` to animate

## Step 4: Programmatic state pages (if applicable)

- [ ] **`generate-programmatic.js`** — Add `generateGstIndex()`, `generateGstStatePage(slug)` functions following the stamp-duty/rto-tax pattern
- [ ] **`generate-programmatic.js`** — Add write logic at bottom for `public/programmatic/gst-calculator/` directory
- [ ] **`surgical-edit.js`** (or inline in generator) — Add neighbor compare box, all-states grid footer, breadcrumb "All States" link
- [ ] Run generator: `node generate-programmatic.js`
- [ ] Run surgical edits: `node surgical-edit.js`

## Step 5: Homepage & navigation

- [ ] **`public/index.html`** — Add tool card to `.tool-grid` (icon, name, description, Calculate link)
- [ ] **`public/index.html`** — Add `home.gst.*` i18n keys inline or via lang files

## Step 6: Sitemap, discovery & headers

- [ ] **`public/sitemap.xml`** — Add `<url>` entries: tool page + state-level pages + guides/comparisons
- [ ] **`public/_headers`** — Append `</tools/gst-calculator>; rel="service-doc"; type="text/html"` to the `Link:` header
- [ ] **`api-config.js`** — Already added in Step 1; run `npm run generate-discovery` to regenerate `api-catalog` + `agent-card.json`
- [ ] **`public/sw.js`** — Add new asset paths to `STATIC_ASSETS` array (OG image, new JS files, etc.)

## Step 7: Assets

- [ ] **`public/assets/img/og-gst-calculator.png`** — Create OG image, 1200×630px PNG

## Step 8: Optional pages (if applicable)

- [ ] `public/comparisons/gst-comparison.html` — Comparison article
- [ ] `public/guides/how-to-calculate-gst.html` — Guide article
- [ ] `public/openapi/gst-calculator.json` — OpenAPI 3.1 spec for the API

## Step 9: Smoke test

- [ ] Run `npm run generate-discovery` — verify no errors
- [ ] Run `node generate-programmatic.js` — verify state pages generated (if applicable)
- [ ] Validate `public/sitemap.xml` — all new URLs present
- [ ] Validate `public/_headers` — Link header includes new tool
- [ ] Open tool page in browser — form renders, calculation works, i18n toggle works
- [ ] Share/copy URL round-trips correctly (URL params → form state)
- [ ] Check no console errors

---

**Quick reference: files that change for every new tool**

| File | Action |
|------|--------|
| `api-config.js` | Add API entry |
| `public/assets/js/lang-en.js` | Add `gst.*` keys |
| `public/assets/js/lang-hi.js` | Add `gst.*` keys |
| `public/assets/js/calc-core.js` | Add `calcGst()` function |
| `public/assets/js/ad.js` | Add ad slots + page key |
| `public/tools/gst-calculator.html` | **Create** main tool page |
| `public/index.html` | Add tool card |
| `public/sitemap.xml` | Add URL entries |
| `public/_headers` | Append Link header |
| `public/sw.js` | Add new assets |
| `public/assets/img/og-gst-calculator.png` | **Create** OG image |
| `generate-programmatic.js` | Add generators (if state-level) |
| `state-data.js` | Add rates (if state-level) |
| `public/assets/js/state-rates.js` | Add full data (if state-level) |
