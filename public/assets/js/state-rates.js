const STAMP_DUTY_RATES = {
  andhrapradesh: {
    name: 'Andhra Pradesh',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  arunachalpradesh: {
    name: 'Arunachal Pradesh',
    rate: { male: 6, female: 6, joint_ff: 6, joint_mm: 6, joint_mf: 6 },
    registration: { rate: 1, cap: null },
  },
  assam: {
    name: 'Assam',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  bihar: {
    name: 'Bihar',
    rate: { male: 6, female: 5, joint_ff: 5, joint_mm: 6, joint_mf: 5.5 },
    registration: { rate: 1, cap: null },
  },
  chhattisgarh: {
    name: 'Chhattisgarh',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  delhi: {
    name: 'Delhi',
    rate: { male: 6, female: 4, joint_ff: 4, joint_mm: 6, joint_mf: 5 },
    registration: { rate: 1, cap: null },
    firstTimeRebate: { female: 1 },
  },
  goa: {
    name: 'Goa',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  gujarat: {
    name: 'Gujarat',
    rate: { male: 4.9, female: 4.9, joint_ff: 4.9, joint_mm: 4.9, joint_mf: 4.9 },
    registration: { rate: 1, cap: null },
  },
  haryana: {
    name: 'Haryana',
    rate: {
      urban: { male: 7, female: 5, joint_ff: 6, joint_mm: 6, joint_mf: 6 },
      rural: { male: 5, female: 3, joint_ff: 4, joint_mm: 4, joint_mf: 4 },
    },
    registration: { rate: 1, cap: null },
  },
  himachalpradesh: {
    name: 'Himachal Pradesh',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  jharkhand: {
    name: 'Jharkhand',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  karnataka: {
    name: 'Karnataka',
    rate: { male: 5, female: 5, joint_ff: 5, joint_mm: 5, joint_mf: 5 },
    registration: { rate: 2, cap: null },
    stampDutySurcharge: { rate: 10, type: 'percent_of_sd' },
  },
  kerala: {
    name: 'Kerala',
    rate: { male: 6, female: 5, joint_ff: 5, joint_mm: 6, joint_mf: 5.5 },
    registration: { rate: 1, cap: null },
    surcharge: { rate: 2, type: 'percent_of_sd' },
  },
  madhyapradesh: {
    name: 'Madhya Pradesh',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  maharashtra: {
    name: 'Maharashtra',
    rate: { male: 6, female: 5, joint_ff: 5, joint_mm: 6, joint_mf: 5 },
    registration: { rate: 1, cap: 30000 },
    metroCess: { rate: 1 },
    lbc: { rate: 1 },
  },
  manipur: {
    name: 'Manipur',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  meghalaya: {
    name: 'Meghalaya',
    rate: { male: 10, female: 8, joint_ff: 8, joint_mm: 10, joint_mf: 9 },
    registration: { rate: 1, cap: null },
  },
  mizoram: {
    name: 'Mizoram',
    rate: { male: 6, female: 5, joint_ff: 5, joint_mm: 6, joint_mf: 5.5 },
    registration: { rate: 1, cap: null },
  },
  nagaland: {
    name: 'Nagaland',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  odisha: {
    name: 'Odisha',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  punjab: {
    name: 'Punjab',
    rate: { male: 7, female: 5, joint_ff: 5, joint_mm: 7, joint_mf: 6 },
    registration: { rate: 1, cap: null },
  },
  rajasthan: {
    name: 'Rajasthan',
    rate: { male: 6, female: 5, joint_ff: 5, joint_mm: 6, joint_mf: 5.5 },
    registration: { rate: 1, cap: null },
  },
  sikkim: {
    name: 'Sikkim',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  tamilnadu: {
    name: 'Tamil Nadu',
    rate: { male: 7, female: 7, joint_ff: 7, joint_mm: 7, joint_mf: 7 },
    registration: { rate: 4, cap: null },
    registrationWomen: { rate: 3, maxPropertyValue: 1000000 },
  },
  telangana: {
    name: 'Telangana',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  tripura: {
    name: 'Tripura',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  uttarpradesh: {
    name: 'Uttar Pradesh',
    rate: { male: 7, female: 6, joint_ff: 6, joint_mm: 7, joint_mf: 6.5 },
    registration: { rate: 1, cap: null },
  },
  uttarakhand: {
    name: 'Uttarakhand',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
  },
  westbengal: {
    name: 'West Bengal',
    rate: null,
    registration: { rate: 1, cap: null },
    surcharge: { rate: 1, type: 'percent_of_sd', minPropertyValue: 10000000 },
    rateSlabs: {
      urban: [
        { min: 0, max: 10000000, rate: 6 },
        { min: 10000001, max: Infinity, rate: 7 },
      ],
      rural: [
        { min: 0, max: 10000000, rate: 5 },
        { min: 10000001, max: Infinity, rate: 6 },
      ],
    },
  },
};

const RTO_RATES = {
  andhrapradesh: {
    name: 'Andhra Pradesh',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 1000000, rate: 12 },
      { min: 1000001, max: Infinity, rate: 14 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    cesses: [
      { type: 'percent', rate: 10, fuel: 'petrol', label: 'Safety Cess' },
	  { type: 'percent', rate: 10, fuel: 'diesel', label: 'Safety Cess' },
    ],
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 5000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 2000, period: 'year' },
        { minSeats: 13, maxSeats: 30, type: 'per_seat', rate: 3000, period: 'year' },
        { minSeats: 31, maxSeats: Infinity, type: 'per_seat', rate: 4000, period: 'year' },
      ],
    },
  },
  arunachalpradesh: {
    name: 'Arunachal Pradesh',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 4000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1200, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2000, period: 'year' },
      ],
    },
  },
  assam: {
    name: 'Assam',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 4500 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1500, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2500, period: 'year' },
      ],
    },
  },
  bihar: {
    name: 'Bihar',
    type: 'flat_percent',
    rate: { petrol: 6, diesel: 7, cng: 6, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 5000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 2000, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 3000, period: 'year' },
      ],
    },
  },
  chhattisgarh: {
    name: 'Chhattisgarh',
    type: 'flat_percent',
    rate: { petrol: 4, diesel: 5, cng: 4, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 3500 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1200, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2000, period: 'year' },
      ],
    },
  },
  delhi: {
    name: 'Delhi',
    type: 'slab_percent',
    slabs: {
      petrol: [
        { min: 0, max: 600000, rate: 4 },
        { min: 600001, max: 1000000, rate: 7 },
        { min: 1000001, max: Infinity, rate: 10 },
      ],
      diesel: [
        { min: 0, max: 600000, rate: 5 },
        { min: 600001, max: 1000000, rate: 8.75 },
        { min: 1000001, max: Infinity, rate: 12.5 },
      ],
      cng: [
        { min: 0, max: 600000, rate: 4 },
        { min: 600001, max: 1000000, rate: 7 },
        { min: 1000001, max: Infinity, rate: 10 },
      ],
    },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 4, type: 'one_time', amount: 5000 },
        { minSeats: 5, maxSeats: 6, type: 'one_time', amount: 8000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 2000, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2000, period: 'year' },
      ],
    },
  },
  goa: {
    name: 'Goa',
    type: 'flat_percent',
    rate: { petrol: 4, diesel: 5, cng: 4, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 4000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1500, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2500, period: 'year' },
      ],
    },
  },
  gujarat: {
    name: 'Gujarat',
    type: 'pre_gst_percent',
    rate: 6,
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'partial', evRate: 1, registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 3, type: 'one_time', amount: 3000 },
        { minSeats: 4, maxSeats: 6, type: 'per_seat', rate: 1000, period: 'year' },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1500, period: 'year' },
        { minSeats: 13, maxSeats: 20, type: 'per_seat', rate: 2000, period: 'year' },
        { minSeats: 21, maxSeats: Infinity, type: 'per_seat', rate: 2500, period: 'year' },
      ],
    },
  },
  haryana: {
    name: 'Haryana',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 600000, rate: 5 },
      { min: 600001, max: 2000000, rate: 8 },
      { min: 2000001, max: Infinity, rate: 10 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'concession', concessionPercent: 75, registration: false },
    commercial: {
      brackets: [
		{ minSeats: 1, maxSeats: 3, type: 'one_time', amount: 3000 },
        { minSeats: 4, maxSeats: 6, type: 'one_time', amount: 5000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 2000, period: 'quarter' },
        { minSeats: 13, maxSeats: 30, type: 'per_seat', rate: 3000, period: 'quarter' },
        { minSeats: 31, maxSeats: Infinity, type: 'per_seat', rate: 4000, period: 'quarter' },
      ],
    },
  },
  himachalpradesh: {
    name: 'Himachal Pradesh',
    type: 'flat_percent',
    rate: { petrol: 4, diesel: 5, cng: 4, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 3500 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1000, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 1800, period: 'year' },
      ],
    },
  },
  jharkhand: {
    name: 'Jharkhand',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 4000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1500, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2500, period: 'year' },
      ],
    },
  },
  karnataka: {
    name: 'Karnataka',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 500000, rate: 13 },
      { min: 500001, max: 1000000, rate: 14 },
      { min: 1000001, max: 2000000, rate: 17 },
      { min: 2000001, max: Infinity, rate: 18 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'slabbed', registration: false },
	evSlabs: [
	  { min: 0,        max: 1000000,  rate: 5  },
	  { min: 1000001,  max: 2500000,  rate: 8  },
	  { min: 2500001,  max: Infinity, rate: 10 },
	],
    cesses: [
      { type: 'percent', rate: 11, label: 'Infra & Road Safety Cess' },
      { type: 'fixed', amount: 1000, label: 'Transport Workers Cess' },
    ],
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 3, type: 'one_time', amount: 2500 },
        { minSeats: 4, maxSeats: 12, type: 'per_seat', rate: 1500, period: 'quarter' },
        { minSeats: 13, maxSeats: 20, type: 'per_seat', rate: 1500, period: 'quarter' },
        { minSeats: 21, maxSeats: Infinity, type: 'per_seat', rate: 1500, period: 'quarter' },
      ],
    },
  },
  kerala: {
    name: 'Kerala',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 500000, rate: 10 },
      { min: 500001, max: 1000000, rate: 13 },
      { min: 1000001, max: 1500000, rate: 15 },
      { min: 1500001, max: 2000000, rate: 17 },
      { min: 2000001, max: Infinity, rate: 20 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'slabbed', registration: false },
    evSlabs: [
      { min: 0, max: 1000000, rate: 3 },
      { min: 1000001, max: 1500000, rate: 5 },
      { min: 1500001, max: 2000000, rate: 5 },
      { min: 2000001, max: 4000000, rate: 10 },
      { min: 4000001, max: Infinity, rate: 15 },
    ],
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 3, type: 'one_time', amount: 3000 },
        { minSeats: 4, maxSeats: 5, type: 'per_seat', rate: 300, period: 'quarter' },
        { minSeats: 6, maxSeats: 12, type: 'per_seat', rate: 400, period: 'quarter' },
        { minSeats: 13, maxSeats: 20, type: 'per_seat', rate: 500, period: 'quarter' },
        { minSeats: 21, maxSeats: Infinity, type: 'per_seat', rate: 600, period: 'quarter' },
      ],
    },
  },
  madhyapradesh: {
    name: 'Madhya Pradesh',
    type: 'slab_percent',
    slabs: {
      petrol: [
        { min: 0, max: 1000000, rate: 8 },
        { min: 1000001, max: 2000000, rate: 10 },
        { min: 2000001, max: Infinity, rate: 14 },
      ],
      diesel: [
        { min: 0, max: 1000000, rate: 10 },
        { min: 1000001, max: 2000000, rate: 12 },
        { min: 2000001, max: Infinity, rate: 16 },
      ],
    },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', evPriceCap: 2000000, registration: false },
    taxModel: 'quarterly',
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 4000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1200, period: 'year' },
        { minSeats: 13, maxSeats: 32, type: 'per_seat', rate: 2000, period: 'year' },
        { minSeats: 33, maxSeats: Infinity, type: 'per_seat', rate: 3000, period: 'year' },
      ],
    },
  },
  maharashtra: {
    name: 'Maharashtra',
    type: 'slab_percent',
    slabs: {
      petrol: [
        { min: 0, max: 1000000, rate: 11 },
        { min: 1000001, max: 2000000, rate: 12 },
        { min: 2000001, max: Infinity, rate: 13 },
      ],
      diesel: [
        { min: 0, max: 1000000, rate: 13 },
        { min: 1000001, max: 2000000, rate: 14 },
        { min: 2000001, max: Infinity, rate: 15 },
      ],
      cng: [
        { min: 0, max: 1000000, rate: 8 },
        { min: 1000001, max: 2000000, rate: 9 },
        { min: 2000001, max: Infinity, rate: 10 },
      ],
    },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    taxCap: 3000000,
    cesses: [
      { type: 'percent', rate: 2, fuel: 'diesel', label: 'Diesel Cess' },
    ],
    commercial: {
      brackets: [
		{ minSeats: 1, maxSeats: 2, type: 'one_time', amount: 2500 },
        { minSeats: 3, maxSeats: 4, type: 'one_time', amount: 3850 },
        { minSeats: 5, maxSeats: 6, type: 'one_time', amount: 7150 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1700, period: 'year' },
        { minSeats: 13, maxSeats: 24, type: 'per_seat', rate: 3000, period: 'year' },
        { minSeats: 25, maxSeats: Infinity, type: 'per_seat', rate: 5000, period: 'year' },
      ],
    },
  },
  manipur: {
    name: 'Manipur',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 3000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1000, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 1800, period: 'year' },
      ],
    },
  },
  meghalaya: {
    name: 'Meghalaya',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 4000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1400, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2200, period: 'year' },
      ],
    },
  },
  mizoram: {
    name: 'Mizoram',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 3000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1000, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 1800, period: 'year' },
      ],
    },
  },
  nagaland: {
    name: 'Nagaland',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 3500 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1200, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2000, period: 'year' },
      ],
    },
  },
  odisha: {
    name: 'Odisha',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 4000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1500, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2500, period: 'year' },
      ],
    },
  },
  punjab: {
    name: 'Punjab',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
		{ minSeats: 1, maxSeats: 3, type: 'one_time', amount: 3000 },
        { minSeats: 4, maxSeats: 6, type: 'one_time', amount: 5000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 2000, period: 'quarter' },
        { minSeats: 13, maxSeats: 30, type: 'per_seat', rate: 3000, period: 'quarter' },
        { minSeats: 31, maxSeats: Infinity, type: 'per_seat', rate: 4000, period: 'quarter' },
      ],
    },
  },
  rajasthan: {
    name: 'Rajasthan',
    type: 'flat_percent',
    rate: { petrol: 4, diesel: 5, cng: 4, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'per_seat', rate: 150, period: 'month' },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 200, period: 'month' },
        { minSeats: 13, maxSeats: 30, type: 'per_seat', rate: 250, period: 'month' },
        { minSeats: 31, maxSeats: Infinity, type: 'per_seat', rate: 300, period: 'month' },
      ],
    },
  },
  sikkim: {
    name: 'Sikkim',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 3000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1000, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 1800, period: 'year' },
      ],
    },
  },
  tamilnadu: {
    name: 'Tamil Nadu',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 500000, rate: 12 },
      { min: 500001, max: 1000000, rate: 13 },
      { min: 1000001, max: 2000000, rate: 18 },
      { min: 2000001, max: Infinity, rate: 20 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 4, type: 'one_time', amount: 3000 },
        { minSeats: 5, maxSeats: 7, type: 'per_seat', rate: 200, period: 'quarter' },
        { minSeats: 8, maxSeats: 13, type: 'per_seat', rate: 200, period: 'quarter' },
        { minSeats: 14, maxSeats: 35, type: 'per_seat', rate: 400, period: 'quarter' },
        { minSeats: 36, maxSeats: Infinity, type: 'per_seat', rate: 500, period: 'quarter' },
      ],
    },
  },
  telangana: {
    name: 'Telangana',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 500000, rate: 13 },
      { min: 500001, max: 1000000, rate: 14 },
      { min: 1000001, max: 2000000, rate: 17 },
      { min: 2000001, max: Infinity, rate: 18 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    cesses: [
      { type: 'fixed', amount: 5000, label: 'Road Safety Cess' },
    ],
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 5000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 2000, period: 'year' },
        { minSeats: 13, maxSeats: 30, type: 'per_seat', rate: 3000, period: 'year' },
        { minSeats: 31, maxSeats: Infinity, type: 'per_seat', rate: 4000, period: 'year' },
      ],
    },
  },
  tripura: {
    name: 'Tripura',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 3000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1000, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 1800, period: 'year' },
      ],
    },
  },
  uttarpradesh: {
    name: 'Uttar Pradesh',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 1000000, rate: 8 },
      { min: 1000001, max: Infinity, rate: 10 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 3, type: 'one_time', amount: 2000 },
        { minSeats: 4, maxSeats: 6, type: 'per_seat', rate: 3000, period: 'quarter' },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 6000, period: 'quarter' },
        { minSeats: 13, maxSeats: 32, type: 'per_seat', rate: 10000, period: 'quarter' },
        { minSeats: 33, maxSeats: Infinity, type: 'per_seat', rate: 15000, period: 'quarter' },
      ],
    },
  },
  uttarakhand: {
    name: 'Uttarakhand',
    type: 'flat_percent',
    rate: { petrol: 4, diesel: 5, cng: 4, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
        { minSeats: 1, maxSeats: 6, type: 'one_time', amount: 3500 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1200, period: 'year' },
        { minSeats: 13, maxSeats: Infinity, type: 'per_seat', rate: 2000, period: 'year' },
      ],
    },
  },
  westbengal: {
    name: 'West Bengal',
    type: 'flat_percent',
    rate: { petrol: 5, diesel: 6, cng: 5, ev: 0 },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    commercial: {
      brackets: [
		{ minSeats: 1, maxSeats: 2, type: 'one_time', amount: 2500 },
        { minSeats: 3, maxSeats: 4, type: 'one_time', amount: 4000 },
        { minSeats: 5, maxSeats: 6, type: 'one_time', amount: 7000 },
        { minSeats: 7, maxSeats: 12, type: 'per_seat', rate: 1200, period: 'year' },
        { minSeats: 13, maxSeats: 26, type: 'per_seat', rate: 1800, period: 'year' },
        { minSeats: 27, maxSeats: 50, type: 'per_seat', rate: 2500, period: 'year' },
      ],
    },
  },
};

function calcStampDuty(state, propertyValue, gender, location, isFirstTime) {
  const s = STAMP_DUTY_RATES[state];
  if (!s) return null;

  let rate;

  if (s.rateSlabs) {
    const slabs = (location && s.rateSlabs[location]) ? s.rateSlabs[location] : (s.rateSlabs.default || s.rateSlabs.urban);
    for (const slab of slabs) {
      if (propertyValue >= slab.min && propertyValue <= slab.max) {
        rate = slab.rate;
        break;
      }
    }
  } else {
    let rateData = s.rate;
    if (location && s.rate[location] && typeof s.rate[location] === 'object') {
      rateData = s.rate[location];
    }
    rate = rateData[gender] || rateData.male;
  }

  if (isFirstTime && s.firstTimeRebate) {
    const rebate = s.firstTimeRebate[gender] || 0;
    rate = Math.max(0, rate - rebate);
  }

  const sdAmount = propertyValue * rate / 100;
  const regRate = s.registration.rate || 1;
  let regAmount = propertyValue * regRate / 100;
  if (s.registration.cap) regAmount = Math.min(regAmount, s.registration.cap);

  if (s.registrationWomen && gender === 'female' && (!s.registrationWomen.maxPropertyValue || propertyValue <= s.registrationWomen.maxPropertyValue)) {
    regAmount = propertyValue * s.registrationWomen.rate / 100;
  }

  let cessAmount = 0;
  if (s.stampDutySurcharge && s.stampDutySurcharge.type === 'percent_of_sd') {
    cessAmount = sdAmount * s.stampDutySurcharge.rate / 100;
  }
  if (s.surcharge && (!s.surcharge.minPropertyValue || propertyValue > s.surcharge.minPropertyValue)) {
    cessAmount += sdAmount * s.surcharge.rate / 100;
  }
  if (s.metroCess) {
    cessAmount += sdAmount * s.metroCess.rate / 100;
  }
  if (s.lbc) {
    cessAmount += sdAmount * s.lbc.rate / 100;
  }

  const total = sdAmount + regAmount + cessAmount + (s.otherCharges || 0);
  return {
    stampDutyRate: rate,
    registrationRate: regRate,
    stampDutyAmount: Math.round(sdAmount),
    registrationAmount: Math.round(regAmount),
    cessAmount: Math.round(cessAmount),
    otherCharges: s.otherCharges || 0,
    totalCharges: Math.round(total),
    effectiveRate: propertyValue > 0 ? (total / propertyValue * 100) : 0,
  };
}

function calcRTO(state, vehicleType, fuelType, exShowroomPrice, engineCC, isUsed, age, seats) {
  const s = RTO_RATES[state];
  if (!s) return null;
  const isEV = fuelType === 'ev' || vehicleType === 'ev';
  const isCommercial = vehicleType === 'commercial';
  let lifeTax = 0;
  let taxRate = 0;
  let cessTotal = 0;
  let annualTax = 0;
  let commercialPeriod = null;
  let calculated = false;

  // ---- Commercial vehicle: seating-based tax ----
  if (isCommercial && s.commercial && s.commercial.brackets) {
    const bracket = s.commercial.brackets.find(b => seats >= b.minSeats && seats <= b.maxSeats);
    if (bracket) {
      if (bracket.type === 'one_time') {
        lifeTax = bracket.amount;
        commercialPeriod = 'lifetime';
      } else if (bracket.type === 'per_seat') {
        const perSeatAmount = bracket.rate * seats;
        if (bracket.period === 'lifetime' || !bracket.period) {
          lifeTax = perSeatAmount;
        } else if (bracket.period === 'year') {
          annualTax = perSeatAmount;
          lifeTax = 0;
        } else if (bracket.period === 'quarter') {
          annualTax = perSeatAmount * 4;
          lifeTax = 0;
        } else if (bracket.period === 'month') {
          annualTax = perSeatAmount * 12;
          lifeTax = 0;
        }
        commercialPeriod = bracket.period || 'lifetime';
      }
      calculated = true;
    }
  }

  // ---- Determine tax based on EV status and type ----
  if (!calculated && isEV && s.evExemption) {
    if (s.evExemption.lifeTax === 'full') {
      lifeTax = 0;
    } else if (s.evExemption.lifeTax === 'partial') {
      taxRate = s.evExemption.evRate || 0;
      lifeTax = exShowroomPrice * taxRate / 100;
    } else if (s.evExemption.lifeTax === 'concession') {
      const pct = s.evExemption.concessionPercent || 0;
      taxRate = resolveRate(s, fuelType, exShowroomPrice);
      lifeTax = exShowroomPrice * taxRate * (1 - pct / 100) / 100;
    } else if (s.evExemption.lifeTax === 'slabbed') {
      const evSlabs = s.evSlabs || [];
      for (const slab of evSlabs) {
        if (exShowroomPrice >= slab.min && exShowroomPrice <= slab.max) {
          taxRate = slab.rate;
          break;
        }
      }
      lifeTax = exShowroomPrice * taxRate / 100;
    }
    calculated = true;
  }

  // ---- Standard calculation (non-commercial, non-EV) ----
  if (!calculated) {
    if (s.type === 'slab_percent') {
      taxRate = resolveRate(s, fuelType, exShowroomPrice);
      lifeTax = exShowroomPrice * taxRate / 100;
    } else if (s.type === 'flat_percent') {
      taxRate = s.rate[fuelType] || 0;
      lifeTax = exShowroomPrice * taxRate / 100;
    } else if (s.type === 'per_cc') {
      const cc = engineCC || 1500;
      taxRate = s.rate[fuelType] || 0;
      lifeTax = cc * taxRate;
    } else if (s.type === 'seating_based') {
      taxRate = 5;
      lifeTax = exShowroomPrice * 0.05;
    } else if (s.type === 'pre_gst_percent') {
      taxRate = s.rate || 0;
      const gstRate = exShowroomPrice > 1000000 ? 1.28 : 1.18;
	  const preGstPrice = exShowroomPrice / gstRate;
      lifeTax = preGstPrice * taxRate / 100;
    }
  }

  // ---- Commercial path complete - skip cesses, surcharge, cap ----
  if (!isCommercial) {
    if (s.cesses) {
      for (const cess of s.cesses) {
        if (cess.fuel && cess.fuel !== fuelType) continue;
        if (cess.type === 'percent') {
          cessTotal += lifeTax * cess.rate / 100;
        } else if (cess.type === 'fixed') {
          cessTotal += cess.amount;
        }
      }
    }
    lifeTax += cessTotal;

    if (isUsed && s.usedVehicleSurcharge) {
      lifeTax += lifeTax * s.usedVehicleSurcharge / 100;
    }

    if (s.taxCap) lifeTax = Math.min(lifeTax, s.taxCap);
  }

  const hsrpFee = s.hsrpFee || 500;
  const registrationFee = s.registrationFee || 600;

  const taxModel = isCommercial
    ? (commercialPeriod === 'lifetime' ? 'lifetime' : (commercialPeriod || 'lifetime'))
    : (s.taxModel || 'lifetime');

  return {
    lifeTax: Math.round(lifeTax),
    taxRate,
    annualTax: isCommercial ? Math.round(annualTax) : (s.taxModel === 'quarterly' ? Math.round(lifeTax * 4) : 0),
    taxModel,
    registrationFee,
    hsrpFee,
    cessTotal: Math.round(cessTotal),
    totalOnRoadDelta: Math.round(lifeTax + registrationFee + hsrpFee),
    effectiveTaxRate: exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0,
  };
}

function resolveRate(s, fuelType, price) {
  let slabs = s.slabs;
  if (!Array.isArray(slabs)) {
    slabs = slabs[fuelType] || slabs.petrol || slabs.default;
  }
  if (!slabs) return 0;
  for (const slab of slabs) {
    if (price >= slab.min && price <= slab.max) {
      return slab.rate;
    }
  }
  return 0;
}
