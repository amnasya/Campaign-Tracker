'use client';

/**
 * Brand dashboard header component
 */

import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-8">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Search - Future Enhancement */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications - Future Enhancement */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* User Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
            {user?.name?.charAt(0).toUpperCase() || 'B'}
          </div>
        </div>
      </div>
    </header>
  );
}
