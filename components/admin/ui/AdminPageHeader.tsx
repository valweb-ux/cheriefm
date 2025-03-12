"use client"

import React from "react"
import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AdminPageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
}

export function AdminPageHeader({ title, description, breadcrumbs = [], actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs.length > 0 && (
        <nav className="text-sm text-gray-500 mb-2">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>/</span>}
                <li>
                  {item.href ? (
                    <Link href={item.href} className="hover:text-blue-500">
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {description && <p className="mt-1 text-gray-500">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  )
}

