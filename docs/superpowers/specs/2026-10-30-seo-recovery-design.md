# DesiCalc SEO Recovery — Design

Date: 2026-10-30
Status: Approved for planning
Owner: DesiCalc

## 1. Context

DesiCalc (desicalc.in) is a static, client-side collection of Indian tax and financial
calculators: Income Tax, Stamp Duty (28 states + Delhi), and RTO Road Tax (28 states +
Delhi). Content lives in hand-authored HTML with Tailwind CSS and vanilla JavaScript.

Search performance is effectively zero:

- 3 clicks and 702 impressions over the last 3 months (0.4% CTR)
- Average position 39 (page 4)
- 73 of 81 sitemap URLs indexed
- No manual actions, no security issues, no `noindex`, site returns HTTP 200
- Peak was about 5,000 impressions and roughly 50 clicks in the first few days after launch

Google's September 2026 spam update ran from 24 September to 8 October 2026 and was the
most disruptive update of the year. Impressions collapsed in the same window. Because no
manual action exists, the most likely cause is an algorithmic quality/spam classification
of scaled or thin programmatic pages, compounded by a lack of site authority.

Content audit findings:

- Large state pages are genuinely rewritten: 800–3,200 words, official source links, FAQ
  schema, low cross-page duplication (max 25% shared 6-grams).
- The highest-value pages are thin: home page 158 words, income tax tool 270 words, stamp
  duty tool 177 words, RTO tool 187 words.
- Most state pages have zero `h3` elements even where FAQ schema is present.
- About 40 titles exceed 60 characters and about 30 meta descriptions exceed 160.
- Trust signals are missing: no author, no reviewer, no methodology, 43-word contact page.
- Hreflang `hi` points to the same URL as `en`, which is invalid and ignored.
- AdSense was never approved, so ad slots are empty but still load Google scripts.
- Ads, browser-only analytics (Cloudflare), and zero tooling budget are fixed constraints.

## 2. Goal and success metrics

Recover organic search visibility and rankings, then grow clicks.

| Milestone | Impressions/month | Clicks/month | Avg position |
|-----------|-------------------|--------------|--------------|
| Baseline  | 702 per 3 months (~230/mo) | 3 per 3 months | 39 |
| Day 30    | Fixes shipped     | —            | —            |
| Day 60    | ≥ 1,500           | ≥ 30         | < 35         |
| Day 90    | ≥ 4,000           | ≥ 120        | < 30         |
| Day 180   | ≥ 10,000          | ≥ 500        | < 20         |

Success also requires: all Tier 1 pages passing the on-page checklist, zero structural
SEO errors, and a repeatable weekly measurement log.

## 3. Non-goals

- No redesign, framework migration, or new calculator features.
- No paid link building, no paid SEO tools.
- No mass noindex or deletion of long-tail state pages during the first 60 days.
- No invented author personas or credentials.
- No city-level page expansion until state pages show recovery.

## 4. Page triage

### Tier 1 — rebuild (29 pages)

- Home: `public/index.html`
- Tool pages: `tools/income-tax`, `tools/stamp-duty`, `tools/rto-tax`, `tools/hra`, `tools/gst`
- RTO states: `haryana`, `andhrapradesh`, `maharashtra`, `tamilnadu`, `kerala`,
  `himachalpradesh`, `karnataka`, `uttarpradesh`, `delhi`, `punjab`
- Stamp states: `punjab`, `maharashtra`, `uttarpradesh`, `delhi`, `karnataka`
- Comparisons: `comparisons/old-vs-new-tax-regime`, `comparisons/ev-vs-petrol-road-tax`
- Guides: `guides/how-to-file-itr-2026`, `guides/section-87a-rebate-explained`,
  `guides/how-to-calculate-stamp-duty`
- New trust pages: `methodology`, `editorial-policy`, `about` (expanded)

### Tier 2 — light fix (remaining 38 state pages)

Titles, meta descriptions, heading structure, visible FAQ matching schema, `dateModified`,
breadcrumbs, and internal links only. No full rewrite in this phase.

### Tier 3 — hold

Pages with no impressions and no unique data are reviewed at Day 60. Decision options:
enrich, merge into the state index, or noindex. No action before Day 60.

## 5. Content requirements

### Tool pages

Calculator stays above the fold. Below it add 1,200–1,500 words:

- How the tax is computed, with the exact slab or rate table
- Two or three worked examples with real numbers
- Common mistakes and edge cases
- Official source links (Income Tax Department, state transport departments)
- Visible FAQ of 6–8 questions that matches the FAQPage schema
- Visible last-updated date

### Tier 1 state pages

- Unique district or city rate tables where rates differ (for example Noida and Ghaziabad
  in Uttar Pradesh; Gurugram and Faridabad in Haryana; Mumbai and Pune in Maharashtra)
- Local registration charges, metro cess, and any state-specific levies
- One fully worked example for a typical vehicle or property purchase in that state
- Registration process specific to that state's transport or registration authority
- 8–10 visible FAQs, 8–10 `h3` headings
- Official source links plus visible last-updated date

### Home page

- Clear value proposition, how it works, why trust it, popular calculators
- Visible freshness ("Rates verified for FY 2026-27, last updated <date>")
- Links to methodology and editorial policy

### New trust pages

- `methodology`: how rates are verified, source hierarchy, update cadence, changelog
- `editorial-policy`: team byline, sourcing rules, corrections policy
- `about`: who runs DesiCalc, why it exists, how it is funded, contact

## 6. E-E-A-T

Tax content is YMYL. No personal name will be used. Instead:

- Use the byline "DesiCalc Editorial Team" on all YMYL pages
- Show "Reviewed by DesiCalc Editorial Team · Last updated <date>" near the top of
  Tier 1 pages
- Link every rate claim to an official source
- Publish the methodology page and link it sitewide from the footer
- Add `Organization` schema with `name`, `url`, `logo`, and `sameAs` (GitHub)
- Expand contact and about so the publisher is identifiable
- Keep visible update dates in sync with `dateModified` in schema

## 7. Technical work

1. Rewrite about 40 titles to ≤ 60 characters and 30 meta descriptions to ≤ 155, each
   unique and query-aligned.
2. Add `h3` headings and visible FAQ sections to state pages; keep FAQPage schema in sync
   with what is visible.
3. Fix hreflang: remove the `hi` alternate that points to the English URL. Keep `en` and
   `x-default`.
4. Add `dateModified` and `Organization` schema sitewide; correct `og:type` (`website` for
   tools, `article` for guides).
5. Rebuild `sitemap.xml` with real `lastmod` values and correct canonical URLs.
6. Remove AdSense entirely: script tags, `ins` blocks, inline `adsbygoogle` pushes, and the
   `ad.js` include. Remove AdSense and Funding Choices domains from CSP. No ads until
   approval and until Day 90.
7. Core Web Vitals: preconnect where still needed, defer non-critical JS, load
   `state-rates.js` only on pages that need it, split language files so both en and hi are
   not loaded, reserve space for any dynamic content, and verify no layout shift.
8. Fix the robots.txt `Content-Signal` block, which currently contains mojibake.
9. Fix the state count wording: India has 28 states plus Delhi as a union territory here, so
   "All 29 States" is inaccurate. Use "28 states + Delhi" or "29 states and UTs covered"
   consistently.
10. Add the missing union territories (Jammu & Kashmir, Puducherry, Chandigarh) as Tier 2
    pages only when the template and verified rates are ready.

## 8. Authority and links

- Publish a linkable asset: "2026 Road Tax and Stamp Duty Rate Tracker" with methodology,
  changelog, and a downloadable table. This becomes the citation target.
- Send 20 targeted outreach messages per month to personal-finance blogs, local news, and
  finance creators. Personalize; no bulk spam.
- Submit to relevant free directories and product listings (Product Hunt, AlternativeTo,
  GitHub README).
- Answer real questions on Reddit and Quora only where a calculator genuinely helps, with
  disclosure.
- Track referring domains manually in a spreadsheet using free Ahrefs Webmaster Tools and
  Bing Webmaster Tools.

## 9. Measurement

- Baseline snapshot before edits: GSC impressions, clicks, CTR, position, indexed count,
  top 50 pages, top 50 queries.
- Weekly log in a repo markdown file: date, 7-day impressions, clicks, CTR, avg position,
  indexed pages, top query movements.
- Review Tier 3 pages at Day 60 using this log.
- Bing Webmaster Tools already present; keep it in the weekly check.
- Cloudflare Web Analytics is the only traffic analytics; no GA4.

## 10. Sequencing

1. Baseline snapshot and analytics log setup.
2. Technical cleanup (titles, meta, schema, hreflang, sitemap, ads removal, CWV).
3. Trust pages and sitewide E-E-A-T scaffolding.
4. Tier 1 tool pages rewrite.
5. Tier 1 state pages rebuild.
6. Tier 2 light fixes.
7. Linkable asset and outreach start.
8. Day 60 review; Day 90 review and decision on Tier 3 and city pages.

## 11. Risks

- Spam-update recovery may take multiple refreshes over several months. Metrics may lag.
- Rewriting 29 pages by hand is the largest effort; quality must not drop to hit volume.
- Removing ads has no revenue cost today but must be revisited after approval.
- Google may still classify the site as scaled content if Tier 2 pages remain templated;
  Day 60 review is the checkpoint.
