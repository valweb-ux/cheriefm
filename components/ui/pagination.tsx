"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Функція для створення масиву сторінок для відображення
  const getPageNumbers = () => {
    const pageNumbers = []

    // Завжди показуємо першу сторінку
    pageNumbers.push(1)

    // Визначаємо діапазон сторінок навколо поточної
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Додаємо "..." після першої сторінки, якщо потрібно
    if (startPage > 2) {
      pageNumbers.push("ellipsis1")
    }

    // Додаємо сторінки в діапазоні
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Додаємо "..." перед останньою сторінкою, якщо потрібно
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis2")
    }

    // Завжди показуємо останню сторінку, якщо є більше однієї сторінки
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center space-x-1">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Попередня сторінка</span>
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === "ellipsis1" || page === "ellipsis2") {
          return (
            <Button key={`ellipsis-${index}`} variant="outline" size="sm" disabled className="cursor-default">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Наступна сторінка</span>
      </Button>
    </div>
  )
}

// Додаємо експорт компонентів для сумісності
export const PaginationContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex w-full items-center justify-center", className)} {...props} />
  ),
)
PaginationContent.displayName = "PaginationContent"

export const PaginationItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
)
PaginationItem.displayName = "PaginationItem"

export const PaginationLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors",
        className,
      )}
      {...props}
    />
  ),
)
PaginationLink.displayName = "PaginationLink"

export const PaginationEllipsis = () => (
  <span className="flex h-8 w-8 items-center justify-center">
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">Більше сторінок</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export const PaginationPrevious = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} variant="outline" size="sm" className={cn("gap-1", className)} {...props}>
      <ChevronLeft className="h-4 w-4" />
      <span>Попередня</span>
    </Button>
  ),
)
PaginationPrevious.displayName = "PaginationPrevious"

export const PaginationNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} variant="outline" size="sm" className={cn("gap-1", className)} {...props}>
      <span>Наступна</span>
      <ChevronRight className="h-4 w-4" />
    </Button>
  ),
)
PaginationNext.displayName = "PaginationNext"

