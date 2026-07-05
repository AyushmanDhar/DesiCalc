# DesiCalc — Free Indian Calculators

Indian tax, stamp duty, and RTO road tax calculators. No login. No build step. Just vanilla JS + HTML.

## Stack

- **Hosting**: Cloudflare Pages (edge CDN)
- **Frontend**: Vanilla JS, Tailwind CSS (CDN)
- **PWA**: Service worker with offline caching (cache-first for assets, network-first for pages)
- **i18n**: EN / हिं (client-side language toggle)
- **Deploy**: Push to `master` → Cloudflare auto-deploys

## Tools

| Tool | Description |
|------|-------------|
| [Income Tax Calculator](https://desicalc.in/tools/income-tax.html) | FY 2026-27 — Old vs New regime |
| [Stamp Duty Calculator](https://desicalc.in/tools/stamp-duty.html) | All 28 states |
| [RTO Tax Calculator](https://desicalc.in/tools/rto-tax.html) | All states, all vehicle types |

## Directory

```
public/
├── index.html
├── sw.js                    # Service worker
├── manifest.json            # PWA manifest
├── assets/
│   ├── css/style.css
│   ├── js/                  # calc-core, i18n, state-rates, slabs, ad
│   └── img/                 # OG images
├── tools/                   # Calculator pages
├── guides/                  # How-to guides
├── comparisons/             # Side-by-side comparisons
├── programmatic/            # State-specific pages
├── _headers                 # CSP headers
└── _redirects
```

## Development

No build step. Edit files in `public/`, serve locally with any static server:

```bash
npx serve public
```

## Deploy

Push to `master` — Cloudflare Pages picks up changes from `public/` directory.

```bash
git push origin master
```
