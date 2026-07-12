# SPEC-006: UI/UX Flow — Wireframes & Interaction

## Design Principles

1. **Non-technical first** — zero jargon, plain labels, tooltips for financial terms
2. **Frictionless** — no signup, no email, no loading spinners. Type → see result instantly
3. **Mobile-first** — >80% of Indian users are mobile. Thumb-zone inputs, large targets
4. **Ad-aware layout** — ad slots designed into grid from start, not shoved in after
5. **Accessible** — high contrast, readable font sizes (min 16px inputs), keyboard navigable

---

## Color Palette

```
Primary (amber):      #D97706   — Actions, buttons, links, active state, focus rings
Primary hover:        #B45309   — Button hover, darker amber
Background:           #FAFAF9   — Page bg (stone-50)
Card:                 #FFFFFF   — Calculator cards, input backgrounds
Text:                 #1C1917   — stone-900 (headings)
Text muted:           #78716C   — stone-500 (labels, secondary text)
Success:              #059669   — Tax saved, lower result highlight
Accent:               #D97706   — Amber (value indicators, currency, result card accent)
Border:               #E7E5E4   — stone-200 (input borders, dividers)
Ad background:        #F5F5F4   — stone-100 (ad container zone)
```

> **Note:** Amber/stone palette chosen intentionally over original blue/slate for warmer Indian aesthetic. Amber (saffron tone) resonates culturally and gives better contrast on result cards. All Tailwind classes use `stone-*` and `amber-*` scales.

---

## Home Page Layout

```
┌──────────────────────────────────────┐
│ [logo desicalc]           [EN] [HI]  │  ← header
│                              🔍      │
├──────────────────────────────────────┤
│                                      │
│    Free Indian Calculators           │  ← H1
│   No login. Just calculate.          │
│                                      │
│ ┌─────────────┐ ┌─────────────┐ ┌─── │
│ │ ↑ ₹         │ │ 🏠          │ │ 🚗 │
│ │ Income Tax  │ │ Stamp Duty  │ │ RTO│
│ │ Calculator  │ │ Calculator  │ │ Tax│
│ │ FY 2026-27  │ │ All 28      │ │ All│
│ │ Old vs New  │ │ states      │ │ st │
│ │ [Calculate] │ │ [Calculate] │ │ [C]│
│ └─────────────┘ └─────────────┘ └─── │
│                                      │
│  ──── AD SLOT: Native 728x90 ────   │
│                                      │
│ Why DesiCalc?                        │
│ • Accurate FY 2026-27 rates          │
│ • Updated for Budget 2026            │
│ • Private — no data leaves your      │
│   device                             │
│ • Free forever                       │
│                                      │
├──────────────────────────────────────┤
│ Footer: About | Privacy | Contact    │
└──────────────────────────────────────┘
```

---

## Tool Page Layout (Income Tax — Desktop)

```
┌──────────────────────────────────────────────────┐
│ [← Back] desicalc                  [EN] [●HI]    │
├─────────────────────────┬────────────────────────┤
│ INCOME TAX CALCULATOR   │  ┌──────────────────┐  │
│ FY 2026-27              │  │ AD: Native 300x250│  │
│                         │  │                  │  │
│ [Info] Calculates tax   │  └──────────────────┘  │
│ under Old and New regime│                         │
│                         │  ┌──────────────────┐  │
│ ──── SECTION: INCOME ──── │ Tax Summary       │  │
│                         │  │ New regime: ₹XX  │  │
│ 💰 Salary Income (₹)    │  │ Old regime: ₹YY  │  │
│ [ 12,00,000         ]   │  │ Save: ₹ZZ       │  │
│                         │  │                  │  │
│ 📊 Other Income (₹)     │  │ Breakdown:       │  │
│ [ 50,000            ]   │  │ • SD: ₹75,000    │  │
│                         │  │ • 87A: ₹25,000   │  │
│ ──── SECTION: REGIME ──── │ • Cess: 4%       │  │
│                         │  └──────────────────┘  │
│ 📋 Select Regime        │                         │
│ ○ New (default)  ○ Old  │                         │
│                         │                         │
│ ──── SECTION: DEDUCTIONS (Old regime) ────        │
│ (shown only when Old selected)                    │
│ 🏦 80C Investments (₹)                            │
│ [ 1,50,000           ]                            │
│ 🏥 80D Health Insurance (₹)                       │
│ [ 25,000            ]                             │
│ 🏠 HRA Details → [Show/Hide]                      │
│                                                    │
├────────────────────────────────────────────────────┤
│  ──────────── AD: In-content 728x90 ───────────── │
├────────────────────────────────────────────────────┤
│                                                    │
│ FAQ                                                │
│ ▶ What income is tax free in new regime?           │
│ ▶ Is old regime better with home loan?             │
│ ▶ How is 87A rebate calculated?                    │
│                                                    │
│ Related Tools                                      │
│ [Stamp Duty Calc] [RTO Tax Calc]                   │
│                                                    │
├────────────────────────────────────────────────────┤
│ Footer: About | Privacy | Contact                  │
└────────────────────────────────────────────────────┘
```

---

## Tool Page (Mobile < 768px)

```
┌──────────────────────┐
│ [←] desicalc  [EN] [HI] │
├──────────────────────┤
│ INCOME TAX           │
│ CALCULATOR           │
│ FY 2026-27           │
├──────────────────────┤
│ 💰 Salary Income     │
│ [ 12,00,000     ]    │
├──────────────────────┤
│ 📊 Other Income      │
│ [ 50,000        ]    │
├──────────────────────┤
│ 📋 Regime            │
│ ○ New  ○ Old        │
├──────────────────────┤
│ ─ AD: Native 300x250 ─│
├──────────────────────┤
│ [🔵 CALCULATE]       │
├──────────────────────┤
│ RESULTS              │
│ ┌──────────────────┐ │
│ │ New: ₹84,500     │ │
│ │ Old: ₹1,24,000   │ │
│ │ Save: ₹39,500 🔥 │ │
│ └──────────────────┘ │
├──────────────────────┤
│ ─ AD: In-content ── │
├──────────────────────┤
│ FAQ                  │
│ ▶ What is 87A?      │
├──────────────────────┤
│ FOOTER               │
└──────────────────────┘
```

---

## Interaction Design

### Input Handling

```
User types in field
    │
    ▼
debounce 300ms (requestIdleCallback)
    │
    ▼
Recompute all output values
    │
    ▼
Update result block (animate: fade slide)
    │
    ▼
Update URL searchParams (replaceState, no reload)
    │
    ▼
Save to localStorage (throttled 2s)
```

- **No "Calculate" button for most fields** — results update live. BUT on mobile, due to virtual keyboard occlusion, add a prominent "Calculate" button for first calculation. After that, live.

### Language Toggle UX

```
[EN] [●HI]

On tap:
  1. Show brief overlay "Switch to Hinglish?"
  2. On confirm → swap data-i18n attributes
  3. Persist choice in localStorage
  4. Announce change with toast "अब हिंग्लिश में"
```

### Input components

| Component | Usage | Behavior |
|-----------|-------|----------|
| `text-input` | Salary, amount fields | `type="text"`, `inputmode="numeric"`, auto-format comma separator |
| `select` | State picker, gender, vehicle type | Searchable dropdown for 28 states |
| `radio-group` | Regime selection, fuel type | Vertical on mobile, horizontal on desktop |
| `toggle-section` | HRA details, deductions | Accordion expand, only shown when relevant |
| `info-tooltip` | Financial terms | Click to show definition tooltip |
| `result-card` | Output display | Colored border (green if saves tax), animated counter |

---

## Responsive Breakpoints

| Breakpoint | Layout | Sidebar ads |
|------------|--------|-------------|
| < 640px | Single column, stacked | Inter-field native + in-content |
| 640 – 1023px | Single column, wider | Sidebar hidden, in-content+footer |
| ≥ 1024px | Two column (form + sidebar) | Sidebar native ×2 + in-content + footer |

---

## Micro-Interactions

| Event | Animation | Duration |
|-------|-----------|----------|
| Input changed | Result card slide-up + opacity | 200ms ease |
| Regime switch | Cross-fade results card | 250ms ease |
| Language toggle | Toast "Language changed" slide-down | 3s display |
| Copy/share URL | `✨ Copied!` toast with pop-in bounce + sparkle prefix | 2.5s |
| Ad load | Placeholder skeleton | Instant no-CLS container |
| New visitor | Brief tooltip "Try typing your salary" | 5s delay, auto-dismiss |
| Tool card hover | Spring bounce (`translateY(-4px) scale(1.02)`) + emoji wiggle | 0.3s ease |
| Result value update | Animated counter (ease-out cubic) + amber flash | 220ms |
| Scroll deep | Back-to-top button fades in at 350px scroll | 0.3s ease |
| Page load | Time-based greeting fades in header (morning/afternoon/evening/night with emoji) | 0.8s ease 0.5s delay |

---

## Ad Container Constraints

Every ad slot wrapper has fixed `min-height` to prevent Cumulative Layout Shift:

```css
.ad-slot-sidebar-top { min-height: 250px; }
.ad-slot-in-content  { min-height: 90px; }
.ad-slot-footer      { min-height: 90px; }
.ad-slot-inter-field { min-height: 250px; }
```

Ad containers marked with `data-ad-slot` attribute. JS injects Adsterra `<ins>` tags and loads `data527.click/js/responsive.js`.

---

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Focus visible | `:focus-visible` ring on all interactive |
| Label associations | `<label for="id">` on all inputs |
| aria-live region | Result card gets `aria-live="polite"` |
| Skip navigation | "Skip to calculator" link at top |
| Touch targets | Min 44×44px for all taps |
| Reduced motion | `prefers-reduced-motion` → disable all animations, gradient fallback to solid bg, no emoji wiggle, no toast pop, no card spring |
| Screen reader | All results text-based, not image-dependent. Greeting uses `aria-live="polite"` |
| Scroll-to-top | `aria-label="Back to top"` on floating button |
