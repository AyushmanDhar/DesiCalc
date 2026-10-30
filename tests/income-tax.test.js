const assert = require('assert');
const fs = require('fs');
const path = require('path');

eval(fs.readFileSync(path.join(__dirname, '..', 'public', 'assets', 'js', 'slabs-2026.js'), 'utf8'));

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

function tax(inputs) {
  return calcIncomeTax(inputs).totalTax;
}

check('new other income 12L', tax({ regime: 'new', incomeOther: 1200000 }), 0);
check('new other income 12.1L', tax({ regime: 'new', incomeOther: 1210000 }), 10400);
check('new other income 12.5L', tax({ regime: 'new', incomeOther: 1250000 }), 52000);
check('new other income 13L', tax({ regime: 'new', incomeOther: 1300000 }), 78000);
check('new salary 12.75L', tax({ regime: 'new', incomeSalary: 1275000 }), 0);
check('new salary 12.75L + 1', tax({ regime: 'new', incomeSalary: 1275001 }), 1);
check('old salary 5.5L', tax({ regime: 'old', incomeSalary: 550000 }), 0);
check('old salary 5.5L + 1', tax({ regime: 'old', incomeSalary: 550001 }), 13000);
check('new salary 60L', tax({ regime: 'new', incomeSalary: 6000000 }), 1552980);
check('old salary 60L', tax({ regime: 'old', incomeSalary: 6000000 }), 1827540);
check('new salary 50.75L + 1', tax({ regime: 'new', incomeSalary: 5075001 }), 1123201);
check('new salary 5L + STCG 5L', tax({ regime: 'new', incomeSalary: 500000, capitalGainsSTCG: 500000 }), 104000);
check('new salary 10L + LTCG 5L', tax({ regime: 'new', incomeSalary: 1000000, capitalGainsLTCG: 500000 }), 48750);
check('new salary 5L + LTCG 2.25L', tax({ regime: 'new', incomeSalary: 500000, capitalGainsLTCG: 225000 }), 13000);
check('new salary 5L + STCG 3Cr surcharge cap', tax({ regime: 'new', incomeSalary: 500000, capitalGainsSTCG: 30000000 }), 7176000);
check('old salary 5L + STCG 3Cr surcharge cap', tax({ regime: 'old', incomeSalary: 500000, capitalGainsSTCG: 30000000 }), 7189000);
check('old NPS capped at 10%', tax({ regime: 'old', incomeSalary: 2000000, employerNps: 200000, employerNpsBasicDA: 1000000 }), 382200);
check('new NPS capped at 14%', tax({ regime: 'new', incomeSalary: 2000000, employerNps: 200000, employerNpsBasicDA: 1000000 }), 163280);
check('new only LTCG 2.25L', tax({ regime: 'new', capitalGainsLTCG: 225000 }), 0);
check('new only STCG 4L', tax({ regime: 'new', capitalGainsSTCG: 400000 }), 0);
check('old only STCG 4L', tax({ regime: 'old', capitalGainsSTCG: 400000 }), 31200);

check('new slab 4L', calcTaxSlabs(400000, 'new', 30), 0);
check('new slab 8L', calcTaxSlabs(800000, 'new', 30), 20000);
check('new slab 12L', calcTaxSlabs(1200000, 'new', 30), 60000);
check('new slab 16L', calcTaxSlabs(1600000, 'new', 30), 120000);
check('new slab 24L', calcTaxSlabs(2400000, 'new', 30), 300000);
check('old slab 5L', calcTaxSlabs(500000, 'old', 30), 12500);
check('old slab 10L', calcTaxSlabs(1000000, 'old', 30), 112500);
check('old senior slab 5L', calcTaxSlabs(500000, 'old', 60), 10000);
check('old super senior slab 5L', calcTaxSlabs(500000, 'old', 80), 0);
check('old super senior slab 10L', calcTaxSlabs(1000000, 'old', 80), 100000);

check('new LTCG 1.25L', tax({ regime: 'new', capitalGainsLTCG: 125000 }), 0);
check('new STCG 1L', tax({ regime: 'new', capitalGainsSTCG: 100000 }), 0);
check('new LTCG 2.25L basic exemption', tax({ regime: 'new', capitalGainsLTCG: 225000 }), 0);

const r = calcIncomeTax({ regime: 'new', incomeSalary: 1200000 });
check('cess formula', r.healthCess, Math.round((r.taxAfterRebate + r.surcharge) * 0.04));

if (failed > 0) {
  console.error(`\n${failed} failed, ${passed} passed`);
  failures.forEach(f => console.error('FAIL ' + f));
  process.exit(1);
}
console.log(`${passed} passed, 0 failed`);
