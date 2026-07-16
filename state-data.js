// State data for programmatic pages
const STATES = [
  { slug: 'andhrapradesh', name: 'Andhra Pradesh', short: 'AP', region: 'South', neighbors: ['telangana', 'tamilnadu', 'karnataka', 'odisha', 'chhattisgarh'] },
  { slug: 'arunachalpradesh', name: 'Arunachal Pradesh', short: 'AR', region: 'Northeast', neighbors: ['assam', 'nagaland'] },
  { slug: 'assam', name: 'Assam', short: 'AS', region: 'Northeast', neighbors: ['arunachalpradesh', 'nagaland', 'manipur', 'mizoram', 'tripura', 'meghalaya', 'westbengal'] },
  { slug: 'bihar', name: 'Bihar', short: 'BR', region: 'East', neighbors: ['uttarpradesh', 'jharkhand', 'westbengal'] },
  { slug: 'chhattisgarh', name: 'Chhattisgarh', short: 'CG', region: 'Central', neighbors: ['madhyapradesh', 'uttarpradesh', 'jharkhand', 'odisha', 'telangana', 'maharashtra'] },
  { slug: 'delhi', name: 'Delhi (NCT)', short: 'DL', region: 'North', neighbors: ['haryana', 'uttarpradesh'] },
  { slug: 'goa', name: 'Goa', short: 'GA', region: 'West', neighbors: ['maharashtra', 'karnataka'] },
  { slug: 'gujarat', name: 'Gujarat', short: 'GJ', region: 'West', neighbors: ['rajasthan', 'madhyapradesh', 'maharashtra'] },
  { slug: 'haryana', name: 'Haryana', short: 'HR', region: 'North', neighbors: ['punjab', 'himachalpradesh', 'uttarpradesh', 'rajasthan', 'delhi'] },
  { slug: 'himachalpradesh', name: 'Himachal Pradesh', short: 'HP', region: 'North', neighbors: ['punjab', 'haryana', 'uttarakhand'] },
  { slug: 'jharkhand', name: 'Jharkhand', short: 'JH', region: 'East', neighbors: ['bihar', 'uttarpradesh', 'chhattisgarh', 'odisha', 'westbengal'] },
  { slug: 'karnataka', name: 'Karnataka', short: 'KA', region: 'South', neighbors: ['maharashtra', 'goa', 'kerala', 'tamilnadu', 'andhrapradesh', 'telangana'] },
  { slug: 'kerala', name: 'Kerala', short: 'KL', region: 'South', neighbors: ['karnataka', 'tamilnadu'] },
  { slug: 'madhyapradesh', name: 'Madhya Pradesh', short: 'MP', region: 'Central', neighbors: ['rajasthan', 'uttarpradesh', 'chhattisgarh', 'maharashtra', 'gujarat'] },
  { slug: 'maharashtra', name: 'Maharashtra', short: 'MH', region: 'West', neighbors: ['gujarat', 'madhyapradesh', 'chhattisgarh', 'telangana', 'karnataka', 'goa'] },
  { slug: 'manipur', name: 'Manipur', short: 'MN', region: 'Northeast', neighbors: ['assam', 'nagaland', 'mizoram'] },
  { slug: 'meghalaya', name: 'Meghalaya', short: 'ML', region: 'Northeast', neighbors: ['assam'] },
  { slug: 'mizoram', name: 'Mizoram', short: 'MZ', region: 'Northeast', neighbors: ['assam', 'manipur', 'tripura'] },
  { slug: 'nagaland', name: 'Nagaland', short: 'NL', region: 'Northeast', neighbors: ['arunachalpradesh', 'assam', 'manipur'] },
  { slug: 'odisha', name: 'Odisha', short: 'OD', region: 'East', neighbors: ['westbengal', 'jharkhand', 'chhattisgarh', 'andhrapradesh'] },
  { slug: 'punjab', name: 'Punjab', short: 'PB', region: 'North', neighbors: ['himachalpradesh', 'haryana', 'rajasthan'] },
  { slug: 'rajasthan', name: 'Rajasthan', short: 'RJ', region: 'North', neighbors: ['punjab', 'haryana', 'uttarpradesh', 'madhyapradesh', 'gujarat'] },
  { slug: 'sikkim', name: 'Sikkim', short: 'SK', region: 'Northeast', neighbors: ['westbengal'] },
  { slug: 'tamilnadu', name: 'Tamil Nadu', short: 'TN', region: 'South', neighbors: ['kerala', 'karnataka', 'andhrapradesh'] },
  { slug: 'telangana', name: 'Telangana', short: 'TS', region: 'South', neighbors: ['andhrapradesh', 'karnataka', 'maharashtra', 'chhattisgarh', 'odisha'] },
  { slug: 'tripura', name: 'Tripura', short: 'TR', region: 'Northeast', neighbors: ['assam', 'mizoram'] },
  { slug: 'uttarpradesh', name: 'Uttar Pradesh', short: 'UP', region: 'North', neighbors: ['uttarakhand', 'himachalpradesh', 'haryana', 'delhi', 'rajasthan', 'madhyapradesh', 'chhattisgarh', 'jharkhand', 'bihar'] },
  { slug: 'uttarakhand', name: 'Uttarakhand', short: 'UK', region: 'North', neighbors: ['himachalpradesh', 'uttarpradesh'] },
  { slug: 'westbengal', name: 'West Bengal', short: 'WB', region: 'East', neighbors: ['sikkim', 'assam', 'meghalaya', 'bihar', 'jharkhand', 'odisha'] },
];

// Stamp duty rates summary for display
const STAMP_DUTY_RATES = {
  andhrapradesh: { male: '5%', female: '4%', joint: '4.5%', reg: '1%' },
  arunachalpradesh: { male: '5%', female: '4%', joint: '4.5%', reg: '1%' },
  assam: { male: '6%', female: '6%', joint: '6%', reg: '1.5%' },
  bihar: { male: '6%', female: '5%', joint: '5.5%', reg: '2%' },
  chhattisgarh: { male: '5%', female: '4%', joint: '4%', reg: '1%' },
  delhi: { male: '6%', female: '4%', joint: '5%', reg: '1%' },
  goa: { male: '6.5%', female: '6.5%', joint: '6.5%', reg: '1%' },
  gujarat: { male: '4.9%', female: '4.9%', joint: '4.9%', reg: '1%' },
  haryana: { male: '6%', female: '5%', joint: '5.5%', reg: '1%' },
  himachalpradesh: { male: '6%', female: '5%', joint: '5.5%', reg: '1%' },
  jharkhand: { male: '5%', female: '4%', joint: '4.5%', reg: '1%' },
  karnataka: { male: '5%', female: '5%', joint: '5%', reg: '1% (+10% cess)' },
  kerala: { male: '8%', female: '8%', joint: '8%', reg: '2%' },
  madhyapradesh: { male: '7.5%', female: '7.5%', joint: '7.5%', reg: '3%' },
  maharashtra: { male: '6%', female: '5%', joint: '5.5%', reg: '1% (cap ₹30K)' },
  manipur: { male: '5%', female: '4%', joint: '4.5%', reg: '1%' },
  meghalaya: { male: '5%', female: '4%', joint: '4.5%', reg: '1%' },
  mizoram: { male: '5%', female: '4%', joint: '4.5%', reg: '1%' },
  nagaland: { male: '5%', female: '4%', joint: '4.5%', reg: '1%' },
  odisha: { male: '6%', female: '5%', joint: '5.5%', reg: '1.5%' },
  punjab: { male: '6%', female: '5%', joint: '5.5%', reg: '1%' },
  rajasthan: { male: '6%', female: '5%', joint: '5.5%', reg: '1%' },
  sikkim: { male: '6%', female: '5%', joint: '5.5%', reg: '1%' },
  tamilnadu: { male: '6%', female: '6%', joint: '6%', reg: '4%' },
  telangana: { male: '6%', female: '5%', joint: '5.5%', reg: '1%' },
  tripura: { male: '5%', female: '4%', joint: '4.5%', reg: '1%' },
  uttarpradesh: { male: '7%', female: '6%', joint: '6.5%', reg: '1%' }, // Note: female cap up to 1Cr
  uttarakhand: { male: '6%', female: '5%', joint: '5.5%', reg: '1%' },
  westbengal: { male: '6%', female: '5%', joint: '5.5%', reg: '1.5% (+1.5% cess)' },
};

// RTO tax summary (simplified for display)
const RTO_RATES = {
  andhrapradesh: '12-14%',
  arunachalpradesh: '6-8%',
  assam: '8-10%',
  bihar: '8-12%',
  chhattisgarh: '7-9%',
  delhi: '4-12%',
  goa: '9-11%',
  gujarat: '6-9%',
  haryana: '8-10%',
  himachalpradesh: '5-7%',
  jharkhand: '6-8%',
  karnataka: '10-18%',
  kerala: '6-15%',
  madhyapradesh: '8-12%',
  maharashtra: '11-15%',
  manipur: '6-8%',
  meghalaya: '6-8%',
  mizoram: '5-7%',
  nagaland: '5-7%',
  odisha: '8-12%',
  punjab: '6-10%',
  rajasthan: '6-10%',
  sikkim: '6-8%',
  tamilnadu: '10-15%',
  telangana: '9-14%',
  tripura: '6-8%',
  uttarpradesh: '7-10%',
  uttarakhand: '5-8%',
  westbengal: '10-12%',
};

// State-specific extra content for programmatic pages
const STATE_EXTRA = {
  madhyapradesh: {
    title: "Madhya Pradesh Stamp Duty & Registry Charges 2026 — Bhopal, Indore, MP Calculator",
    metaDesc: "Calculate Madhya Pradesh stamp duty (7.5%) and registry charges (3%) for Bhopal, Indore, Jabalpur & Gwalior. Check MP IGRS circle rates and total property registration cost. Updated 2026.",
    ogTitle: "Madhya Pradesh Stamp Duty & Registry Charges 2026 — Bhopal, Indore, MP Calculator",
    schemaName: "Madhya Pradesh Stamp Duty & Registry Charges Calculator",
    schemaDesc: "Free stamp duty and registry charges calculator for Madhya Pradesh property registration. Calculate MP IGRS circle rates, Bhopal & Indore rates.",
    contentSections: [
      {
        heading: "Madhya Pradesh Stamp Duty & Registry Charges 2026",
        body: `<p>Madhya Pradesh charges stamp duty and <strong>registry charges</strong> (commonly called "registry charges" locally, not "registration charges") on property transactions. The current rate is a flat <strong>7.5% stamp duty</strong> for all buyers regardless of gender, plus <strong>3% registry charges</strong>. Understanding the correct terminology is important — in MP, buyers and property dealers consistently use the term <strong>"registry charges"</strong> to refer to the property registration fee component.</p>

<p>The state government sets <strong>circle rates</strong> (also called collector guideline rates) for every locality across MP districts. These circle rates serve as the minimum valuation floor — stamp duty and registry charges are calculated on the higher of the agreement value or the circle rate. Each city has its own notified circle rates that differ by sector, colony, and road.</p>`
      },
      {
        heading: "Bhopal Circle Rates — What Buyers Need to Know",
        body: `<p>The search query "bhopal property tax" is often used by people who actually want to know about <strong>Bhopal circle rates</strong> for stamp duty calculation. Property tax and circle rates are different — circle rates determine your stamp duty liability, while property tax is an annual municipal tax.</p>

<p>Bhopal's circle rates are among the highest in Madhya Pradesh. Premium localities command higher rates:</p>
<ul>
  <li><strong>Arera Colony</strong> — One of the highest circle rates in Bhopal, prime residential area</li>
  <li><strong>MP Nagar</strong> — Commercial hub with premium rates for both residential and commercial properties</li>
  <li><strong>Shyamla Hills</strong> — High-value residential locality</li>
  <li><strong>Kolar Road</strong> — Growing area with moderate-to-high circle rates</li>
  <li><strong>Bairagarh</strong> — Developing area with comparatively lower rates</li>
  <li><strong>New Market Area</strong> — Premium commercial rates</li>
</ul>
<p>Bhopal circle rates are revised periodically by the collector's office. You can check the latest rates on the MP IGRS portal at <a href="https://sampada.mp.gov.in" rel="nofollow" target="_blank">sampada.mp.gov.in</a> or at the Bhopal collector's office.</p>`
      },
      {
        heading: "Indore Circle Rates — City-Wise Breakdown",
        body: `<p>Indore, the commercial capital of MP, has the most dynamic real estate market in central India. Its circle rates vary significantly by locality:</p>
<ul>
  <li><strong>Vijay Nagar</strong> — Premium locality with the highest circle rates in Indore</li>
  <li><strong>Scheme 54</strong> — High-value residential area</li>
  <li><strong>AB Road</strong> — Prime commercial corridor with premium rates</li>
  <li><strong>Nipania</strong> — Rapidly developing area with moderate rates</li>
  <li><strong>Sukhliya</strong> — Established residential area</li>
  <li><strong>LIG Colony</strong> — Affordable housing with lower circle rates</li>
  <li><strong>Bypass Road areas</strong> — Growing with competitive rates</li>
</ul>
<p>The Indore Metro project and IT Park development have pushed property values and circle rates upward in recent years.</p>`
      },
      {
        heading: "Jabalpur & Gwalior Circle Rates",
        body: `<p><strong>Jabalpur</strong> — A major administrative and military centre, Jabalpur has moderate circle rates compared to Bhopal and Indore. Key localities include Wright Town, Civil Lines, Vijay Nagar (Jabalpur), and Gorakhpur. The city's real estate is driven by government employment and educational institutions.</p>

<p><strong>Gwalior</strong> — With its historical significance and growing educational sector, Gwalior offers good investment potential. Key areas include City Centre, Lashkar, Morar, and Thatipur. Gwalior's circle rates are generally lower than Bhopal and Indore but have been rising steadily due to infrastructure development.</p>

<p>Both cities have locality-specific circle rates notified by their respective collector offices and available on the IGRS MP portal.</p>`
      },
      {
        heading: "MP IGRS Portal — sampada.mp.gov.in",
        body: `<p>The <strong>Madhya Pradesh IGRS (Inspector General of Registration & Stamps)</strong> portal at <a href="https://sampada.mp.gov.in" rel="nofollow" target="_blank">sampada.mp.gov.in</a> is the official online platform for property registration in MP. Key services available on the IGRS portal include:</p>
<ul>
  <li>Online payment of stamp duty and registry charges</li>
  <li>E-stamp certificate generation</li>
  <li>Appointment booking at Sub-Registrar offices</li>
  <li>Checking property circle rates / collector guideline rates</li>
  <li>Deed draft submission and approval</li>
  <li>Encumbrance certificate search</li>
  <li>Registered document search and verification</li>
</ul>
<p>The portal has simplified the property registration process in MP significantly. Buyers can complete most formalities online before visiting the Sub-Registrar office for biometric verification and deed execution.</p>`
      },
      {
        heading: "Stamp Duty Rates — No Gender Concession Currently",
        body: `<p>Madhya Pradesh currently charges a flat <strong>7.5% stamp duty</strong> for all buyers irrespective of gender. Unlike some other Indian states, MP does not offer a separate female concession on stamp duty as of 2026. Both male and female buyers pay the same rate.</p>
<ul>
  <li><strong>All individual buyers:</strong> 7.5% stamp duty (no gender-based difference)</li>
  <li><strong>Joint ownership — any combination:</strong> 7.5% stamp duty</li>
  <li><strong>Registry charges:</strong> 3% for all categories</li>
</ul>
<p>The 7.5% flat rate applies to all property types — residential, commercial, and agricultural. There is no upper limit on the property value. The stamp duty and registry charges combined make the total cost <strong>10.5%</strong> of the property value (higher of agreement value or circle rate).</p>`
      },
      {
        heading: "Total Cost of Property Registration in Madhya Pradesh",
        body: `<p>When buying property in MP, budget for these costs beyond the property price:</p>
<ul>
  <li><strong>Stamp duty:</strong> 7.5% of the higher of agreement value or circle rate (flat rate for all)</li>
  <li><strong>Registry charges:</strong> 3% of property value (no upper cap)</li>
  <li><strong>Document writer / typist fees:</strong> ₹1,000-3,000 depending on the deed</li>
  <li><strong>Encumbrance certificate:</strong> ₹500-1,000 per year of search</li>
  <li><strong>Mutation charges:</strong> Nominal fee at the municipal office</li>
  <li><strong>GST:</strong> 5% on under-construction properties (not direct registry cost)</li>
  <li><strong>Legal fees:</strong> 0.5-1% of property value if engaging a lawyer</li>
</ul>
<p><strong>Example:</strong> For a property valued at ₹50 lakh in Bhopal: stamp duty = ₹3.75 lakh (7.5%) + registry charges = ₹1.5 lakh (3%) = <strong>₹5.25 lakh total</strong>.</p>`
      },
      {
        heading: "How Stamp Duty is Calculated in Madhya Pradesh",
        body: `<p>Stamp duty in MP is calculated on the <strong>higher of these two values</strong>:</p>
<ol>
  <li>The agreement value (sale price agreed between buyer and seller)</li>
  <li>The circle rate (collector guideline rate) for that locality</li>
</ol>
<p>This means you cannot undervalue your property below the circle rate to save on stamp duty. The Sub-Registrar will assess the deed based on the circle rate if your agreement value is lower.</p>
<p><strong>Calculation formula:</strong><br>
Stamp duty = 7.5% × Higher of (Agreement Value, Circle Rate Value)<br>
Registry charges = 3% × Higher of (Agreement Value, Circle Rate Value)<br>
Total cost = 10.5% × Higher of (Agreement Value, Circle Rate Value)</p>`
      },
      {
        heading: "Property Registration Process in Madhya Pradesh",
        body: `<p>The registration process in Madhya Pradesh is managed through the IGRS Madhya Pradesh portal at <a href="https://sampada.mp.gov.in" rel="nofollow" target="_blank">sampada.mp.gov.in</a>. Here are the steps:</p>
<ul>
  <li><strong>Step 1:</strong> Prepare the sale deed with a registered document writer. The deed draft is submitted online through the IGRS portal.</li>
  <li><strong>Step 2:</strong> Pay stamp duty (7.5%) through e-stamping at authorised banks or online through the portal. The e-stamp certificate serves as proof of payment.</li>
  <li><strong>Step 3:</strong> Pay registry charges (3%) at the Sub-Registrar office or online via the IGRS portal.</li>
  <li><strong>Step 4:</strong> Book an appointment at the Sub-Registrar office through the online portal. Available slots can be viewed and selected.</li>
  <li><strong>Step 5:</strong> Both parties appear at the Sub-Registrar office with original documents and two witnesses. Biometric verification and photographs are taken.</li>
  <li><strong>Step 6:</strong> The Sub-Registrar verifies the deed and supporting documents. Upon satisfaction, the deed is registered and the registered copy is provided.</li>
</ul>`
      },
      {
        heading: "Documents Required for Property Registration in MP",
        body: `<p>When registering a property in Madhya Pradesh, keep these documents ready:</p>
<ul>
  <li>Sale deed on e-stamp paper</li>
  <li>Previous title documents (chain of ownership)</li>
  <li>Encumbrance certificate</li>
  <li>Jamabandi or land record certificate</li>
  <li>Mutation certificate</li>
  <li>Property tax receipts</li>
  <li>Aadhaar card and PAN card</li>
  <li>Passport-size photographs</li>
  <li>Two witnesses with identity proof</li>
  <li>NOC from society or housing board (if applicable)</li>
</ul>`
      }
    ],
    extraFaqs: [
      {
        q: "What are registry charges in Madhya Pradesh?",
        a: "In Madhya Pradesh, 'registry charges' is the local term for property registration fees. It is currently 3% of the property value (the higher of agreement value or circle rate) and is paid at the Sub-Registrar office during deed registration. This is separate from stamp duty (7.5%). Locals rarely say 'registration charges' — 'registry charges' is the commonly used term across MP."
      },
      {
        q: "How can I check circle rates in Bhopal and Indore online?",
        a: "You can check circle rates for Bhopal, Indore, Jabalpur, Gwalior, and all MP districts online through the MP IGRS portal at sampada.mp.gov.in. On the portal, navigate to the 'Circle Rate' or 'Collector Guideline Rate' section and select your district, tehsil, and locality. Circle rates are also published at the respective collector offices and are updated periodically by the state government."
      },
      {
        q: "Is there a female concession on stamp duty in Madhya Pradesh?",
        a: "As of 2026, Madhya Pradesh charges a flat stamp duty rate of 7.5% for all buyers regardless of gender. There is currently no separate female concession in MP. Both male and female buyers pay the same rate. This differs from many other Indian states that offer 1-2% concession for women."
      },
      {
        q: "What is the MP IGRS portal and what services does it offer?",
        a: "The MP IGRS (Inspector General of Registration & Stamps) portal at sampada.mp.gov.in is the official e-governance platform for property registration in Madhya Pradesh. It offers e-stamp payment, deed drafting, appointment booking, circle rate lookup, encumbrance certificate search, and registered document verification. Most of the registration process can now be completed online through this portal."
      }
    ]
  }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STATES, STAMP_DUTY_RATES, RTO_RATES, STATE_EXTRA };
}