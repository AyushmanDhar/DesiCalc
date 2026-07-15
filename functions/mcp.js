const STAMP_DUTY_RATES = {
  andhrapradesh: { male: 5, female: 4, joint: 4.5, reg: 1 },
  arunachalpradesh: { male: 5, female: 4, joint: 4.5, reg: 1 },
  assam: { male: 6, female: 6, joint: 6, reg: 1.5 },
  bihar: { male: 6, female: 5, joint: 5.5, reg: 2 },
  chhattisgarh: { male: 5, female: 4, joint: 4, reg: 1 },
  delhi: { male: 6, female: 4, joint: 5, reg: 1 },
  goa: { male: 6.5, female: 6.5, joint: 6.5, reg: 1 },
  gujarat: { male: 4.9, female: 4.9, joint: 4.9, reg: 1 },
  haryana: { male: 6, female: 5, joint: 5.5, reg: 1 },
  himachalpradesh: { male: 6, female: 5, joint: 5.5, reg: 1 },
  jharkhand: { male: 5, female: 4, joint: 4.5, reg: 1 },
  karnataka: { male: 5, female: 5, joint: 5, reg: 1 },
  kerala: { male: 8, female: 8, joint: 8, reg: 2 },
  madhyapradesh: { male: 6, female: 5, joint: 5.5, reg: 1 },
  maharashtra: { male: 6, female: 5, joint: 5.5, reg: 1 },
  manipur: { male: 5, female: 4, joint: 4.5, reg: 1 },
  meghalaya: { male: 5, female: 4, joint: 4.5, reg: 1 },
  mizoram: { male: 5, female: 4, joint: 4.5, reg: 1 },
  nagaland: { male: 5, female: 4, joint: 4.5, reg: 1 },
  odisha: { male: 6, female: 5, joint: 5.5, reg: 1.5 },
  punjab: { male: 6, female: 5, joint: 5.5, reg: 1 },
  rajasthan: { male: 6, female: 5, joint: 5.5, reg: 1 },
  sikkim: { male: 6, female: 5, joint: 5.5, reg: 1 },
  tamilnadu: { male: 6, female: 6, joint: 6, reg: 4 },
  telangana: { male: 6, female: 5, joint: 5.5, reg: 1 },
  tripura: { male: 5, female: 4, joint: 4.5, reg: 1 },
  uttarpradesh: { male: 7, female: 6, joint: 6.5, reg: 1 },
  uttarakhand: { male: 6, female: 5, joint: 5.5, reg: 1 },
  westbengal: { male: 6, female: 5, joint: 5.5, reg: 1.5 },
};

const RTO_RATES = {
  andhrapradesh: { min: 12, max: 14 },
  arunachalpradesh: { min: 6, max: 8 },
  assam: { min: 8, max: 10 },
  bihar: { min: 8, max: 12 },
  chhattisgarh: { min: 7, max: 9 },
  delhi: { min: 4, max: 12 },
  goa: { min: 9, max: 11 },
  gujarat: { min: 6, max: 9 },
  haryana: { min: 8, max: 10 },
  himachalpradesh: { min: 5, max: 7 },
  jharkhand: { min: 6, max: 8 },
  karnataka: { min: 10, max: 18 },
  kerala: { min: 6, max: 15 },
  madhyapradesh: { min: 8, max: 12 },
  maharashtra: { min: 11, max: 15 },
  manipur: { min: 6, max: 8 },
  meghalaya: { min: 6, max: 8 },
  mizoram: { min: 5, max: 7 },
  nagaland: { min: 5, max: 7 },
  odisha: { min: 8, max: 12 },
  punjab: { min: 6, max: 10 },
  rajasthan: { min: 6, max: 10 },
  sikkim: { min: 6, max: 8 },
  tamilnadu: { min: 10, max: 15 },
  telangana: { min: 9, max: 14 },
  tripura: { min: 6, max: 8 },
  uttarpradesh: { min: 7, max: 10 },
  uttarakhand: { min: 5, max: 8 },
  westbengal: { min: 10, max: 12 },
};

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

function calcIncomeTax(inputs) {
  const regime = inputs.regime || 'new';
  const age = inputs.age || 30;
  const grossTotalIncome = (inputs.income || 0);
  const sd = grossTotalIncome > 0 ? (regime === 'new' ? 75000 : 50000) : 0;
  let deductions = 0;
  if (regime === 'old') {
    deductions += Math.min(inputs.section80c || 0, 150000);
    deductions += inputs.section80d || 0;
  }
  const netTaxableIncome = Math.max(0, grossTotalIncome - sd - deductions);
  let taxBeforeRebate = calcTaxSlabs(netTaxableIncome, regime, age);
  const REBATE_87A = { new: 60000, old: 12500 };
  const REBATE_THRESHOLD = { new: 1200000, old: 500000 };
  let rebate87A = 0;
  if (netTaxableIncome <= REBATE_THRESHOLD[regime]) {
    rebate87A = Math.min(taxBeforeRebate, REBATE_87A[regime]);
  }
  let taxAfterRebate = Math.max(0, taxBeforeRebate - rebate87A);
  let marginalRelief = 0;
  if (regime === 'new' && netTaxableIncome > REBATE_THRESHOLD.new) {
    const excess = netTaxableIncome - REBATE_THRESHOLD.new;
    if (taxAfterRebate > excess) {
      marginalRelief = taxAfterRebate - excess;
      taxAfterRebate = excess;
    }
  }
  const surcharge = calcSurcharge(taxAfterRebate, netTaxableIncome, regime, age);
  const healthCess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = Math.round(taxAfterRebate + surcharge + healthCess);
  const effectiveRate = grossTotalIncome > 0 ? (totalTax / grossTotalIncome * 100) : 0;
  return {
    grossTotalIncome,
    standardDeduction: sd,
    netTaxableIncome: Math.round(netTaxableIncome),
    totalDeductions: deductions,
    taxBeforeRebate: Math.round(taxBeforeRebate),
    rebate87A: Math.round(rebate87A),
    marginalRelief: Math.round(marginalRelief),
    taxAfterRebate: Math.round(taxAfterRebate),
    surcharge: Math.round(surcharge),
    healthCess: Math.round(healthCess),
    totalTax,
    effectiveRate,
  };
}

function calcStampDuty(inputs) {
  const state = inputs.state;
  const propertyValue = inputs.propertyValue;
  const propertyType = inputs.propertyType || 'residential';
  const gender = inputs.gender || 'male';
  const rates = STAMP_DUTY_RATES[state];
  if (!rates) return { error: 'Unknown state: ' + state };
  const sdRate = rates[gender] || rates.male;
  const regRate = rates.reg || 1;
  const stampDuty = propertyValue * sdRate / 100;
  const registration = propertyValue * regRate / 100;
  let surcharge = 0;
  if (state === 'karnataka') surcharge = stampDuty * 0.10;
  if (state === 'kerala') surcharge = registration * 0.10;
  return {
    stampDuty: Math.round(stampDuty),
    registration: Math.round(registration),
    surcharge: Math.round(surcharge),
    total: Math.round(stampDuty + surcharge + registration),
    stampDutyRate: sdRate,
    registrationRate: regRate,
  };
}

function calcRtoTax(inputs) {
  const state = inputs.state;
  const vehiclePrice = inputs.vehiclePrice;
  const fuelType = inputs.fuelType || 'petrol';
  const vehicleType = inputs.vehicleType || 'car';
  const rates = RTO_RATES[state];
  if (!rates) return { error: 'Unknown state: ' + state };
  const midRate = (rates.min + rates.max) / 2;
  const roadTax = vehiclePrice * midRate / 100;
  const registrationFees = vehicleType === 'car' ? 600 : 300;
  return {
    roadTax: Math.round(roadTax),
    registrationFees,
    total: Math.round(roadTax + registrationFees),
    taxRate: midRate,
  };
}

const TOOLS = [
  {
    name: 'stampDuty',
    description: 'Calculate Indian stamp duty rates by state and property value',
    inputSchema: {
      type: 'object',
      properties: {
        state: { type: 'string', description: 'Indian state ID (e.g. karnataka, maharashtra)' },
        propertyValue: { type: 'number', description: 'Property value in INR' },
        propertyType: { type: 'string', enum: ['residential', 'commercial'], default: 'residential' },
        gender: { type: 'string', enum: ['male', 'female', 'joint'], default: 'male' },
      },
      required: ['state', 'propertyValue'],
    },
  },
  {
    name: 'rtoTax',
    description: 'Calculate Indian RTO road tax by state and vehicle price',
    inputSchema: {
      type: 'object',
      properties: {
        state: { type: 'string', description: 'Indian state ID (e.g. karnataka, maharashtra)' },
        vehiclePrice: { type: 'number', description: 'Ex-showroom price in INR' },
        fuelType: { type: 'string', enum: ['petrol', 'diesel', 'electric', 'cng'], default: 'petrol' },
        vehicleType: { type: 'string', enum: ['car', 'bike', 'scooter'], default: 'car' },
      },
      required: ['state', 'vehiclePrice'],
    },
  },
  {
    name: 'incomeTax',
    description: 'Calculate Indian income tax under old and new regimes',
    inputSchema: {
      type: 'object',
      properties: {
        income: { type: 'number', description: 'Annual income in INR' },
        regime: { type: 'string', enum: ['old', 'new'], default: 'new' },
        age: { type: 'number', description: 'Age in years' },
        section80c: { type: 'number', description: 'Section 80C deductions in INR', default: 0 },
        section80d: { type: 'number', description: 'Section 80D deductions in INR', default: 0 },
      },
      required: ['income'],
    },
  },
];

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const { method, params, id } = body;

  try {
    let result;
    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2025-03-26',
          capabilities: { tools: {} },
          serverInfo: { name: 'in.desicalc/calculators', version: '1.0.0' },
        };
        break;
      case 'tools/list':
        result = { tools: TOOLS };
        break;
      case 'tools/call':
        result = handleToolCall(params);
        break;
      default:
        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32601, message: 'Method not found: ' + method },
          id,
        }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    return new Response(JSON.stringify({ jsonrpc: '2.0', result, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32603, message: err.message },
      id,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

function handleToolCall(params) {
  const { name, arguments: args } = params;
  switch (name) {
    case 'stampDuty':
      return calcStampDuty(args);
    case 'rtoTax':
      return calcRtoTax(args);
    case 'incomeTax':
      return calcIncomeTax(args);
    default:
      throw new Error('Unknown tool: ' + name);
  }
}