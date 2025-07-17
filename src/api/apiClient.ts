import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import qs from 'qs';

const TOKEN_KEY = 'authToken';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params, { allowDots: true });
    },
  },
});

// Request interceptor: Add Authorization header to all requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    
    // Add Authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors and trigger logout
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses
    const res = response.data;
    if (res.code && res.code !== 0) {
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    console.error('Response error:', error.message);
    
    // Check if the error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('auth-logout'));
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Configure axios-retry for automatic request retry functionality
axiosRetry(apiClient, {
  // Maximum number of retry attempts
  retries: 3,
  
  // Retry condition: Only retry on network errors or 5xx server errors
  retryCondition: (error) => {
    // Retry on network errors (no response received)
    if (axiosRetry.isNetworkError(error)) {
      return true;
    }
    
    // Retry on 5xx server errors (500, 502, 503, 504, etc.)
    if (axiosRetry.isRetryableError(error)) {
      return error.response?.status ? error.response.status >= 500 : false;
    }
    
    // Do not retry on 4xx client errors (401, 403, 404, etc.)
    return false;
  },
  
  // Exponential backoff delay strategy
  retryDelay: (retryCount) => {
    // Calculate delay: retryCount * 2000ms (2s, 4s, 6s for retries 1, 2, 3)
    const delay = retryCount * 2000;
    return delay;
  },
  
  // Logging callback for each retry attempt
  onRetry: (retryCount, error) => {
    const errorMessage = error.message || 'Unknown error';
    console.warn(`API 請求錯誤: ${errorMessage}. 正在進行第 ${retryCount} 次重試...`);
  }
});

export default apiClient;