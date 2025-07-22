// apiClient.js
import axios from 'axios';
import baseURL from './baseUrl';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});


const tokenManager = {
  getToken: () => {
   
    return window.authToken || null;
  },
  
  setToken: (token) => {
    window.authToken = token;
  },
  
  removeToken: () => {
    delete window.authToken;
  },
  
  getRefreshToken: () => {
    return window.refreshToken || null;
  },
  
  setRefreshToken: (token) => {
    window.refreshToken = token;
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata?.startTime;
    
    console.log(`✅ [${response.config.method?.toUpperCase()}] ${response.config.url} - ${response.status} (${duration}ms)`);
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Calculate request duration for failed requests
    const duration = originalRequest.metadata?.startTime 
      ? new Date() - originalRequest.metadata.startTime 
      : 0;
    
    console.error(`❌ [${originalRequest.method?.toUpperCase()}] ${originalRequest.url} - ${error.response?.status || 'Network Error'} (${duration}ms)`);
    
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return handleUnauthorized(error, originalRequest);
        case 403:
          return handleForbidden(error);
        case 404:
          return handleNotFound(error);
        case 422:
          return handleValidationError(error);
        case 429:
          return handleRateLimit(error, originalRequest);
        case 500:
        case 502:
        case 503:
        case 504:
          return handleServerError(error, originalRequest);
        default:
          return handleGenericError(error);
      }
    } else if (error.request) {
      // Network error (no response received)
      return handleNetworkError(error, originalRequest);
    } else {
      // Request setup error
      return handleRequestError(error);
    }
  }
);

// Error handling functions
async function handleUnauthorized(error, originalRequest) {
  const refreshToken = tokenManager.getRefreshToken();
  
  // Prevent infinite refresh loops
  if (originalRequest._retry || !refreshToken) {
    tokenManager.removeToken();
    window.location.href = '/login';
    return Promise.reject(error);
  }
  
  originalRequest._retry = true;
  
  try {
    const response = await axios.post('/auth/refresh', {
      refreshToken: refreshToken
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    tokenManager.setToken(accessToken);
    tokenManager.setRefreshToken(newRefreshToken);
    
    // Retry original request with new token
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient(originalRequest);
  } catch (refreshError) {
    tokenManager.removeToken();
    window.location.href = '/login';
    return Promise.reject(refreshError);
  }
}

function handleForbidden(error) {
  showErrorNotification('Access forbidden. You don\'t have permission to perform this action.');
  return Promise.reject({
    ...error,
    userMessage: 'You don\'t have permission to perform this action'
  });
}

function handleNotFound(error) {
  showErrorNotification('Resource not found.');
  return Promise.reject({
    ...error,
    userMessage: 'The requested resource was not found'
  });
}

function handleValidationError(error) {
  const validationErrors = error.response?.data?.errors || {};
  const messages = Object.values(validationErrors).flat();
  
  showErrorNotification(`Validation failed: ${messages.join(', ')}`);
  return Promise.reject({
    ...error,
    userMessage: 'Please check your input and try again',
    validationErrors
  });
}

async function handleRateLimit(error, originalRequest) {
  const retryAfter = error.response?.headers['retry-after'] || 1;
  
  showErrorNotification(`Rate limit exceeded. Retrying in ${retryAfter} seconds...`);
  
  // Wait for retry-after duration
  await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
  
  // Retry the original request
  return apiClient(originalRequest);
}

async function handleServerError(error, originalRequest) {
  const maxRetries = 3;
  const retryCount = originalRequest._retryCount || 0;
  
  if (retryCount < maxRetries) {
    originalRequest._retryCount = retryCount + 1;
    
    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount) * 1000;
    
    console.log(`🔄 Retrying request (${retryCount + 1}/${maxRetries}) in ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return apiClient(originalRequest);
  }
  
  showErrorNotification('Server error. Please try again later.');
  return Promise.reject({
    ...error,
    userMessage: 'Server error. Please try again later.'
  });
}

async function handleNetworkError(error, originalRequest) {
  const maxRetries = 2;
  const retryCount = originalRequest._retryCount || 0;
  
  if (retryCount < maxRetries) {
    originalRequest._retryCount = retryCount + 1;
    
    const delay = 2000; // 2 second delay for network retries
    
    console.log(`🔄 Network error, retrying (${retryCount + 1}/${maxRetries}) in ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return apiClient(originalRequest);
  }
  
  showErrorNotification('Network error. Please check your connection.');
  return Promise.reject({
    ...error,
    userMessage: 'Network error. Please check your internet connection.'
  });
}

function handleRequestError(error) {
  console.error('Request setup error:', error);
  showErrorNotification('Request configuration error.');
  return Promise.reject({
    ...error,
    userMessage: 'Request configuration error'
  });
}

function handleGenericError(error) {
  const message = error.response?.data?.message || 'An unexpected error occurred';
  showErrorNotification(message);
  return Promise.reject({
    ...error,
    userMessage: message
  });
}

// Notification system (you can integrate with your preferred notification library)
function showErrorNotification(message) {
  // Example using browser's built-in notification
  // You can replace this with your preferred notification library (react-toast, react-hot-toast, etc.)
  console.error('API Error:', message);
  
  // If you're using a notification library, replace this with:
  // toast.error(message);
  // or
  // notification.error({ message });
}

// API helper functions
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // Utility methods
  setAuthToken: (token) => tokenManager.setToken(token),
  removeAuthToken: () => tokenManager.removeToken(),
  
  // Request with custom retry logic
  requestWithRetry: async (requestConfig, maxRetries = 3) => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await apiClient(requestConfig);
      } catch (error) {
        if (i === maxRetries) throw error;
        
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
};

export default apiClient;