"use client"

import * as React from "react"

export interface ToastProps {
  title?: string
  description?: string
}

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
}>({
  toast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, props])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.map((toastProps, index) => (
        <Toast key={index} {...toastProps} />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function Toast({ title, description }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-md shadow-lg p-4">
      {title && <div className="text-sm font-medium">{title}</div>}
      {description && <div className="text-sm opacity-90">{description}</div>}
    </div>
  )
}

