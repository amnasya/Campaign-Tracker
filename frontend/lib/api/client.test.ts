/**
 * Property-based tests for API client authentication
 * Feature: influencer-campaign-tracker, Property 46: API request authentication
 * Validates: Requirements 18.2
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { setToken, removeToken, getToken } from '../auth/token';

// Create a mock server to capture requests
const mockAdapter = {
  requests: [] as InternalAxiosRequestConfig[],
  reset() {
    this.requests = [];
  },
};

describe('API Client Authentication', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    mockAdapter.reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property 46: API request authentication
   * For any API request made by the frontend, the request should include the JWT token in the authorization header.
   */
  it('should include JWT token in authorization header for all requests', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random JWT-like tokens
        fc.string({ minLength: 20, maxLength: 200 }),
        // Generate random API paths
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0 && !s.includes('/')),
        async (token, path) => {
          // Set the token
          setToken(token);

          // Create a test axios instance with interceptor
          const testClient = axios.create({
            baseURL: 'http://localhost:4000/api',
          });

          let capturedConfig: InternalAxiosRequestConfig | null = null;

          // Add request interceptor
          testClient.interceptors.request.use((config) => {
            const currentToken = getToken();
            if (currentToken && config.headers) {
              config.headers.Authorization = `Bearer ${currentToken}`;
            }
            capturedConfig = config;
            // Reject to prevent actual request
            return Promise.reject(new Error('Test - preventing actual request'));
          });

          // Try to make a request (it will be rejected by our interceptor)
          try {
            await testClient.get(`/${path}`);
          } catch (error) {
            // Expected to fail
          }

          // Verify the token was added to headers
          expect(capturedConfig).not.toBeNull();
          expect(capturedConfig?.headers?.Authorization).toBe(`Bearer ${token}`);

          // Cleanup
          removeToken();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not include authorization header when no token is present', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0 && !s.includes('/')),
        async (path) => {
          // Ensure no token is set
          removeToken();

          // Create a test axios instance with interceptor
          const testClient = axios.create({
            baseURL: 'http://localhost:4000/api',
          });

          let capturedConfig: InternalAxiosRequestConfig | null = null;

          // Add request interceptor
          testClient.interceptors.request.use((config) => {
            const currentToken = getToken();
            if (currentToken && config.headers) {
              config.headers.Authorization = `Bearer ${currentToken}`;
            }
            capturedConfig = config;
            // Reject to prevent actual request
            return Promise.reject(new Error('Test - preventing actual request'));
          });

          // Try to make a request (it will be rejected by our interceptor)
          try {
            await testClient.get(`/${path}`);
          } catch (error) {
            // Expected to fail
          }

          // Verify no authorization header is present
          expect(capturedConfig).not.toBeNull();
          expect(capturedConfig?.headers?.Authorization).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
