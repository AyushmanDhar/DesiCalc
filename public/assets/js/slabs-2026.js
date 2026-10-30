const TAX_SLABS_NEW = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 5 },
  { min: 800000, max: 1200000, rate: 10 },
  { min: 1200000, max: 1600000, rate: 15 },
  { min: 1600000, max: 2000000, rate: 20 },
  { min: 2000000, max: 2400000, rate: 25 },
  { min: 2400000, max: Infinity, rate: 30 },
];

const TAX_SLABS_OLD = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];

const TAX_SLABS_OLD_SENIOR = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];

const TAX_SLABS_OLD_SUPERSENIOR = [
  { min: 0, max: 500000, rate: 0 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];

const SURCHARGE_SLABS_NEW = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000001, max: 10000000, rate: 10 },
  { min: 10000001, max: 20000000, rate: 15 },
  { min: 20000001, max: Infinity, rate: 25 },
];

const SURCHARGE_SLABS_OLD = [
  { min: 0, max: 5000000, rate: 0 },
  { min: 5000001, max: 10000000, rate: 10 },
  { min: 10000001, max: 20000000, rate: 15 },
  { min: 20000001, max: 50000000, rate: 25 },
  { min: 50000001, max: Infinity, rate: 37 },
];

const STANDARD_DEDUCTION = { new: 75000, old: 50000 };
const REBATE_87A = { new: 60000, old: 12500 };
const REBATE_THRESHOLD = { new: 1200000, old: 500000 };

function calcTaxSlabs(netTaxableIncome, regime, age) {
  let slabs;
  if (regime === 'new') {
    slabs = TAX_SLABS_NEW;
  } else {
    if (age >= 80) slabs = TAX_SLABS_OLD_SUPERSENIOR;
    else if (age >= 60) slabs = TAX_SLABS_OLD_SENIOR;
    else slabs = TAX_SLABS_OLD;
  }
  let tax = 0;
  for (const s of slabs) {
    const taxableInSlab = Math.max(0, Math.min(netTaxableIncome, s.max) - s.min);
    tax += taxableInSlab * s.rate / 100;
  }
  return tax;
}

function calcSurcharge(tax, netTaxableIncome, regime, age) {
  const slabs = regime === 'new' ? SURCHARGE_SLABS_NEW : SURCHARGE_SLABS_OLD;

  let rate = 0;
  for (const s of slabs) {
    if (netTaxableIncome >= s.min && netTaxableIncome <= s.max) {
      rate = s.rate;
      break;
    }
  }
  if (rate === 0) return 0;

  let surcharge = tax * rate / 100;
  let threshold = 0;
  for (const s of slabs) {
    if (netTaxableIncome >= s.min && netTaxableIncome <= s.max) {
      threshold = s.min;
      break;
    }
  }

  if (threshold > 1) {
    const boundary = threshold - 1;
    let prevRate = 0;
    for (const s of slabs) {
      if (s.max >= boundary) {
        prevRate = s.rate;
        break;
      }
    }
    if (prevRate < rate) {
      const taxAtBoundary = calcTaxSlabs(boundary, regime, age);
      const totalAtBoundary = taxAtBoundary * (1 + prevRate / 100);
      const maxTotal = totalAtBoundary + (netTaxableIncome - boundary);
      const actualTotal = tax * (1 + rate / 100);
      if (actualTotal > maxTotal) {
        surcharge = maxTotal - tax;
      }
    }
  }

  return surcharge;
}

function getSurchargeRate(totalIncome, regime) {
  if (totalIncome <= 5000000) return 0;
  if (totalIncome <= 10000000) return 10;
  if (totalIncome <= 20000000) return 15;
  if (regime === 'new') return 25;
  if (totalIncome <= 50000000) return 25;
  return 37;
}

function calcSurchargeSplit(slabTax, specialTax, totalIncome, regime, age) {
  const rate = getSurchargeRate(totalIncome, regime);
  if (rate === 0) return 0;
  const slabSurcharge = calcSurcharge(slabTax, totalIncome, regime, age);
  const specialSurcharge = specialTax * Math.min(rate, 15) / 100;

  const brackets = regime === 'new'
    ? [5000000, 10000000, 20000000]
    : [5000000, 10000000, 20000000, 50000000];
  const rates = regime === 'new' ? [10, 15, 25] : [10, 15, 25, 37];
  const idx = rates.indexOf(rate);
  if (idx < 0) return slabSurcharge + specialSurcharge;

  const boundary = brackets[idx];
  const prevRate = idx === 0 ? 0 : rates[idx - 1];
  const taxAtBoundary = calcTaxSlabs(boundary, regime, age);
  const totalAtBoundary = taxAtBoundary * (1 + prevRate / 100)
    + specialTax * (1 + Math.min(prevRate, 15) / 100);
  const maxTotal = totalAtBoundary + (totalIncome - boundary);
  const actualTotal = slabTax + specialTax + slabSurcharge + specialSurcharge;
  if (actualTotal > maxTotal) {
    return Math.max(0, maxTotal - slabTax - specialTax);
  }
  return slabSurcharge + specialSurcharge;
}

function calcIncomeTax(inputs) {
  const regime = inputs.regime || 'new';
  const age = inputs.age || 30;

  const equityLtcg = inputs.capitalGainsLTCG || 0;
  const equityStcg = inputs.capitalGainsSTCG || 0;

  const grossTotalIncome = (inputs.incomeSalary || 0)
    + (inputs.incomeOther || 0)
    + (inputs.incomeBusiness || 0)
    + equityLtcg + equityStcg;

  const salary = inputs.incomeSalary || 0;
  const sd = salary > 0 ? Math.min(salary, STANDARD_DEDUCTION[regime]) : 0;

  const npsBasicDA = inputs.employerNpsBasicDA || 0;
  const npsRate = regime === 'new'
    ? 0.14
    : (inputs.employerIsGovernment ? 0.14 : 0.10);
  const employerNpsDeduction = npsBasicDA > 0
    ? Math.min(inputs.employerNps || 0, npsBasicDA * npsRate)
    : 0;

  let deductions = 0;
  if (regime === 'old') {
    deductions += Math.min(inputs.deductions80C || 0, 150000);
    deductions += inputs.deductions80D || 0;
    deductions += Math.min(inputs.deductions80CCD || 0, 50000);
    deductions += Math.min(inputs.homeLoanInterest || 0, 200000);
    if (inputs.incomeSalary > 0) {
      const hraActual = inputs.hraActual || 0;
      const hraRent = inputs.hraRent || 0;
      const hraBasic = (inputs.hraBasic || 0) + (inputs.hraDA || 0);
      const hraMetro = inputs.hraMetro || false;
      const hraPercent = hraMetro ? 0.5 : 0.4;
      const hraExemption = Math.min(
        hraActual,
        hraBasic * hraPercent,
        Math.max(0, hraRent - hraBasic * 0.1)
      );
      deductions += hraExemption;
    }
  }

  const regularIncome = Math.max(0, grossTotalIncome - equityLtcg - equityStcg - sd - deductions - employerNpsDeduction);
  const totalIncome = grossTotalIncome - sd - deductions - employerNpsDeduction;

  const slabTax = calcTaxSlabs(regularIncome, regime, age);

  const basicExemption = regime === 'new'
    ? 400000
    : (age >= 80 ? 500000 : age >= 60 ? 300000 : 250000);
  const unusedBasicExemption = Math.max(0, basicExemption - regularIncome);
  const stcgExempt = Math.min(unusedBasicExemption, equityStcg);
  const stcgAdjusted = Math.max(0, equityStcg - stcgExempt);
  const ltcgAfterExemption = Math.max(0, equityLtcg - 125000);
  const unusedAfterStcg = Math.max(0, unusedBasicExemption - stcgExempt);
  const ltcgAdjusted = Math.max(0, ltcgAfterExemption - unusedAfterStcg);

  const stcgTax = stcgAdjusted * 0.20;
  const ltcgTax = ltcgAdjusted * 0.125;
  const specialTax = stcgTax + ltcgTax;
  const taxBeforeRebate = slabTax + specialTax;

  let rebate87A = 0;
  if (regime === 'new') {
    if (regularIncome <= REBATE_THRESHOLD.new) {
      rebate87A = Math.min(slabTax, REBATE_87A.new);
    }
  } else if (totalIncome <= REBATE_THRESHOLD.old) {
    rebate87A = Math.min(slabTax, REBATE_87A.old);
  }

  let slabTaxAfterRebate = Math.max(0, slabTax - rebate87A);
  const specialTaxAfterRebate = specialTax;

  let marginalRelief = 0;
  if (regime === 'new' && regularIncome > REBATE_THRESHOLD.new) {
    const excess = regularIncome - REBATE_THRESHOLD.new;
    if (slabTaxAfterRebate > excess) {
      marginalRelief = slabTaxAfterRebate - excess;
      slabTaxAfterRebate = excess;
    }
  }

  const taxAfterRebate = slabTaxAfterRebate + specialTaxAfterRebate;
  const surcharge = calcSurchargeSplit(slabTaxAfterRebate, specialTaxAfterRebate, totalIncome, regime, age);
  const healthCess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = Math.round(taxAfterRebate + surcharge + healthCess);

  const effectiveRate = grossTotalIncome > 0 ? (totalTax / grossTotalIncome * 100) : 0;

  return {
    grossTotalIncome,
    standardDeduction: sd,
    netTaxableIncome: Math.round(totalIncome),
    totalDeductions: deductions + employerNpsDeduction,
    employerNpsDeduction,
    taxBeforeRebate: Math.round(taxBeforeRebate),
    rebate87A: Math.round(rebate87A),
    marginalRelief: Math.round(marginalRelief),
    taxAfterRebate: Math.round(taxAfterRebate),
    stcgTax: Math.round(stcgTax),
    ltcgTax: Math.round(ltcgTax),
    surcharge: Math.round(surcharge),
    healthCess: Math.round(healthCess),
    totalTax,
    effectiveRate,
  };
}
