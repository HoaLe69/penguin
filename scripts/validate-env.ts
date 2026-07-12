import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Validate that all required environment variables are present
const REQUIRED_VARS = [
  'REACT_APP_API_URL',
  'REACT_APP_SOCKET_URL',
  'REACT_APP_GOOGLE_CLIENT_KEY',
];

const missing = REQUIRED_VARS.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.error(`\n❌ Missing required environment variables: ${missing.join(', ')}\n`);
  console.error(`Please create a .env file in the project root and set these variables.`);
  console.error(`You can copy .env.example to .env and fill in the values:\n`);
  console.error(`  cp .env.example .env\n`);
  process.exit(1);
}
