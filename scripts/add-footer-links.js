const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');

const TRUST_LINKS = {
  methodology: '<a href="/methodology" data-i18n="footer.methodology">Methodology</a>',
  editorial: '<a href="/editorial-policy" data-i18n="footer.editorial">Editorial Policy</a>',
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function indentAt(text, index) {
  const lineStart = text.lastIndexOf('\n', index - 1) + 1;
  return (text.slice(lineStart, index).match(/^[ \t]*/) || [''])[0];
}

function childIndentOf(footer, footerOpenIndent) {
  const first = footer.match(/\r?\n([ \t]+)<(?:div|nav|p|ul)\b/i);
  return first ? first[1] : `${footerOpenIndent}  `;
}

function trustBlock(footer) {
  return footer.match(/<div class="footer-trust">[\s\S]*?<\/div>/i);
}

function renderTrust(divIndent, anchors, closeIndent) {
  const anchorIndent = divIndent + '  ';
  return (
    `${divIndent}<div class="footer-trust">\n` +
    anchors.map((anchor) => `${anchorIndent}${anchor}`).join('\n') +
    `\n${divIndent}</div>\n${closeIndent}</footer>`
  );
}

for (const file of walk(PUBLIC)) {
  let html = fs.readFileSync(file, 'utf8');
  const footerMatch = html.match(/<footer\b[\s\S]*?<\/footer>/i);
  if (!footerMatch) continue;

  const footer = footerMatch[0];
  const footerIndex = footerMatch.index;
  const footerOpenIndent = indentAt(html, footerIndex);
  const childIndent = childIndentOf(footer, footerOpenIndent);
  const existingBlock = trustBlock(footer);

  const needsMethodology = !footer.includes('href="/methodology"');
  const needsEditorial = !footer.includes('href="/editorial-policy"');

  let nextFooter = footer;

  if (existingBlock) {
    const blockIndex = footer.indexOf(existingBlock[0]);
    const blockLineStart = footer.lastIndexOf('\n', blockIndex - 1) + 1;
    const anchors = [...existingBlock[0].matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map((m) => m[0]);
    if (needsMethodology) anchors.unshift(TRUST_LINKS.methodology);
    if (needsEditorial) anchors.push(TRUST_LINKS.editorial);
    const end = footer.lastIndexOf('</footer>') + '</footer>'.length;
    nextFooter =
      footer.slice(0, blockLineStart) +
      renderTrust(childIndent, anchors, footerOpenIndent) +
      footer.slice(end);
  } else if (needsMethodology || needsEditorial) {
    const missing = [];
    if (needsMethodology) missing.push(TRUST_LINKS.methodology);
    if (needsEditorial) missing.push(TRUST_LINKS.editorial);

    const aboutMatch = footer.match(/<a\s+href="\/?about"/i);
    if (aboutMatch) {
      const aboutIndex = footer.indexOf(aboutMatch[0]);
      const lineStart = footer.lastIndexOf('\n', aboutIndex - 1) + 1;
      const aboutIndent = indentAt(footer, aboutIndex);
      const insert = missing.map((anchor) => `${aboutIndent}${anchor}`).join('\n') + '\n';
      nextFooter = footer.slice(0, lineStart) + insert + footer.slice(lineStart);
    } else {
      const closeIndex = footer.lastIndexOf('</footer>');
      const closeLineStart = footer.lastIndexOf('\n', closeIndex - 1) + 1;
      nextFooter =
        footer.slice(0, closeLineStart) +
        renderTrust(childIndent, missing, footerOpenIndent);
    }
  }

  if (nextFooter !== footer) {
    html = html.slice(0, footerIndex) + nextFooter + html.slice(footerIndex + footer.length);
    fs.writeFileSync(file, html);
    console.log(`footer links updated: ${path.relative(PUBLIC, file)}`);
  }
}
