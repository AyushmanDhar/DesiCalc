# SPEC-005: SEO & Content Strategy

## Keyword Targets (Primary + Long-Tail)

### Tool 1: Income Tax Calculator

| Keyword | Volume (est.) | Difficulty | CPC (₹) | Intent |
|---------|---------------|-----------|---------|--------|
| `income tax calculator 2026` | 210K/mo | High (65) | 240 | Transactional |
| `old vs new tax regime calculator` | 33K/mo | Medium (38) | 180 | Comparison |
| `income tax calculator india fy 2026-27` | 18K/mo | Low (22) | 195 | Transactional |
| `tax calculator new regime 2026` | 14K/mo | Low (18) | 150 | Informational |
| `income tax naye niyam 2026` (Hinglish) | 8K/mo | Very Low (10) | 80 | Informational |
| `income tax kitna lagega 2026` (Hinglish) | 5K/mo | Very Low (8) | 75 | Informational |
| `how much tax on 12 lakh salary 2026` | 3.6K/mo | Low (15) | 210 | Transactional |
| `section 87A rebate calculator` | 2.4K/mo | Low (12) | 195 | Informational |
| `income tax slab 2026 old regime` | 27K/mo | Medium (42) | 160 | Informational |
| `income tax calculator for salaried 2026` | 12K/mo | Low (25) | 200 | Transactional |

### Tool 2: Stamp Duty Calculator

| Keyword | Volume (est.) | Difficulty | CPC (₹) | Intent |
|---------|---------------|-----------|---------|--------|
| `stamp duty calculator` | 48K/mo | High (58) | 120 | Transactional |
| `stamp duty calculator maharashtra` | 14K/mo | Medium (35) | 110 | Transactional |
| `stamp duty in india 2026` | 5.4K/mo | Low (18) | 90 | Informational |
| `property registration charges maharashtra` | 6.2K/mo | Low (22) | 105 | Informational |
| `stamp duty female buyer discount` | 2.1K/mo | Very Low (8) | 100 | Informational |
| `stamp duty calculator karnataka` | 5.8K/mo | Medium (30) | 95 | Transactional |
| `circle rate vs agreement value` | 3.3K/mo | Low (15) | 80 | Informational |
| `stamp duty rate delhi 2026` | 2.8K/mo | Low (12) | 100 | Informational |
| `stamp duty gujarat 2026` | 2.1K/mo | Low (10) | 85 | Informational |
| `stamp duty uttar pradesh 2026` | 3.5K/mo | Low (14) | 90 | Informational |

### Tool 3: RTO/Road Tax Calculator

| Keyword | Volume (est.) | Difficulty | CPC (₹) | Intent |
|---------|---------------|-----------|---------|--------|
| `rto tax calculator` | 27K/mo | Medium (42) | 65 | Transactional |
| `road tax calculator india` | 14K/mo | Low (28) | 55 | Transactional |
| `car registration charges maharashtra` | 6.6K/mo | Low (20) | 70 | Informational |
| `ev road tax exemption india` | 8.1K/mo | Low (15) | 90 | Informational |
| `bike registration charges 2026` | 5.2K/mo | Low (18) | 50 | Informational |
| `rto tax on electric car` | 3.8K/mo | Very Low (10) | 85 | Informational |
| `on road price break up` | 4.1K/mo | Low (16) | 55 | Informational |
| `rto charges for new car in delhi` | 3.3K/mo | Low (12) | 60 | Informational |
| `car tax karnataka 2026` | 2.1K/mo | Very Low (8) | 50 | Informational |
| `road tax tamilnadu per cc` | 1.8K/mo | Very Low (6) | 45 | Informational |

---

## Content Architecture

### Page Types (all 100+ URLs by launch +90 days)

```
desicalc.pages.dev/
├── /                                    # Home: grid of tools, search, featured
├── /tools/income-tax                    # Single tool page
├── /tools/stamp-duty                    # Single tool page
├── /tools/rto-tax                       # Single tool page
│
├── /comparisons/                        # Evergreen comparison pages (SEO gold)
│   ├── old-vs-new-tax-regime            # "Which regime saves more?" — 33K/mo
│   ├── stamp-duty-rates-all-states      # Table comparison — 12K/mo
│   ├── ev-vs-petrol-road-tax           # "Is EV really cheaper?" — 6K/mo
│   └── income-tax-slabs-2026           # Reference guide — 27K/mo
│
├── /guides/                             # Informational / how-to (top-of-funnel)
│   ├── how-to-file-itr-2026
│   ├── how-to-calculate-stamp-duty
│   ├── how-to-register-new-car-rto
│   ├── section-87a-rebate-explained
│   └── capital-gains-tax-changes-2026
│
├── /programmatic/stamp-duty             # 28 state pages (auto-generated template)
│   ├── maharashtra
│   ├── karnataka
│   ├── tamil-nadu
│   ├── ...
│   └── uttar-pradesh
│
└── /programmatic/rto-tax                # 28 state pages (auto-generated template)
    ├── maharashtra
    ├── karnataka
    ├── tamil-nadu
    ├── ...
    └── uttar-pradesh
```

### Programmatic Page Pattern

Each `programmatic/stamp-duty/{state}.html` follows template:

```html
<!-- /programmatic/stamp-duty/maharashtra.html -->
<html>
  <head>
    <title>Stamp Duty Calculator Maharashtra 2026 | DesiCalc</title>
    <meta name="description"
      content="Calculate stamp duty and registration charges for property in Maharashtra.
      Mumbai 5% SD, Pune/other 6%. Female buyers get 1% concession. Updated 2026.">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Stamp Duty Calculator Maharashtra",
      "url": "https://desicalc.pages.dev/tools/stamp-duty?state=maharashtra",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All"
    }
    </script>
  </head>
  <body>
    <!-- Embed the tool with pre-selected state=maharashtra -->
    <iframe src="/tools/stamp-duty.html?state=maharashtra" ...>
    </iframe>
    <!-- 500+ words state-specific content: rates table, how-to, FAQ -->
    <section class="state-rates">
      <h2>Maharashtra Stamp Duty Rates 2026</h2>
      <table>
        <tr><th>Area</th><th>Male</th><th>Female</th></tr>
        <tr><td>Mumbai Municipal Corp</td><td>5%</td><td>4%</td></tr>
        <tr><td>Rest of Maharashtra</td><td>6%</td><td>5%</td></tr>
      </table>
    </section>
  </body>
</html>
```

Each state page has 500+ words unique content (rate tables, how-to, FAQ). Generated programmatically from `state-rates.js` data + templates.

---

## Structured Data (Schema.org)

### Calculator Tool Page

```json
{
  "@context": "https://schema.org",
  "@type": ["WebApplication", "SoftwareApplication"],
  "name": "Income Tax Calculator India 2026",
  "url": "https://desicalc.pages.dev/tools/income-tax",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "browserRequirements": "JavaScript",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "description": "Free Income Tax Calculator for India FY 2026-27. Compare Old vs New tax regime. Calculate tax, surcharge, cess, 87A rebate instantly. No login required.",
  "featureList": [
    "Old vs New Regime Comparison",
    "Section 87A Rebate",
    "Surcharge Calculation",
    "Health & Education Cess 4%",
    "HRA Exemption",
    "80C, 80D, 80CCD Deductions"
  ]
}
```

### FAQ Schema (per tool page)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the standard deduction for FY 2026-27?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Under the new regime, standard deduction is ₹75,000. Under the old regime, it is ₹50,000."
      }
    },
    {
      "@type": "Question",
      "name": "Which tax regime is better for salary above ₹15 lakh?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For income above ₹15 lakh without significant deductions (80C, 80D, HRA), the new regime usually saves more tax. Use our calculator to compare both regimes for your exact income."
      }
    }
    // ... 6-10 FAQ per tool
  ]
}
```

### BreadcrumbList (all pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://desicalc.pages.dev" },
    { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://desicalc.pages.dev/tools" },
    { "@type": "ListItem", "position": 3, "name": "Income Tax Calculator", "item": "https://desicalc.pages.dev/tools/income-tax" }
  ]
}
```

---

## On-Page SEO Checklist (Every Page)

| Element | Required | Example |
|---------|----------|---------|
| Title | Yes | `Income Tax Calculator India 2026 | Compare Old vs New Regime` |
| Meta description | Yes | 150-160 chars, includes keyword + call-to-action |
| H1 | Yes | `Income Tax Calculator India FY 2026-27` |
| H2-H6 | Yes | Sections: Inputs, Results, Regime Comparison, FAQ |
| Alt text | Where needed | On icons/illustrations |
| Canonical | Yes | Self-referencing |
| Open Graph | Yes | `og:title`, `og:description`, `og:image` (1200x630) |
| Twitter Card | Yes | `summary_large_image` |
| Sitemap entry | Yes | In `sitemap.xml` |
| Internal links | Yes | To sibling tools, comparison pages |
| External links | Selective | To official government portals (income tax dept, GST portal) |

### Open Graph / Social Card Template

```html
<meta property="og:title" content="Income Tax Calculator India 2026 | DesiCalc" />
<meta property="og:description" content="Free income tax calculator. Compare Old vs New regime. See exactly how much tax you pay with 87A rebate, surcharge, and cess. No login." />
<meta property="og:url" content="https://desicalc.pages.dev/tools/income-tax" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://desicalc.pages.dev/assets/img/og-tax-calculator.png" />
<meta name="twitter:card" content="summary_large_image" />
```

---

## Link Building Strategy

| Tactic | Priority | Effort | Impact |
|--------|----------|--------|--------|
| Quora answers (Hinglish) linking to tool | High | Low | Medium — answered queries = long-tail links |
| Reddit r/IndiaTax, r/IndiaInvestments | Medium | Medium | High — target high-volume threads |
| CA / tax consultant forums (Taxguru, Caclubindia) | High | Medium | High — niche audience, dofollow |
| Submit to tool directories (ToolPilot, AlternativeTo, etc.) | Medium | Low | Low — net new but indexable |
| Embeddable widget → other sites link back | High | High | Very High — if site embeds calculator, they link |
| "Rate this tool" → link to tweet/share | Low | Low | Low — social signal |
| Guest posts on Indian finance blogs | Low | Very High | Medium — too slow for solo |

---

## AI Overview Optimization

60% of searches now zero-click + AI Overviews in 58% of queries (2026). Strategy:

- **FAQ schema** on every page — Google pulls FAQ content into AI answers
- **Table format** for comparison data — Google parses tables into AI snippets
- **Hinglish content** — AI models are worse at Hinglish than English. Content in Hinglish faces less AI-competing content. First-mover advantage in non-English calculator space.
- **Cite sources** — Every rate table cites official notification (CBDT, state governments). AI models prefer authoritative citations.

---

## Sitemap Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core tool pages -->
  <url><loc>https://desicalc.pages.dev/tools/income-tax</loc><priority>1.0</priority></url>
  <url><loc>https://desicalc.pages.dev/tools/stamp-duty</loc><priority>1.0</priority></url>
  <url><loc>https://desicalc.pages.dev/tools/rto-tax</loc><priority>1.0</priority></url>

  <!-- Comparison pages -->
  <url><loc>https://desicalc.pages.dev/comparisons/old-vs-new-tax-regime</loc><priority>0.8</priority></url>
  <url><loc>https://desicalc.pages.dev/comparisons/stamp-duty-rates-all-states</loc><priority>0.8</priority></url>

  <!-- Programmatic state pages -->
  <url><loc>https://desicalc.pages.dev/programmatic/stamp-duty/maharashtra</loc><priority>0.7</priority></url>
  <url><loc>https://desicalc.pages.dev/programmatic/stamp-duty/karnataka</loc><priority>0.7</priority></url>
  <!-- ... 54 more -->
</urlset>
```
