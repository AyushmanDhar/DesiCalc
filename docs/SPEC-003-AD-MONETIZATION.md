# SPEC-003: Ad Monetization Strategy

## Primary Network: Adsterra

### Why Adsterra

| Criteria | PropellerAds | Adsterra | ylliX |
|----------|-------------|----------|-------|
| Approval | Instant | < 24 hrs | Instant |
| Min traffic | None | None | None |
| Min payout | $5 (PayPal) | $100 | $1 |
| Payout frequency | Weekly / Net-30 | Bi-weekly | Daily |
| Formats | Push, Pop, Native, Banner, Interstitial | Pop, Native, Banner, Social Bar | Push, Pop, Native |
| Global fill | Yes, strong in India | Yes, strong in India | Growing |
| India CPM (est.) | $0.05–$0.50 (pop), $0.10–$0.30 (push) | $0.08–$0.40 (pop) | $0.03–$0.10 |
| AdBlock bypass | Push notifications not blocked | Pop can be blocked | Push not blocked |

**Decision: Adsterra as primary** (implemented via `data527.click` network). Chosen for instant approval with no minimum traffic, multi-format support, and strong India fill. ylliX as future fallback if Adsterra underperforms on India traffic.

### Adsterra Onboarding (completed)

1. Registered at Adsterra
2. Site URL: `desicalc.in`
3. Site category: "Finance/Tools"
4. Added `data527.click` to Cloudflare `_headers` CSP allowlist
5. Got placement IDs for each ad unit. 6 ad slots created.

---

## Ad Slot Map

### Desktop Layout (≥ 1024px)

```
┌─────────────────────────────────────────┐
│  HEADER                                  │
│  [Logo] [Language Toggle] [Search]       │
│  ─────────────────────────────────────   │
│  [PropellerAds Push Notification Opt-in] │
├────────────────┬────────────────────────┤
│                │                         │
│   CALCULATOR   │  SIDEBAR               │
│   FORM         │  [Native Ad 300x250]    │
│                │  ──────────────         │
│   [RESULT]     │  [Native Ad 300x250]    │
│                │                         │
├────────────────┴────────────────────────┤
│  IN-CONTENT AD  (728x90 banner)          │
│  ──below result ──                        │
│                                          │
│  FAQ SECTION                             │
│  [Q1] [Q2] [Q3] ...                      │
│                                          │
│  RELATED TOOLS GRID                      │
│  [Tax] [Stamp] [RTO]                     │
│                                          │
│  FOOTER AD (728x90 banner)               │
├──────────────────────────────────────────┤
│  FOOTER: About | Privacy | Contact       │
└──────────────────────────────────────────┘
```

### Mobile Layout (< 1024px)

```
┌─────────────────────┐
│  HEADER             │
│  [Logo] [Lang Tog]  │
├─────────────────────┤
│  [Push Opt-in]      │
├─────────────────────┤
│  CALCULATOR FORM    │
│  (full width)       │
├─────────────────────┤
│  [Native 300x250    │
│   between fields]   │
├─────────────────────┤
│  RESULT             │
├─────────────────────┤
│  [Interstitial ad   │
│   on result calc]   │
├─────────────────────┤
│  FAQ                │
│  RELATED TOOLS      │
├─────────────────────┤
│  FOOTER             │
└─────────────────────┘
```

### Ad Unit Specs Per Tool

| Slot | Format | PropellerAds Zone Type | Load Timing |
|------|--------|----------------------|-------------|
| Sidebar top | Native 300x250 | Adsterra In-Page | On page load |
| In-content | Banner 728x90 | Adsterra Banner | After result renders |
| Footer | Banner 728x90 | Adsterra Banner | After all content loaded |

### Implementation Pattern

```html
<!-- Ad placeholder pattern - all ads lazy loaded -->
<div class="ad-slot" data-ad-slot="sidebar_top_income_tax">
  <!-- Adsterra script injects <ins> tag here -->
</div>
```

```javascript
// Lazy ad injection via requestIdleCallback
// See public/assets/js/ad.js for full implementation
// Each slot has pre-defined <ins> tag with data-domain="//data527.click"
// Master script: //data527.click/js/responsive.js
// Rendered via window.affilistStart() callback
```

---

## Performance Safeguards

| Concern | Solution |
|---------|----------|
| Ad slows load | `async`/`defer` all ad scripts, load after first paint via `requestIdleCallback` |
| Ad breaks layout | Fixed-size containers with `min-height` (prevent CLS) |
| AdBlock blocks content | Graceful fallback — calculators work fully without ads |
| CSP violations | Allowlist `data527.click` in `_headers` |

### CSP in `_headers`

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://data527.click https://cdn.tailwindcss.com;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  img-src 'self' https: data:;
  connect-src 'self' https://data527.click;
  frame-src 'self' https://data527.click;
```

---

## Revenue Projections (Conservative, India Traffic)

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Daily visitors | 200 | 1,500 | 5,000 | 20,000 |
| Pageviews/day | 400 | 4,000 | 15,000 | 60,000 |
| Adsterra RPM (India) | $0.08 | $0.12 | $0.18 | $0.25 |
| Daily revenue | $0.03 | $0.48 | $2.70 | $15.00 |
| Monthly revenue | ~$1.00 | ~$14 | ~$81 | ~$450 |

**Strategy:** Stay on Adsterra until ~$100/mo. Then apply **Ezoic** (10K pv/mo minimum). Ezoic typically 50-250% higher RPM than AdSense due to header bidding + AI optimization.

---

## Scaling the Ad Stack

| Phase | Traffic (pv/mo) | Network | Est. RPM ($) | Est. Monthly ($) |
|-------|----------------|---------|-------------|------------------|
| Launch | 0 → 10K | Adsterra | $0.08–$0.20 | $1 → $20 |
| Growth | 10K → 100K | Add Ezoic | $1.50–$4.00 | $150 → $400 |
| Scale | 100K+ | Add Monumetric or Raptive | $5.00–$15.00 | $500+ |
