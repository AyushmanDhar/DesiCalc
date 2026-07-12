const fs = require('fs');
const path = require('path');
const { APIS } = require('./api-config.js');

const PUBLIC_DIR = path.join(__dirname, 'public');
const WELL_KNOWN_DIR = path.join(PUBLIC_DIR, '.well-known');

function generateApiCatalog() {
  const linkset = APIS.map(api => ({
    anchor: api.anchor,
    'service-desc': [
      { href: api.serviceDesc, type: 'application/vnd.oai.openapi+json;version=3.0' }
    ],
    'service-doc': [
      { href: api.serviceDoc, type: 'text/html' }
    ],
    'status': [
      { href: 'https://desicalc.in/.well-known/api-catalog', type: 'application/linkset+json' }
    ]
  }));

  return JSON.stringify({ linkset }, null, 2) + '\n';
}

function generateAgentCard() {
  const capabilities = {};
  APIS.forEach(api => {
    capabilities[api.id] = {
      name: api.name,
      description: api.description,
      url: api.anchor,
      inputSchema: api.inputSchema,
      outputSchema: api.outputSchema
    };
  });

  return JSON.stringify({
    $schema: 'https://raw.githubusercontent.com/google/A2A/main/specification/json/a2a-agent-card-schema.json',
    schemaVersion: 'v1',
    name: 'DesiCalc',
    description: 'Indian tax & financial calculator platform — stamp duty, RTO tax, income tax. Provides structured JSON API responses for agent consumption.',
    url: 'https://desicalc.in',
    version: '1.0.0',
    capabilities,
    authentication: { type: 'none' },
    wellKnown: 'https://desicalc.in/.well-known/agent-card.json'
  }, null, 2) + '\n';
}

// Write api-catalog
const catalogPath = path.join(WELL_KNOWN_DIR, 'api-catalog');
fs.writeFileSync(catalogPath, generateApiCatalog());
console.log('Generated .well-known/api-catalog');

// Write agent-card.json
const cardPath = path.join(WELL_KNOWN_DIR, 'agent-card.json');
fs.writeFileSync(cardPath, generateAgentCard());
console.log('Generated .well-known/agent-card.json');

console.log('Done! Run `npm run generate-discovery` after adding new APIs to api-config.js.');
