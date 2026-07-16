# DesiCalc — Free Indian Calculators

Indian tax, stamp duty, and RTO road tax calculators. No login. No data leaves your device.

**Live at [desicalc.in](https://desicalc.in)**
**Develop branch**: [develop.desicalc.in](https://develop.desicalc.in)

## Tools

- [Income Tax Calculator](https://desicalc.in/tools/income-tax) — FY 2026-27, Old vs New regime
- [Stamp Duty Calculator](https://desicalc.in/tools/stamp-duty) — All 28 states
- [RTO Tax Calculator](https://desicalc.in/tools/rto-tax) — All states, all vehicle types

## Features

- **Fully client-side** — all calculation runs in browser, no server round-trip
- **Offline-capable** — PWA service worker caches assets and pages
- **Dual language** — English and Hindi with client-side toggle
- **Mobile-first** — responsive layout with Tailwind CSS
- **Privacy-first** — zero tracking cookies, no data collection
- **Tasteful whimsy** — time-based greetings, animated result counters, subtle card hover effects, back-to-top button

## Stack

| Layer | Choice |
|-------|--------|
| Hosting | Cloudflare Pages (global edge CDN) |
| Frontend | Vanilla JS + Tailwind CSS (build-time) |
| Ad network | Adsterra (via `data527.click`) |
| PWA | Custom service worker, cache-first for assets, network-first for pages |
| i18n | Client-side JSON-based translation |
| Deployment | Git push → Cloudflare auto-deploy |

## Project Structure

```
public/
├── index.html              # Home page
├── sw.js                   # Service worker (offline caching)
├── site.webmanifest        # PWA manifest
├── _headers                # Security headers (CSP)
├── _redirects
├── assets/
│   ├── css/
│   │   ├── style.css       # Hand-written custom styles
│   │   └── tailwind.css    # Generated (purged Tailwind utilities)
│   ├── js/                 # calc-core, i18n, state-rates, slabs, ad
│   └── img/                # Open Graph images
├── tools/                  # Calculator pages (income-tax, stamp-duty, rto-tax)
├── guides/                 # How-to articles
├── comparisons/            # Side-by-side comparisons
├── stamp-duty/              # 28 state-specific stamp duty pages
└── rto-tax/                 # 28 state-specific RTO tax pages
src/
└── tailwind.css            # Tailwind source (input)
tailwind.config.js          # Tailwind content paths
package.json                # Dependencies & build scripts
wrangler.toml               # Cloudflare Pages config
```

## Development

```bash
# Install dependencies (first time only)
npm ci

# Build Tailwind CSS
npm run build

# Serve locally
npx serve public
```

To auto-rebuild on file changes, run `npm run dev` (watches for changes) in a separate terminal.

## Contributing

Contributions welcome! Open an issue or submit a PR.

- Add or update state-wise rates in `public/assets/js/state-rates.js`
- Add translations in `public/assets/js/lang-en.js` / `lang-hi.js`
- Calculator logic lives in `public/assets/js/calc-core.js`
