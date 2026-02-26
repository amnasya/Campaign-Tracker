'use client';

/**
 * Brand dashboard layout wrapper
 * Provides consistent layout with sidebar and header for all brand pages
 */

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface BrandLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function BrandLayout({ children, title, description }: BrandLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <Header title={title} description={description} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
