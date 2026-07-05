# SPEC-004: Deployment — Cloudflare Pages

## Domain Strategy

| Resource | Choice | Cost | Why |
|----------|--------|------|-----|
| Primary domain | `desicalc.pages.dev` | $0 | Cloudflare Pages default subdomain. Custom domain deferred until real traffic arrives |
| SSL | Auto via Cloudflare | $0 | Universal SSL |
| CDN | Cloudflare global edge (330+ nodes) | $0 | Included with Pages |
| DNS | Cloudflare DNS | $0 | Fastest DNS propagation |

### Future: Custom Domain
- Buy `desicalc.in` (₹800/yr, ~$10) when daily visitors exceed 500
- Registrar: Cloudflare Registrar or Namecheap
- Point NS to Cloudflare, add as custom domain in Pages

---

## Cloudflare Pages Setup

### Wrangler Config (`wrangler.toml`)

```toml
name = "desicalc"
type = "pages"
pages_build_output_dir = "./public"
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
6. Project assigned `desicalc.pages.dev` automatically
7. Enable HTTPS enforcement (on by default)

### `public/_headers` (Security & SEO)

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://data527.click https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' https: data:; connect-src 'self' https://data527.click; frame-src 'self' https://data527.click
```

### `public/_redirects`

(Empty — Cloudflare Pages auto-serves `foo.html` at `/foo` for static sites. Redirects may be added later for SEO.)

---

## Git Workflow

```
main ─────┬─────── feature/income-tax ───── merge ──→ deploy
          │
          ├──── feature/stamp-duty ───────── merge ──→ deploy
          │
          ├──── feature/rto-tax ──────────── merge ──→ deploy
```

- `main`: Always deployable. Pushes auto-deploy to `desicalc.pages.dev`
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
| Ad revenue | Adsterra dashboard | Real-time stats |
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
