# SPEC-004: Deployment — Cloudflare Pages

## Domain Strategy

| Resource | Choice | Cost | Why |
|----------|--------|------|-----|
| Primary domain | `desicalc.in` | ₹800/yr (~$10) | .in builds India trust, ₹.in domain signals local tool |
| SSL | Auto via Cloudflare | $0 | Universal SSL |
| CDN | Cloudflare global edge (330+ nodes) | $0 | Included with Pages |
| DNS | Cloudflare DNS | $0 | Fastest DNS propagation |

### Registration
- Registrar: **Cloudflare Registrar** (at cost, no markup) or **Namecheap** (if CF not available for .in)
- If CF Registrar doesn't support `.in` — use Namecheap, point NS to Cloudflare

---

## Cloudflare Pages Setup

### Wrangler Config (`wrangler.toml`)

```toml
name = "desicalc"
compatibility_date = "2026-07-01"

[build]
command = "echo 'static site - no build required'"
output_dir = "public"

[env.production]
routes = [
  { pattern = "desicalc.in", zone_id = "ZONE_ID_HERE" }
]

[[redirects]]
from = "/tools/income-tax"
to = "/tools/income-tax.html"
status = 200

[[redirects]]
from = "/tools/stamp-duty"
to = "/tools/stamp-duty.html"
status = 200

[[redirects]]
from = "/tools/rto-tax"
to = "/tools/rto-tax.html"
status = 200
```

### Step-by-Step Setup

1. Push `public/` to GitHub repo `desicalc`
2. Cloudflare Dashboard → Pages → Create project → Connect Git
3. Select repo, branch `main`
4. Build settings:
   - Build command: (none — static files)
   - Build output: `public`
   - Root directory: (leave blank)
5. Deploy
6. Add custom domain: `desicalc.in`
7. Enable HTTPS enforcement

### `public/_headers` (Security & SEO)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

# Calculators
https://desicalc.in/tools/*
  Link: </assets/css/style.css>; rel=preload; as=style
  Link: </assets/js/calc-core.js>; rel=preload; as=script

# Static assets - long cache
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### `public/_redirects`

```
/tools/income-tax      /tools/income-tax.html      200
/tools/stamp-duty      /tools/stamp-duty.html       200
/tools/rto-tax         /tools/rto-tax.html          200
/comparisons/*         /comparisons/:splat.html     200

# Programmatic state pages
/programmatic/stamp-duty/:state   /tools/stamp-duty.html?state=:state  200
/programmatic/rto-tax/:state      /tools/rto-tax.html?state=:state       200
```

---

## Git Workflow

```
main ─────┬─────── feature/income-tax ───── merge ──→ deploy
          │
          ├──── feature/stamp-duty ───────── merge ──→ deploy
          │
          ├──── feature/rto-tax ──────────── merge ──→ deploy
```

- `main`: Always deployable. Pushes auto-deploy to `desicalc.in`
- Feature branches: Preview deploys via Cloudflare Pages (unique URL per branch)
- No PR gates needed for solo founder (can skip)
- Commit messages: `feat: add income tax calculator logic`, `fix: 87A rebate threshold`

---

## Build-Free Deployment (Zero Cost Guarantee)

**No build step = $0 hosting cost forever.** Because:

- No server-side code → no compute cost
- No database → no storage cost
- Static files only → Cloudflare Pages free tier (unlimited bandwidth + 500 builds/mo)
- PWA service worker registered at runtime (no build injector needed)

If traffic exceeds Cloudflare Pages free tier limits (unlikely — 500 builds & unlimited bandwidth):

| Free | Pro ($20/mo) |
|------|-------------|
| Unlimited bandwidth | Same |
| 500 builds/mo | 5,000 builds/mo |
| 1 concurrent build | 5 concurrent |
| No Analytics | Web Analytics included |

---

## Monitoring

| Aspect | Tool | Why |
|--------|------|-----|
| Traffic analytics | Cloudflare Web Analytics | Free, privacy-first, no JS required |
| Uptime | Cloudflare Pages status | Automatic |
| Errors | Browser console (ad-hoc) | No error tracking needed for static site |
| Ad revenue | PropellerAds dashboard | Real-time stats |
| Search performance | Google Search Console | Free, essential for SEO |
| Core Web Vitals | CrUX via GSC | Free, monthly report |

---

## CI/CD (Optional — can start without)

```yaml
# .github/workflows/deploy.yml
on: push
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
```

Manual deploy is also fine for MVP: drag-drop `public/` folder via Cloudflare Pages dashboard.
