/**
 * Property-based tests for protected route authentication
 * Feature: influencer-campaign-tracker, Property 48: Protected route authentication
 * Validates: Requirements 19.1
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthProvider } from '@/lib/auth/useAuth';
import { setToken, removeToken } from '@/lib/auth/token';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the API call
vi.mock('@/lib/api/auth', () => ({
  getProfile: vi.fn(),
}));

import { getProfile } from '@/lib/api/auth';

describe('Protected Route Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Property 48: Protected route authentication
   * For any protected route access attempt by an unauthenticated user, the frontend should redirect to the login page.
   */
  it('should redirect unauthenticated users to login page', async () => {
    // Ensure no token is set
    removeToken();

    // Mock getProfile to throw error (simulating unauthenticated)
    vi.mocked(getProfile).mockRejectedValue(new Error('Unauthorized'));

    // Render protected route
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    // Wait for redirect
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    }, { timeout: 3000 });

    // Content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render content for authenticated users with any valid user data', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random user data with valid dates
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          role: fc.constantFrom('brand' as const, 'influencer' as const),
          createdAt: fc.constant(new Date('2024-01-01').toISOString()),
          updatedAt: fc.constant(new Date('2024-01-01').toISOString()),
        }),
        async (user) => {
          // Clear any previous state
          cleanup();
          mockPush.mockClear();
          
          // Set a token
          setToken('valid-token-123');

          // Mock getProfile to return user data
          vi.mocked(getProfile).mockResolvedValue(user);

          // Render protected route
          const { container } = render(
            <AuthProvider>
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            </AuthProvider>
          );

          // Wait for content to be visible
          await waitFor(() => {
            const element = screen.queryByTestId('protected-content');
            expect(element).toBeInTheDocument();
          }, { timeout: 3000 });

          // Should not redirect
          expect(mockPush).not.toHaveBeenCalled();

          // Cleanup
          removeToken();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000); // 60 second timeout for property tests

  it('should show loading state initially', async () => {
    // Set a token
    setToken('valid-token-123');

    // Mock getProfile with a delay
    vi.mocked(getProfile).mockImplementation(() => 
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'brand',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }, 100);
      })
    );

    // Render protected route
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Cleanup
    removeToken();
  });
});
