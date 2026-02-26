'use client'

/**
 * Responsive table component that converts to cards on mobile
 * Provides better UX on small screens
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  className?: string;
  mobileLabel?: string; // Optional custom label for mobile view
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data available',
  className,
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className={cn('w-full', className)}>
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-gray-500',
                    column.className
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'border-b border-gray-100 transition-colors hover:bg-gray-50',
                  onRowClick && 'cursor-pointer',
                  'animate-in fade-in slide-in-from-left',
                  index === 0 && 'stagger-1',
                  index === 1 && 'stagger-2',
                  index === 2 && 'stagger-3',
                  index === 3 && 'stagger-4',
                  index >= 4 && 'stagger-5'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn('px-4 py-4 text-sm', column.className)}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.map((item, index) => (
          <div
            key={keyExtractor(item)}
            onClick={() => onRowClick?.(item)}
            className={cn(
              'rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md',
              onRowClick && 'cursor-pointer active:scale-[0.98]',
              'animate-in fade-in scale-in',
              index === 0 && 'stagger-1',
              index === 1 && 'stagger-2',
              index === 2 && 'stagger-3',
              index === 3 && 'stagger-4',
              index >= 4 && 'stagger-5'
            )}
          >
            <div className="space-y-3">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start gap-2">
                  <span className="text-sm font-medium text-gray-500 min-w-[100px]">
                    {column.mobileLabel || column.label}:
                  </span>
                  <div className={cn('text-sm text-gray-900 flex-1 text-right', column.className)}>
                    {column.render(item)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
