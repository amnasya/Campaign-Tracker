/**
 * Property-based tests for role-based route access
 * Feature: influencer-campaign-tracker, Property 49: Role-based route access
 * Validates: Requirements 19.2
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { BrandRoute } from './BrandRoute';
import { InfluencerRoute } from './InfluencerRoute';
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

describe('Role-Based Route Access', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Property 49: Role-based route access
   * For any route access attempt by an authenticated user with incorrect role, the frontend should redirect to an unauthorized page.
   */
  it('should redirect influencers trying to access brand routes', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random influencer user data
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          role: fc.constant('influencer' as const),
          createdAt: fc.constant(new Date('2024-01-01').toISOString()),
          updatedAt: fc.constant(new Date('2024-01-01').toISOString()),
        }),
        async (user) => {
          // Clear any previous state
          cleanup();
          mockPush.mockClear();
          
          // Set a token
          setToken('valid-token-123');

          // Mock getProfile to return influencer user
          vi.mocked(getProfile).mockResolvedValue(user);

          // Render brand-only route
          render(
            <AuthProvider>
              <BrandRoute>
                <div data-testid="brand-content">Brand Content</div>
              </BrandRoute>
            </AuthProvider>
          );

          // Wait for redirect to unauthorized
          await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/unauthorized');
          }, { timeout: 3000 });

          // Content should not be visible
          expect(screen.queryByTestId('brand-content')).not.toBeInTheDocument();

          // Cleanup
          removeToken();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  it('should redirect brands trying to access influencer routes', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random brand user data
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          role: fc.constant('brand' as const),
          createdAt: fc.constant(new Date('2024-01-01').toISOString()),
          updatedAt: fc.constant(new Date('2024-01-01').toISOString()),
        }),
        async (user) => {
          // Clear any previous state
          cleanup();
          mockPush.mockClear();
          
          // Set a token
          setToken('valid-token-123');

          // Mock getProfile to return brand user
          vi.mocked(getProfile).mockResolvedValue(user);

          // Render influencer-only route
          render(
            <AuthProvider>
              <InfluencerRoute>
                <div data-testid="influencer-content">Influencer Content</div>
              </InfluencerRoute>
            </AuthProvider>
          );

          // Wait for redirect to unauthorized
          await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/unauthorized');
          }, { timeout: 3000 });

          // Content should not be visible
          expect(screen.queryByTestId('influencer-content')).not.toBeInTheDocument();

          // Cleanup
          removeToken();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  it('should allow brands to access brand routes', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random brand user data
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          role: fc.constant('brand' as const),
          createdAt: fc.constant(new Date('2024-01-01').toISOString()),
          updatedAt: fc.constant(new Date('2024-01-01').toISOString()),
        }),
        async (user) => {
          // Clear any previous state
          cleanup();
          mockPush.mockClear();
          
          // Set a token
          setToken('valid-token-123');

          // Mock getProfile to return brand user
          vi.mocked(getProfile).mockResolvedValue(user);

          // Render brand-only route
          render(
            <AuthProvider>
              <BrandRoute>
                <div data-testid="brand-content">Brand Content</div>
              </BrandRoute>
            </AuthProvider>
          );

          // Wait for content to be visible
          await waitFor(() => {
            expect(screen.getByTestId('brand-content')).toBeInTheDocument();
          }, { timeout: 3000 });

          // Should not redirect
          expect(mockPush).not.toHaveBeenCalled();

          // Cleanup
          removeToken();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);

  it('should allow influencers to access influencer routes', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random influencer user data
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          role: fc.constant('influencer' as const),
          createdAt: fc.constant(new Date('2024-01-01').toISOString()),
          updatedAt: fc.constant(new Date('2024-01-01').toISOString()),
        }),
        async (user) => {
          // Clear any previous state
          cleanup();
          mockPush.mockClear();
          
          // Set a token
          setToken('valid-token-123');

          // Mock getProfile to return influencer user
          vi.mocked(getProfile).mockResolvedValue(user);

          // Render influencer-only route
          render(
            <AuthProvider>
              <InfluencerRoute>
                <div data-testid="influencer-content">Influencer Content</div>
              </InfluencerRoute>
            </AuthProvider>
          );

          // Wait for content to be visible
          await waitFor(() => {
            expect(screen.getByTestId('influencer-content')).toBeInTheDocument();
          }, { timeout: 3000 });

          // Should not redirect
          expect(mockPush).not.toHaveBeenCalled();

          // Cleanup
          removeToken();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000);
});
