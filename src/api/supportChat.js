import axios from 'axios';
import apiResponseHandler from '../utils/apiResponseHandler';

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
    return await apiResponseHandler.handleApiCall(
      () => apiClient.get('/support-chat/conversations'),
      {
        loadingMessage: 'Loading conversations...',
        successMessage: 'Conversations loaded successfully',
        errorMessage: 'Failed to load conversations',
        showSuccessToast: false,
        showErrorToast: true
      }
    );
  },

  // Create new conversation
  createConversation: async (conversationData) => {
    return await apiResponseHandler.handleApiCall(
      () => apiClient.post('/support-chat/conversations', conversationData),
      {
        loadingMessage: 'Creating conversation...',
        successMessage: 'Conversation created successfully!',
        errorMessage: 'Failed to create conversation'
      }
    );
  },

  // Get conversation details with messages
  getConversationDetails: async (conversationId) => {
    return await apiResponseHandler.handleApiCall(
      () => apiClient.get(`/support-chat/conversations/${conversationId}`),
      {
        loadingMessage: 'Loading conversation details...',
        successMessage: 'Conversation details loaded successfully',
        errorMessage: 'Failed to load conversation details',
        showSuccessToast: false,
        showErrorToast: true
      }
    );
  },

  // Send message in conversation
  sendMessage: async (conversationId, message) => {
    return await apiResponseHandler.handleApiCall(
      () => apiClient.post(`/support-chat/conversations/${conversationId}/messages`, {
        message
      }),
      {
        loadingMessage: 'Sending message...',
        successMessage: 'Message sent successfully!',
        errorMessage: 'Failed to send message'
      }
    );
  },

  // Upload file for conversation
  uploadFile: async (conversationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);

    return await apiResponseHandler.handleApiCall(
      () => apiClient.post('/support-chat/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      {
        loadingMessage: 'Uploading file...',
        successMessage: 'File uploaded successfully!',
        errorMessage: 'Failed to upload file'
      }
    );
  }
};

export default supportChatService;