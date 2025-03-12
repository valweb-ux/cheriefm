"use client"

import type React from "react"

import { useState } from "react"
import { ChevronUp, ChevronDown, Maximize2 } from "lucide-react"

interface DashboardWidgetProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function DashboardWidget({ title, children, className = "" }: DashboardWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`dashboard-widget ${className}`}>
      <div className="dashboard-widget-header">
        <h2 className="dashboard-widget-title">{title}</h2>
        <div className="dashboard-widget-actions">
          <button
            className="dashboard-widget-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Розгорнути" : "Згорнути"}
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button className="dashboard-widget-toggle" aria-label="На весь екран">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      {!isCollapsed && <div className="dashboard-widget-content">{children}</div>}
    </div>
  )
}

