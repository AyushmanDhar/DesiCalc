// Central registry of all DesiCalc APIs
// Add new APIs here, then run: npm run generate-discovery
const MCP = {
  name: 'in.desicalc/calculators',
  version: '1.0.0',
  description: 'Indian tax & financial calculators — stamp duty, RTO tax, income tax. Provides structured JSON API responses for agent consumption.',
  title: 'DesiCalc Calculators',
  websiteUrl: 'https://desicalc.in',
  serverCardUrl: 'https://desicalc.in/mcp/server-card',
  remoteUrl: 'https://desicalc.in/mcp',
  supportedProtocolVersions: ['2025-03-26'],
};

const APIS = [
  {
    id: 'stampDuty',
    name: 'Stamp Duty Calculator',
    description: 'Calculate Indian stamp duty rates by state and property value',
    anchor: 'https://desicalc.in/programmatic/stamp-duty/{state}',
    serviceDoc: 'https://desicalc.in/tools/stamp-duty',
    serviceDesc: 'https://desicalc.in/openapi/stamp-duty.json',
    inputSchema: {
      type: 'object',
      properties: {
        state: { type: 'string', description: 'Indian state ID (e.g. karnataka, maharashtra)' },
        propertyValue: { type: 'number', description: 'Property value in INR' },
        propertyType: { type: 'string', enum: ['residential', 'commercial'], default: 'residential' },
        gender: { type: 'string', enum: ['male', 'female', 'joint'], default: 'male' }
      }
    },
    outputSchema: {
      type: 'object',
      properties: {
        stampDuty: { type: 'number' },
        registration: { type: 'number' },
        total: { type: 'number' },
        stampDutyRate: { type: 'number' },
        registrationRate: { type: 'number' }
      }
    }
  },
  {
    id: 'rtoTax',
    name: 'RTO Tax Calculator',
    description: 'Calculate Indian RTO road tax by state and vehicle price',
    anchor: 'https://desicalc.in/programmatic/rto-tax/{state}',
    serviceDoc: 'https://desicalc.in/tools/rto-tax',
    serviceDesc: 'https://desicalc.in/openapi/rto-tax.json',
    inputSchema: {
      type: 'object',
      properties: {
        state: { type: 'string', description: 'Indian state ID (e.g. karnataka, maharashtra)' },
        vehiclePrice: { type: 'number', description: 'Ex-showroom price in INR' },
        fuelType: { type: 'string', enum: ['petrol', 'diesel', 'electric', 'cng'], default: 'petrol' },
        vehicleType: { type: 'string', enum: ['car', 'bike', 'scooter'], default: 'car' }
      }
    },
    outputSchema: {
      type: 'object',
      properties: {
        roadTax: { type: 'number' },
        registrationFees: { type: 'number' },
        total: { type: 'number' },
        taxRate: { type: 'number' }
      }
    }
  },
  {
    id: 'incomeTax',
    name: 'Income Tax Calculator',
    description: 'Calculate Indian income tax under old and new regimes',
    anchor: 'https://desicalc.in/tools/income-tax',
    serviceDoc: 'https://desicalc.in/tools/income-tax',
    serviceDesc: 'https://desicalc.in/openapi/income-tax.json',
    inputSchema: {
      type: 'object',
      properties: {
        income: { type: 'number', description: 'Annual income in INR' },
        regime: { type: 'string', enum: ['old', 'new'], default: 'new' },
        age: { type: 'number', description: 'Age in years' },
        section80c: { type: 'number', description: 'Section 80C deductions in INR', default: 0 },
        section80d: { type: 'number', description: 'Section 80D deductions in INR', default: 0 },
        hra: { type: 'number', description: 'HRA claimed in INR', default: 0 }
      }
    },
    outputSchema: {
      type: 'object',
      properties: {
        taxableIncome: { type: 'number' },
        taxAmount: { type: 'number' },
        cessAmount: { type: 'number' },
        totalTax: { type: 'number' },
        effectiveRate: { type: 'number' }
      }
    }
  }
];

module.exports = { APIS, MCP };
