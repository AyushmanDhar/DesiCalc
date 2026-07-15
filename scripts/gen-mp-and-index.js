const fs = require('fs');
const path = require('path');
const { STATES, STAMP_DUTY_RATES } = require('../state-data.js');

const STAMP_DIR = path.join(__dirname, '..', 'public', 'programmatic', 'stamp-duty');

// Regenerate just the index page
function generateStampDutyIndex() {
  const statesHtml = STATES.map(state => {
    const rates = STAMP_DUTY_RATES[state.slug];
    return `<a href="${state.slug}.html" class="state-card no-underline">
      <div class="state-name">${state.name}</div>
      <div class="state-rates">
        <span class="rate-badge male" title="Male">\u2642 ${rates.male}</span>
        <span class="rate-badge female" title="Female">\u2640 ${rates.female}</span>
        <span class="rate-badge joint" title="Joint">\u26A5 ${rates.joint}</span>
        <span class="rate-badge reg" title="Registration">\uD83D\uDCCB ${rates.reg}</span>
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
  <link rel="stylesheet" href="/assets/css/tailwind.css">
  <link rel="stylesheet" href="/assets/css/style.css">
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
        <a href="../../../" class="text-sm text-stone-500 hover:text-stone-900 no-underline" data-i18n="header.back">\u2190 Back</a>
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
      <span class="legend-item"><span class="rate-badge male">\u2642</span> Male</span>
      <span class="legend-item"><span class="rate-badge female">\u2640</span> Female</span>
      <span class="legend-item"><span class="rate-badge joint">\u26A5</span> Joint</span>
      <span class="legend-item"><span class="rate-badge reg">\uD83D\uDCCB</span> Registration</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3" id="statesGrid">
${statesHtml}
    </div>

    <section class="mt-12">
      <h2 class="text-2xl font-bold text-stone-900 mb-4">Quick Links</h2>
      <div class="flex flex-wrap gap-2">
        <a href="../../../tools/stamp-duty" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3.5 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs font-medium text-stone-900 no-underline">
          <span>\uD83C\uDFE0</span> Main Calculator
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
</body>
</html>`;
}

// Write index
fs.writeFileSync(path.join(STAMP_DIR, 'index.html'), generateStampDutyIndex());
console.log('Index page written');

// Regenerate MP page
require('./gen-mp-only.js');
