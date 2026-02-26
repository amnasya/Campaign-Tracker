'use client'

/**
 * Demo mode banner - shows when running without backend
 */

import { Info } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium shadow-md">
      <div className="flex items-center justify-center gap-2">
        <Info className="h-4 w-4" />
        <span>
          🎭 DEMO MODE - Running with mock data (no backend required)
        </span>
      </div>
    </div>
  );
}
