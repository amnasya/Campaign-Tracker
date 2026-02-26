import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 text-center animate-in fade-in scale-in",
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-gray-400 animate-in fade-in slide-in-from-top stagger-1">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 animate-in fade-in slide-in-from-top stagger-2">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-gray-600 animate-in fade-in slide-in-from-top stagger-3">
          {description}
        </p>
      )}
      {action && (
        <div className="animate-in fade-in scale-in stagger-4">
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}

export { EmptyState }
