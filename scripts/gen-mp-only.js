const fs = require('fs');
const path = require('path');
const { STATES, STAMP_DUTY_RATES, RTO_RATES, STATE_EXTRA } = require('../state-data.js');

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

function generateContentSections(slug) {
  const extra = STATE_EXTRA[slug];
  if (extra && extra.contentSections) {
    return extra.contentSections.map(s => `
    <section class="prose max-w-none mb-8">
      <h2 class="text-2xl font-bold text-stone-900 mt-8 mb-4">${s.heading}</h2>
      ${s.body}
    </section>`).join('\n');
  }
  return '';
}

function generateExtraFaqs(slug) {
  const extra = STATE_EXTRA[slug];
  if (extra && extra.extraFaqs) {
    return extra.extraFaqs.map(f => `
        <div class="faq-item">
          <button class="faq-question" onclick="toggleFaq(this)"><span>${f.q}</span><span class="faq-icon">+</span></button>
          <div class="faq-answer">${f.a}</div>
        </div>`).join('\n');
  }
  return '';
}

function generateStampDutyStatePage(slug) {
  const state = getStateBySlug(slug);
  if (!state) return null;

  const rates = STAMP_DUTY_RATES[slug];
  const neighbors = getNeighbors(slug);
  const extra = STATE_EXTRA[slug];
  
  const neighborLinks = neighbors.map(n => 
    `<a href="../${n.slug}.html" class="neighbor-link no-underline" title="Compare with ${n.name}">${n.name}</a>`
  ).join('');

  const pageTitle = extra ? extra.title : `Stamp Duty Calculator ${state.name} 2026 | DesiCalc`;
  const metaDesc = extra ? extra.metaDesc : `Calculate stamp duty and registration charges for property in ${state.name}. Male ${rates.male}, Female ${rates.female}, Joint ${rates.joint}. Registration ${rates.reg}. Free calculator.`;
  const ogTitle = extra ? extra.ogTitle : `Stamp Duty Calculator ${state.name} 2026 | DesiCalc`;
  const ogDesc = extra ? extra.ogDesc || metaDesc : `Calculate stamp duty in ${state.name}. Male ${rates.male}, Female ${rates.female}, Joint ${rates.joint}. Free online calculator.`;
  const schemaName = extra ? extra.schemaName : `Stamp Duty Calculator ${state.name}`;
  const schemaDesc = extra ? extra.schemaDesc : `Free stamp duty calculator for ${state.name} property registration. Calculate stamp duty rates, registration charges, female concession, circle rate.`;

  const h1 = extra ? extra.title.split(' — ')[0] : `Stamp Duty Calculator ${state.name} 2026`;
  const subtitle = extra ? `Calculate stamp duty, registry charges, and total cost for buying property in ${state.name}. Updated for 2026.` : `Calculate property registration charges, stamp duty rates, and total cost for buying property in ${state.name}. Updated for 2026.`;

  const contentSectionsHtml = generateContentSections(slug);
  const extraFaqsHtml = generateExtraFaqs(slug);

  return `<!DOCTYPE html>
<html lang="en" data-lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="https://desicalc.in/programmatic/stamp-duty/${slug}">
  <link rel="alternate" hreflang="en" href="https://desicalc.in/programmatic/stamp-duty/${slug}" />
  <link rel="alternate" hreflang="x-default" href="https://desicalc.in/programmatic/stamp-duty/${slug}" />
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDesc}">
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
    "name": "${schemaName}",
    "url": "https://desicalc.in/tools/stamp-duty?state=${slug}",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "description": "${schemaDesc}"
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
  <link rel="stylesheet" href="/assets/css/tailwind.css">
  <link rel="stylesheet" href="/assets/css/style.css">
  <script src="/assets/js/calc-core.js"></script>
  <script src="/assets/js/common.js"></script>
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
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="DesiCalc" />
  <link rel="manifest" href="/site.webmanifest" />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2207525036040634"
     crossorigin="anonymous"></script>
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

    <h1 class="text-3xl font-bold text-stone-900 mb-2">${h1}</h1>
    <p class="text-stone-500 mb-8">${subtitle}</p>

    ${neighbors.length > 0 ? `
    <div class="compare-box">
      <h3>🔗 Compare with Neighboring States</h3>
      <div class="neighbor-states">
        ${neighborLinks}
      </div>
      <p class="text-xs text-stone-600 mt-2 mb-0">Click any state to compare stamp duty rates side-by-side.</p>
    </div>
    ` : ''}

    <div class="bg-white rounded-xl border border-stone-200 p-6 mb-8">
      <div id="calc-placeholder" class="text-center py-8">
        <p class="text-stone-500 mb-4">Use our interactive calculator for ${state.name}</p>
        <a href="../../../tools/stamp-duty?state=${slug}" class="btn btn-primary">Open Calculator</a>
      </div>
    </div>

    <section class="mb-8">
      <h2 class="text-2xl font-bold text-stone-900 mb-4">${state.name} Stamp Duty &amp; Registry Charges 2026</h2>
      <div class="overflow-x-auto bg-white rounded-xl border border-stone-200">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-stone-100 border-b border-stone-200">
              <th class="text-left p-3 font-semibold text-stone-900">Category</th>
              <th class="text-left p-3 font-semibold text-stone-900">Stamp Duty Rate</th>
              <th class="text-left p-3 font-semibold text-stone-900">Registration / Registry Charge</th>
              <th class="text-left p-3 font-semibold text-stone-900">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Male (individual)</td>
              <td class="p-3 text-stone-900">${rates.male}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.male) + parseFloat(rates.reg.match(/\d+(?:\.\d+)?/)[0])}%</td>
            </tr>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Female (individual)</td>
              <td class="p-3 text-stone-900">${rates.female}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.female) + parseFloat(rates.reg.match(/\d+(?:\.\d+)?/)[0])}%</td>
            </tr>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Joint - Both Female</td>
              <td class="p-3 text-stone-900">${rates.joint}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.joint) + parseFloat(rates.reg.match(/\d+(?:\.\d+)?/)[0])}%</td>
            </tr>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Joint - Both Male</td>
              <td class="p-3 text-stone-900">${rates.male}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.male) + parseFloat(rates.reg.match(/\d+(?:\.\d+)?/)[0])}%</td>
            </tr>
            <tr class="border-b border-stone-100">
              <td class="p-3 text-stone-900">Joint - Male + Female</td>
              <td class="p-3 text-stone-900">${rates.joint}</td>
              <td class="p-3 text-stone-900">${rates.reg}</td>
              <td class="p-3 text-stone-900 font-medium">${parseFloat(rates.joint) + parseFloat(rates.reg.match(/\d+(?:\.\d+)?/)[0])}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    ${contentSectionsHtml || ''}

    <section class="mt-10 max-w-2xl">
      <h2 class="text-lg font-bold mb-3">FAQs</h2>
      <div class="faq-item">
        <button class="faq-question" onclick="toggleFaq(this)"><span>What is the stamp duty rate for women in ${state.name}?</span><span class="faq-icon">+</span></button>
        <div class="faq-answer">${parseFloat(rates.male) === parseFloat(rates.female) ? `Women in ${state.name} pay the same ${rates.female} stamp duty rate as men, as MP charges a flat rate for all buyers.` : `Women in ${state.name} pay ${rates.female} stamp duty, which is ${parseFloat(rates.male) - parseFloat(rates.female)}% lower than the ${rates.male} rate for men. This concession is available for individual female buyers and joint ownership where all owners are women.`}</div>
      </div>
      <div class="faq-item">
        <button class="faq-question" onclick="toggleFaq(this)"><span>What are the total registry charges in ${state.name}?</span><span class="faq-icon">+</span></button>
        <div class="faq-answer">${parseFloat(rates.male) === parseFloat(rates.female) ? `The total cost of property registration in ${state.name} is ${parseFloat(rates.male) + parseFloat(rates.reg.match(/\d+(?:\.\d+)?/)[0])}% of the property value — stamp duty ${rates.male} + registry charges ${rates.reg}. Additional costs include document writer fees, encumbrance certificate, and legal fees.` : `The total cost of property registration in ${state.name} includes stamp duty (${rates.male} for men, ${rates.female} for women) plus ${rates.reg} registry charges. Additional costs include document writer fees, encumbrance certificate, and legal fees.`}</div>
      </div>
      <div class="faq-item">
        <button class="faq-question" onclick="toggleFaq(this)"><span>Is e-stamping available in ${state.name}?</span><span class="faq-icon">+</span></button>
        <div class="faq-answer">Yes, e-stamping is widely available and is the preferred method for stamp duty payment in ${state.name}. E-stamp certificates can be obtained from authorised banks including SBI, PNB, and Axis Bank.</div>
      </div>
      <div class="faq-item">
        <button class="faq-question" onclick="toggleFaq(this)"><span>What additional costs apply when buying property in ${state.name}?</span><span class="faq-icon">+</span></button>
        <div class="faq-answer">Besides stamp duty and registry charges, buyers should budget for legal fees, document writer charges, encumbrance certificate fees, mutation charges, and GST on under-construction properties. These typically add 1-2% to the total cost.</div>
      </div>
      ${extraFaqsHtml}
    </section>

    <section class="mt-10 mb-8">
      <h2 class="text-lg font-bold mb-3">All States Quick Access</h2>
      <div class="flex flex-wrap gap-2">
${STATES.map(s => `<a href="../${s.slug}.html" class="inline-flex items-center gap-1.5 bg-white rounded-full border border-stone-200 px-3 py-1.5 hover:border-amber-300 hover:bg-amber-50 transition text-xs ${s.slug === slug ? 'border-amber-400 bg-amber-50 font-medium' : 'no-underline'}"><span class="font-medium text-stone-900">${s.name}</span></a>`).join('\n')}
      </div>
    </section>
  </main>

  <ins class="adsbygoogle ad-slot-footer mb-4" style="display:block;min-height:90px" data-ad-client="ca-pub-2207525036040634" data-ad-slot="4037844123" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

  <footer class="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
    <div class="max-w-5xl mx-auto px-4"><span class="text-stone-900 font-semibold">DesiCalc</span> &copy; 2026. Free Indian tax calculators.</div>
  </footer>
  <script src="/assets/js/ad.js"></script>
</body>
</html>`;
}

const mpHtml = generateStampDutyStatePage('madhyapradesh');
fs.writeFileSync(path.join(__dirname, '..', 'public', 'programmatic', 'stamp-duty', 'madhyapradesh.html'), mpHtml);
console.log('MP page written successfully');
