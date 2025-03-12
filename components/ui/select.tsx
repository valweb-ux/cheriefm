"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const Select = ({ value, defaultValue, onValueChange, children }: SelectProps) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setSelectedValue(newValue)
      onValueChange?.(newValue)
      setOpen(false)
    },
    [onValueChange],
  )

  return (
    <SelectContext.Provider value={{ value: selectedValue, onValueChange: handleValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
}

const SelectTrigger = ({ children, className }: SelectTriggerProps) => {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectTrigger must be used within Select")

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white",
        className,
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
}

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectValue must be used within Select")

  // Знаходимо відповідний SelectItem для відображення його тексту
  const selectedItem = React.Children.toArray(React.useContext(SelectContentContext)?.children).find((child) => {
    if (React.isValidElement(child) && child.type === SelectItem) {
      return child.props.value === context.value
    }
    return false
  }) as React.ReactElement | undefined

  return <span>{context.value && selectedItem ? selectedItem.props.children : placeholder}</span>
}

const SelectContentContext = React.createContext<{
  children: React.ReactNode
} | null>(null)

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

const SelectContent = ({ children, className }: SelectContentProps) => {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectContent must be used within Select")

  if (!context.open) return null

  return (
    <SelectContentContext.Provider value={{ children }}>
      <div className="relative">
        <div
          className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-80",
            className,
          )}
          style={{ width: "var(--radix-select-trigger-width)" }}
        >
          <div className="p-1">{children}</div>
        </div>
      </div>
    </SelectContentContext.Provider>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

const SelectItem = ({ value, children, className }: SelectItemProps) => {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectItem must be used within Select")

  const isSelected = context.value === value

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100",
        isSelected && "bg-gray-100 font-medium",
        className,
      )}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

