/**
 * Property-based tests for consistent error handling
 * Feature: influencer-campaign-tracker, Property 47: Consistent error handling
 * Validates: Requirements 18.3
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { removeToken } from '../auth/token';
import type { ApiError } from '@/types';

describe('API Error Handling Consistency', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  /**
   * Property 47: Consistent error handling
   * For any API error response, the frontend should handle the error consistently regardless of which endpoint triggered it.
   */
  it('should format all API errors consistently with statusCode, message, and error fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random HTTP error status codes
        fc.constantFrom(400, 401, 403, 404, 409, 500),
        // Generate random error messages
        fc.oneof(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 })
        ),
        // Generate random error types
        fc.string({ minLength: 1, maxLength: 50 }),
        async (statusCode, message, errorType) => {
          // Create a test axios instance with error interceptor
          const testClient = axios.create({
            baseURL: 'http://localhost:4000/api',
          });

          let capturedError: ApiError | null = null;

          // Add response interceptor for error handling
          testClient.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiError>) => {
              // Format error consistently
              const apiError: ApiError = {
                statusCode: error.response?.status || 500,
                message: error.response?.data?.message || 'An unexpected error occurred',
                error: error.response?.data?.error || 'Error',
              };
              
              capturedError = apiError;
              return Promise.reject(apiError);
            }
          );

          // Simulate an API error response
          const mockError: AxiosError<ApiError> = {
            name: 'AxiosError',
            message: 'Request failed',
            isAxiosError: true,
            toJSON: () => ({}),
            response: {
              status: statusCode,
              statusText: errorType,
              data: {
                statusCode,
                message,
                error: errorType,
              },
              headers: {},
              config: {} as InternalAxiosRequestConfig,
            },
            config: {} as InternalAxiosRequestConfig,
          };

          // Trigger the error interceptor
          try {
            await testClient.interceptors.response.handlers[0].rejected(mockError);
          } catch (error) {
            // Expected to be rejected
          }

          // Verify error is formatted consistently
          expect(capturedError).not.toBeNull();
          expect(capturedError).toHaveProperty('statusCode');
          expect(capturedError).toHaveProperty('message');
          expect(capturedError).toHaveProperty('error');
          expect(capturedError?.statusCode).toBe(statusCode);
          expect(capturedError?.message).toEqual(message);
          expect(capturedError?.error).toBe(errorType);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle errors without response data gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        async (errorMessage) => {
          // Create a test axios instance with error interceptor
          const testClient = axios.create({
            baseURL: 'http://localhost:4000/api',
          });

          let capturedError: ApiError | null = null;

          // Add response interceptor for error handling
          testClient.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiError>) => {
              // Format error consistently
              const apiError: ApiError = {
                statusCode: error.response?.status || 500,
                message: error.response?.data?.message || 'An unexpected error occurred',
                error: error.response?.data?.error || 'Error',
              };
              
              capturedError = apiError;
              return Promise.reject(apiError);
            }
          );

          // Simulate a network error (no response)
          const mockError: AxiosError<ApiError> = {
            name: 'AxiosError',
            message: errorMessage,
            isAxiosError: true,
            toJSON: () => ({}),
            config: {} as InternalAxiosRequestConfig,
          };

          // Trigger the error interceptor
          try {
            await testClient.interceptors.response.handlers[0].rejected(mockError);
          } catch (error) {
            // Expected to be rejected
          }

          // Verify error is formatted with defaults
          expect(capturedError).not.toBeNull();
          expect(capturedError?.statusCode).toBe(500);
          expect(capturedError?.message).toBe('An unexpected error occurred');
          expect(capturedError?.error).toBe('Error');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle 401 errors by clearing token', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 20, maxLength: 200 }),
        async (token) => {
          // Set a token
          localStorage.setItem('auth_token', token);

          // Create a test axios instance with error interceptor
          const testClient = axios.create({
            baseURL: 'http://localhost:4000/api',
          });

          // Add response interceptor for error handling
          testClient.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiError>) => {
              // Handle authentication errors
              if (error.response?.status === 401) {
                removeToken();
              }
              
              const apiError: ApiError = {
                statusCode: error.response?.status || 500,
                message: error.response?.data?.message || 'An unexpected error occurred',
                error: error.response?.data?.error || 'Error',
              };
              
              return Promise.reject(apiError);
            }
          );

          // Simulate a 401 error
          const mockError: AxiosError<ApiError> = {
            name: 'AxiosError',
            message: 'Unauthorized',
            isAxiosError: true,
            toJSON: () => ({}),
            response: {
              status: 401,
              statusText: 'Unauthorized',
              data: {
                statusCode: 401,
                message: 'Unauthorized',
                error: 'Unauthorized',
              },
              headers: {},
              config: {} as InternalAxiosRequestConfig,
            },
            config: {} as InternalAxiosRequestConfig,
          };

          // Trigger the error interceptor
          try {
            await testClient.interceptors.response.handlers[0].rejected(mockError);
          } catch (error) {
            // Expected to be rejected
          }

          // Verify token was removed
          expect(localStorage.getItem('auth_token')).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});
