'use client';

/**
 * Route wrapper for influencer-only pages
 */

import { ProtectedRoute } from './ProtectedRoute';

interface InfluencerRouteProps {
  children: React.ReactNode;
}

export function InfluencerRoute({ children }: InfluencerRouteProps) {
  return <ProtectedRoute requiredRole="influencer">{children}</ProtectedRoute>;
}
