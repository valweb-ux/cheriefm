"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  onValueChange?: (value: number[]) => void
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
  id?: string
  name?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, onValueChange, value, defaultValue, min = 0, max = 100, step = 1, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState<number[]>(value || defaultValue || [0])

    React.useEffect(() => {
      if (value !== undefined) {
        setLocalValue(value)
      }
    }, [value])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [Number(event.target.value)]
      setLocalValue(newValue)
      if (onValueChange) {
        onValueChange(newValue)
      }
    }

    return (
      <div className={cn("relative w-full touch-none select-none", className)}>
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              width: `${((localValue[0] - min) / (max - min)) * 100}%`,
            }}
          />
        </div>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleChange}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
          disabled={props.disabled}
          id={props.id}
          name={props.name}
        />
      </div>
    )
  },
)
Slider.displayName = "Slider"

export { Slider }

