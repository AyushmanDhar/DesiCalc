const STAMP_DUTY_RATES = {
  andhrapradesh: {
    name: 'Andhra Pradesh',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4.5 },
    registration: { rate: 1, cap: null },
	transferDuty: { rate: 1.5 },
  },
  arunachalpradesh: {
    name: 'Arunachal Pradesh',
    rate: { male: 6, female: 6, joint_ff: 6, joint_mm: 6, joint_mf: 6 },
    registration: { rate: 1, cap: null },
  },
  assam: {
    name: 'Assam',
    rate: {male: 8.25, female: 8.25, joint_ff: 8.25, joint_mm: 8.25, joint_mf: 8.25,},
    registration: { rate: 1, cap: null },
  },
  bihar: {
    name: 'Bihar',
    rate: { male: 6, female: 5, joint_ff: 5, joint_mm: 6, joint_mf: 5.5 },
    registration: { rate: 1, cap: null },
  },
  chhattisgarh: {
    name: 'Chhattisgarh',
    rate: { male: 5, female: 4, joint_ff: 4, joint_mm: 5, joint_mf: 4 },
    registration: { rate: 4, cap: null },
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
    rate: null,
	rateSlabs: [
	  { min: 0, max: 2000000, rate: 2 },
	  { min: 2000001, max: 4500000, rate: 3 },
	  { min: 4500001, max: Infinity, rate: 5 },
  ],
    registration: { rate: 2, cap: null },
    stampDutySurcharge: { rate: 10, type: 'percent_of_sd' },
  },
  kerala: {
    name: 'Kerala',
    rate: { male: 8, female: 8, joint_ff: 8, joint_mm: 8, joint_mf: 8 },
    registration: { rate: 1, cap: null },
    surcharge: { rate: 2, type: 'percent_of_sd' },
  },
  madhyapradesh: {
    name: 'Madhya Pradesh',
    rate: { male: 7.5, female: 7.5, joint_ff: 7.5, joint_mm: 7.5, joint_mf: 7.5 },
    registration: { rate: 3, cap: null },
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
    rate: { male: 7, female: 6, joint_ff: 6, joint_mm: 7, joint_mf: 6.5 },
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
    hsrpFee: 590,
    hsrpFee_2w: 320,
    evExemption: { lifeTax: 'full', registration: true },
    cesses: [
      { type: 'percent', rate: 10, label: 'Safety Cess' },
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 300000, rate: 2.5 },
      { min: 300001, max: 500000, rate: 2.7 },
      { min: 500001, max: 1000000, rate: 3 },
      { min: 1000001, max: 1500000, rate: 3.5 },
      { min: 1500001, max: 1800000, rate: 4 },
      { min: 1800001, max: 2000000, rate: 4.5 },
      { min: 2000001, max: Infinity, rate: 6.5 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 300000, rate: 4 },
      { min: 300001, max: 500000, rate: 6 },
      { min: 500001, max: 2000000, rate: 10 },
      { min: 2000001, max: Infinity, rate: 14 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    cesses: [
      { type: 'percent', rate: 1, label: 'Road Safety Cess' },
    ],
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 1000000, rate: 8 },
      { min: 1000001, max: 8000000, rate: 9 },
      { min: 8000001, max: 15000000, rate: 10 },
      { min: 15000001, max: Infinity, rate: 13 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: true },
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 500000, rate: 5 },
      { min: 500001, max: Infinity, rate: 6 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'concession', concessionPercent: 25, registration: false },
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
    hsrpFee: 1100,
    hsrpFee_2w: 400,
    evExemption: { lifeTax: 'full', evPriceCap: 3000000, registration: true },
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 1000000, rate: 9 },
      { min: 1000001, max: 2000000, rate: 12 },
      { min: 2000001, max: Infinity, rate: 15 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    taxCap: 1500000,
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
    hsrpFee: 600,
    hsrpFee_2w: 300,
    evExemption: { lifeTax: 'full', evPriceCap: 3000000, evAboveCapConcession: 50, registration: false },
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 1500000, rate: 6 },
      { min: 1500001, max: Infinity, rate: 7 },
    ],
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
    type: 'slab_marginal',
    slabs: [
      { min: 0, max: 1500000, rate: 6 },
      { min: 1500001, max: Infinity, rate: 15 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'concession', concessionPercent: 25, registration: false },
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
      { min: 2000001, max: Infinity, rate: 22 },
    ],
    registrationFee: 600,
    hsrpFee: 1000,
    hsrpFee_2w: 500,
    evExemption: { lifeTax: 'slabbed', registration: false },
    evSlabs: [
      { min: 0, max: 1000000, rate: 3 },
      { min: 1000001, max: 2000000, rate: 5 },
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
    evExemption: { lifeTax: 'partial', evRate: 4, registration: false },
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
      { type: 'percent', rate: 2, label: 'Road Safety Cess' },
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 300000, rate: 6 },
      { min: 300001, max: 600000, rate: 7 },
      { min: 600001, max: 1000000, rate: 8 },
      { min: 1000001, max: 1500000, rate: 9 },
      { min: 1500001, max: 2000000, rate: 10 },
      { min: 2000001, max: 2500000, rate: 12 },
      { min: 2500001, max: 3500000, rate: 14 },
      { min: 3500001, max: 4500000, rate: 15 },
      { min: 4500001, max: Infinity, rate: 16 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'concession', concessionPercent: 20, registration: false },
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 300000, rate: 4 },
      { min: 300001, max: 1500000, rate: 6 },
      { min: 1500001, max: 2000000, rate: 8 },
      { min: 2000001, max: Infinity, rate: 10 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: true },
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
    type: 'pre_gst_percent',
    rate: 6,
    registrationFee: 600,
    hsrpFee: 400,
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
    rate: { petrol: 5, diesel: 5, cng: 5, ev: 5 },
    registrationFee: 600,
    hsrpFee: 400,
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 500000, rate: 6 },
      { min: 500001, max: 1000000, rate: 8 },
      { min: 1000001, max: 2000000, rate: 10 },
      { min: 2000001, max: 4000000, rate: 12 },
      { min: 4000001, max: Infinity, rate: 20 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: true },
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 1500000, rate: 9.5 },
      { min: 1500001, max: 2500000, rate: 12 },
      { min: 2500001, max: Infinity, rate: 13 },
    ],
    registrationFee: 600,
    hsrpFee: 566,
    hsrpFee_2w: 191,
    evExemption: { lifeTax: 'full', registration: true },
    cesses: [
      { type: 'fixed', amount: 1000, label: 'Cow Cess' },
    ],
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
    type: 'slab_cc_percent',
    slabs: {
      petrol: [
        { min: 0, max: 800, rate: 6 },
        { min: 801, max: 1200, rate: 9 },
        { min: 1201, max: Infinity, rate: 10 },
      ],
      diesel: [
        { min: 0, max: 800, rate: 8 },
        { min: 801, max: 1200, rate: 11 },
        { min: 1201, max: Infinity, rate: 12 },
      ],
      cng: [
        { min: 0, max: 800, rate: 6 },
        { min: 801, max: 1200, rate: 9 },
        { min: 1201, max: Infinity, rate: 10 },
      ],
    },
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: false },
    cesses: [
      { type: 'percent', rate: 12.5, label: 'Surcharge' },
    ],
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 2000000, rate: 1 },
      { min: 2000001, max: 20000000, rate: 4 },
      { min: 20000001, max: Infinity, rate: 5 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'partial', evRate: 1, registration: false },
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
      { min: 1000001, max: 2000000, rate: 18 },
      { min: 2000001, max: 5000000, rate: 20 },
      { min: 5000001, max: Infinity, rate: 21 },
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
    type: 'slab_fixed',
    slabs: [
      { min: 0, max: 300000, amount: 4100 },
      { min: 300001, max: 500000, amount: 4800 },
      { min: 500001, max: 1000000, amount: 6900 },
      { min: 1000001, max: 1500000, amount: 7550 },
      { min: 1500001, max: Infinity, amount: 8250 },
    ],
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'concession', concessionPercent: 25, registration: false },
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
      { min: 0, max: 1000000, rate: 9 },
      { min: 1000001, max: Infinity, rate: 11 },
    ],
    registrationFee: 600,
    hsrpFee: 1100,
    hsrpFee_2w: 400,
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
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 1000000, rate: 6 },
      { min: 1000001, max: Infinity, rate: 8 },
    ],
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
    type: 'slab_cc',
    slabs: [
      { min: 0, max: 800, amount: 40000 },
      { min: 801, max: 1490, amount: 55000 },
      { min: 1491, max: 1999, amount: 80000 },
      { min: 2000, max: Infinity, amount: 100000 },
    ],
    maxPctRate: 10,
    registrationFee: 600,
    hsrpFee: 400,
    evExemption: { lifeTax: 'full', registration: true },
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

const TWO_WHEELER_RTO_RATES = {
  andhrapradesh: {
    name: 'Andhra Pradesh',
    type: 'flat_percent',
    rate: 9,
    evExemption: { lifeTax: 'full', registration: true },
    cesses: [
      { type: 'percent_on_tax', rate: 10, label: 'Safety Cess' },
    ],
  },
  arunachalpradesh: {
    name: 'Arunachal Pradesh',
    type: 'slab_weight',
    slabs: [
      { min: 0, max: 65, amount: 1200 },
      { min: 66, max: 90, amount: 2000 },
      { min: 91, max: 135, amount: 3000 },
      { min: 136, max: Infinity, amount: 3500 },
    ],
    fallbackPercent: 4,
  },
  assam: {
    name: 'Assam',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 70000, rate: 6 },
      { min: 70001, max: 300000, rate: 8 },
      { min: 300001, max: Infinity, rate: 10 },
    ],
    evExemption: { lifeTax: 'full' },
  },
  bihar: {
    name: 'Bihar',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 100000, rate: 9 },
      { min: 100001, max: 8000000, rate: 10 },
      { min: 8000001, max: 15000000, rate: 11 },
      { min: 15000001, max: Infinity, rate: 13 },
    ],
    evExemption: { lifeTax: 'full', registration: true },
  },
  chhattisgarh: {
    name: 'Chhattisgarh',
    type: 'flat_percent',
    rate: 4,
    evExemption: { lifeTax: 'concession', concessionPercent: 25 },
  },
  delhi: {
    name: 'Delhi',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 75000, rate: 4 },
      { min: 75001, max: 200000, rate: 6 },
      { min: 200001, max: Infinity, rate: 8 },
    ],
    evExemption: { lifeTax: 'full', registration: true },
  },
  goa: {
    name: 'Goa',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 150000, rate: 9 },
      { min: 150001, max: 300000, rate: 12 },
      { min: 300001, max: Infinity, rate: 15 },
    ],
    evExemption: { lifeTax: 'full' },
  },
  gujarat: {
    name: 'Gujarat',
    type: 'pre_gst_percent',
    rate: 6,
    evExemption: { lifeTax: 'partial', evRate: 1 },
  },
  haryana: {
    name: 'Haryana',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 75000, rate: 4 },
      { min: 75001, max: 200000, rate: 6 },
      { min: 200001, max: Infinity, rate: 8 },
    ],
    evExemption: { lifeTax: 'full' },
  },
  himachalpradesh: {
    name: 'Himachal Pradesh',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 100000, rate: 6 },
      { min: 100001, max: Infinity, rate: 7 },
    ],
    evExemption: { lifeTax: 'full' },
  },
  jharkhand: {
    name: 'Jharkhand',
    type: 'flat_percent',
    rate: 6,
    evExemption: { lifeTax: 'concession', concessionPercent: 25 },
  },
  karnataka: {
    name: 'Karnataka',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 50000, rate: 10 },
      { min: 50001, max: 100000, rate: 12 },
      { min: 100001, max: Infinity, rate: 18 },
    ],
    cesses: [
      { type: 'percent_on_tax', rate: 11, label: 'Infrastructure & Road Safety Cess' },
      { type: 'fixed', amount: 500, label: 'Transport Workers Cess' },
    ],
    evExemption: { lifeTax: 'full' },
  },
  kerala: {
    name: 'Kerala',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 100000, rate: 13 },
      { min: 100001, max: 200000, rate: 15 },
      { min: 200001, max: Infinity, rate: 21 },
    ],
    evExemption: { lifeTax: 'partial', evRate: 5 },
  },
  madhyapradesh: {
    name: 'Madhya Pradesh',
    type: 'flat_percent',
    rate: 8,
    evExemption: { lifeTax: 'partial', evRate: 4 },
  },
  maharashtra: {
    name: 'Maharashtra',
    type: 'slab_cc_percent',
    slabs: [
      { min: 0, max: 99, rate: 10 },
      { min: 100, max: 299, rate: 11 },
      { min: 300, max: Infinity, rate: 12 },
    ],
    minTax: 1500,
    cesses: [
      { type: 'percent_on_tax', rate: 2, label: 'Road Safety Cess' },
    ],
    evExemption: { lifeTax: 'full' },
  },
  manipur: {
    name: 'Manipur',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 200000, rate: 5 },
      { min: 200001, max: 500000, rate: 6 },
      { min: 500001, max: Infinity, rate: 7 },
    ],
    evExemption: { lifeTax: 'concession', concessionPercent: 30 },
  },
  meghalaya: {
    name: 'Meghalaya',
    type: 'slab_weight',
    slabs: [
      { min: 0, max: 65, amount: 1100 },
      { min: 66, max: 90, amount: 1800 },
      { min: 91, max: 135, amount: 2500 },
      { min: 136, max: Infinity, amount: 2990 },
    ],
    fallbackPercent: 4,
  },
  mizoram: {
    name: 'Mizoram',
    type: 'pre_gst_percent',
    rate: 6,
  },
  nagaland: {
    name: 'Nagaland',
    type: 'flat_percent',
    rate: 5,
  },
  odisha: {
    name: 'Odisha',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 500000, rate: 6 },
      { min: 500001, max: 1000000, rate: 8 },
      { min: 1000001, max: 2000000, rate: 10 },
      { min: 2000001, max: 4000000, rate: 12 },
      { min: 4000001, max: Infinity, rate: 20 },
    ],
    evExemption: { lifeTax: 'full', registration: true },
  },
  punjab: {
    name: 'Punjab',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 100000, rate: 7.5 },
      { min: 100001, max: 200000, rate: 10 },
      { min: 200001, max: Infinity, rate: 11 },
    ],
    evExemption: { lifeTax: 'full', registration: true },
    cesses: [
      { type: 'fixed', amount: 200, label: 'Cow Cess' },
    ],
  },
  rajasthan: {
    name: 'Rajasthan',
    type: 'slab_cc_percent',
    slabs: [
      { min: 0, max: 200, rate: 8 },
      { min: 201, max: 500, rate: 13 },
      { min: 501, max: Infinity, rate: 15 },
    ],
    evExemption: { lifeTax: 'full' },
    cesses: [
      { type: 'percent_on_tax', rate: 12.5, label: 'Surcharge' },
    ],
  },
  sikkim: {
    name: 'Sikkim',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 100000, rate: 3 },
      { min: 100001, max: Infinity, rate: 4 },
    ],
    evExemption: { lifeTax: 'partial', evRate: 1 },
  },
  tamilnadu: {
    name: 'Tamil Nadu',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 100000, rate: 10 },
      { min: 100001, max: Infinity, rate: 12 },
    ],
    evExemption: { lifeTax: 'full' },
  },
  telangana: {
    name: 'Telangana',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 50000, rate: 9 },
      { min: 50001, max: 100000, rate: 12 },
      { min: 100001, max: 200000, rate: 15 },
      { min: 200001, max: Infinity, rate: 18 },
    ],
    evExemption: { lifeTax: 'full' },
  },
  tripura: {
    name: 'Tripura',
    type: 'flat_percent',
    rate: 4,
    evExemption: { lifeTax: 'concession', concessionPercent: 25 },
  },
  uttarakhand: {
    name: 'Uttarakhand',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 1000000, rate: 6 },
      { min: 1000001, max: Infinity, rate: 8 },
    ],
  },
  uttarpradesh: {
    name: 'Uttar Pradesh',
    type: 'slab_percent',
    slabs: [
      { min: 0, max: 40000, rate: 7 },
      { min: 40001, max: Infinity, rate: 10 },
    ],
    evExemption: { lifeTax: 'full' },
  },
  westbengal: {
    name: 'West Bengal',
    type: 'slab_cc',
    slabs: [
      { min: 0, max: 80, amount: 1560 },
      { min: 81, max: 170, amount: 3125 },
      { min: 171, max: 250, amount: 4685 },
      { min: 251, max: Infinity, amount: 6250 },
    ],
  },
};

function calcStampDuty(state, propertyValue, gender, location, isFirstTime) {
  const s = STAMP_DUTY_RATES[state];
  if (!s) return null;

  let rate;

  if (s.rateSlabs) {
    let slabs;

    // State-wide slab array (e.g. Karnataka)
    if (Array.isArray(s.rateSlabs)) {
      slabs = s.rateSlabs;
    }
    // Location-based slabs (e.g. West Bengal)
    else {
      slabs =
        (location && s.rateSlabs[location]) ||
        s.rateSlabs.default ||
        s.rateSlabs.urban;
    }

    if (!slabs) {
      return null;
    }

    for (const slab of slabs) {
      if (propertyValue >= slab.min && propertyValue <= slab.max) {
        rate = slab.rate;
        break;
      }
    }

    if (rate == null) {
      return null;
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
  const transferAmount = s.transferDuty ? propertyValue * s.transferDuty.rate / 100 : 0;
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

  const total = sdAmount + regAmount + transferAmount + cessAmount + (s.otherCharges || 0);
  return {
    stampDutyRate: rate,
    registrationRate: regRate,
    stampDutyAmount: Math.round(sdAmount),
    registrationAmount: Math.round(regAmount),
    cessAmount: Math.round(cessAmount),
    transferDutyAmount: Math.round(transferAmount),
    otherCharges: s.otherCharges || 0,
    totalCharges: Math.round(total),
    effectiveRate: propertyValue > 0 ? (total / propertyValue * 100) : 0,
  };
}

function calcRTO(state, vehicleType, fuelType, exShowroomPrice, engineCC, isUsed, age, seats, vehicleWeight) {
  const s = RTO_RATES[state];
  if (!s) return null;
  const isEV = fuelType === 'ev' || vehicleType === 'ev';
  const isCommercial = vehicleType === 'commercial';
  const vehicleCategory = (vehicleType === 'two_wheeler' || vehicleType === '2w') ? 'two_wheeler' : 'four_wheeler';
  const tw = (vehicleCategory === 'two_wheeler') ? TWO_WHEELER_RTO_RATES[state] : null;
  let lifeTax = 0;
  let taxRate = 0;
  let cessTotal = 0;
  let annualTax = 0;
  let commercialPeriod = null;
  let calculated = false;

  // ---- Two-wheeler: use TWO_WHEELER_RTO_RATES ----
  if (!calculated && tw) {
    const isEV2W = fuelType === 'ev';

    // EV exemption for 2W
    if (isEV2W && tw.evExemption) {
      if (tw.evExemption.lifeTax === 'full') {
        lifeTax = 0;
        taxRate = 0;
        calculated = true;
      } else if (tw.evExemption.lifeTax === 'partial') {
        taxRate = tw.evExemption.evRate || 0;
        if (tw.type === 'pre_gst_percent') {
          const gstRate = exShowroomPrice > 1000000 ? 1.28 : 1.18;
          lifeTax = (exShowroomPrice / gstRate) * taxRate / 100;
        } else {
          lifeTax = exShowroomPrice * taxRate / 100;
        }
        calculated = true;
      }
    }

    if (!calculated) {
      if (tw.type === 'flat_percent') {
        taxRate = tw.rate;
        lifeTax = exShowroomPrice * taxRate / 100;
        calculated = true;
      } else if (tw.type === 'slab_percent') {
        for (const slab of tw.slabs) {
          if (exShowroomPrice >= slab.min && exShowroomPrice <= slab.max) {
            taxRate = slab.rate;
            break;
          }
        }
        lifeTax = exShowroomPrice * taxRate / 100;
        calculated = true;
      } else if (tw.type === 'pre_gst_percent') {
        // Calculate on pre-GST price (remove 28% GST for >10L, 18% otherwise)
        const gstRate = exShowroomPrice > 1000000 ? 1.28 : 1.18;
        const preGstPrice = exShowroomPrice / gstRate;
        taxRate = tw.rate;
        lifeTax = preGstPrice * taxRate / 100;
        calculated = true;
      } else if (tw.type === 'slab_cc') {
        // engineCC must be passed in; fall back to 150cc if not provided
        const cc = engineCC || 150;
        for (const slab of tw.slabs) {
          if (cc >= slab.min && cc <= slab.max) {
            lifeTax = slab.amount;
            taxRate = exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0;
            break;
          }
        }
        calculated = true;
      } else if (tw.type === 'slab_cc_percent') {
        // % of price by engine CC (e.g. Maharashtra, Rajasthan)
        const cc = engineCC || 150;
        for (const slab of tw.slabs) {
          if (cc >= slab.min && cc <= slab.max) {
            taxRate = slab.rate;
            break;
          }
        }
        lifeTax = exShowroomPrice * taxRate / 100;
        if (tw.minTax && lifeTax < tw.minTax) lifeTax = tw.minTax;
        calculated = true;
      } else if (tw.type === 'slab_weight') {
        // vehicleWeight param used if available; fall back to fallbackPercent
        if (typeof vehicleWeight === 'number' && vehicleWeight > 0) {
          for (const slab of tw.slabs) {
            if (vehicleWeight >= slab.min && vehicleWeight <= slab.max) {
              lifeTax = slab.amount;
              taxRate = exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0;
              break;
            }
          }
        } else if (tw.fallbackPercent) {
          taxRate = tw.fallbackPercent;
          lifeTax = exShowroomPrice * taxRate / 100;
        }
        calculated = true;
      }
    }

    // Apply 2W EV concession (waiver) on top of computed tax
    if (calculated && isEV2W && tw.evExemption && tw.evExemption.lifeTax === 'concession') {
      const pct = tw.evExemption.concessionPercent || 0;
      lifeTax = lifeTax * (1 - pct / 100);
      taxRate = exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0;
    }

    // Apply 2W cesses if defined (e.g. Karnataka, Maharashtra, Rajasthan)
    if (calculated && tw.cesses) {
      for (const cess of tw.cesses) {
        if (cess.type === 'percent_on_tax') {
          cessTotal += lifeTax * cess.rate / 100;
        } else if (cess.type === 'fixed') {
          cessTotal += cess.amount;
        }
      }
      lifeTax += cessTotal;
    }
  }

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
    const evCap = s.evExemption.evPriceCap;
    const aboveCap = evCap && exShowroomPrice > evCap;
    if (s.evExemption.lifeTax === 'full' && !aboveCap) {
      lifeTax = 0;
      taxRate = 0;
      calculated = true;
    } else if (s.evExemption.lifeTax === 'full' && aboveCap && s.evExemption.evAboveCapConcession) {
      taxRate = resolveRate(s, fuelType, exShowroomPrice);
      lifeTax = exShowroomPrice * taxRate * (1 - s.evExemption.evAboveCapConcession / 100) / 100;
      calculated = true;
    } else if (s.evExemption.lifeTax === 'partial') {
      taxRate = s.evExemption.evRate || 0;
      if (s.type === 'pre_gst_percent') {
        const gstRate = exShowroomPrice > 1000000 ? 1.28 : 1.18;
        lifeTax = (exShowroomPrice / gstRate) * taxRate / 100;
      } else {
        lifeTax = exShowroomPrice * taxRate / 100;
      }
      calculated = true;
    } else if (s.evExemption.lifeTax === 'concession') {
      const pct = s.evExemption.concessionPercent || 0;
      if (s.type === 'slab_fixed') {
        for (const slab of s.slabs) {
          if (exShowroomPrice >= slab.min && exShowroomPrice <= slab.max) {
            lifeTax = slab.amount * (1 - pct / 100);
            taxRate = exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0;
            break;
          }
        }
      } else if (s.type === 'slab_marginal') {
        for (const slab of s.slabs) {
          const bandEnd = Math.min(slab.max === Infinity ? exShowroomPrice : slab.max, exShowroomPrice);
          if (bandEnd > slab.min) {
            lifeTax += (bandEnd - slab.min) * slab.rate / 100;
          }
          if (exShowroomPrice <= slab.max) break;
        }
        lifeTax = lifeTax * (1 - pct / 100);
        taxRate = exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0;
      } else {
        taxRate = resolveRate(s, fuelType, exShowroomPrice);
        lifeTax = exShowroomPrice * taxRate * (1 - pct / 100) / 100;
      }
      calculated = true;
    } else if (s.evExemption.lifeTax === 'slabbed') {
      const evSlabs = s.evSlabs || [];
      for (const slab of evSlabs) {
        if (exShowroomPrice >= slab.min && exShowroomPrice <= slab.max) {
          taxRate = slab.rate;
          break;
        }
      }
      lifeTax = exShowroomPrice * taxRate / 100;
      calculated = true;
    }
    // 'full' above cap without concession: falls through to standard rates below
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
    } else if (s.type === 'slab_cc') {
      // Fixed one-time amounts by engine CC (e.g. West Bengal 4W)
      const cc = engineCC || 1500;
      for (const slab of s.slabs) {
        if (cc >= slab.min && cc <= slab.max) {
          lifeTax = slab.amount;
          taxRate = exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0;
          break;
        }
      }
      if (s.maxPctRate) {
        lifeTax = Math.max(lifeTax, exShowroomPrice * s.maxPctRate / 100);
        taxRate = exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0;
      }
    } else if (s.type === 'slab_cc_percent') {
      // % of price by engine CC band, optional fuel split (e.g. Rajasthan 4W)
      const cc = engineCC || 1500;
      let ccSlabs = s.slabs;
      if (!Array.isArray(ccSlabs)) ccSlabs = ccSlabs[fuelType] || ccSlabs.petrol;
      for (const slab of ccSlabs) {
        if (cc >= slab.min && cc <= slab.max) {
          taxRate = slab.rate;
          break;
        }
      }
      lifeTax = exShowroomPrice * taxRate / 100;
      if (s.minTax && lifeTax < s.minTax) lifeTax = s.minTax;
    } else if (s.type === 'slab_fixed') {
      // Fixed one-time amounts by price band (e.g. Tripura 4W)
      for (const slab of s.slabs) {
        if (exShowroomPrice >= slab.min && exShowroomPrice <= slab.max) {
          lifeTax = slab.amount;
          taxRate = exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0;
          break;
        }
      }
    } else if (s.type === 'slab_marginal') {
      // Rate applies only to the portion of price within each band (e.g. Jharkhand 4W)
      for (const slab of s.slabs) {
        const bandEnd = Math.min(slab.max === Infinity ? exShowroomPrice : slab.max, exShowroomPrice);
        if (bandEnd > slab.min) {
          lifeTax += (bandEnd - slab.min) * slab.rate / 100;
        }
        if (exShowroomPrice <= slab.max) break;
      }
      taxRate = exShowroomPrice > 0 ? (lifeTax / exShowroomPrice * 100) : 0;
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
    if (s.cesses && vehicleCategory !== 'two_wheeler') {
      for (const cess of s.cesses) {
        if (cess.fuel && cess.fuel !== fuelType) continue;
        if (cess.type === 'percent') {
          cessTotal += lifeTax * cess.rate / 100;
        } else if (cess.type === 'fixed') {
          cessTotal += cess.amount;
        }
      }
    }
    if (vehicleCategory !== 'two_wheeler') {
      lifeTax += cessTotal;
    }

    if (isUsed && s.usedVehicleSurcharge) {
      lifeTax += lifeTax * s.usedVehicleSurcharge / 100;
    }

    if (s.taxCap) lifeTax = Math.min(lifeTax, s.taxCap);
  }

  // 2W registration and HSRP fees are typically lower than 4W
  // Default 2W fees: registrationFee ₹300, hsrpFee ₹200 (national standard)
  const hsrpFee = vehicleCategory === 'two_wheeler'
    ? (s.hsrpFee_2w != null ? s.hsrpFee_2w : 200)
    : (s.hsrpFee || 500);
  const registrationFee = (isEV && (
    vehicleCategory === 'two_wheeler'
      ? (tw && tw.evExemption && tw.evExemption.registration)
      : (s.evExemption && s.evExemption.registration)
  ))
    ? 0
    : (vehicleCategory === 'two_wheeler'
      ? (s.registrationFee_2w != null ? s.registrationFee_2w : 300)
      : (s.registrationFee || 600));

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
