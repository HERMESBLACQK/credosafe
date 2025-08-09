import axios from 'axios';

// Create axios instance for support chat
const getApiBaseUrl = () => {
  // Check if we're in production (on render.com)
  if (window.location.hostname.includes('onrender.com') || window.location.protocol === 'https:') {
    return 'https://server-b6ns.onrender.com/api';
  }
  // Development fallback
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const supportChatService = {
  // Get user's conversations
  getConversations: async () => {
    try {
      console.log('🔍 [USER SUPPORT CHAT] Getting conversations...');
      console.log('📤 Request URL: /support-chat/conversations');
      console.log('📤 Base URL:', API_BASE_URL);
      
      const response = await apiClient.get('/support-chat/conversations');
      
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ [USER SUPPORT CHAT] Error getting conversations:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      } else {
        throw new Error('Network error: Unable to connect to server');
      }
    }
  },

  // Create new conversation
  createConversation: async (conversationData) => {
    try {
      console.log('🔍 [USER SUPPORT CHAT] Creating conversation...');
      console.log('📤 Request URL: /support-chat/conversations');
      console.log('📤 Conversation Data:', JSON.stringify(conversationData, null, 2));
      
      const response = await apiClient.post('/support-chat/conversations', conversationData);
      
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ [USER SUPPORT CHAT] Error creating conversation:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      } else {
        throw new Error('Network error: Unable to connect to server');
      }
    }
  },

  // Get conversation details with messages
  getConversationDetails: async (conversationId) => {
    try {
      console.log('🔍 [USER SUPPORT CHAT] Getting conversation details...');
      console.log('📤 Request URL:', `/support-chat/conversations/${conversationId}`);
      console.log('📤 Conversation ID:', conversationId);
      
      const response = await apiClient.get(`/support-chat/conversations/${conversationId}`);
      
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ [USER SUPPORT CHAT] Error getting conversation details:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      } else {
        throw new Error('Network error: Unable to connect to server');
      }
    }
  },

  // Send message in conversation
  sendMessage: async (conversationId, message) => {
    try {
      console.log('🔍 [USER SUPPORT CHAT] Sending message...');
      console.log('📤 Request URL:', `/support-chat/conversations/${conversationId}/messages`);
      console.log('📤 Conversation ID:', conversationId);
      console.log('📤 Message:', message);
      
      const response = await apiClient.post(`/support-chat/conversations/${conversationId}/messages`, {
        message
      });
      
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ [USER SUPPORT CHAT] Error sending message:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      } else {
        throw new Error('Network error: Unable to connect to server');
      }
    }
  },

  // Upload file for conversation
  uploadFile: async (conversationId, file) => {
    try {
      console.log('🔍 [USER SUPPORT CHAT] Uploading file...');
      console.log('📤 Request URL: /support-chat/upload');
      console.log('📤 Conversation ID:', conversationId);
      console.log('📤 File:', file.name, file.size, file.type);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);

      const response = await apiClient.post('/support-chat/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ [USER SUPPORT CHAT] Error uploading file:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      } else {
        throw new Error('Network error: Unable to connect to server');
      }
    }
  }
};

export default supportChatService;
