// Browser regression suite: calculator behaviour + UI rendering.
// Run: npm run test:ui
const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..', 'public');
const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.csv': 'text/csv',
  '.webmanifest': 'application/manifest+json',
};

function createServer() {
  return http.createServer((req, res) => {
    let pathname = decodeURIComponent(req.url.split('?')[0]);
    if (pathname.endsWith('/')) pathname += 'index.html';
    let file = path.join(ROOT, pathname);
    if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file += '.html';
    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

function findEdge() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('No Edge or Chrome executable found');
  return found;
}

let passed = 0;
let failed = 0;
const failures = [];

function check(name, actual, expected) {
  if (actual === expected) {
    passed++;
  } else {
    failed++;
    failures.push(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function checkTrue(name, condition, detail) {
  if (condition) passed++;
  else {
    failed++;
    failures.push(`${name}${detail ? `: ${detail}` : ''}`);
  }
}

function parseMoney(text) {
  const digits = String(text || '').replace(/[^0-9.]/g, '');
  return digits ? Math.round(Number(digits)) : 0;
}

async function setValue(page, selector, value) {
  await page.$eval(
    selector,
    (el, next) => {
      el.value = String(next);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    value,
  );
}

async function choose(page, selector, value) {
  await page.waitForFunction(
    (sel, val) => {
      const el = document.querySelector(sel);
      return el && [...el.options].some((option) => option.value === val);
    },
    { timeout: 4000 },
    selector,
    value,
  );
  await page.select(selector, value);
}

async function setRadio(page, name, value) {
  await page.$eval(
    `input[name="${name}"][value="${value}"]`,
    (el) => {
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
  );
}

async function expectMoney(page, id, expected, label) {
  const selector = `#${id}`;
  let actual = null;
  try {
    await page.waitForFunction(
      (resultId, target) => {
        const el = document.getElementById(resultId);
        if (!el) return false;
        const digits = el.innerText.replace(/[^0-9.]/g, '');
        return digits !== '' && Math.round(Number(digits)) === target;
      },
      { timeout: 5000 },
      id,
      expected,
    );
    actual = await page.$eval(selector, (el) => Math.round(Number(el.innerText.replace(/[^0-9.]/g, ''))));
  } catch {
    actual = await page.$eval(selector, (el) => { const digits = String(el.innerText || '').replace(/[^0-9.]/g, ''); return digits ? Math.round(Number(digits)) : 0; }).catch(() => null);
  }
  check(label, actual, expected);
}

async function openPage(browser, origin, route) {
  const page = await browser.newPage();
  const consoleErrors = [];
  const requestFailures = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('requestfailed', (request) => {
    const failure = request.failure();
    requestFailures.push(`${request.url()} ${failure ? failure.errorText : ''}`.trim());
  });
  const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
  return { page, response, consoleErrors, requestFailures };
}

async function runCalculatorTests(browser, origin) {
  {
    const { page, consoleErrors } = await openPage(browser, origin, '/tools/income-tax');
    await setValue(page, '#incomeSalary', 1200000);
    await expectMoney(page, 'rTotalTax', 0, 'income tax: new regime 12L is tax-free');

    await setValue(page, '#incomeSalary', 2000000);
    await expectMoney(page, 'rTotalTax', 192400, 'income tax: new regime 20L');

    await setValue(page, '#incomeSalary', 1200000);
    await setRadio(page, 'regime', 'old');
    await setValue(page, '#deductions80C', 150000);
    await setValue(page, '#deductions80D', 25000);
    await expectMoney(page, 'rTotalTax', 111800, 'income tax: old regime 12L with 80C/80D');
    check('income tax: no console errors', consoleErrors.length, 0);
    await page.close();
  }

  {
    const { page, consoleErrors } = await openPage(browser, origin, '/tools/rto-tax');
    await choose(page, '#state', 'westbengal');
    await choose(page, '#vehicleType', 'two_wheeler');
    await choose(page, '#fuelType', 'petrol');
    await setValue(page, '#exShowroomPrice', 95000);
    await setValue(page, '#engineCC', 125);
    await expectMoney(page, 'rLifeTax', 3125, 'RTO: West Bengal 2W 95k life tax');
    await expectMoney(page, 'rTotal', 98625, 'RTO: West Bengal 2W 95k total on-road');

    await choose(page, '#state', 'haryana');
    await choose(page, '#vehicleType', 'private_car');
    await setValue(page, '#exShowroomPrice', 1000000);
    await setValue(page, '#engineCC', 1200);
    await expectMoney(page, 'rLifeTax', 80000, 'RTO: Haryana car 10L life tax');
    await expectMoney(page, 'rTotal', 1081200, 'RTO: Haryana car 10L total on-road');

    await choose(page, '#state', 'maharashtra');
    await choose(page, '#vehicleType', 'ev');
    await choose(page, '#fuelType', 'ev');
    await setValue(page, '#exShowroomPrice', 1500000);
    await expectMoney(page, 'rLifeTax', 0, 'RTO: Maharashtra EV car 15L life tax');
    await expectMoney(page, 'rTotal', 1501000, 'RTO: Maharashtra EV car 15L total on-road');
    check('RTO: no console errors', consoleErrors.length, 0);
    await page.close();
  }

  {
    const { page, consoleErrors } = await openPage(browser, origin, '/tools/stamp-duty');
    await choose(page, '#state', 'punjab');
    await choose(page, '#gender', 'male');
    await setValue(page, '#propertyValue', 6000000);
    await expectMoney(page, 'rTotal', 480000, 'stamp: Punjab male 60L');

    await choose(page, '#state', 'maharashtra');
    await choose(page, '#location', 'mumbai');
    await setValue(page, '#propertyValue', 5000000);
    await expectMoney(page, 'rTotal', 330000, 'stamp: Maharashtra Mumbai male 50L');

    await choose(page, '#state', 'karnataka');
    await choose(page, '#gender', 'male');
    await setValue(page, '#propertyValue', 6000000);
    await expectMoney(page, 'rTotal', 456000, 'stamp: Karnataka male 60L');
    check('stamp: no console errors', consoleErrors.length, 0);
    await page.close();
  }

  {
    const { page, consoleErrors } = await openPage(browser, origin, '/tools/hra');
    await setValue(page, '#basicSalary', 50000);
    await setValue(page, '#hraReceived', 20000);
    await setValue(page, '#rentPaid', 25000);
    await choose(page, '#cityType', 'nonmetro');
    await expectMoney(page, 'rExemption', 240000, 'HRA: non-metro exemption');

    await choose(page, '#cityType', 'metro');
    await expectMoney(page, 'rExemption', 240000, 'HRA: metro exemption still capped by HRA received');
    check('HRA: no console errors', consoleErrors.length, 0);
    await page.close();
  }

  {
    const { page, consoleErrors } = await openPage(browser, origin, '/tools/gst');
    await setValue(page, '#gstAmount', 10000);
    await choose(page, '#gstRate', '18');
    await setRadio(page, 'gstCalcType', 'add');
    await expectMoney(page, 'rRegGst', 1800, 'GST: 10k at 18% add');
    await expectMoney(page, 'rRegLast', 11800, 'GST: 10k at 18% total');

    await setRadio(page, 'gstCalcType', 'extract');
    await setValue(page, '#gstAmount', 11800);
    await expectMoney(page, 'rRegFirst', 11800, 'GST: 11800 extract entered total');
    await expectMoney(page, 'rRegGst', 1800, 'GST: 11800 extract GST');
    await expectMoney(page, 'rRegLast', 10000, 'GST: 11800 extract base');
    check('GST: no console errors', consoleErrors.length, 0);
    await page.close();
  }
}

const UI_ROUTES = [
  '/',
  '/tools/income-tax',
  '/tools/stamp-duty',
  '/tools/rto-tax',
  '/tools/hra',
  '/tools/gst',
  '/rto-tax/',
  '/rto-tax/haryana',
  '/rto-tax/bihar',
  '/stamp-duty/',
  '/stamp-duty/punjab',
  '/stamp-duty/goa',
  '/guides/',
  '/guides/how-to-file-itr-2026',
  '/guides/how-to-register-new-car-rto',
  '/comparisons/old-vs-new-tax-regime',
  '/comparisons/ev-vs-petrol-road-tax',
  '/comparisons/stamp-duty-rates-all-states',
  '/about',
  '/methodology',
  '/editorial-policy',
  '/contact',
  '/privacy',
  '/rate-tracker',
  '/embed',
];

async function runUiTests(browser, origin) {
  for (const route of UI_ROUTES) {
    const { page, response, consoleErrors, requestFailures } = await openPage(browser, origin, route);
    const name = route;

    check(`${name} status`, response.status(), 200);

    const facts = await page.evaluate(() => ({
      title: document.title.trim(),
      h1: document.querySelectorAll('h1').length,
      text: document.body.innerText.trim().length,
      header: !!document.querySelector('header'),
      footer: !!document.querySelector('footer'),
      sheets: document.styleSheets.length,
      h1Size: document.querySelector('h1') ? parseFloat(getComputedStyle(document.querySelector('h1')).fontSize) : 0,
      navColor: document.querySelector('header a') ? getComputedStyle(document.querySelector('header a')).color : '',
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    }));

    checkTrue(`${name} title`, facts.title.length > 0);
    check(`${name} h1 count`, facts.h1, 1);
    const minText = route === '/contact' ? 150 : 300;
    checkTrue(`${name} has body text`, facts.text > minText, `${facts.text} chars`);
    checkTrue(`${name} has header`, facts.header);
    checkTrue(`${name} has footer`, facts.footer);
    checkTrue(`${name} loads stylesheets`, facts.sheets >= 2, `${facts.sheets} sheets`);
    checkTrue(`${name} h1 styled`, facts.h1Size > 20, `${facts.h1Size}px`);
    checkTrue(`${name} header styled`, facts.navColor !== '', facts.navColor);
    checkTrue(`${name} no horizontal overflow`, facts.overflow <= 2, `${facts.overflow}px`);
    check(`${name} no console errors`, consoleErrors.length, 0);
    check(`${name} no failed requests`, requestFailures.length, 0);

    await page.setViewport({ width: 390, height: 844, isMobile: true });
    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    checkTrue(`${name} mobile no horizontal overflow`, mobileOverflow <= 2, `${mobileOverflow}px`);
    await page.close();
  }

}

(async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({
    executablePath: findEdge(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });

  try {
    await runCalculatorTests(browser, origin);
    await runUiTests(browser, origin);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed) {
    console.log('\nFailures:');
    for (const failure of failures) console.log('  - ' + failure);
    process.exit(1);
  }
})();
