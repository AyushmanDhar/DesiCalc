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
  const before = html;

  html = html.replace(/<html lang="en" data-lang="en">/g, '<html lang="en">');
  html = html.replace(/[ \t]*<div class="lang-toggle"[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/[ \t]*<script[^>]*src="[^"]*lang-(en|hi)\.js"[^>]*><\/script>\s*/g, '');
  html = html.replace(/^\s*initLang\(\);\s*\n/gm, '');
  html = html.replace(/\n\s*document\.querySelectorAll\('\[data-lang-btn\]'\)[\s\S]*?getLang\(\)\);\s*\n\s*\}\);\s*\n/g, '\n');
  html = html.replace(/[ \t]*\n?[ \t]*<script>\s*setLang\('(en|hi)'\);\s*<\/script>\s*\n?/g, '');
  html = html.replace(/\s+data-i18n="[^"]*"/g, '');
  html = html.replace(/\s+data-i18n-html(?=[\s>])/g, '');
  html = html.replace(/\s+data-lang-btn="[^"]*"/g, '');
  html = html.replace(/\s+data-lang="en"/g, '');

  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log(`cleaned ${path.relative(PUBLIC, file)}`);
  }
}

for (const name of ['lang-en.js', 'lang-hi.js']) {
  const file = path.join(PUBLIC, 'assets', 'js', name);
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`deleted assets/js/${name}`);
  }
}
