const fs = require('fs');
const path = require('path');
const { STATES, STAMP_DUTY_RATES } = require('./state-data.js');

const PUBLIC_DIR = path.join(__dirname, 'public');
const STAMP_DIR = path.join(PUBLIC_DIR, 'programmatic', 'stamp-duty');
const RTO_DIR = path.join(PUBLIC_DIR, 'programmatic', 'rto-tax');

function getStateBySlug(slug) {
  return STATES.find(s => s.slug === slug);
}

function getNeighbors(slug) {
  const state = getStateBySlug(slug);
  if (!state) return [];
  return state.neighbors.map(n => {
    const s = getStateBySlug(n);
    return s ? { slug: s.slug, name: s.name } : null;
  }).filter(Boolean);
}

const CSS_BLOCK = `
  <style>
    .neighbor-states { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.75rem 0; }
    .neighbor-link { display: inline-flex; align-items: center; padding: 0.35rem 0.75rem; background: white; border: 1px solid #e7e5e4; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; color: #78716c; transition: all 0.2s; text-decoration: none; }
    .neighbor-link:hover { border-color: #f59e0b; color: #92400e; background: #fefce8; }
    .neighbor-link.current { border-color: #f59e0b; background: #fffbeb; color: #92400e; }
    .compare-box { background: #fefce8; border: 1px solid #fde047; border-radius: 12px; padding: 1rem; margin: 1.5rem 0; }
    .compare-box h3 { font-size: 0.875rem; font-weight: 600; color: #92400e; margin-bottom: 0.75rem; }
    .states-grid-footer { display: flex; flex-wrap: wrap; gap: 0.35rem; }
    .states-grid-footer a { display: inline-block; padding: 0.2rem 0.55rem; background: white; border: 1px solid #e7e5e4; border-radius: 4px; font-size: 0.7rem; color: #78716c; text-decoration: none; transition: all 0.15s; }
    .states-grid-footer a:hover { border-color: #f59e0b; color: #92400e; background: #fefce8; }
    .states-grid-footer a.current { border-color: #f59e0b; background: #fefce8; color: #92400e; font-weight: 600; }
  </style>`;

function surgicalUpdate(filePath, slug, category) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  const state = getStateBySlug(slug);
  if (!state) return;
  const neighbors = getNeighbors(slug);

  // 1. Add CSS if not already present
  if (!content.includes('neighbor-states')) {
    content = content.replace('</head>', CSS_BLOCK + '\n</head>');
  }

  // 2. Update breadcrumb HTML: add "All States" link
  // Pattern: Home / ToolName / <span>StateName</span>
  // Need to find: / <span class="text-stone-900">StateName</span>
  const categoryPath = category === 'stamp-duty' ? 'stamp-duty' : 'rto-tax';
  const categoryName = category === 'stamp-duty' ? 'Stamp Duty' : 'RTO Tax';
  
  // Already has the all-states link? If not, add it
  if (!content.includes('../" class="hover:text-amber-600">All States</a>')) {
    // Find the breadcrumb pattern: / <span class="text-stone-900">StateName</span>
    const breadcrumbRegex = new RegExp(`\\/ <span class="text-stone-900">${state.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/span>`);
    content = content.replace(
      breadcrumbRegex,
      `/ <a href="../" class="hover:text-amber-600">All States</a> / <span class="text-stone-900">${state.name}</span>`
    );
  }

  // 3. Update breadcrumb JSON-LD: add All States as position 3
  if (!content.includes('"All States"')) {
    // Find the position-3 state entry in BreadcrumbList and replace it
    const stateEntry = `"item": "https://desicalc.in/programmatic/${categoryPath}/${slug}"`;
    const allStatesEntry = `{ "@type": "ListItem", "position": 3, "name": "All States", "item": "https://desicalc.in/programmatic/${categoryPath}/" }`;
    const newStateEntry = `{ "@type": "ListItem", "position": 4, "name": "${state.name}", "item": "https://desicalc.in/programmatic/${categoryPath}/${slug}" }`;
    
    // Replace the old position-3 entry with new entries
    const pos3Regex = new RegExp(
      `\\{\\s*"@type":\\s*"ListItem",\\s*"position":\\s*3,\\s*"name":\\s*"${state.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",\\s*"item":\\s*"https://desicalc\\.in/programmatic/${categoryPath}/${slug}"\\s*\\}`
    );
    content = content.replace(pos3Regex, `${allStatesEntry},\n      ${newStateEntry}`);
  }

  // 4. Add "Compare with Neighboring States" box after the subtitle paragraph
  // Find: <p class="text-stone-500 mb-8">...</p> followed by calculator div
  if (!content.includes('Compare with Neighboring States') && neighbors.length > 0) {
    const neighborLinks = neighbors.map(n => 
      `<a href="../${n.slug}.html" class="neighbor-link" title="Compare with ${n.name}">${n.name}</a>`
    ).join('\n        ');
    
    const compareBox = `
    <div class="compare-box">
      <h3>Compare with Neighboring States</h3>
      <div class="neighbor-states">
        ${neighborLinks}
      </div>
      <p class="text-xs text-stone-600" style="margin:0">Click any state to compare ${categoryName.toLowerCase()} rates side-by-side.</p>
    </div>`;

    // Insert after the subtitle paragraph (mb-8 class)
    const subtitleRegex = /<p class="text-stone-500 mb-8">[^<]*<\/p>\s*\n/;
    content = content.replace(subtitleRegex, (match) => match + compareBox);
  }

  // 5. Add "All States" footer grid before </main>
  if (!content.includes('states-grid-footer">')) {
    const allStatesLinks = STATES.map(s => 
      `<a href="../${s.slug}.html"${s.slug === slug ? ' class="current"' : ''}>${s.name}</a>`
    ).join('\n        ');
    
    const footerGrid = `
    <section class="mt-12">
      <h2 class="text-lg font-bold mb-3">All States</h2>
      <div class="states-grid-footer">
        ${allStatesLinks}
      </div>
    </section>\n`;
    
    content = content.replace('</main>', footerGrid + '</main>');
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${path.basename(filePath)}`);
}

// Process all stamp duty pages
STATES.forEach(state => {
  surgicalUpdate(path.join(STAMP_DIR, `${state.slug}.html`), state.slug, 'stamp-duty');
});

// Process all RTO tax pages
STATES.forEach(state => {
  surgicalUpdate(path.join(RTO_DIR, `${state.slug}.html`), state.slug, 'rto-tax');
});

console.log('Done with surgical updates!');
