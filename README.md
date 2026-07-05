# DesiCalc — Free Indian Calculators

Indian tax, stamp duty, and RTO road tax calculators. No login. No data leaves your device. No build step.

**Live at [desicalc.pages.dev](https://desicalc.pages.dev)** (custom domain deferred until real traffic)
**Develop branch**: [develop.desicalc.pages.dev](https://develop.desicalc.pages.dev)

## Tools

- [Income Tax Calculator](https://desicalc.pages.dev/tools/income-tax.html) — FY 2026-27, Old vs New regime
- [Stamp Duty Calculator](https://desicalc.pages.dev/tools/stamp-duty.html) — All 28 states
- [RTO Tax Calculator](https://desicalc.pages.dev/tools/rto-tax.html) — All states, all vehicle types

## Features

- **Fully client-side** — all calculation runs in browser, no server round-trip
- **Offline-capable** — PWA service worker caches assets and pages
- **Dual language** — English and Hindi with client-side toggle
- **Mobile-first** — responsive layout with Tailwind CSS
- **Privacy-first** — zero tracking cookies, no data collection

## Stack

| Layer | Choice |
|-------|--------|
| Hosting | Cloudflare Pages (global edge CDN) |
| Frontend | Vanilla JS + Tailwind CSS (CDN) |
| Ad network | Adsterra (via `data527.click`) |
| PWA | Custom service worker, cache-first for assets, network-first for pages |
| i18n | Client-side JSON-based translation |
| Deployment | Git push → Cloudflare auto-deploy |

## Project Structure

```
public/
├── index.html              # Home page
├── sw.js                   # Service worker (offline caching)
├── manifest.json           # PWA manifest
├── _headers                # Security headers (CSP)
├── _redirects
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/                 # calc-core, i18n, state-rates, slabs, ad
│   └── img/                # Open Graph images
├── tools/                  # Calculator pages (income-tax, stamp-duty, rto-tax)
├── guides/                 # How-to articles
├── comparisons/            # Side-by-side comparisons
└── programmatic/           # State-specific deep pages (28 states each for stamp-duty + rto-tax)
```

## Development

No build step. Edit files in `public/` and serve locally:

```bash
npx serve public
```

## Contributing

Contributions welcome! Open an issue or submit a PR.

- Add or update state-wise rates in `public/assets/js/state-rates.js`
- Add translations in `public/assets/js/lang-en.js` / `lang-hi.js`
- Calculator logic lives in `public/assets/js/calc-core.js`
