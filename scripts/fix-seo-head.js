const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const TODAY = '2026-10-30';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function cleanUrl(file) {
  const rel = path.relative(PUBLIC, file).replace(/\\/g, '/');
  if (rel === 'index.html') return 'https://desicalc.in/';
  if (rel.endsWith('/index.html')) return `https://desicalc.in/${rel.slice(0, -'index.html'.length)}`;
  return `https://desicalc.in/${rel.replace(/\.html$/, '')}`;
}

for (const file of walk(PUBLIC)) {
  let html = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(PUBLIC, file).replace(/\\/g, '/');

  html = html.replace(/[ \t]*<link\s+rel="alternate"\s+hreflang="hi"[^>]*>[ \t]*\r?\n?/gi, '');

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  for (const [prop, value] of [
    ['og:title', titleMatch && titleMatch[1]],
    ['og:description', descMatch && descMatch[1]],
  ]) {
    if (value == null) continue;
    const tag = `<meta property="${prop}" content="${value}">`;
    const tagRe = new RegExp(`^[ \\t]*<meta\\s+property="${prop}"[^>]*>`, 'im');
    if (tagRe.test(html)) {
      html = html.replace(tagRe, () => `  ${tag}`);
    } else {
      html = html.replace(/<\/head>/i, () => `  ${tag}\n</head>`);
    }
  }

  const ogType = relPath.startsWith('guides/') || relPath.startsWith('comparisons/') ? 'article' : 'website';
  const ogRe = /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>>?/i;
  if (ogRe.test(html)) {
    html = html.replace(ogRe, `<meta property="og:type" content="${ogType}">`);
  } else {
    html = html.replace(/<\/head>/i, `  <meta property="og:type" content="${ogType}">\n</head>`);
  }
  html = html.replace(/(<meta\s+property="og:type"[^>]*>)(?=<meta\b)/gi, '$1\n  ');

  if (!html.includes('"dateModified"')) {
    const url = cleanUrl(file);
    const block =
      `  <script type="application/ld+json">\n` +
      `  {"@context":"https://schema.org","@type":"WebPage","url":"${url}","dateModified":"${TODAY}"}\n` +
      `  </script>\n`;
    html = html.replace(/<\/head>/i, `${block}</head>`);
  }

  if (relPath === 'index.html' && !html.includes('"@type": "Organization"')) {
    const block =
      `  <script type="application/ld+json">\n` +
      `  {"@context":"https://schema.org","@type": "Organization","name":"DesiCalc","url":"https://desicalc.in","logo":"https://desicalc.in/assets/img/og-home.png"}\n` +
      `  </script>\n`;
    html = html.replace(/<\/head>/i, `${block}</head>`);
  }

  fs.writeFileSync(file, html);
}

console.log('head normalization complete');
