const https = require('https');
const http = require('http');

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'https://server-b6ns.onrender.com';
const ADMIN_URL = process.env.ADMIN_URL || 'https://admin-b6ns.onrender.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://credosafe.onrender.com';
const HEALTH_ENDPOINT = '/health';

const URLS = [
  { name: 'Server', url: `${SERVER_URL}${HEALTH_ENDPOINT}` },
  { name: 'Admin', url: `${ADMIN_URL}${HEALTH_ENDPOINT}` },
  { name: 'Frontend', url: `${FRONTEND_URL}${HEALTH_ENDPOINT}` },
];

console.log('🔄 Starting keep-alive service for CredoSafe Frontend...');
console.log('📡 Pinging services every 3 minutes:');
URLS.forEach(({ name, url }) => console.log(`  - ${name}: ${url}`));

// Function to ping a service
const pingService = (name, url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200 && response.status === 'OK') {
            console.log(`✅ ${name} is running - Status: ${response.status}`);
            console.log(`   📅 Timestamp: ${response.timestamp}`);
            resolve(response);
          } else {
            console.log(`⚠️ ${name} responded but status is not OK:`, response);
            resolve(response);
          }
        } catch (error) {
          console.log(`⚠️ ${name} responded but couldn't parse JSON:`, data);
          resolve({ status: 'UNKNOWN', data });
        }
      });
    });
    req.on('error', (error) => {
      console.error(`❌ Failed to ping ${name}:`, error.message);
      reject(error);
    });
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Function to ping all services
const pingAllServices = async () => {
  console.log(`\n🕐 [${new Date().toISOString()}] Pinging all services...`);
  let hasError = false;
  for (const { name, url } of URLS) {
    try {
      await pingService(name, url);
    } catch (error) {
      hasError = true;
      console.error(`❌ Keep-alive failed for ${name}:`, error.message);
    }
  }
  if (hasError) {
    console.log('⚠️ Some services failed to respond');
  } else {
    console.log('✅ All services responded successfully');
  }
  console.log(`⏰ Next ping in 3 minutes...\n`);
};

// Initial ping
pingAllServices();

// Set up interval to ping every 3 minutes
setInterval(pingAllServices, 3 * 60 * 1000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Keep-alive service stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Keep-alive service stopped');
  process.exit(0);
}); 