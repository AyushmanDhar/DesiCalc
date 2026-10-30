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

function stamp(state, propertyValue, gender, location, isFirstTime, sellerGender, isFirstSaleFlat) {
  const r = calcStampDuty(state, propertyValue, gender || 'male', location, isFirstTime, sellerGender, isFirstSaleFlat);
  return r ? r.totalCharges : NaN;
}

function stampField(state, field, propertyValue, gender, location, isFirstTime, sellerGender, isFirstSaleFlat) {
  const r = calcStampDuty(state, propertyValue, gender || 'male', location, isFirstTime, sellerGender, isFirstSaleFlat);
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
check('Bihar car 9L', tax('bihar', 'car', 'petrol', 900000), 99000);
check('Chhattisgarh car 8L', tax('chhattisgarh', 'car', 'petrol', 800000), 48000);
check('Chhattisgarh car 4L', tax('chhattisgarh', 'car', 'petrol', 400000), 20000);
check('Delhi car petrol 8L', tax('delhi', 'car', 'petrol', 800000), 56000);
check('Delhi car diesel 8L', tax('delhi', 'car', 'diesel', 800000), 70000);
check('Delhi car petrol 5L', tax('delhi', 'car', 'petrol', 500000), 20000);
check('Goa car 25L with infra cess', tax('goa', 'car', 'petrol', 2500000), 425000);
check('Goa car 8L', tax('goa', 'car', 'petrol', 800000), 72000);
check('Goa car 1.5Cr cap', tax('goa', 'car', 'petrol', 15000000), 1500000);
check('Gujarat car 8L pre-GST 18%', tax('gujarat', 'car', 'petrol', 800000, 1200), 40678);
check('Gujarat car 15L pre-GST 18%', tax('gujarat', 'car', 'petrol', 1500000, 1500), 76271);
check('Haryana car 8L', tax('haryana', 'car', 'petrol', 800000), 64000);
check('Haryana car 5L', tax('haryana', 'car', 'petrol', 500000), 25000);
check('HP car 8L', tax('himachalpradesh', 'car', 'petrol', 800000), 48000);
check('HP car 20L', tax('himachalpradesh', 'car', 'petrol', 2000000), 140000);
check('Jharkhand car 8L 9%', tax('jharkhand', 'car', 'petrol', 800000), 72000);
check('Jharkhand car 20L 9% + 3%', tax('jharkhand', 'car', 'petrol', 2000000), 240000);
check('Jharkhand car 15L boundary 9%', tax('jharkhand', 'car', 'petrol', 1500000), 135000);
check('Karnataka car 8L', tax('karnataka', 'car', 'petrol', 800000), 125320);
check('Kerala car 8L', tax('kerala', 'car', 'petrol', 800000), 104000);
check('Kerala car 25L', tax('kerala', 'car', 'petrol', 2500000), 550000);
check('MP car petrol 8L', tax('madhyapradesh', 'car', 'petrol', 800000), 64000);
check('MP car diesel 8L', tax('madhyapradesh', 'car', 'diesel', 800000), 80000);
check('Maharashtra car petrol 8L', tax('maharashtra', 'car', 'petrol', 800000), 89760);
check('Maharashtra car diesel 8L', tax('maharashtra', 'car', 'diesel', 800000), 106080);
check('Maharashtra car petrol 25L', tax('maharashtra', 'car', 'petrol', 2500000), 331500);
check('Manipur car 12L', tax('manipur', 'car', 'petrol', 1200000), 91525);
check('Manipur car 8L', tax('manipur', 'car', 'petrol', 800000), 54237);
check('Meghalaya car 8L', tax('meghalaya', 'car', 'petrol', 800000), 48000);
check('Meghalaya car 2.5L', tax('meghalaya', 'car', 'petrol', 250000), 10000);
check('Mizoram car 8L pre-GST 18%', tax('mizoram', 'car', 'petrol', 800000, 1200), 40678);
check('Nagaland car diesel 8L', tax('nagaland', 'car', 'diesel', 800000), 40678);
check('Nagaland car petrol 8L', tax('nagaland', 'car', 'petrol', 800000), 40678);
check('Odisha car 8L', tax('odisha', 'car', 'petrol', 800000), 64000);
check('Odisha car 30L', tax('odisha', 'car', 'petrol', 3000000), 360000);
check('Odisha car 45L', tax('odisha', 'car', 'petrol', 4500000), 900000);
check('Punjab car 8L', tax('punjab', 'car', 'petrol', 800000), 77000);
check('Punjab car 20L', tax('punjab', 'car', 'petrol', 2000000), 241000);
check('Rajasthan car diesel 1800cc 15L', tax('rajasthan', 'car', 'diesel', 1500000, 1800), 202500);
check('Rajasthan car petrol 1000cc 15L', tax('rajasthan', 'car', 'petrol', 1500000, 1000), 151875);
check('Sikkim car 10L', tax('sikkim', 'car', 'petrol', 1000000), 30000);
check('Sikkim car 100L', tax('sikkim', 'car', 'petrol', 10000000), 600000);
check('Tamil Nadu car 8L + road safety', tax('tamilnadu', 'car', 'petrol', 800000), 106250);
check('Tamil Nadu car 3L + road safety', tax('tamilnadu', 'car', 'petrol', 300000), 38250);
check('Telangana car 15L', tax('telangana', 'car', 'petrol', 1500000), 275000);
check('Telangana car 3L', tax('telangana', 'car', 'petrol', 300000), 44000);
check('Tripura car 8L 7%', tax('tripura', 'car', 'petrol', 800000), 56000);
check('Tripura car 2L 6%', tax('tripura', 'car', 'petrol', 200000), 12000);
check('Tripura car 20L 8%', tax('tripura', 'car', 'petrol', 2000000), 160000);
check('UP car 8L', tax('uttarpradesh', 'car', 'petrol', 800000), 72000);
check('UP car 15L', tax('uttarpradesh', 'car', 'petrol', 1500000), 165000);
check('Uttarakhand car 8L petrol + green cess', tax('uttarakhand', 'car', 'petrol', 800000), 73500);
check('Uttarakhand car 12L petrol + green cess', tax('uttarakhand', 'car', 'petrol', 1200000), 121500);
check('WB car 1491cc 8L', tax('westbengal', 'car', 'petrol', 800000, 1491), 80000);
check('WB car 600cc 4L', tax('westbengal', 'car', 'petrol', 400000, 600), 40000);
check('WB car 2000cc 6L', tax('westbengal', 'car', 'petrol', 600000, 2000), 80000);

// ---------- 2-WHEELERS ----------
check('AP 2W 80k', tax('andhrapradesh', '2w', 'petrol', 80000), 7920);
check('Arunachal 2W 1L (weight fallback)', tax('arunachalpradesh', '2w', 'petrol', 100000), 4000);
check('Assam 2W 1L', tax('assam', '2w', 'petrol', 100000), 8000);
check('Assam 2W 50k', tax('assam', '2w', 'petrol', 50000), 3000);
check('Bihar 2W 2L + 1% cess', tax('bihar', '2w', 'petrol', 200000), 22000);
check('Bihar 2W 50k + 1% cess', tax('bihar', '2w', 'petrol', 50000), 5000);
check('Chhattisgarh 2W 1L', tax('chhattisgarh', '2w', 'petrol', 100000), 4000);
check('Delhi 2W 50k', tax('delhi', '2w', 'petrol', 50000), 3000);
check('Delhi 2W 1L', tax('delhi', '2w', 'petrol', 100000), 8000);
check('Delhi 2W 2.5L', tax('delhi', '2w', 'petrol', 250000), 20000);
check('Goa 2W 1L', tax('goa', '2w', 'petrol', 100000), 9000);
check('Goa 2W 2L', tax('goa', '2w', 'petrol', 200000), 24000);
check('Goa 2W 4L', tax('goa', '2w', 'petrol', 400000), 60000);
check('Gujarat 2W 1L pre-GST', tax('gujarat', '2w', 'petrol', 100000), 5085);
check('Haryana 2W 1L', tax('haryana', '2w', 'petrol', 100000), 6000);
check('Haryana 2W 3L', tax('haryana', '2w', 'petrol', 300000), 24000);
check('HP 2W 1.2L', tax('himachalpradesh', '2w', 'petrol', 120000), 8400);
check('HP 2W 80k', tax('himachalpradesh', '2w', 'petrol', 80000), 4800);
check('Jharkhand 2W 1.2L 9%', tax('jharkhand', '2w', 'petrol', 120000), 10800);
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
check('Nagaland 2W 1L', tax('nagaland', '2w', 'petrol', 100000), 6000);
check('Odisha 2W 1L', tax('odisha', '2w', 'petrol', 100000), 6000);
check('Odisha 2W 7L', tax('odisha', '2w', 'petrol', 700000), 56000);
check('Punjab 2W 1.2L', tax('punjab', '2w', 'petrol', 120000), 12200);
check('Rajasthan 2W 350cc 1.5L', tax('rajasthan', '2w', 'petrol', 150000, 350), 19500);
check('Rajasthan 2W 125cc 1L', tax('rajasthan', '2w', 'petrol', 100000, 125), 8000);
check('Rajasthan 2W EV 1L', tax('rajasthan', '2w', 'ev', 100000, 125), 0);
check('Sikkim 2W 1.2L', tax('sikkim', '2w', 'petrol', 120000), 1200);
check('Sikkim 2W 80k', tax('sikkim', '2w', 'petrol', 80000), 800);
check('Tamil Nadu 2W 1.2L + road safety', tax('tamilnadu', '2w', 'petrol', 120000), 14775);
check('Tamil Nadu 2W 80k + road safety', tax('tamilnadu', '2w', 'petrol', 80000), 8375);
check('Tamil Nadu 2W EV 1L + road safety', tax('tamilnadu', '2w', 'ev', 100000), 375);
check('Telangana 2W 1.5L', tax('telangana', '2w', 'petrol', 150000), 24500);
check('Telangana 2W 40k', tax('telangana', '2w', 'petrol', 40000), 5600);
check('Tripura 2W 1L 5%', tax('tripura', '2w', 'petrol', 100000), 5000);
check('UP 2W 1L', tax('uttarpradesh', '2w', 'petrol', 100000), 10000);
check('UP 2W 30k', tax('uttarpradesh', '2w', 'petrol', 30000), 2100);
check('Uttarakhand 2W 1L + green cess', tax('uttarakhand', '2w', 'petrol', 100000), 8500);
check('Uttarakhand 2W 2L + green cess', tax('uttarakhand', '2w', 'petrol', 200000), 18500);
check('Uttarakhand EV 2W no green cess', tax('uttarakhand', '2w', 'ev', 200000), 18000);
check('Uttarakhand 2W green cess 500', calcRTO('uttarakhand', '2w', 'petrol', 200000).cessTotal, 500);
check('WB 2W 100cc', tax('westbengal', '2w', 'petrol', 80000, 100), 3125);
check('WB 2W 200cc', tax('westbengal', '2w', 'petrol', 80000, 200), 4685);
check('WB 2W 300cc', tax('westbengal', '2w', 'petrol', 80000, 300), 6250);

// ---------- EV TREATMENT ----------
check('Delhi EV car 25L exempt', tax('delhi', 'car', 'ev', 2500000), 0);
check('Delhi EV car 35L full rate', tax('delhi', 'car', 'ev', 3500000), 350000);
check('Delhi EV car 35L reg not waived', regFee('delhi', 'car', 'ev', 3500000), 600);
check('Haryana EV car 25L exempt', tax('haryana', 'car', 'ev', 2500000), 0);
check('Haryana EV car 35L 50% conc', tax('haryana', 'car', 'ev', 3500000), 175000);
check('Karnataka EV car 8L slabbed', tax('karnataka', 'car', 'ev', 800000), 45400);
check('Kerala EV car 8L slabbed', tax('kerala', 'car', 'ev', 800000), 24000);
check('Assam EV car 8L standard 10% + 1% cess', tax('assam', 'car', 'ev', 800000), 80800);
check('MP EV car 8L 4%', tax('madhyapradesh', 'car', 'ev', 800000), 32000);
check('MP EV 2W 1L 4%', tax('madhyapradesh', '2w', 'ev', 100000), 4000);
check('Jharkhand EV car 20L 25% conc', tax('jharkhand', 'car', 'ev', 2000000), 195000);
check('Jharkhand EV 2W 1.2L 25% conc', tax('jharkhand', '2w', 'ev', 120000), 8100);
check('Chhattisgarh EV car 8L 25% conc', tax('chhattisgarh', 'car', 'ev', 800000), 36000);
check('Chhattisgarh EV 2W 1L 25% conc', tax('chhattisgarh', '2w', 'ev', 100000), 3000);
check('Manipur EV car 12L 4%', tax('manipur', 'car', 'ev', 1200000), 48000);
check('Manipur EV 2W 1L 4%', tax('manipur', '2w', 'ev', 100000), 4000);
check('Tripura EV car 8L 25% conc', tax('tripura', 'car', 'ev', 800000), 42000);
check('Gujarat EV car 1L standard 6%', tax('gujarat', 'car', 'ev', 100000), 5714);
check('Gujarat EV 2W 1L standard 6%', tax('gujarat', '2w', 'ev', 100000), 5714);
check('Kerala EV 2W 1.2L 5%', tax('kerala', '2w', 'ev', 120000), 6000);
check('Sikkim EV car 10L 1%', tax('sikkim', 'car', 'ev', 1000000), 10000);
check('Sikkim EV 2W 1.2L 1%', tax('sikkim', '2w', 'ev', 120000), 1200);
check('Odisha EV 2W reg waived', regFee('odisha', '2w', 'ev', 700000), 0);
check('Punjab EV car reg waived', regFee('punjab', 'car', 'ev', 2000000), 0);
check('AP EV car reg waived', regFee('andhrapradesh', 'car', 'ev', 800000), 0);
check('Bihar EV car reg charged', regFee('bihar', 'car', 'ev', 1800000), 600);
check('WB EV car reg waived', regFee('westbengal', 'car', 'ev', 800000), 0);
check('Meghalaya EV car reg waived', regFee('meghalaya', 'car', 'ev', 800000), 0);
check('Delhi EV 2W reg waived', regFee('delhi', '2w', 'ev', 120000), 0);
check('Nagaland EV car pays 6% pre-GST', tax('nagaland', 'car', 'ev', 800000), 45714);

// ---------- RTO: OCTOBER 2026 RATE REFRESH ----------
check('Rajasthan car 2L 800cc no surcharge', tax('rajasthan', 'car', 'petrol', 200000, 800), 12000);
check('Rajasthan car 3L 800cc no surcharge', tax('rajasthan', 'car', 'petrol', 300000, 800), 18000);
check('Rajasthan 2W 3L+ surcharge', tax('rajasthan', '2w', 'petrol', 300001, 350), 43875);
check('Tripura 2W 60k 5%', tax('tripura', '2w', 'petrol', 60000), 3000);
check('Tripura 2W 1L 5%', tax('tripura', '2w', 'petrol', 100000), 5000);
check('Tripura 2W 1L+ 8%', tax('tripura', '2w', 'petrol', 100001), 8000);
check('Tripura 2W EV 1.5L 25% conc', tax('tripura', '2w', 'ev', 150000), 9000);
check('WB car 850cc 4L', tax('westbengal', 'car', 'petrol', 400000, 850), 40000);
check('WB car 901cc 4L', tax('westbengal', 'car', 'petrol', 400000, 901), 55000);
check('WB car 2001cc 6L', tax('westbengal', 'car', 'petrol', 600000, 2001), 100000);
check('Sikkim car 3L 2%', tax('sikkim', 'car', 'petrol', 300000), 6000);
check('Sikkim car 5L 3%', tax('sikkim', 'car', 'petrol', 500000), 15000);
check('Sikkim car 20L 4%', tax('sikkim', 'car', 'petrol', 2000000), 80000);
check('Sikkim car 30L 5%', tax('sikkim', 'car', 'petrol', 3000000), 150000);
check('Sikkim car 60L 6%', tax('sikkim', 'car', 'petrol', 6000000), 360000);
check('Sikkim 2W 1.5L 1%', tax('sikkim', '2w', 'petrol', 150000), 1500);
check('Sikkim 2W 3L 2%', tax('sikkim', '2w', 'petrol', 300000), 6000);
check('Sikkim 2W EV 3L 1%', tax('sikkim', '2w', 'ev', 300000), 3000);
check('Goa 2W 5L under cap', tax('goa', '2w', 'petrol', 500000), 75000);
check('Goa 2W 1Cr cap', tax('goa', '2w', 'petrol', 10000000), 150000);
check('Telangana 2W 1L + cess', tax('telangana', '2w', 'petrol', 100000), 14000);
check('Telangana 2W EV cess', tax('telangana', '2w', 'ev', 150000), 2000);
check('Manipur EV car 10L 4%', tax('manipur', 'car', 'ev', 1000000), 40000);
check('Manipur EV car 20L 4%', tax('manipur', 'car', 'ev', 2000000), 80000);
check('Manipur EV 2W 1.5L 4%', tax('manipur', '2w', 'ev', 150000), 6000);
check('Gujarat EV car 15L standard 6% at 5% GST', tax('gujarat', 'car', 'ev', 1500000), 85714);
check('Gujarat car 25L pre-GST 6% at 18% GST', tax('gujarat', 'car', 'petrol', 2500000, 2000), 127119);

// ---------- CONFIRMED CLAUDE REVIEW FIXES ----------
check('Haryana stamp no location defaults urban', stamp('haryana', 5000000, 'male'), 375200);
check('Maharashtra stamp no location defaults mumbai', stamp('maharashtra', 5000000, 'male'), 280000);
check('Delhi EV 25L reg waived under cap', regFee('delhi', 'car', 'ev', 2500000), 0);
check('Delhi EV 35L reg standard above cap', regFee('delhi', 'car', 'ev', 3500000), 600);
check('MP private car annual tax zero', calcRTO('madhyapradesh', 'car', 'petrol', 1500000).annualTax, 0);
check('MP private car lifetime model', calcRTO('madhyapradesh', 'car', 'petrol', 1500000).taxModel, 'lifetime');
check('Bihar 18L tax rate 12', calcRTO('bihar', 'car', 'petrol', 18000000).taxRate, 12);
check('Bihar 18L 1% road safety cess', calcRTO('bihar', 'car', 'petrol', 18000000).cessTotal, 180000);
check('Goa 25L infra cess 50k', calcRTO('goa', 'car', 'petrol', 2500000).cessTotal, 50000);
check('Uttarakhand 12L diesel green cess 3k', calcRTO('uttarakhand', 'car', 'diesel', 1200000).cessTotal, 3000);
check('Tamil Nadu EV 15L road safety tax', calcRTO('tamilnadu', 'car', 'ev', 1500000).cessTotal, 2250);
check('Jharkhand 20L additional 3%', calcRTO('jharkhand', 'car', 'petrol', 2000000).cessTotal, 60000);

// ---------- STAMP DUTY: GENDER-FLAT RATES ----------
check('AP stamp male 50L (5% + 1% + 1.5% TD)', stamp('andhrapradesh', 5000000), 375000);
check('AP stamp female 50L (no gender split)', stamp('andhrapradesh', 5000000, 'female'), 375000);
check('Arunachal stamp 50L (6% + 1%)', stamp('arunachalpradesh', 5000000), 350000);
check('Assam stamp male 50L (6% + 8.5%)', stamp('assam', 5000000), 725000);
check('Assam stamp female 50L (5% + 8.5%)', stamp('assam', 5000000, 'female'), 675000);
check('Assam stamp joint_mf 50L (5.5% + 8.5%)', stamp('assam', 5000000, 'joint_mf'), 700000);
check('Assam stamp male 5L (8.5% reg applies below min)', stamp('assam', 500000), 72500);
check('Bihar stamp 50L urban (7% + 2% + 2% municipal)', stamp('bihar', 5000000, 'male', 'urban'), 550000);
check('Bihar stamp 50L rural (7% + 2%)', stamp('bihar', 5000000, 'male', 'rural'), 450000);
check('Bihar stamp male to female urban', stamp('bihar', 5000000, 'female', 'urban', false, 'male'), 525000);
check('Bihar stamp male to female rural', stamp('bihar', 5000000, 'female', 'rural', false, 'male'), 425000);
check('Bihar stamp female to male urban', stamp('bihar', 5000000, 'male', 'urban', false, 'female'), 555000);
check('Bihar stamp joint urban', stamp('bihar', 5000000, 'joint_mf', 'urban'), 550000);
check('Bihar stamp rate 7', stampField('bihar', 'stampDutyRate', 5000000, 'male', 'urban'), 7);
check('Bihar stamp male to female rate 6.6', stampField('bihar', 'stampDutyRate', 5000000, 'female', 'urban', false, 'male'), 6.6);
check('Bihar stamp male to female registration 1.9', stampField('bihar', 'registrationRate', 5000000, 'female', 'urban', false, 'male'), 1.9);
check('Bihar stamp municipal transfer 2%', stampField('bihar', 'transferDutyAmount', 5000000, 'male', 'urban'), 100000);
check('Chhattisgarh stamp male 50L (5% + 4%)', stamp('chhattisgarh', 5000000), 450000);
check('Chhattisgarh stamp female 50L (4% + 2%)', stamp('chhattisgarh', 5000000, 'female'), 300000);
check('Chhattisgarh female registration 2%', stampField('chhattisgarh', 'registrationRate', 5000000, 'female'), 2);
check('Gujarat stamp 50L (4.9% + 1%)', stamp('gujarat', 5000000), 295000);
check('Gujarat stamp female 50L (4.9% + 0% reg exempt)', stamp('gujarat', 5000000, 'female'), 245000);
check('Haryana stamp urban male 50L (7% + reg slab 25000 + 200)', stamp('haryana', 5000000, 'male', 'urban'), 375200);
check('Haryana stamp urban female 50L (5% + reg slab 25000 + 200)', stamp('haryana', 5000000, 'female', 'urban'), 275200);
check('Haryana stamp rural male 50L (5% + reg slab 25000 + 200)', stamp('haryana', 5000000, 'male', 'rural'), 275200);
check('Haryana reg 75k slab 500', stampField('haryana', 'registrationAmount', 75000, 'male', 'urban'), 500);
check('Haryana reg 2L slab 1000', stampField('haryana', 'registrationAmount', 200000, 'male', 'urban'), 1000);
check('Haryana reg 20L slab 10000', stampField('haryana', 'registrationAmount', 2000000, 'male', 'urban'), 10000);
check('Haryana reg 25L slab 12500', stampField('haryana', 'registrationAmount', 2500000, 'male', 'urban'), 12500);
check('Haryana reg 30L slab 15000', stampField('haryana', 'registrationAmount', 3000000, 'male', 'urban'), 15000);
check('Haryana reg 95L slab 50000', stampField('haryana', 'registrationAmount', 9500000, 'male', 'urban'), 50000);
check('Jharkhand stamp 50L (4% + 3%)', stamp('jharkhand', 5000000), 350000);
check('Kerala stamp 50L (8% + 2%)', stamp('kerala', 5000000), 500000);
check('MP stamp 50L (7.5% + 3%)', stamp('madhyapradesh', 5000000), 525000);
check('Maharashtra stamp mumbai male 50L (5% + 1% metro of value + 1% reg capped)', stamp('maharashtra', 5000000, 'male', 'mumbai'), 330000);
check('Maharashtra stamp mumbai female 50L (4% + 1% metro + 1% reg capped)', stamp('maharashtra', 5000000, 'female', 'mumbai'), 280000);
check('Maharashtra stamp mumbai joint_mf 50L (5% + 1% metro + reg capped)', stamp('maharashtra', 5000000, 'joint_mf', 'mumbai'), 330000);
check('Maharashtra stamp pune male 50L (7% + reg capped)', stamp('maharashtra', 5000000, 'male', 'pune'), 380000);
check('Maharashtra stamp pune female 50L (6% + reg capped)', stamp('maharashtra', 5000000, 'female', 'pune'), 330000);
check('Maharashtra stamp nagpur male 50L (7%)', stamp('maharashtra', 5000000, 'male', 'nagpur'), 380000);
check('Maharashtra stamp municipal male 50L (5% + reg capped)', stamp('maharashtra', 5000000, 'male', 'municipal'), 280000);
check('Maharashtra stamp municipal female 50L (4% + reg capped)', stamp('maharashtra', 5000000, 'female', 'municipal'), 230000);
check('Maharashtra stamp grampanchayat male 50L (4% + reg capped)', stamp('maharashtra', 5000000, 'male', 'grampanchayat'), 230000);
check('Maharashtra stamp grampanchayat female 50L (3% + reg capped)', stamp('maharashtra', 5000000, 'female', 'grampanchayat'), 180000);
check('Manipur stamp 50L (7% + 3% reg capped 25k)', stamp('manipur', 5000000), 375000);
check('Meghalaya stamp male 50L (9.9% + 1.5%)', stamp('meghalaya', 5000000), 570000);
check('Meghalaya stamp female 50L (9.9% + 1.5%)', stamp('meghalaya', 5000000, 'female'), 570000);
check('Meghalaya stamp joint_mf 50L (9.9% + 1.5%)', stamp('meghalaya', 5000000, 'joint_mf'), 570000);
check('Mizoram stamp 50L (3% + 0.5% reg)', stamp('mizoram', 5000000), 175000);
check('Nagaland stamp 50L (8.25% + 1%)', stamp('nagaland', 5000000), 462500);
check('Odisha stamp male 50L (5% + 2%)', stamp('odisha', 5000000), 350000);
check('Odisha stamp female 50L (4% + 2%)', stamp('odisha', 5000000, 'female'), 300000);
check('Odisha stamp joint_ff 50L (4% + 2%)', stamp('odisha', 5000000, 'joint_ff'), 300000);
check('Punjab stamp male 50L (7% + 1%)', stamp('punjab', 5000000), 400000);
check('Punjab stamp female 50L (5% + 1%)', stamp('punjab', 5000000, 'female'), 300000);
check('Punjab stamp joint_mf 50L (6% + 1%)', stamp('punjab', 5000000, 'joint_mf'), 350000);
check('Punjab stamp male 5Cr (reg capped 2L)', stamp('punjab', 50000000), 3700000);
check('Rajasthan stamp male 50L (6% + 33% surcharge + 1% + 500)', stamp('rajasthan', 5000000), 449500);
check('Rajasthan stamp female 50L (5% + 33% surcharge + 1% + 500)', stamp('rajasthan', 5000000, 'female'), 383000);
check('Rajasthan stamp joint_mf 50L (5.5% + 33% + 1% + 500)', stamp('rajasthan', 5000000, 'joint_mf'), 416250);
check('Rajasthan stamp male 5L (30% surcharge)', stamp('rajasthan', 500000, 'male'), 44500);
check('Rajasthan stamp female 5L (30% surcharge)', stamp('rajasthan', 500000, 'female'), 38000);
check('Rajasthan stamp male 10L (30% surcharge)', stamp('rajasthan', 1000000, 'male'), 88500);
check('Rajasthan stamp male 10L+1 (33% surcharge)', stamp('rajasthan', 1000001, 'male'), 90300);
check('Sikkim stamp 50L urban (1% + 5%)', stamp('sikkim', 5000000), 300000);
check('Sikkim stamp 50L rural (1% + 4%)', stamp('sikkim', 5000000, 'male', 'rural'), 250000);
check('Sikkim stamp female 50L urban (1% + 4% women reg)', stamp('sikkim', 5000000, 'female'), 250000);
check('TN stamp male 50L (7% + 4%)', stamp('tamilnadu', 5000000), 550000);
check('TN stamp female 8L (7% + 3% women reg)', stamp('tamilnadu', 800000, 'female'), 80000);
check('TN stamp female 20L (7% + 4%, women reg only <=10L)', stamp('tamilnadu', 2000000, 'female'), 220000);
check('TN stamp joint_ff 8L (3% women reg)', stamp('tamilnadu', 800000, 'joint_ff'), 80000);
check('TN stamp joint_ff 8L registration 3%', stampField('tamilnadu', 'registrationRate', 800000, 'joint_ff'), 3);
check('Tripura stamp 50L (5% + 1.5% + 78 fixed)', stamp('tripura', 5000000), 325078);
check('UP stamp male 50L (7% + 1%)', stamp('uttarpradesh', 5000000), 400000);
check('UP stamp female 50L (6% + 1%)', stamp('uttarpradesh', 5000000, 'female'), 350000);
check('UP stamp joint_mf 50L (6.5% + 1%)', stamp('uttarpradesh', 5000000, 'joint_mf'), 375000);
check('UP stamp female 2Cr (6% + 1%)', stamp('uttarpradesh', 20000000, 'female'), 1400000);
check('UP stamp female 1Cr boundary (6%)', stamp('uttarpradesh', 10000000, 'female'), 700000);

// ---------- STAMP DUTY: DELHI REBATES + TRANSFER DUTY ----------
check('Delhi stamp male 50L (6% + 1% + 4% TD + 100)', stamp('delhi', 5000000), 550100);
check('Delhi stamp female 50L (4% + 1% + 3% TD + 100)', stamp('delhi', 5000000, 'female'), 400100);
check('Delhi stamp joint_mf 50L (5% + 1% + 4% TD + 100)', stamp('delhi', 5000000, 'joint_mf'), 500100);
check('Delhi stamp female first-time 30L (no rebate + TD)', stamp('delhi', 3000000, 'female', 'urban', true), 240100);
check('Delhi stamp female first-time 30L rate 4', stampField('delhi', 'stampDutyRate', 3000000, 'female', 'urban', true), 4);
check('Delhi stamp male first-time 30L (no rebate + TD)', stamp('delhi', 3000000, 'male', 'urban', true), 330100);
check('Delhi stamp male 20L TD 3%', stampField('delhi', 'transferDutyAmount', 2000000, 'male'), 60000);
check('Delhi stamp male 30L TD 4%', stampField('delhi', 'transferDutyAmount', 3000000, 'male'), 120000);
check('Delhi stamp female 20L TD 2%', stampField('delhi', 'transferDutyAmount', 2000000, 'female'), 40000);
check('Delhi stamp female 30L TD 3%', stampField('delhi', 'transferDutyAmount', 3000000, 'female'), 90000);

// ---------- STAMP DUTY: VALUE SLABS ----------
check('Goa stamp 40L (3% + 3%)', stamp('goa', 4000000), 240000);
check('Goa stamp 50L boundary (3% + 3%)', stamp('goa', 5000000), 300000);
check('Goa stamp 60L (4% + 3%)', stamp('goa', 6000000), 420000);
check('Goa stamp 90L (4.5% + 3.5%)', stamp('goa', 9000000), 720000);
check('Goa stamp 2Cr (5% + 3.5%)', stamp('goa', 20000000), 1700000);
check('Goa stamp 6Cr (6% + 3.5%)', stamp('goa', 60000000), 5700000);
check('Goa stamp 6Cr effective rate 9.5%', stampField('goa', 'effectiveRate', 60000000), 9.5);
check('Karnataka stamp 15L standard 5%', stamp('karnataka', 1500000), 114000);
check('Karnataka stamp 20L standard 5%', stamp('karnataka', 2000000), 152000);
check('Karnataka stamp 40L standard 5%', stamp('karnataka', 4000000), 304000);
check('Karnataka stamp 45L standard 5%', stamp('karnataka', 4500000), 342000);
check('Karnataka stamp urban 50L (5% + 2% + 12% cess)', stamp('karnataka', 5000000, 'male', 'urban'), 380000);
check('Karnataka stamp rural 50L (5% + 2% + 13% cess)', stamp('karnataka', 5000000, 'male', 'rural'), 382500);
check('Karnataka stamp urban 50L rate 5', stampField('karnataka', 'stampDutyRate', 5000000, 'male', 'urban'), 5);
check('Karnataka stamp urban 50L cess 30000', stampField('karnataka', 'cessAmount', 5000000, 'male', 'urban'), 30000);
check('Karnataka stamp rural 50L cess 32500', stampField('karnataka', 'cessAmount', 5000000, 'male', 'rural'), 32500);
check('Karnataka first-sale flat 15L 2%', stamp('karnataka', 1500000, 'male', 'urban', false, null, true), 63600);
check('Karnataka first-sale flat 20L 2%', stamp('karnataka', 2000000, 'male', 'urban', false, null, true), 84800);
check('Karnataka first-sale flat 40L 3%', stamp('karnataka', 4000000, 'male', 'urban', false, null, true), 214400);
check('WB stamp urban 90L (6% + 1%)', stamp('westbengal', 9000000, 'male', 'urban'), 630000);
check('WB stamp urban 1Cr boundary (6%, no addl duty)', stamp('westbengal', 10000000, 'male', 'urban'), 700000);
check('WB stamp urban 1.5Cr (7% + 1%)', stamp('westbengal', 15000000, 'male', 'urban'), 1200000);
check('WB stamp urban 1.5Cr rate 7', stampField('westbengal', 'stampDutyRate', 15000000, 'male', 'urban'), 7);
check('WB stamp rural 90L (5% + 1%)', stamp('westbengal', 9000000, 'male', 'rural'), 540000);
check('WB stamp rural 1.1Cr (6% + 1%)', stamp('westbengal', 11000000, 'male', 'rural'), 770000);

// ---------- STAMP DUTY: GENDER SLABS (HP/UK) ----------
check('HP stamp male 40L (6% + 2% no cap)', stamp('himachalpradesh', 4000000), 320000);
check('HP stamp male 50L boundary (6%)', stamp('himachalpradesh', 5000000), 400000);
check('HP stamp male 50L+1 (8%)', stamp('himachalpradesh', 5000001), 500000);
check('HP stamp male 60L (8% + 2% no cap)', stamp('himachalpradesh', 6000000), 600000);
check('HP stamp female 70L (4% + 2%)', stamp('himachalpradesh', 7000000, 'female'), 420000);
check('HP stamp female 80L boundary (4%)', stamp('himachalpradesh', 8000000, 'female'), 480000);
check('HP stamp female 90L (8%)', stamp('himachalpradesh', 9000000, 'female'), 900000);
check('HP stamp joint_mf 40L (5% lower slab)', stamp('himachalpradesh', 4000000, 'joint_mf'), 280000);
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
check('Maharashtra stamp mumbai male 50L reg capped 30000', stampField('maharashtra', 'registrationAmount', 5000000, 'male', 'mumbai'), 30000);
check('Maharashtra stamp mumbai male 50L base rate 5', stampField('maharashtra', 'stampDutyRate', 5000000, 'male', 'mumbai'), 5);
check('Maharashtra stamp pune male 50L base rate 7', stampField('maharashtra', 'stampDutyRate', 5000000, 'male', 'pune'), 7);

// ---------- AUDIT REGRESSION CHECKS ----------
check('Gujarat stamp joint_ff 50L reg 0', stampField('gujarat', 'registrationAmount', 5000000, 'joint_ff'), 0);
check('Haryana stamp urban joint_ff rate 5', stampField('haryana', 'stampDutyRate', 5000000, 'joint_ff', 'urban'), 5);
check('Haryana stamp urban joint_mm rate 7', stampField('haryana', 'stampDutyRate', 5000000, 'joint_mm', 'urban'), 7);
check('Maharashtra stamp mumbai joint_mf rate 5', stampField('maharashtra', 'stampDutyRate', 5000000, 'joint_mf', 'mumbai'), 5);
check('Rajasthan stamp spouse joint 50L rate 5.5', stampField('rajasthan', 'stampDutyRate', 5000000, 'joint_mf'), 5.5);
check('Rajasthan stamp spouse joint 60L rate 6', stampField('rajasthan', 'stampDutyRate', 6000000, 'joint_mf'), 6);
check('UP stamp rural male rate 5', stampField('uttarpradesh', 'stampDutyRate', 5000000, 'male', 'rural'), 5);
check('UP stamp reg min 100', stampField('uttarpradesh', 'registrationAmount', 1000, 'male', 'urban'), 100);
check('WB stamp reg min 50', stampField('westbengal', 'registrationAmount', 1000, 'male', 'urban'), 50);
check('Bihar EV car 9L 75% rebate + cess', tax('bihar', 'car', 'ev', 900000), 31500);
check('Chhattisgarh EV car reg 0', regFee('chhattisgarh', 'car', 'ev', 1000000), 0);
check('Delhi 2W 50k 6%', tax('delhi', '2w', 'petrol', 50000), 3000);
check('Uttarakhand car 8L 9% + cess', tax('uttarakhand', 'car', 'petrol', 800000), 73500);
check('Uttarakhand 2W 1L 8% + cess', tax('uttarakhand', '2w', 'petrol', 100000), 8500);
check('Meghalaya 2W EV tax 0', tax('meghalaya', '2w', 'ev', 100000), 0);
check('Meghalaya 2W EV reg 0', regFee('meghalaya', '2w', 'ev', 100000), 0);
check('MP EV car 4%', tax('madhyapradesh', 'car', 'ev', 1000000), 40000);
check('MP EV 2W 4%', tax('madhyapradesh', '2w', 'ev', 100000), 4000);
check('HP EV car full exemption', tax('himachalpradesh', 'car', 'ev', 2000000), 0);
check('Haryana 2W EV 35L pays 50%', tax('haryana', '2w', 'ev', 3500000), 140000);
check('Sikkim RC holder reg 8%', calcStampDuty('sikkim', 5000000, 'male', 'urban', false, null, false, 'rc').registrationAmount, 400000);
check('UP non-AC car 10L 8%', calcRTO('uttarpradesh', 'car', 'petrol', 1000000, 1500, false, 0, 5, undefined, false).lifeTax, 80000);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('\nFailures:');
  for (const f of failures) console.log('  - ' + f);
  process.exit(1);
}




