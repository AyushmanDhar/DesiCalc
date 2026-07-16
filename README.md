# DesiCalc — Free Indian Calculators

Indian tax, stamp duty, and RTO road tax calculators. No login. No data leaves your device.

**Live at [desicalc.in](https://desicalc.in)**

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
| Ad network | Google AdSense (AdSense Auto Ads + manual placements) |
| PWA | Custom service worker, cache-first for assets, network-first for pages |
| i18n | Client-side JSON-based translation |
| Deployment | Git push → Cloudflare auto-deploy |

## Project Structure

```
public/
├── index.html              # Home page
├── sw.js                   # Service worker (offline caching)
├── site.webmanifest        # PWA manifest
├── sitemap.xml             # XML sitemap with hreflang annotations
├── robots.txt              # Crawler directives with Content-Signals
├── _headers                # Security & CORS headers (CSP, HSTS, MCP)
├── _redirects              # URL redirects (old /programmatic/ → clean paths)
├── assets/
│   ├── css/
│   │   ├── style.css       # Hand-written custom styles
│   │   └── tailwind.css    # Generated (purged Tailwind utilities)
│   ├── js/                 # calc-core, i18n (en/hi), state-rates, slabs
│   └── img/                # Open Graph images (1200×630)
├── tools/                  # Calculator pages (income-tax, stamp-duty, rto-tax)
├── guides/                 # 5 how-to articles (ITR, stamp duty, RTO, 87A, capital gains)
├── comparisons/            # 3 side-by-side comparisons
├── stamp-duty/              # Index + 28 state-specific stamp duty pages
└── rto-tax/                 # Index + 28 state-specific RTO tax pages
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
- State-specific pages are under `public/stamp-duty/` and `public/rto-tax/`
