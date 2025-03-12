"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked)
      }
    }

    return (
      <div className="relative flex items-center">
        <div
          className={cn(
            "h-4 w-4 rounded border border-gray-300 flex items-center justify-center bg-white",
            checked && "border-primary",
            className,
          )}
        >
          <input
            type="checkbox"
            className="absolute inset-0 opacity-0 cursor-pointer"
            ref={ref}
            checked={checked}
            onChange={handleChange}
            {...props}
          />
          {checked && <Check className="h-3 w-3 text-primary" />}
        </div>
      </div>
    )
  },
)

Checkbox.displayName = "Checkbox"

export { Checkbox }

