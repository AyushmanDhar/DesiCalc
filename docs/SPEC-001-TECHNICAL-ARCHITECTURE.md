# SPEC-001: Technical Architecture & Data Flow

## Stack Overview

```
desicalc.in
├── cloudflare-pages          # Hosting, edge CDN, unlimited bandwidth
├── vanilla-js                # Zero framework — no build step, no deps
│   └── progressive-enhancement  # Works JS-off (static forms), enhanced JS-on
├── tailwind-css (CDN)        # Utility-first, fast prototyping
├── adsterra                  # Primary ad network (no min traffic, instant)
└── cloudflare-analytics      # Free, privacy-first, no GA dependency
```

### Why Vanilla JS + Tailwind CDN
- **Zero build step** — edit HTML, push git, Cloudflare auto-deploys
- **No npm/webpack/vite** — reduces perceived complexity, no dependency audit
- **PWA via custom service worker** — offline cache for calculators
- **Tailwind via CDN** — `https://cdn.tailwindcss.com` — no purge needed for prototype

---

## Directory Structure

```
desicalc/
├── public/                      # Cloudflare Pages root
│   ├── index.html               # Home page — tool grid + search
│   ├── tools/
│   │   ├── income-tax.html      # Self-contained calculator
│   │   ├── stamp-duty.html
│   │   └── rto-tax.html
│   ├── stamp-duty/              # State-level stamp duty pages (static)
│   ├── rto-tax/                 # State-level RTO tax pages (static)
│   │   ├── stamp-duty/
│   │   │   ├── maharashtra.html
│   │   │   ├── karnataka.html
│   │   │   └── ...  (28 states)
│   │   └── rto-tax/
│   │       ├── maharashtra.html
│   │       ├── karnataka.html
│   │       └── ...  (28 states)
│   ├── comparisons/
│   │   ├── old-vs-new-regime.html
│   │   ├── stamp-duty-rates-all-states.html
│   │   └── ev-vs-petrol-road-tax.html
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css        # Custom overrides, ad slot spacing
│   │   └── js/
│   │       ├── calc-core.js     # Shared helpers: formatINR, clamp, debounce
│   │       ├── slabs-2026.js    # Tax slabs, rebates, cess rates
│   │       ├── state-rates.js   # 28-state stamp duty + RTO rate table
│   │       └── lang-en.js       # English UI strings
│   │       └── lang-hi.js       # Hinglish UI strings
│   ├── sw.js                     # PWA offline cache (service worker)
│   ├── site.webmanifest          # Web app manifest (PWA)
│   ├── sitemap.xml               # Full site XML sitemap
│   ├── robots.txt
│   ├── _headers                  # Security headers (CSP)
│   └── _redirects
├── wrangler.toml                 # Cloudflare Pages config
├── package.json                  # Metadata only (no deps)
├── .gitignore
└── README.md
```

---

## Data Flow Architecture

```
┌──────────────┐     ┌───────────────────────┐     ┌──────────────┐
│  User fills   │────>│  Client-side JS reads  │────>│  Render to   │
│  form fields  │     │  all inputs, selects    │     │  DOM result  │
│  (no submit)  │     │  state/regime/income     │     │  block       │
└──────────────┘     └───────────┬───────────┘     └──────────────┘
                                 │
                                 ▼
                        ┌───────────────────┐
                        │  Pure function     │
                        │  calcTax(income,   │
                        │   regime, age,     │
                        │   deductions...)   │
                        │  → result object   │
                        └───────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
            ┌──────────────┐         ┌────────────────┐
            │  LocalStorage │         │  URL query      │
            │  (last inputs)│         │  params (share) │
            └──────────────┘         └────────────────┘
```

Key principle: **No server round-trips for calculations**. All computations run in browser. This means:
- Zero server cost at any scale
- Instant results (no latency)
- Works fully offline after first load (PWA cache)
- Privacy compliant by default — no data leaves device

---

## State Management (per-tool)

Each tool is a self-contained HTML file. State is managed via:

| Storage | Purpose | Lifetime |
|---------|---------|----------|
| URL `searchParams` | Input sharing (link bookmark) | Session |
| `localStorage` key `desicalc_incometax_last` | Restore last inputs on return | Forever |
| `sessionStorage` key `desicalc_incometax_ad_closed` | Ad dismiss state | Tab session |

URL pattern: `desicalc.in/tools/income-tax?regime=new&income=1200000&age=30`
→ On page load, parse params. If absent, check localStorage. If absent, use defaults.

---

## Language Toggle Mechanism

```
English ↔ Hinglish
     │
     ▼
Switch `data-lang` attribute on `<html>`:
  <html data-lang="en"> ...
  <html data-lang="hi"> ...
     │
     ▼
JS reads all elements with `data-i18n="key"`:
  <label data-i18n="tax.label.income">Income (₹)</label>
     │
     ▼
Lookup key in lang-{en,hi}.js → replace innerText
```

- No i18n library. Plain object lookup: `strings[key]`
- ~300 keys total for 3 tools. ~50 shared, ~250 tool-specific
- Toggle persists to localStorage (`desicalc_lang`)

---

## PWA Strategy

| Feature | Implementation |
|---------|---------------|
| Service Worker | Custom `sw.js` registered at runtime |
| Cache Strategy | Cache-first for assets, network-first for HTML |
| Offline | Full calculator logic works offline after first visit |
| Installable | `site.webmanifest` with `display: standalone`, `icons/192` |

---

## Performance Budget

| Metric | Target | How |
|--------|--------|-----|
| FCP | < 1.5s | Inline critical CSS, async non-critical, CDN edge |
| LCP | < 2.5s | No images, skeleton loading |
| TBT | < 50ms | All work off main thread via `requestIdleCallback` |
| TTI | < 2s | Deferred JS execution, ad slots lazy-loaded |
| Lighthouse | 95+ | Strict CSP, minimal DOM, semantic HTML |
