const fs = require('fs');
const path = require('path');

function extractFAQs(html) {
  const faqs = [];
  const faqItemRegex = /<div class="faq-item">([\s\S]*?)<\/div>\s*(?=<div class="faq-item">|<\/section>)/g;
  const questionRegex = /<button class="faq-question"[^>]*><span>([^<]+)<\/span><span class="faq-icon">\+<\/span><\/button>/;
  const answerRegex = /<div class="faq-answer">([\s\S]*?)<\/div>/;

  let match;
  while ((match = faqItemRegex.exec(html)) !== null) {
    const itemHtml = match[1];
    const qMatch = itemHtml.match(questionRegex);
    const aMatch = itemHtml.match(answerRegex);
    if (qMatch && aMatch) {
      const question = qMatch[1].trim();
      const answer = aMatch[1].trim().replace(/\s+/g, ' ');
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

function buildFAQPageSchema(faqs, pageUrl) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  return JSON.stringify(schema, null, 2);
}

function injectFAQSchema(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Check if FAQPage schema already exists
  if (html.includes('"@type": "FAQPage"')) {
    console.log(`  SKIP: FAQPage already exists`);
    return false;
  }

  const faqs = extractFAQs(html);
  if (faqs.length === 0) {
    console.log(`  SKIP: No FAQs found`);
    return false;
  }

  const pageUrl = filePath
    .replace(/.*public/, 'https://desicalc.in')
    .replace(/\\/g, '/')
    .replace(/\.html$/, '');

  const schema = buildFAQPageSchema(faqs, pageUrl);
  const schemaScript = `  <script type="application/ld+json">\n${schema}\n  </script>\n`;

  // Find the last </script> before </head> and insert after it
  const headEndIndex = html.indexOf('</head>');
  if (headEndIndex === -1) {
    console.log(`  ERROR: No </head> found`);
    return false;
  }

  // Find the last script tag in head
  const headContent = html.substring(0, headEndIndex);
  const lastScriptIndex = headContent.lastIndexOf('</script>');
  if (lastScriptIndex === -1) {
    console.log(`  ERROR: No script tags in head`);
    return false;
  }

  const insertIndex = lastScriptIndex + '</script>'.length;
  const newHtml = html.slice(0, insertIndex) + '\n' + schemaScript + html.slice(insertIndex);

  fs.writeFileSync(filePath, newHtml, 'utf8');
  console.log(`  OK: Added ${faqs.length} FAQs`);
  return true;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  console.log(`\nProcessing ${files.length} files in ${path.basename(dir)}...`);
  let count = 0;
  for (const file of files) {
    const filePath = path.join(dir, file);
    console.log(`  ${file}:`);
    if (injectFAQSchema(filePath)) count++;
  }
  console.log(`  Done: ${count}/${files.length} files updated`);
}

const stampDutyDir = path.join(__dirname, 'public', 'programmatic', 'stamp-duty');
const rtoTaxDir = path.join(__dirname, 'public', 'programmatic', 'rto-tax');

processDirectory(stampDutyDir);
processDirectory(rtoTaxDir);

console.log('\nAll done!');