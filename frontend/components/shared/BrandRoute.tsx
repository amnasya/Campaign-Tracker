'use client';

/**
 * Route wrapper for brand-only pages
 */

import { ProtectedRoute } from './ProtectedRoute';

interface BrandRouteProps {
  children: React.ReactNode;
}

export function BrandRoute({ children }: BrandRouteProps) {
  return <ProtectedRoute requiredRole="brand">{children}</ProtectedRoute>;
}
