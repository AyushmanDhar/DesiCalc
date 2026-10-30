const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const TODAY = '2026-10-30';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html') && !entry.name.startsWith('startupranking')) out.push(full);
  }
  return out;
}

function cleanUrl(file) {
  const rel = path.relative(PUBLIC, file).replace(/\\/g, '/');
  if (rel === 'index.html') return 'https://desicalc.in/';
  if (rel.endsWith('/index.html')) return `https://desicalc.in/${rel.slice(0, -'index.html'.length)}`;
  return `https://desicalc.in/${rel.replace(/\.html$/, '')}`;
}

function lastCommitDate(file) {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: ROOT, encoding: 'utf8' }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : TODAY;
  } catch {
    return TODAY;
  }
}

const entries = walk(PUBLIC)
  .map((file) => ({ file, loc: cleanUrl(file), lastmod: lastCommitDate(file) }))
  .sort((a, b) => a.loc.localeCompare(b.loc));

const body = entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${entry.loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${entry.loc}" />
    <lastmod>${entry.lastmod}</lastmod>
    <priority>${entry.loc === 'https://desicalc.in/' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), xml);
console.log(`sitemap written with ${entries.length} URLs`);
