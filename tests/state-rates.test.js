// Test suite for the RTO road tax + stamp duty calculators (state-rates.js)
// Run: node tests/state-rates.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

global.window = {};
eval(fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'js', 'state-rates.js'), 'utf8'));

let passed = 0;
let failed = 0;
const failures = [];

function check(name, actual, expected) {
  if (actual === expected) {
    passed++;
  } else {
    failed++;
    failures.push(`${name}: expected ${expected}, got ${actual}`);
  }
}

function tax(state, vtype, fuel, price, cc, seats) {
  const r = calcRTO(state, vtype, fuel, price, cc, false, 0, seats || 5);
  return r ? r.lifeTax : NaN;
}

function regFee(state, vtype, fuel, price) {
  const r = calcRTO(state, vtype, fuel, price);
  return r ? r.registrationFee : NaN;
}

function stamp(state, propertyValue, gender, location, isFirstTime) {
  const r = calcStampDuty(state, propertyValue, gender || 'male', location, isFirstTime);
  return r ? r.totalCharges : NaN;
}

function stampField(state, field, propertyValue, gender, location, isFirstTime) {
  const r = calcStampDuty(state, propertyValue, gender || 'male', location, isFirstTime);
  return r ? r[field] : NaN;
}

// ---------- 4-WHEELERS ----------
check('AP car 8L', tax('andhrapradesh', 'car', 'petrol', 800000), 105600);
check('AP car 15L', tax('andhrapradesh', 'car', 'petrol', 1500000), 231000);
check('Arunachal car 5L', tax('arunachalpradesh', 'car', 'petrol', 500000), 13500);
check('Arunachal car 16L', tax('arunachalpradesh', 'car', 'petrol', 1600000), 64000);
check('Arunachal car 25L', tax('arunachalpradesh', 'car', 'petrol', 2500000), 162500);
check('Assam car 8L', tax('assam', 'car', 'petrol', 800000), 80800);
check('Assam car 2.5L', tax('assam', 'car', 'petrol', 250000), 10100);
check('Bihar car 18L', tax('bihar', 'car', 'petrol', 18000000), 2340000);
check('Bihar car 9L', tax('bihar', 'car', 'petrol', 900000), 72000);
check('Chhattisgarh car 8L', tax('chhattisgarh', 'car', 'petrol', 800000), 48000);
check('Chhattisgarh car 4L', tax('chhattisgarh', 'car', 'petrol', 400000), 20000);
check('Delhi car petrol 8L', tax('delhi', 'car', 'petrol', 800000), 56000);
check('Delhi car diesel 8L', tax('delhi', 'car', 'diesel', 800000), 70000);
check('Delhi car petrol 5L', tax('delhi', 'car', 'petrol', 500000), 20000);
check('Goa car 25L', tax('goa', 'car', 'petrol', 2500000), 375000);
check('Goa car 8L', tax('goa', 'car', 'petrol', 800000), 72000);
check('Goa car 1.5Cr cap', tax('goa', 'car', 'petrol', 15000000), 1500000);
check('Gujarat car 8L pre-GST', tax('gujarat', 'car', 'petrol', 800000), 40678);
check('Gujarat car 15L pre-GST', tax('gujarat', 'car', 'petrol', 1500000), 70313);
check('Haryana car 8L', tax('haryana', 'car', 'petrol', 800000), 64000);
check('Haryana car 5L', tax('haryana', 'car', 'petrol', 500000), 25000);
check('HP car 8L', tax('himachalpradesh', 'car', 'petrol', 800000), 48000);
check('HP car 20L', tax('himachalpradesh', 'car', 'petrol', 2000000), 140000);
check('Jharkhand car 8L', tax('jharkhand', 'car', 'petrol', 800000), 48000);
check('Jharkhand car 20L marginal', tax('jharkhand', 'car', 'petrol', 2000000), 165000);
check('Jharkhand car 15L boundary', tax('jharkhand', 'car', 'petrol', 1500000), 90000);
check('Karnataka car 8L', tax('karnataka', 'car', 'petrol', 800000), 125320);
check('Kerala car 8L', tax('kerala', 'car', 'petrol', 800000), 104000);
check('Kerala car 25L', tax('kerala', 'car', 'petrol', 2500000), 550000);
check('MP car petrol 8L', tax('madhyapradesh', 'car', 'petrol', 800000), 64000);
check('MP car diesel 8L', tax('madhyapradesh', 'car', 'diesel', 800000), 80000);
check('Maharashtra car petrol 8L', tax('maharashtra', 'car', 'petrol', 800000), 89760);
check('Maharashtra car diesel 8L', tax('maharashtra', 'car', 'diesel', 800000), 106080);
check('Maharashtra car petrol 25L', tax('maharashtra', 'car', 'petrol', 2500000), 331500);
check('Manipur car 12L', tax('manipur', 'car', 'petrol', 1200000), 108000);
check('Manipur car 8L', tax('manipur', 'car', 'petrol', 800000), 64000);
check('Meghalaya car 8L', tax('meghalaya', 'car', 'petrol', 800000), 48000);
check('Meghalaya car 2.5L', tax('meghalaya', 'car', 'petrol', 250000), 10000);
check('Mizoram car 8L pre-GST', tax('mizoram', 'car', 'petrol', 800000), 40678);
check('Nagaland car diesel 8L', tax('nagaland', 'car', 'diesel', 800000), 40000);
check('Nagaland car petrol 8L', tax('nagaland', 'car', 'petrol', 800000), 40000);
check('Odisha car 8L', tax('odisha', 'car', 'petrol', 800000), 64000);
check('Odisha car 30L', tax('odisha', 'car', 'petrol', 3000000), 360000);
check('Odisha car 45L', tax('odisha', 'car', 'petrol', 4500000), 900000);
check('Punjab car 8L', tax('punjab', 'car', 'petrol', 800000), 77000);
check('Punjab car 20L', tax('punjab', 'car', 'petrol', 2000000), 241000);
check('Rajasthan car diesel 1800cc 15L', tax('rajasthan', 'car', 'diesel', 1500000, 1800), 202500);
check('Rajasthan car petrol 1000cc 15L', tax('rajasthan', 'car', 'petrol', 1500000, 1000), 151875);
check('Sikkim car 10L', tax('sikkim', 'car', 'petrol', 1000000), 10000);
check('Sikkim car 100L', tax('sikkim', 'car', 'petrol', 10000000), 400000);
check('Tamil Nadu car 8L', tax('tamilnadu', 'car', 'petrol', 800000), 104000);
check('Tamil Nadu car 3L', tax('tamilnadu', 'car', 'petrol', 300000), 36000);
check('Telangana car 15L', tax('telangana', 'car', 'petrol', 1500000), 275000);
check('Telangana car 3L', tax('telangana', 'car', 'petrol', 300000), 44000);
check('Tripura car 8L', tax('tripura', 'car', 'petrol', 800000), 6900);
check('Tripura car 2L', tax('tripura', 'car', 'petrol', 200000), 4100);
check('Tripura car 20L', tax('tripura', 'car', 'petrol', 2000000), 8250);
check('UP car 8L', tax('uttarpradesh', 'car', 'petrol', 800000), 72000);
check('UP car 15L', tax('uttarpradesh', 'car', 'petrol', 1500000), 165000);
check('Uttarakhand car 8L', tax('uttarakhand', 'car', 'petrol', 800000), 48000);
check('Uttarakhand car 12L', tax('uttarakhand', 'car', 'petrol', 1200000), 96000);
check('WB car 1491cc 8L', tax('westbengal', 'car', 'petrol', 800000, 1491), 80000);
check('WB car 600cc 4L', tax('westbengal', 'car', 'petrol', 400000, 600), 40000);
check('WB car 2000cc 6L', tax('westbengal', 'car', 'petrol', 600000, 2000), 100000);

// ---------- 2-WHEELERS ----------
check('AP 2W 80k', tax('andhrapradesh', '2w', 'petrol', 80000), 7920);
check('Arunachal 2W 1L (weight fallback)', tax('arunachalpradesh', '2w', 'petrol', 100000), 4000);
check('Assam 2W 1L', tax('assam', '2w', 'petrol', 100000), 8000);
check('Assam 2W 50k', tax('assam', '2w', 'petrol', 50000), 3000);
check('Bihar 2W 2L', tax('bihar', '2w', 'petrol', 200000), 20000);
check('Bihar 2W 50k', tax('bihar', '2w', 'petrol', 50000), 4500);
check('Chhattisgarh 2W 1L', tax('chhattisgarh', '2w', 'petrol', 100000), 4000);
check('Delhi 2W 50k', tax('delhi', '2w', 'petrol', 50000), 2000);
check('Delhi 2W 1L', tax('delhi', '2w', 'petrol', 100000), 6000);
check('Delhi 2W 2.5L', tax('delhi', '2w', 'petrol', 250000), 20000);
check('Goa 2W 1L', tax('goa', '2w', 'petrol', 100000), 9000);
check('Goa 2W 2L', tax('goa', '2w', 'petrol', 200000), 24000);
check('Goa 2W 4L', tax('goa', '2w', 'petrol', 400000), 60000);
check('Gujarat 2W 1L pre-GST', tax('gujarat', '2w', 'petrol', 100000), 5085);
check('Haryana 2W 1L', tax('haryana', '2w', 'petrol', 100000), 6000);
check('Haryana 2W 3L', tax('haryana', '2w', 'petrol', 300000), 24000);
check('HP 2W 1.2L', tax('himachalpradesh', '2w', 'petrol', 120000), 8400);
check('HP 2W 80k', tax('himachalpradesh', '2w', 'petrol', 80000), 4800);
check('Jharkhand 2W 1.2L', tax('jharkhand', '2w', 'petrol', 120000), 7200);
check('Karnataka 2W 1L', tax('karnataka', '2w', 'petrol', 100000), 13820);
check('Karnataka 2W 40k', tax('karnataka', '2w', 'petrol', 40000), 4940);
check('Kerala 2W 1.2L', tax('kerala', '2w', 'petrol', 120000), 18000);
check('Kerala 2W 80k', tax('kerala', '2w', 'petrol', 80000), 10400);
check('MP 2W 1L', tax('madhyapradesh', '2w', 'petrol', 100000), 8000);
check('Maharashtra 2W 110cc 90k', tax('maharashtra', '2w', 'petrol', 90000, 110), 10098);
check('Maharashtra 2W 99cc 10k min', tax('maharashtra', '2w', 'petrol', 10000, 99), 1530);
check('Manipur 2W 1L', tax('manipur', '2w', 'petrol', 100000), 5000);
check('Manipur 2W 3L', tax('manipur', '2w', 'petrol', 300000), 18000);
check('Meghalaya 2W 1L (weight fallback)', tax('meghalaya', '2w', 'petrol', 100000), 4000);
check('Mizoram 2W 1L pre-GST', tax('mizoram', '2w', 'petrol', 100000), 5085);
check('Nagaland 2W 1L', tax('nagaland', '2w', 'petrol', 100000), 5000);
check('Odisha 2W 1L', tax('odisha', '2w', 'petrol', 100000), 6000);
check('Odisha 2W 7L', tax('odisha', '2w', 'petrol', 700000), 56000);
check('Punjab 2W 1.2L', tax('punjab', '2w', 'petrol', 120000), 12200);
check('Rajasthan 2W 350cc 1.5L', tax('rajasthan', '2w', 'petrol', 150000, 350), 21938);
check('Rajasthan 2W 125cc 1L', tax('rajasthan', '2w', 'petrol', 100000, 125), 9000);
check('Rajasthan 2W EV 1L', tax('rajasthan', '2w', 'ev', 100000, 125), 0);
check('Sikkim 2W 1.2L', tax('sikkim', '2w', 'petrol', 120000), 4800);
check('Sikkim 2W 80k', tax('sikkim', '2w', 'petrol', 80000), 2400);
check('Tamil Nadu 2W 1.2L', tax('tamilnadu', '2w', 'petrol', 120000), 14400);
check('Tamil Nadu 2W 80k', tax('tamilnadu', '2w', 'petrol', 80000), 8000);
check('Tamil Nadu 2W EV 1L', tax('tamilnadu', '2w', 'ev', 100000), 0);
check('Telangana 2W 1.5L', tax('telangana', '2w', 'petrol', 150000), 22500);
check('Telangana 2W 40k', tax('telangana', '2w', 'petrol', 40000), 3600);
check('Tripura 2W 1L', tax('tripura', '2w', 'petrol', 100000), 4000);
check('UP 2W 1L', tax('uttarpradesh', '2w', 'petrol', 100000), 10000);
check('UP 2W 30k', tax('uttarpradesh', '2w', 'petrol', 30000), 2100);
check('Uttarakhand 2W 1L', tax('uttarakhand', '2w', 'petrol', 100000), 6000);
check('Uttarakhand 2W 2L', tax('uttarakhand', '2w', 'petrol', 200000), 12000);
check('WB 2W 100cc', tax('westbengal', '2w', 'petrol', 80000, 100), 3125);
check('WB 2W 200cc', tax('westbengal', '2w', 'petrol', 80000, 200), 4685);
check('WB 2W 300cc', tax('westbengal', '2w', 'petrol', 80000, 300), 6250);

// ---------- EV TREATMENT ----------
check('Delhi EV car 25L exempt', tax('delhi', 'car', 'ev', 2500000), 0);
check('Delhi EV car 35L full rate', tax('delhi', 'car', 'ev', 3500000), 350000);
check('Delhi EV car 35L reg waived', regFee('delhi', 'car', 'ev', 3500000), 0);
check('Haryana EV car 25L exempt', tax('haryana', 'car', 'ev', 2500000), 0);
check('Haryana EV car 35L 50% conc', tax('haryana', 'car', 'ev', 3500000), 175000);
check('Karnataka EV car 8L slabbed', tax('karnataka', 'car', 'ev', 800000), 45400);
check('Kerala EV car 8L slabbed', tax('kerala', 'car', 'ev', 800000), 24000);
check('MP EV car 8L 4%', tax('madhyapradesh', 'car', 'ev', 800000), 32000);
check('MP EV 2W 1L 4%', tax('madhyapradesh', '2w', 'ev', 100000), 4000);
check('Jharkhand EV car 20L 25% conc', tax('jharkhand', 'car', 'ev', 2000000), 123750);
check('Jharkhand EV 2W 1.2L 25% conc', tax('jharkhand', '2w', 'ev', 120000), 5400);
check('Chhattisgarh EV car 8L 25% conc', tax('chhattisgarh', 'car', 'ev', 800000), 36000);
check('Chhattisgarh EV 2W 1L 25% conc', tax('chhattisgarh', '2w', 'ev', 100000), 3000);
check('Manipur EV car 12L 20% conc', tax('manipur', 'car', 'ev', 1200000), 86400);
check('Manipur EV 2W 1L 30% conc', tax('manipur', '2w', 'ev', 100000), 3500);
check('Tripura EV car 8L 25% conc', tax('tripura', 'car', 'ev', 800000), 5175);
check('Gujarat EV car 1L 1% pre-GST', tax('gujarat', 'car', 'ev', 100000), 847);
check('Gujarat EV 2W 1L 1% pre-GST', tax('gujarat', '2w', 'ev', 100000), 847);
check('Kerala EV 2W 1.2L 5%', tax('kerala', '2w', 'ev', 120000), 6000);
check('Sikkim EV car 10L 1%', tax('sikkim', 'car', 'ev', 1000000), 10000);
check('Sikkim EV 2W 1.2L 1%', tax('sikkim', '2w', 'ev', 120000), 1200);
check('Odisha EV 2W reg waived', regFee('odisha', '2w', 'ev', 700000), 0);
check('Punjab EV car reg waived', regFee('punjab', 'car', 'ev', 2000000), 0);
check('AP EV car reg waived', regFee('andhrapradesh', 'car', 'ev', 800000), 0);
check('Bihar EV car reg waived', regFee('bihar', 'car', 'ev', 1800000), 0);
check('WB EV car reg waived', regFee('westbengal', 'car', 'ev', 800000), 0);
check('Meghalaya EV car reg waived', regFee('meghalaya', 'car', 'ev', 800000), 0);
check('Delhi EV 2W reg waived', regFee('delhi', '2w', 'ev', 120000), 0);
check('Nagaland EV car pays 5%', tax('nagaland', 'car', 'ev', 800000), 40000);

// ---------- STAMP DUTY: GENDER-FLAT RATES ----------
check('AP stamp male 50L (5% + 1% + 1.5% TD)', stamp('andhrapradesh', 5000000), 375000);
check('AP stamp female 50L (no gender split)', stamp('andhrapradesh', 5000000, 'female'), 375000);
check('Arunachal stamp 50L (6% + 1%)', stamp('arunachalpradesh', 5000000), 350000);
check('Assam stamp male 50L (6% + 8.5%)', stamp('assam', 5000000), 725000);
check('Assam stamp female 50L (5% + 8.5%)', stamp('assam', 5000000, 'female'), 675000);
check('Assam stamp joint_mf 50L (5.5% + 8.5%)', stamp('assam', 5000000, 'joint_mf'), 700000);
check('Assam stamp male 5L (8.5% reg applies below min)', stamp('assam', 500000), 72500);
check('Bihar stamp 50L (6% + 2%)', stamp('bihar', 5000000), 400000);
check('Chhattisgarh stamp male 50L (5% + 4%)', stamp('chhattisgarh', 5000000), 450000);
check('Chhattisgarh stamp female 50L (4% + 4%)', stamp('chhattisgarh', 5000000, 'female'), 400000);
check('Gujarat stamp 50L (4.9% + 1%)', stamp('gujarat', 5000000), 295000);
check('Haryana stamp urban male 50L (7% + 1%)', stamp('haryana', 5000000, 'male', 'urban'), 400000);
check('Haryana stamp urban female 50L (5% + 1%)', stamp('haryana', 5000000, 'female', 'urban'), 300000);
check('Haryana stamp rural male 50L (5% + 1%)', stamp('haryana', 5000000, 'male', 'rural'), 300000);
check('Jharkhand stamp 50L (4% + 3%)', stamp('jharkhand', 5000000), 350000);
check('Kerala stamp 50L (8% + 2%)', stamp('kerala', 5000000), 500000);
check('MP stamp 50L (7.5% + 3%)', stamp('madhyapradesh', 5000000), 525000);
check('Maharashtra stamp male 50L (5% + 1% metro of value + 1% reg capped)', stamp('maharashtra', 5000000), 330000);
check('Maharashtra stamp female 50L (4% + 1% metro + 1% reg capped)', stamp('maharashtra', 5000000, 'female'), 280000);
check('Maharashtra stamp joint_mf 50L (4.5% + 1% metro + reg capped)', stamp('maharashtra', 5000000, 'joint_mf'), 305000);
check('Manipur stamp 50L (7% + 3% reg)', stamp('manipur', 5000000), 500000);
check('Meghalaya stamp male 50L (10% + 1%)', stamp('meghalaya', 5000000), 550000);
check('Meghalaya stamp female 50L (8% + 1%)', stamp('meghalaya', 5000000, 'female'), 450000);
check('Meghalaya stamp joint_mf 50L (9% + 1%)', stamp('meghalaya', 5000000, 'joint_mf'), 500000);
check('Mizoram stamp 50L (3% + 1%)', stamp('mizoram', 5000000), 200000);
check('Nagaland stamp 50L (8.25% + 1%)', stamp('nagaland', 5000000), 462500);
check('Odisha stamp male 50L (5% + 2%)', stamp('odisha', 5000000), 350000);
check('Odisha stamp female 50L (4% + 2%)', stamp('odisha', 5000000, 'female'), 300000);
check('Odisha stamp joint_ff 50L (4% + 2%)', stamp('odisha', 5000000, 'joint_ff'), 300000);
check('Punjab stamp male 50L (7% + 1%)', stamp('punjab', 5000000), 400000);
check('Punjab stamp female 50L (5% + 1%)', stamp('punjab', 5000000, 'female'), 300000);
check('Punjab stamp joint_mf 50L (6% + 1%)', stamp('punjab', 5000000, 'joint_mf'), 350000);
check('Rajasthan stamp male 50L (6% + 1%)', stamp('rajasthan', 5000000), 350000);
check('Rajasthan stamp female 50L (5% + 1%)', stamp('rajasthan', 5000000, 'female'), 300000);
check('Sikkim stamp 50L (1% + 5%)', stamp('sikkim', 5000000), 300000);
check('TN stamp male 50L (7% + 4%)', stamp('tamilnadu', 5000000), 550000);
check('TN stamp female 8L (7% + 3% women reg)', stamp('tamilnadu', 800000, 'female'), 80000);
check('TN stamp female 20L (7% + 4%, women reg only <=10L)', stamp('tamilnadu', 2000000, 'female'), 220000);
check('Tripura stamp 50L (5% + 1%)', stamp('tripura', 5000000), 300000);
check('UP stamp male 50L (7% + 1%)', stamp('uttarpradesh', 5000000), 400000);
check('UP stamp female 50L (6% + 1%)', stamp('uttarpradesh', 5000000, 'female'), 350000);
check('UP stamp joint_mf 50L (6.5% + 1%)', stamp('uttarpradesh', 5000000, 'joint_mf'), 375000);

// ---------- STAMP DUTY: DELHI REBATES ----------
check('Delhi stamp male 50L (6% + 1%)', stamp('delhi', 5000000), 350000);
check('Delhi stamp female 50L (4% + 1%)', stamp('delhi', 5000000, 'female'), 250000);
check('Delhi stamp joint_mf 50L (5% + 1%)', stamp('delhi', 5000000, 'joint_mf'), 300000);
check('Delhi stamp female first-time 30L (3% rebate)', stamp('delhi', 3000000, 'female', 'urban', true), 120000);
check('Delhi stamp female first-time 30L rate 3', stampField('delhi', 'stampDutyRate', 3000000, 'female', 'urban', true), 3);
check('Delhi stamp male first-time 30L (no rebate)', stamp('delhi', 3000000, 'male', 'urban', true), 210000);

// ---------- STAMP DUTY: VALUE SLABS ----------
check('Goa stamp 40L (3% + 3%)', stamp('goa', 4000000), 240000);
check('Goa stamp 50L boundary (3% + 3%)', stamp('goa', 5000000), 300000);
check('Goa stamp 60L (4% + 3%)', stamp('goa', 6000000), 420000);
check('Goa stamp 90L (4.5% + 3%)', stamp('goa', 9000000), 675000);
check('Goa stamp 2Cr (5% + 3%)', stamp('goa', 20000000), 1600000);
check('Goa stamp 6Cr (6% + 3%)', stamp('goa', 60000000), 5400000);
check('Goa stamp 6Cr effective rate 9%', stampField('goa', 'effectiveRate', 60000000), 9);
check('Karnataka stamp 15L (2% + 2% + 12% cess)', stamp('karnataka', 1500000), 63600);
check('Karnataka stamp 20L boundary (2% slab)', stamp('karnataka', 2000000), 84800);
check('Karnataka stamp 40L (3% + 2% + 12% cess)', stamp('karnataka', 4000000), 214400);
check('Karnataka stamp 45L boundary (3% slab)', stamp('karnataka', 4500000), 241200);
check('Karnataka stamp urban 50L (5% + 2% + 12% cess)', stamp('karnataka', 5000000, 'male', 'urban'), 380000);
check('Karnataka stamp rural 50L (5% + 2% + 13% cess)', stamp('karnataka', 5000000, 'male', 'rural'), 382500);
check('Karnataka stamp urban 50L rate 5', stampField('karnataka', 'stampDutyRate', 5000000, 'male', 'urban'), 5);
check('Karnataka stamp urban 50L cess 30000', stampField('karnataka', 'cessAmount', 5000000, 'male', 'urban'), 30000);
check('Karnataka stamp rural 50L cess 32500', stampField('karnataka', 'cessAmount', 5000000, 'male', 'rural'), 32500);
check('WB stamp urban 90L (4% + 1%)', stamp('westbengal', 9000000, 'male', 'urban'), 450000);
check('WB stamp urban 1Cr boundary (4%, no addl duty)', stamp('westbengal', 10000000, 'male', 'urban'), 500000);
check('WB stamp urban 1.5Cr (5% + 1% + 1% addl)', stamp('westbengal', 15000000, 'male', 'urban'), 1050000);
check('WB stamp urban 1.5Cr addl duty 150000', stampField('westbengal', 'cessAmount', 15000000, 'male', 'urban'), 150000);
check('WB stamp rural 90L (3% + 1%)', stamp('westbengal', 9000000, 'male', 'rural'), 360000);
check('WB stamp rural 1.1Cr (4% + 1% + 1% addl)', stamp('westbengal', 11000000, 'male', 'rural'), 660000);

// ---------- STAMP DUTY: GENDER SLABS (HP/UK) ----------
check('HP stamp male 40L (6% + 2% reg capped)', stamp('himachalpradesh', 4000000), 265000);
check('HP stamp male 50L boundary (6%)', stamp('himachalpradesh', 5000000), 325000);
check('HP stamp male 50L+1 (8%)', stamp('himachalpradesh', 5000001), 425000);
check('HP stamp male 60L (8% + reg capped 25k)', stamp('himachalpradesh', 6000000), 505000);
check('HP stamp female 70L (4% + reg capped)', stamp('himachalpradesh', 7000000, 'female'), 305000);
check('HP stamp female 80L boundary (4%)', stamp('himachalpradesh', 8000000, 'female'), 345000);
check('HP stamp female 90L (8%)', stamp('himachalpradesh', 9000000, 'female'), 745000);
check('HP stamp joint_mf 40L (6%)', stamp('himachalpradesh', 4000000, 'joint_mf'), 265000);
check('UK stamp male 20L (5% + 2%)', stamp('uttarakhand', 2000000), 140000);
check('UK stamp male 30L (5% + reg capped 50k)', stamp('uttarakhand', 3000000), 200000);
check('UK stamp male 30L reg amount 50000', stampField('uttarakhand', 'registrationAmount', 3000000, 'male'), 50000);
check('UK stamp female 20L (3.75% + 2%)', stamp('uttarakhand', 2000000, 'female'), 115000);
check('UK stamp female 25L boundary (3.75%)', stamp('uttarakhand', 2500000, 'female'), 143750);
check('UK stamp female 30L (5%)', stamp('uttarakhand', 3000000, 'female'), 200000);
check('UK stamp joint_mf 25L (4.37%)', stamp('uttarakhand', 2500000, 'joint_mf'), 159250);
check('UK stamp joint_mf 30L (5%)', stamp('uttarakhand', 3000000, 'joint_mf'), 200000);
check('UK stamp joint_mm 30L (5%)', stamp('uttarakhand', 3000000, 'joint_mm'), 200000);

// ---------- STAMP DUTY: LOCATION RATES (TG) ----------
check('TG stamp urban 50L (5.5% + 0.5% + 1.5% TD)', stamp('telangana', 5000000, 'male', 'urban'), 375000);
check('TG stamp rural 50L (5.5% + 2%, no TD)', stamp('telangana', 5000000, 'male', 'rural'), 375000);
check('TG stamp urban 50L TD 75000', stampField('telangana', 'transferDutyAmount', 5000000, 'male', 'urban'), 75000);
check('TG stamp rural 50L TD 0', stampField('telangana', 'transferDutyAmount', 5000000, 'male', 'rural'), 0);

// ---------- STAMP DUTY: FIELD CHECKS ----------
check('TN stamp female 8L reg amount 24000', stampField('tamilnadu', 'registrationAmount', 800000, 'female'), 24000);
check('Maharashtra stamp male 50L reg capped 30000', stampField('maharashtra', 'registrationAmount', 5000000, 'male'), 30000);
check('Maharashtra stamp male 50L base rate 5', stampField('maharashtra', 'stampDutyRate', 5000000, 'male'), 5);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('\nFailures:');
  for (const f of failures) console.log('  - ' + f);
  process.exit(1);
}
