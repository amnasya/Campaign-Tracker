'use client'

/**
 * Loading overlay component for async operations
 * Provides visual feedback during loading states
 */

import React from 'react';
import { Spinner } from './spinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  blur?: boolean;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  children,
  blur = true,
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80',
            blur && 'backdrop-blur-sm',
            'animate-in fade-in'
          )}
        >
          <Spinner size="lg" />
          {message && (
            <p className="mt-4 text-sm font-medium text-gray-600 animate-in fade-in slide-in-from-top">
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
