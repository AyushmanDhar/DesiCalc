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
  html = html.replace(/[ \t]*<script[^>]*adsbygoogle\.js[^>]*><\/script>\s*/gi, '');
  html = html.replace(
    /[ \t]*<script[^>]*src=(["'])(?:[^"']*[/\\])?ad\.js(?:\?[^"']*)?\1[^>]*><\/script>\s*/gi,
    '',
  );
  html = html.replace(/[ \t]*<ins[^>]*adsbygoogle[\s\S]*?<\/ins>\s*/gi, '');
  html = html.replace(/[ \t]*<script>\s*\(adsbygoogle[^<]*<\/script>\s*/gi, '');
  html = html.replace(/[ \t]*<script[^>]*>[^<]*adsbygoogle[^<]*<\/script>\s*/gi, '');
  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log(`cleaned ${path.relative(PUBLIC, file)}`);
  }
}
