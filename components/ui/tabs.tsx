"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  value: string
  onChange: (value: string) => void
} | null>(null)

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

const Tabs = ({ defaultValue, value, onValueChange, children, className }: TabsProps) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue)

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setSelectedValue(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange],
  )

  return (
    <TabsContext.Provider value={{ value: selectedValue, onChange: handleValueChange }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

const TabsList = ({ children, className }: TabsListProps) => {
  return <div className={cn("flex space-x-1 border-b", className)}>{children}</div>
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsTrigger = ({ value, children, className }: TabsTriggerProps) => {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const isActive = context.value === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => context.onChange(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-all",
        isActive ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700",
        className,
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")

  return context.value === value ? <div className={cn("pt-2", className)}>{children}</div> : null
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

