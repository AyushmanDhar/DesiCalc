const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

for (const file of walk(PUBLIC)) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('href="/methodology"')) continue;

  const links = `<a href="/methodology" data-i18n="footer.methodology">Methodology</a>\n      <a href="/editorial-policy" data-i18n="footer.editorial">Editorial Policy</a>\n      `;
  if (html.includes('<a href="about"')) {
    html = html.replace('<a href="about"', `${links}<a href="about"`);
  } else if (html.includes('<a href="/about"')) {
    html = html.replace('<a href="/about"', `${links}<a href="/about"`);
  } else {
    html = html.replace('</footer>', `  <div class="footer-trust">${links}</div>\n</footer>`);
  }

  fs.writeFileSync(file, html);
  console.log(`footer links added: ${path.relative(PUBLIC, file)}`);
}
