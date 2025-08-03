const https = require('https');
const http = require('http');

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://credosafe.onrender.com';
const PING_INTERVAL = 13 * 60 * 1000; // 13 minutes (Render free tier timeout is 15 minutes)

console.log('🔄 Frontend keep-alive script started');
console.log(`📡 Frontend URL: ${FRONTEND_URL}`);
console.log(`⏰ Interval: ${PING_INTERVAL / 1000 / 60} minutes`);

function pingFrontend() {
  const url = new URL(FRONTEND_URL);
  const client = url.protocol === 'https:' ? https : http;
  
  const req = client.get(FRONTEND_URL, (res) => {
    console.log(`✅ Frontend ping successful - Status: ${res.statusCode} - ${new Date().toISOString()}`);
  });
  
  req.on('error', (err) => {
    console.error(`❌ Frontend ping failed: ${err.message} - ${new Date().toISOString()}`);
  });
  
  req.setTimeout(10000, () => {
    console.error(`⏰ Frontend ping timeout - ${new Date().toISOString()}`);
    req.destroy();
  });
}

// Start pinging
pingFrontend();

// Set up interval
setInterval(pingFrontend, PING_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Frontend keep-alive script stopped');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Frontend keep-alive script stopped');
  process.exit(0);
}); 