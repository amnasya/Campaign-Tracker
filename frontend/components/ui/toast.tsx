'use client'

import React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast, onClose: () => void }) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
  }

  const variantTextStyles = {
    default: 'text-gray-900',
    success: 'text-emerald-900',
    error: 'text-red-900',
    warning: 'text-amber-900',
  }

  const variantDescStyles = {
    default: 'text-gray-600',
    success: 'text-emerald-700',
    error: 'text-red-700',
    warning: 'text-amber-700',
  }

  const variant = toast.variant ?? 'default'

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5',
        variantStyles[variant]
      )}
    >
      <div className="flex-1 space-y-1">
        {toast.title && (
          <div className={cn('text-sm font-semibold', variantTextStyles[variant])}>
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className={cn('text-sm', variantDescStyles[variant])}>
            {toast.description}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className={cn(
          'rounded-md p-1 transition-colors hover:bg-black/5',
          variantTextStyles[variant]
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
