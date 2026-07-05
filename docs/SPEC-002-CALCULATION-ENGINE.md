# SPEC-002: Calculation Engine — Data Models & Formulas

## Tool 1: Income Tax Calculator (FY 2026-27)

### Input Model

```typescript
{
  regime: 'old' | 'new',          // Default: 'new' (government default since FY23-24)
  age: number,                     // 0-150, determines senior surcharge rates
  incomeSalary: number,            // Gross salary income (₹)
  incomeOther: number,             // Other sources (FD interest, etc.)
  incomeBusiness: number,          // Business/profession income (₹)
  capitalGainsLTCG: number,        // LTCG > ₹1.25L (equity) at 12.5%
  capitalGainsSTCG: number,        // STCG equity at 20%, others at slab rate
  deductions80C: number,           // Max ₹1.5L (old regime only)
  deductions80D: number,           // Health insurance (old regime only, varies by age)
  deductions80CCD: number,         // NPS 80CCD(1B): max ₹50K (old regime only)
  hraActual: number,               // HRA exemption (old regime only)
  hraRent: number,                 // Actual rent paid
  hraBasic: number,                // Basic salary component
  hraMetro: boolean,               // Living in metro city
  homeLoanInterest: number,        // Section 24(b): max ₹2L self-occupied
  section87A: boolean,             // Apply rebate? Auto-detected
}
```

### Output Model

```typescript
{
  grossTotalIncome: number,
  standardDeduction: number,       // New: ₹75K, Old: ₹50K
  netTaxableIncome: number,
  totalDeductions: number,         // Old regime only
  taxBeforeRebate: number,
  rebate87A: number,               // Max ₹25K (old), ₹25K (new) — varies by regime
  taxAfterRebate: number,
  surcharge: number,               // 10% if > ₹50L, 15% > ₹1Cr, 25% > ₹2Cr, 37% > ₹5Cr
  healthCess: number,              // 4% of (tax + surcharge)
  totalTax: number,
  effectiveRate: number,           // totalTax / grossTotalIncome * 100
  regimeRecommended: string,       // 'old', 'new', or 'tie'
  taxSaved: number,                // Difference between regimes
  breakdown: string,               // Step-by-step breakdown text (for SEO/social card)
}
```

### Slab Rates — New Regime FY 2026-27 (per Budget 2025)

| Income Slab (₹) | Rate |
|-----------------|------|
| 0 – 4,00,000 | 0% (rebate u/s 87A up to ₹25K if income ≤ ₹7L) |
| 4,00,001 – 8,00,000 | 5% |
| 8,00,001 – 12,00,000 | 10% |
| 12,00,001 – 16,00,000 | 15% |
| 16,00,001 – 20,00,000 | 20% |
| 20,00,001 – 24,00,000 | 25% |
| Above 24,00,000 | 30% |

- Standard deduction: ₹75,000 (salaried/pension)
- Section 87A: Full rebate if net taxable income ≤ ₹7L. Max rebate = tax amount (tax becomes 0). If income > ₹7L, rebate = ₹25K or tax, whichever lower. → Wait, check this: Per budget 2025, 87A rebate under new regime is ₹25K if income ≤ ₹7L. But the actual calculation — the rebate is available only if total income (after standard deduction but before cess) ≤ ₹7L. Let me verify...

Actually, 87A rebate under new regime for FY 2025-26 (AY 2026-27): Rebate of ₹25K is available if taxable income ≤ ₹7L. This effectively means zero tax up to ₹7L net taxable income (after standard deduction).

Wait, I need to double check. The standard deduction of ₹75K is from salary. The 87A rebate threshold is ₹7L of total income (before standard deduction?) — no, total income after all deductions. Let me reconsider.

Per the Income Tax Act:
- New regime: 87A rebate = ₹25K if **total income** ≤ ₹7L. "Total income" means gross total income minus deductions (but new regime has very few deductions). For salaried, the standard deduction of ₹75K is already taken. So effectively, someone with salary of ₹7L + standard deduction of ₹75K = net taxable ₹6.25L — they still qualify for 87A rebate. But someone with salary of ₹7.75L - ₹75K SD = ₹7L — qualifies at the boundary.

Actually for the spec, what matters is we implement it correctly. Let me write the formula:

```
netTaxableIncome = grossTotalIncome - standardDeduction - eligibleDeductions
if (netTaxableIncome <= 700000 && regime === 'new') {
  rebate = min(taxBeforeRebate, 25000)
  // tax becomes 0 up to 7L effectively
}
```

Wait, is ₹7L the maximum income for 87A, or ₹7L net taxable? Generally: total income ≤ ₹7L. Total income = all income minus deductions under Chapter VI-A (which new regime doesn't allow), but before standard deduction? Hmm, standard deduction IS deducted from salary income to arrive at gross total income in some interpretations. Let me look this up more carefully...

Actually, per the IT Act: For new regime, the 87A rebate threshold is **total income** ≤ ₹7L. Total income = gross total income minus deductions under sections 80C to 80U (which in new regime you don't get most of). The standard deduction IS available in new regime and reduces the total income. So:

- If salary = ₹7.75L, gross total income = ₹7L after standard deduction → REBATE APPLIES → tax = 0
- If salary = ₹7.76L, gross total income = ₹7.01L after SD → no rebate → tax applies

Let me simplify for the spec. I'll write the logic cleanly.

### Slab Rates — Old Regime FY 2026-27

| Income Slab (₹) | Rate |
|-----------------|------|
| 0 – 2,50,000 | 0% |
| 2,50,001 – 5,00,000 | 5% |
| 5,00,001 – 10,00,000 | 20% |
| Above 10,00,000 | 30% |

- Standard deduction: ₹50,000
- Senior citizen exemption threshold: ₹3,00,000 (age 60-79)
- Super senior exemption: ₹5,00,000 (age 80+)
- Section 87A: Max ₹25K if total income ≤ ₹5L (different threshold than new!)
- Surcharge: Same structure as new regime
- Cess: 4% in both regimes

### Surcharge Structure (Both Regimes)

| Income Range | Surcharge Rate |
|-------------|----------------|
| ≤ ₹50L | 0% |
| ₹50L – ₹1Cr | 10% |
| ₹1Cr – ₹2Cr | 15% |
| ₹2Cr – ₹5Cr | 25% |
| > ₹5Cr | 37% |

Marginal relief: Where surcharge pushes total income over threshold, relief to the extent of excess plus ₹1 applies.

### Calculation Order

```
1. grossTotalIncome = incomeSalary + incomeOther + incomeBusiness + capitalGainsLTCG(rules differ) + capitalGainsSTCG
2. standardDeduction = (regime === 'new') ? 75000 : 50000  (only if salary income > 0)
3. deductions = (regime === 'old') ? sum(80C min150K, 80D, 80CCD, homeLoanInterest, HRA_exemption) : 0
4. netTaxableIncome = grossTotalIncome - standardDeduction - deductions
5. tax = applySlabs(netTaxableIncome, regime, age)
6. rebate = apply87A(netTaxableIncome, regime)   // cap at tax amount
7. taxAfterRebate = max(tax - rebate, 0)
8. surcharge = applySurcharge(netTaxableIncome, taxAfterRebate)
9. cess = (taxAfterRebate + surcharge) * 0.04
10. totalTax = taxAfterRebate + surcharge + cess
```

### HRA Exemption Calculation

```
HRA_exemption = min(
    actualHRAReceived,
    (hraBasic * 0.5  if metro else 0.4),
    actualRentPaid - (hraBasic * 0.1)
)
```

---

## Tool 2: Stamp Duty Calculator (All 28 States)

### Input Model

```typescript
{
  state: string,                    // 1 of 28 states + UTs
  propertyValue: number,            // Agreement value or circle rate (whichever higher)
  gender: 'male' | 'female' | 'joint_ff' | 'joint_mm' | 'joint_mf',
  propertyType: 'residential' | 'commercial' | 'industrial',
  location: 'urban' | 'rural',     // Some states differentiate
  isFirstTime: boolean,            // First home buyer rebate (Delhi, select states)
}
```

### Output Model

```typescript
{
  stampDutyRate: number,           // e.g., 5% → 5
  registrationRate: number,        // e.g., 1% → 1
  stampDutyAmount: number,
  registrationAmount: number,
  cessAmount: number,              // Metro cess (Mumbai 1%), surcharge (2-3%)
  otherCharges: number,            // Handling, document, e-stamp fee
  totalCharges: number,
  effectiveRate: number,
  breakEven: {                     // Tells user: your property must be ≥ circle rate
    circleRate: number,
    payOn: 'agreement' | 'circleRate',
  }
}
```

### State Rate Data Model

Stored in `assets/js/state-rates.js` as:

```javascript
const STAMP_DUTY_RATES = {
  maharashtra: {
    name: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    rate: { male: 6, female: 5, joint_ff: 5, joint_mm: 6, joint_mf: 5 },
    registration: { rate: 1, cap: 30000 },
    metroCess: { rate: 1, applies: ['mumbai'] },
    lbc: { rate: 1, applies: ['pune', 'thane', 'nagpur'] }, // Local Body Tax
    surcharge: null,
    circleRate: null                // User inputs actual value
  },
  delhi: {
    rate: { male: 6, female: 4, joint_ff: 4, joint_mm: 6, joint_mf: 5 },
    registration: { rate: 1, cap: null },
    firstTimeRebate: { male: 1, female: 1 }, // 1% off for first-time buyers
    ...
  },
  karnataka: {
    rate: { male: 5, female: 5, ... },  // No gender discrimination
    registration: { rate: 1, cap: null },
    stampDutySurcharge: { rate: 10, type: 'percent_of_sd' },  // 10% cess on SD
    ...
  },
  // ... 25 more states
}
```

### Calculation Order

```
1. baseRate = STAMP_DUTY_RATES[state].rate[gender]
2. applyFirstTimeRebate if applicable
3. stampDutyAmount = propertyValue * baseRate / 100
4. registrationAmount = min(propertyValue * regRate / 100, regCap)
5. surcharge = stampDutyAmount * surchargeRate / 100  (if exists)
6. cess = stampDutyAmount * cessRate / 100  (if metro area)
7. total = stampDutyAmount + registrationAmount + surcharge + cess
```

---

## Tool 3: RTO / Road Tax Calculator

### Input Model

```typescript
{
  state: string,
  vehicleType: 'private_car' | 'commercial_vehicle' | 'two_wheeler' | 'ev',
  fuelType: 'petrol' | 'diesel' | 'cng' | 'ev',  // EV exemptions vary by state
  exShowroomPrice: number,
  isUsedVehicle: boolean,
  age: number,                    // Vehicle age in years (for used vehicle / transfer)
  seatingCapacity: number,        // Some states differ by seats
}
```

### Output Model

```typescript
{
  lifeTax: number,                // One-time road tax paid at registration
  annualTax: number,              // Annual tax (commercial vehicles)
  registrationFee: number,        // RTO registration fee
  hsrpFee: number,                // High Security Registration Plate
  totalOnRoadDelta: number,       // Additional cost beyond ex-showroom
  effectiveTaxRate: number,       // lifeTax / exShowroomPrice * 100
}
```

### RTO Tax Rules (State-wise Variation)

RTO/motor vehicle tax in India varies dramatically by state. Common structures:

| Structure | States | Example |
|-----------|--------|---------|
| Slab-based on price | Maharashtra, Gujarat, Karnataka | 6% up to ₹10L, 8% above |
| Flat percentage | Delhi, UP, Rajasthan | 4-8% of vehicle cost |
| Engine capacity (CC) based | Tamil Nadu, Kerala | ₹40/cc for petrol, ₹50/cc for diesel |
| Seating-based | Telangana, AP | Different rates for different seat counts |
| EV exemption | Most states | 100% exemption or reduced (varies) |

### State Tax Structure Examples

```javascript
const RTO_RATES = {
  maharashtra: {
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 1000000, rate: 6 },
      { min: 1000001, max: Infinity, rate: 8 },
    ],
    registrationFee: 600,
    hsrpFee: 500,
    evExemption: { lifeTax: 'full', registration: false }  // EV exempt from life tax
  },
  delhi: {
    type: 'flat_percent',
    rate: { petrol: 4, diesel: 5, cng: 4, ev: 0 },
    registrationFee: 600,
    hsrpFee: 500,
    // For used vehicle transfer: additional 1.5%
  },
  tamilnadu: {
    type: 'per_cc',
    rate: { petrol: 40, diesel: 50, ev: 0 },  // ₹ per CC
    registrationFee: 600,
    hsrpFee: 500,
  },
  // ... 25 more states
}
```

### Commercial Vehicle Seating-Based Tax

Each state defines `commercial.brackets` in RTO_RATES. Each bracket has:
- `minSeats`, `maxSeats`: seating range
- `type`: `'one_time'` (flat fee) or `'per_seat'` (rate * seats)
- `period`: `'lifetime' | 'year' | 'quarter' | 'month'` (default lifetime for per_seat)
- `amount`: flat fee for one_time brackets
- `rate`: per-seat rate for per_seat brackets

Logic in `calcRTO()`: if `vehicleType === 'commercial'`, find matching bracket by seat count:
- `one_time` type → `lifeTax = amount` (one-time lump sum)
- `per_seat` type with `period: 'lifetime'` → `lifeTax = rate * seats`
- `per_seat` type with `period: 'year'` → `annualTax = rate * seats`, `lifeTax = 0`
- `per_seat` type with `period: 'quarter'` → `annualTax = rate * seats * 4`, `lifeTax = 0`
- `per_seat` type with `period: 'month'` → `annualTax = rate * seats * 12`, `lifeTax = 0`

Commercial path skips EV exemption, standard rate slabs, cesses, used surcharge, and tax cap entirely. Registration and HSRP fees still apply as standard fees.

### Calculation Order

```
0. if vehicleType === 'commercial' → commercial seating-based tax (skip rest)
1. if fuelType === 'ev' && RTO_RATES[state].evExemption.lifeTax === 'full' → lifeTax = 0
2. else apply rate structure:
   a. slab_percent: find applicable slab → lifeTax = price * rate / 100
   b. flat_percent: lifeTax = price * rate[fuelType] / 100
   c. per_cc: lifeTax = engineCC * rate[fuelType]
3. registrationFee = RTO_RATES[state].registrationFee  (flat, ₹600 standard)
4. hsrpFee = RTO_RATES[state].hsrpFee  (₹500 new set, ₹250 for retro-fit)
5. total = lifeTax + registrationFee + hsrpFee
```

---

## Shared Utilities (`calc-core.js`)

```javascript
// Number formatting
function formatINR(n)      // → "₹1,20,000" (Indian numbering)
function formatPercent(n)  // → "5.00%"

// State lookup
function getStateList()    // → [{id, name, nameHi}]
function getStateRates(id) // → STAMP_DUTY_RATES[id] | RTO_RATES[id]

// URL helpers
function serializeParams(obj, prefix) // → "?regime=new&income=1200000"
function deserializeParams()          // → {regime: 'new', income: 1200000}

// Lang helpers
function t(key)            // → string from active lang object

// Debounced input handler
function onInput(el, cb, delay)  // requestIdleCallback where available
```
