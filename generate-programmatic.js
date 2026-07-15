const fs = require('fs');
const path = require('path');
const { STATES, STAMP_DUTY_RATES, RTO_RATES } = require('./state-data.js');

const PUBLIC_DIR = path.join(__dirname, 'public');
const STAMP_DIR = path.join(PUBLIC_DIR, 'programmatic', 'stamp-duty');
const RTO_DIR = path.join(PUBLIC_DIR, 'programmatic', 'rto-tax');

function getStateBySlug(slug) {
  return STATES.find(s => s.slug === slug);
}

function getNeighbors(slug) {
  const state = getStateBySlug(slug);
  if (!state) return [];
  return state.neighbors.map(n => {
    const s = getStateBySlug(n);
    return s ? { slug: s.slug, name: s.name, short: s.short } : null;
  }).filter(Boolean);
}

function generateStampDutyIndex() {
  const statesHtml = STATES.map(state => {
    const rates = STAMP_DUTY_RATES[state.slug];
    return `<a href="${state.slug}.html" class="state-card no-underline">
      <div class="state-name">${state.name}</div>
      <div class="state-rates">
        <span class="rate-badge male" title="Male">♂ ${rates.male}</span>
        <span class="rate-badge female" title="Female">♀ ${rates.female}</span>
        <span class="rate-badge joint" title="Joint">⚥ ${rates.joint}</span>
        <span class="rate-badge reg" title="Registration">📋 ${rates.reg}</span>
      </div>
    </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en" data-lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stamp Duty Calculator — All 28 States | DesiCalc</title>
  <meta name="description" content="Calculate stamp duty and registration charges for all 28 Indian states. Compare rates, female concessions, registration fees. Updated 2026 rates.">
  <link rel="canonical" href="https://desicalc.in/programmatic/stamp-duty/">
  <meta property="og:title" content="Stamp Duty Calculator — All 28 States | DesiCalc">
  <meta property="og:description" content="Calculate stamp duty and registration charges for all 28 Indian states. Compare rates, female concessions, registration fees. Updated 2026 rates.">
  <meta property="og:url" content="https://desicalc.in/programmatic/stamp-duty/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://desicalc.in/assets/img/og-stamp-duty.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Stamp Duty Calculators for All Indian States",
    "description": "Free stamp duty calculators for all 28 Indian states with 2026 rates.",
    "itemListElement": [
${STATES.map((state, i) => `      { "@type": "ListItem", "position": ${i + 1}, "url": "https://desicalc.in/programmatic/stamp-duty/${state.slug}", "name": "${state.name} Stamp Duty Calculator" }`).join(',\n')}
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://desicalc.in" },
      { "@type": "ListItem", "position": 2, "name": "Stamp Duty Calculator", "item": "https://desicalc.in/tools/stamp-duty" },
      { "@type": "ListItem", "position": 3, "name": "All States", "item": "https://desicalc.in/programmatic/stamp-duty/" }
    ]
  }
  </script>
  <link rel="stylesheet" href="../../assets/css/tailwind.css">
  <link rel="stylesheet" href="../../assets/css/style.css">
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="apple-touch-icon" href="/assets/img/favicon.svg">
  <style>
    .state-card { display: block; background: white; border: 1px solid #e7e5e4; border-radius: 12px; padding: 1rem; transition: all 0.2s; }
    .state-card:hover { border-color: #f59e0b; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
    .state-name { font-weight: 600; color: #1c1917; margin-bottom: 0.5rem; font-size: 1rem; }
    .state-rates { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .rate-badge { font-size: 0.7rem; padding: 0.15rem 0.45rem; border-radius: 9999px; background: #f5f5f4; color: #44403c; font-weight: 500; }
    .rate-badge.male { background: #dbeafe; color: #1e40af; }
    .rate-badge.female { background: #fce7f3; color: #9d174d; }
    .rate-badge.joint { background: #fef3c7; color: #92400e; }
    .rate-badge.reg { background: #dcfce7; color: #166534; }
    .legend { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.75rem; color: #78716c; margin-bottom: 1.5rem; }
    .legend-item { display: flex; align-items: center; gap: 0.25rem; }
  </style>
</head>
<body class="bg-stone-50">
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
    <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="../../../" class="text-sm text-stone-500 hover:text-stone-900 no-underline" data-i18n="header.back">← Back</a>
        <a href="../../../" class="text-xl font-bold no-underline"><span class="text-stone-900">Desi</span><span class="text-amber-600">Calc</span></a>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-8">
    <nav class="text-sm text-stone-500 mb-6">
      <a href="../../../" class="hover:text-amber-600">Home</a> / 
      <a href="../../../tools/stamp-duty" class="hover:text-amber-600">Stamp Duty</a> / 
      <span class="text-stone-900">All States</span>
    </nav>

    <h1 class="text-3xl font-bold text-stone-900 mb-2">Stamp Duty Calculator — All 28 States</h1>
    <p class="text-stone-500 mb-8">Compare stamp duty rates, registration charges, and female concessions across all Indian states. Click any state for detailed calculator and rates.</p>

    <div class="legend">
      <span class="legend-item"><span class="rate-badge male">♂</span> Male</span>
      <span class="legend-item"><span class="rate-badge female">♀</span> Female</span>
      <span class="legend-item"><span class="rate-badge joint">⚥</span> Joint</span>
      <span class="legend-item"><span class="rate-badge reg">📋</span> Registration</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3" id="statesGrid">
${statesHtml}
    </div>

    <section class="mt-12">
      <h2 class="text-2xl font-bold text-stone-900 mb-4">Quick Links</h2>
      <div class="flex flex-wrap gap-2">
        <a href="../../../tools/stamp-duty" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3.5 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs font-medium text-stone-900 no-underline">
          <span>🏠</span> Main Calculator
        </a>
        <a href="../../../comparisons/stamp-duty-rates-all-states" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3.5 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs no-underline">
          <span class="font-medium text-stone-900">All States Comparison</span> <span class="text-stone-400">Table</span>
        </a>
        <a href="../../../guides/how-to-calculate-stamp-duty" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3.5 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs no-underline">
          <span class="font-medium text-stone-900">How to Calculate</span> <span class="text-stone-400">Guide</span>
        </a>
      </div>
    </section>
  </main>

  <section class="ad-slot-footer mb-4" data-ad-slot="footer_main"></section>

  <footer class="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
    <div class="max-w-5xl mx-auto px-4"><span class="text-stone-900 font-semibold">DesiCalc</span> &copy; 2026. Free Indian tax calculators.</div>
  </footer>
  <script src="../../../assets/js/ad.js"></script>
</body>
</html>`;
}

function generateRTOIndex() {
  const statesHtml = STATES.map(state => {
    const rate = RTO_RATES[state.slug];
    return `<a href="${state.slug}.html" class="state-card no-underline">
      <div class="state-name">${state.name}</div>
      <div class="state-rate">${rate}</div>
    </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en" data-lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RTO Tax Calculator — All States | DesiCalc</title>
  <meta name="description" content="Calculate RTO road tax and registration charges for all Indian states. Car, bike, EV, commercial vehicle rates. Updated 2026.">
  <link rel="canonical" href="https://desicalc.in/programmatic/rto-tax/">
  <meta property="og:title" content="RTO Tax Calculator — All States | DesiCalc">
  <meta property="og:description" content="Calculate RTO road tax and registration charges for all Indian states. Car, bike, EV, commercial vehicle rates. Updated 2026.">
  <meta property="og:url" content="https://desicalc.in/programmatic/rto-tax/">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://desicalc.in/assets/img/og-rto-tax.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "RTO Tax Calculators for All Indian States",
    "description": "Free RTO road tax calculators for all Indian states with 2026 rates.",
    "itemListElement": [
${STATES.map((state, i) => `      { "@type": "ListItem", "position": ${i + 1}, "url": "https://desicalc.in/programmatic/rto-tax/${state.slug}", "name": "${state.name} RTO Tax Calculator" }`).join(',\n')}
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://desicalc.in" },
      { "@type": "ListItem", "position": 2, "name": "RTO Tax Calculator", "item": "https://desicalc.in/tools/rto-tax" },
      { "@type": "ListItem", "position": 3, "name": "All States", "item": "https://desicalc.in/programmatic/rto-tax/" }
    ]
  }
  </script>
  <link rel="stylesheet" href="../../assets/css/tailwind.css">
  <link rel="stylesheet" href="../../assets/css/style.css">
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="apple-touch-icon" href="/assets/img/favicon.svg">
  <style>
    .state-card { display: block; background: white; border: 1px solid #e7e5e4; border-radius: 12px; padding: 1rem; transition: all 0.2s; }
    .state-card:hover { border-color: #f59e0b; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-2px); }
    .state-name { font-weight: 600; color: #1c1917; margin-bottom: 0.5rem; font-size: 1rem; }
    .state-rate { font-size: 0.85rem; color: #f59e0b; font-weight: 600; }
  </style>
</head>
<body class="bg-stone-50">
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
    <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="../../../" class="text-sm text-stone-500 hover:text-stone-900 no-underline" data-i18n="header.back">← Back</a>
        <a href="../../../" class="text-xl font-bold no-underline"><span class="text-stone-900">Desi</span><span class="text-amber-600">Calc</span></a>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-8">
    <nav class="text-sm text-stone-500 mb-6">
      <a href="../../../" class="hover:text-amber-600">Home</a> / 
      <a href="../../../tools/rto-tax" class="hover:text-amber-600">RTO Tax</a> / 
      <span class="text-stone-900">All States</span>
    </nav>

    <h1 class="text-3xl font-bold text-stone-900 mb-2">RTO Tax Calculator — All States</h1>
    <p class="text-stone-500 mb-8">Calculate road tax, registration fees, and HSRP charges for any state. Car, bike, EV, commercial vehicle rates included.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3" id="statesGrid">
${statesHtml}
    </div>

    <section class="mt-12">
      <h2 class="text-2xl font-bold text-stone-900 mb-4">Quick Links</h2>
      <div class="flex flex-wrap gap-2">
        <a href="../../../tools/rto-tax" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3.5 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs font-medium text-stone-900 no-underline">
          <span>🚗</span> Main Calculator
        </a>
        <a href="../../../comparisons/ev-vs-petrol-road-tax" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3.5 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs no-underline">
          <span class="font-medium text-stone-900">EV vs Petrol</span> <span class="text-stone-400">Comparison</span>
        </a>
        <a href="../../../guides/how-to-register-new-car-rto" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3.5 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs no-underline">
          <span class="font-medium text-stone-900">Registration</span> <span class="text-stone-400">Guide</span>
        </a>
      </div>
    </section>
  </main>

  <section class="ad-slot-footer mb-4" data-ad-slot="footer_main"></section>

  <footer class="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
    <div class="max-w-5xl mx-auto px-4"><span class="text-stone-900 font-semibold">DesiCalc</span> &copy; 2026. Free Indian tax calculators.</div>
  </footer>
  <script src="../../../assets/js/ad.js"></script>
</body>
</html>`;
}

function generateStampDutyStatePage(slug) {
  const state = getStateBySlug(slug);
  if (!state) return null;

  const rates = STAMP_DUTY_RATES[slug];
  const neighbors = getNeighbors(slug);
  
  const neighborLinks = neighbors.map(n => 
    `<a href="../${n.slug}.html" class="neighbor-link no-underline" title="Compare with ${n.name}">${n.name}</a>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en" data-lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stamp Duty Calculator ${state.name} 2026 | DesiCalc</title>
  <meta name="description" content="Calculate stamp duty and registration charges for property in ${state.name}. Male ${rates.male}, Female ${rates.female}, Joint ${rates.joint}. Registration ${rates.reg}. Free calculator.">
  <link rel="canonical" href="https://desicalc.in/programmatic/stamp-duty/${slug}">
  <meta property="og:title" content="Stamp Duty Calculator ${state.name} 2026 | DesiCalc">
  <meta property="og:description" content="Calculate stamp duty in ${state.name}. Male ${rates.male}, Female ${rates.female}, Joint ${rates.joint}. Free online calculator.">
  <meta property="og:url" content="https://desicalc.in/programmatic/stamp-duty/${slug}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="https://desicalc.in/assets/img/og-stamp-duty.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "Stamp Duty Calculator ${state.name}",
    "url": "https://desicalc.in/programmatic/stamp-duty/${slug}",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "description": "Free stamp duty calculator for ${state.name} property registration. Calculate stamp duty rates, registration charges, female concession, circle rate."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://desicalc.in" },
      { "@type": "ListItem", "position": 2, "name": "Stamp Duty Calculator", "item": "https://desicalc.in/tools/stamp-duty" },
      { "@type": "ListItem", "position": 3, "name": "All States", "item": "https://desicalc.in/programmatic/stamp-duty/" },
      { "@type": "ListItem", "position": 4, "name": "${state.name}", "item": "https://desicalc.in/programmatic/stamp-duty/${slug}" }
    ]
  }
  </script>
  <link rel="stylesheet" href="../../assets/css/tailwind.css">
  <link rel="stylesheet" href="../../assets/css/style.css">
  <script src="../../assets/js/calc-core.js"></script>
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="apple-touch-icon" href="/assets/img/favicon.svg">
  <style>
    .neighbor-states { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem; }
    .neighbor-link { display: inline-flex; align-items: center; padding: 0.35rem 0.75rem; background: white; border: 1px solid #e7e5e4; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; color: #78716c; transition: all 0.2s; }
    .neighbor-link:hover { border-color: #f59e0b; color: #92400e; background: #fefce8; }
    .compare-box { background: #fefce8; border: 1px solid #fde047; border-radius: 12px; padding: 1rem; margin: 1.5rem 0; }
    .compare-box h3 { font-size: 0.875rem; font-weight: 600; color: #92400e; margin-bottom: 0.5rem; }
  </style>
</head>
<body class="bg-stone-50">
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
    <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
      <a href="../../../" class="text-xl font-bold no-underline"><span class="text-stone-900">Desi</span><span class="text-amber-600">Calc</span></a>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    <nav class="text-sm text-stone-500 mb-4">
      <a href="../../../" class="hover:text-amber-600">Home</a> / 
      <a href="../../../tools/stamp-duty" class="hover:text-amber-600">Stamp Duty</a> / 
      <a href="../" class="hover:text-amber-600">All States</a> / 
      <span class="text-stone-900">${state.name}</span>
    </nav>

    <h1 class="text-3xl font-bold text-stone-900 mb-2">Stamp Duty Calculator ${state.name} 2026</h1>
    <p class="text-stone-500 mb-8">Calculate property registration charges, stamp duty rates, and total cost for buying property in ${state.name}. Updated for 2026.</p>

    ${neighbors.length > 0 ? `
    <div class="compare-box">
      <h3>🔗 Compare with Neighboring States</h3>
      <div class="neighbor-states">
        ${neighborLinks}
      </div>
      <p class="text-xs text-stone-600 mt-2 mb-0">Click any state to compare stamp duty rates side-by-side.</p>
    </div>
    ` : ''}

    <section class="mb-8">
      <h2 class="text-2xl font-bold text-stone-900 mb-4">${state.name} Stamp Duty Rates 2026</h2>
      <div class="overflow-x-auto bg-white rounded-xl border border-stone-200">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-stone-100 border-b border-stone-200">
              <th class="text-left p-3 font-semibold text-stone-900">Category</th>
              <th class="text-left p-3 font-semibold text-stone-900">Stamp Duty Rate</th>
              <th class="text-left p-3 font-semibold text-stone-900">Registration Charge</th>
              <th class="text-left p-3 font-semibold text-stone-900">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Male (individual)</td>
              <td class="p-3 text-stone-900">${rates.male}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.male) + parseFloat(rates.reg.replace('%','')) + parseFloat(rates.reg.includes('cap') ? '0' : rates.reg.replace('%',''))}%</td>
            </tr>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Female (individual)</td>
              <td class="p-3 text-stone-900">${rates.female}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.female) + parseFloat(rates.reg.replace('%',''))}%</td>
            </tr>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Joint - Both Female</td>
              <td class="p-3 text-stone-900">${rates.joint}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.joint) + parseFloat(rates.reg.replace('%',''))}%</td>
            </tr>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Joint - Both Male</td>
              <td class="p-3 text-stone-900">${rates.male}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.male) + parseFloat(rates.reg.replace('%',''))}%</td>
            </tr>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Joint - Male + Female</td>
              <td class="p-3 text-stone-900">${rates.joint}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.joint) + parseFloat(rates.reg.replace('%',''))}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="bg-white rounded-xl border border-stone-200 p-6 mb-8">
      <div id="calc-placeholder" class="text-center py-8">
        <p class="text-stone-500 mb-4">Use our interactive calculator for ${state.name}</p>
        <a href="../../../tools/stamp-duty?state=${slug}" class="btn btn-primary">Open Calculator</a>
      </div>
    </div>

    <section class="mb-8">
      <h2 class="text-lg font-bold mb-3">All States Quick Access</h2>
      <div class="flex flex-wrap gap-2">
${STATES.map(s => `<a href="../${s.slug}.html" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs ${s.slug === slug ? 'border-amber-400 bg-amber-50 font-medium' : 'no-underline'}"><span class="font-medium text-stone-900">${s.name}</span></a>`).join('\n')}
      </div>
    </section>
  </main>

  <section class="ad-slot-footer mb-4" data-ad-slot="footer_main"></section>

  <footer class="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
    <div class="max-w-5xl mx-auto px-4"><span class="text-stone-900 font-semibold">DesiCalc</span> &copy; 2026. Free Indian tax calculators.</div>
  </footer>
  <script src="../../assets/js/ad.js"></script>
</body>
</html>`;
}

function generateRTOStatePage(slug) {
  const state = getStateBySlug(slug);
  if (!state) return null;

  const rate = RTO_RATES[slug];
  const neighbors = getNeighbors(slug);
  
  const neighborLinks = neighbors.map(n => 
    `<a href="../${n.slug}.html" class="neighbor-link no-underline" title="Compare with ${n.name}">${n.name}</a>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en" data-lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RTO Tax Calculator ${state.name} 2026 | DesiCalc</title>
  <meta name="description" content="Calculate RTO road tax and registration charges for vehicles in ${state.name}. Car, bike, EV, commercial rates. Updated 2026.">
  <link rel="canonical" href="https://desicalc.in/programmatic/rto-tax/${slug}">
  <meta property="og:title" content="RTO Tax Calculator ${state.name} 2026 | DesiCalc">
  <meta property="og:description" content="Calculate RTO road tax in ${state.name}. Car, bike, EV rates. Free calculator.">
  <meta property="og:url" content="https://desicalc.in/programmatic/rto-tax/${slug}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="https://desicalc.in/assets/img/og-rto-tax.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "name": "RTO Tax Calculator ${state.name}",
    "url": "https://desicalc.in/programmatic/rto-tax/${slug}",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "description": "Free RTO road tax calculator for ${state.name}. Calculate life tax, registration, HSRP."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://desicalc.in" },
      { "@type": "ListItem", "position": 2, "name": "RTO Tax Calculator", "item": "https://desicalc.in/tools/rto-tax" },
      { "@type": "ListItem", "position": 3, "name": "All States", "item": "https://desicalc.in/programmatic/rto-tax/" },
      { "@type": "ListItem", "position": 4, "name": "${state.name}", "item": "https://desicalc.in/programmatic/rto-tax/${slug}" }
    ]
  }
  </script>
  <link rel="stylesheet" href="../../assets/css/tailwind.css">
  <link rel="stylesheet" href="../../assets/css/style.css">
  <script src="../../assets/js/calc-core.js"></script>
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="apple-touch-icon" href="/assets/img/favicon.svg">
  <style>
    .neighbor-states { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem; }
    .neighbor-link { display: inline-flex; align-items: center; padding: 0.35rem 0.75rem; background: white; border: 1px solid #e7e5e4; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; color: #78716c; transition: all 0.2s; }
    .neighbor-link:hover { border-color: #f59e0b; color: #92400e; background: #fefce8; }
    .compare-box { background: #fefce8; border: 1px solid #fde047; border-radius: 12px; padding: 1rem; margin: 1.5rem 0; }
    .compare-box h3 { font-size: 0.875rem; font-weight: 600; color: #92400e; margin-bottom: 0.5rem; }
  </style>
</head>
<body class="bg-stone-50">
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
    <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
      <a href="../../../" class="text-xl font-bold no-underline"><span class="text-stone-900">Desi</span><span class="text-amber-600">Calc</span></a>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    <nav class="text-sm text-stone-500 mb-4">
      <a href="../../../" class="hover:text-amber-600">Home</a> / 
      <a href="../../../tools/rto-tax" class="hover:text-amber-600">RTO Tax</a> / 
      <a href="../" class="hover:text-amber-600">All States</a> / 
      <span class="text-stone-900">${state.name}</span>
    </nav>

    <h1 class="text-3xl font-bold text-stone-900 mb-2">RTO Tax Calculator ${state.name} 2026</h1>
    <p class="text-stone-500 mb-8">Calculate road tax, registration charges, and on-road price for vehicles in ${state.name}. Updated for 2026.</p>

    ${neighbors.length > 0 ? `
    <div class="compare-box">
      <h3>🔗 Compare with Neighboring States</h3>
      <div class="neighbor-states">
        ${neighborLinks}
      </div>
      <p class="text-xs text-stone-600 mt-2 mb-0">Click any state to compare RTO road tax rates side-by-side.</p>
    </div>
    ` : ''}

    <section class="mb-8">
      <h2 class="text-2xl font-bold text-stone-900 mb-4">${state.name} RTO Road Tax Rates 2026</h2>
      <p class="text-stone-600 mb-4">Estimated range: <strong class="text-stone-900">${rate}</strong> (varies by vehicle type, fuel, price, and category). Use the calculator above for exact figures.</p>
    </section>

    <div class="bg-white rounded-xl border border-stone-200 p-6 mb-8">
      <div id="calc-placeholder" class="text-center py-8">
        <p class="text-stone-500 mb-4">Use our interactive RTO tax calculator for ${state.name}</p>
        <a href="../../../tools/rto-tax?state=${slug}" class="btn btn-primary">Open Calculator &rarr;</a>
      </div>
    </div>

    <section class="mb-8">
      <h2 class="text-lg font-bold mb-3">All States Quick Access</h2>
      <div class="flex flex-wrap gap-2">
${STATES.map(s => `<a href="../${s.slug}.html" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs ${s.slug === slug ? 'border-amber-400 bg-amber-50 font-medium' : 'no-underline'}"><span class="font-medium text-stone-900">${s.name}</span></a>`).join('\n')}
      </div>
    </section>
  </main>

  <section class="ad-slot-footer mb-4" data-ad-slot="footer_main"></section>

  <footer class="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
    <div class="max-w-5xl mx-auto px-4"><span class="text-stone-900 font-semibold">DesiCalc</span> &copy; 2026. Free Indian tax calculators.</div>
  </footer>
  <script src="../../assets/js/ad.js"></script>
</body>
</html>`;
}

// Write index pages
fs.writeFileSync(path.join(STAMP_DIR, 'index.html'), generateStampDutyIndex());
fs.writeFileSync(path.join(RTO_DIR, 'index.html'), generateRTOIndex());
console.log('Created index pages for stamp-duty and rto-tax');

// Update state pages with cross-links
STATES.forEach(state => {
  const stampPath = path.join(STAMP_DIR, `${state.slug}.html`);
  const rtoPath = path.join(RTO_DIR, `${state.slug}.html`);
  
  if (fs.existsSync(stampPath)) {
    fs.writeFileSync(stampPath, generateStampDutyStatePage(state.slug));
    console.log(`Updated stamp-duty/${state.slug}.html`);
  }
  
  if (fs.existsSync(rtoPath)) {
    fs.writeFileSync(rtoPath, generateRTOStatePage(state.slug));
    console.log(`Updated rto-tax/${state.slug}.html`);
  }
});

console.log('Done generating programmatic pages!');