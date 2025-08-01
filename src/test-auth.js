// Test authentication state
console.log('🔍 Testing authentication state...');

// Check localStorage
const token = localStorage.getItem('token');
console.log('🔑 Token present:', !!token);
console.log('🔑 Token length:', token ? token.length : 0);

// Check API base URL
const getApiBaseUrl = () => {
  if (window.location.hostname.includes('onrender.com') || window.location.protocol === 'https:') {
    return 'https://server-b6ns.onrender.com/api';
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('🌐 API Base URL:', API_BASE_URL);

// Test API call
async function testAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/devices`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response status:', response.status);
    const data = await response.json();
    console.log('📄 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Authentication working!');
    } else {
      console.log('❌ Authentication failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

if (token) {
  testAuth();
} else {
  console.log('❌ No token found - user not authenticated');
} 