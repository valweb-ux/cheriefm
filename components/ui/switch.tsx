"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked)
      }
    }

    return (
      <div className={cn("relative inline-flex h-6 w-11 items-center rounded-full", className)}>
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <span className={cn("absolute inset-0 rounded-full transition", checked ? "bg-primary" : "bg-gray-300")} />
        <span
          className={cn(
            "absolute h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-1",
          )}
        />
      </div>
    )
  },
)
Switch.displayName = "Switch"

export { Switch }

