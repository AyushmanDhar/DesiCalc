# SPEC-003: Ad Monetization Strategy

## Primary Network: PropellerAds

### Why PropellerAds (most frictionless)

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

**Decision: PropellerAds as primary.** ylliX as fallback if PropellerAds underperforms on India traffic (add ylliX after 30 days of data).

### PropellerAds Onboarding Steps

1. Register at `https://propellerads.com/pub/signup`
2. Site URL: `desicalc.in`
3. Site category: "Finance/Tools"
4. Add `propellerads.com` and `propellerpops.com` to Cloudflare `_headers` CSP allowlist
5. Get zone IDs for each ad unit. Expect 3 zones per tool.

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
| Push notification | Push notification | Push Zone | On page load (accept dialog) |
| Sidebar top | Native 300x250 | Native Ads / In-Page | On page load |
| Sidebar bottom | Native 300x250 | Native Ads / In-Page | On scroll past form |
| In-content | Banner 728x90 | Banner | After result renders |
| Mobile inter-field | Native 300x250 | Native Ads | On field change (debounced) |
| Mobile interstitial | Interstitial | Interstitial Zone | After first calculation complete |
| Footer | Banner 728x90 | Banner | After all content loaded |

### Implementation Pattern

```html
<!-- Ad placeholder pattern - all ads lazy loaded -->
<div class="ad-slot ad-sidebar-top" data-zone="propeller_zone_12345">
  <!-- PropellerAds script injects here -->
</div>
```

```javascript
// Lazy ad injection
function loadAdSlots() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => injectPropellerAds(), { timeout: 2000 });
  } else {
    setTimeout(() => injectPropellerAds(), 1000);
  }
}

function injectPropellerAds() {
  // PropellerAds pushes their script.
  // We load one master script with all zone IDs in a config object.
  // Their recommended approach: <script type="text/javascript" src="//propellerads.com/serve/zone/...">
  // OR: use propellerads global C* object (check their integration docs)
}
```

---

## Performance Safeguards

| Concern | Solution |
|---------|----------|
| Ad slows load | `async`/`defer` all ad scripts, load after first paint |
| Ad breaks layout | Fixed-size containers with `min-height` (prevent CLS) |
| AdBlock blocks content | Graceful fallback — calculators work fully without ads |
| Intrusive popups | Skip pop-under; use push + native + banner only |
| CSP violations | Allowlist `propellerads.com`, `propellerpops.com`, `*.doubleclick.net` in `_headers` |

### CSP in `_headers`

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://propellerads.com https://*.propellerads.com https://propellerpops.com;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  img-src 'self' https: data:;
  connect-src 'self' https://propellerads.com;
  frame-src 'self' https://propellerads.com;
```

---

## Revenue Projections (Conservative, India Traffic)

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Daily visitors | 200 | 1,500 | 5,000 | 20,000 |
| Pageviews/day | 400 | 4,000 | 15,000 | 60,000 |
| PropellerAds RPM (India) | $0.15 | $0.20 | $0.25 | $0.30 |
| Daily revenue | $0.06 | $0.80 | $3.75 | $18.00 |
| Monthly revenue | ~$1.80 | ~$24 | ~$112 | ~$540 |
| AdSense equivalent RPM | $0.80 | $0.80 | $0.80 | $0.80 |
| AdSense projected (mo) | $9.60 | $96 | $360 | $1,440 |

**Strategy:** Stay on PropellerAds until ~$100/mo. Then apply **Ezoic** (10K pv/mo minimum). Ezoic typically 50-250% higher RPM than AdSense due to header bidding + AI optimization.

---

## Scaling the Ad Stack

| Phase | Traffic (pv/mo) | Network | Est. RPM ($) | Est. Monthly ($) |
|-------|----------------|---------|-------------|------------------|
| Launch | 0 → 10K | PropellerAds | $0.15–$0.30 | $1.50 → $30 |
| Growth | 10K → 100K | Add Ezoic | $1.50–$4.00 | $150 → $400 |
| Scale | 100K+ | Add Monumetric or Raptive | $5.00–$15.00 | $500+ |
