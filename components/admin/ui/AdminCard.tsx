"use client"

import type React from "react"

interface AdminCardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AdminCard({ title, children, footer, className = "" }: AdminCardProps) {
  return (
    <div className={`bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {title && (
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">{footer}</div>}
    </div>
  )
}

