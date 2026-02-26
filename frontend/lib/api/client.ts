/**
 * Axios client configuration with interceptors for authentication and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from '../auth/token';
import type { ApiError } from '@/types';

// Create Axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT token to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for consistent error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error: AxiosError<any>) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      removeToken();
      
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Format error for consistent handling
    const apiError: any = {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      error: error.response?.data?.error || 'Error',
    };

    // Include validation errors if present
    if (error.response?.data?.errors) {
      apiError.errors = error.response.data.errors;
    }
    
    return Promise.reject(apiError);
  }
);

export default apiClient;
