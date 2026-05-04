'use client'

import { cn } from '@/utils/cn'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1
    if (page <= 4) return i + 1
    if (page >= totalPages - 3) return totalPages - 6 + i
    return page - 3 + i
  })

  return (
    <nav className="flex items-center gap-1">
      <PagButton disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        ‹
      </PagButton>
      {pages.map((p) => (
        <PagButton key={p} active={p === page} onClick={() => onPageChange(p)}>
          {p}
        </PagButton>
      ))}
      <PagButton disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        ›
      </PagButton>
    </nav>
  )
}

function PagButton({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
        'disabled:pointer-events-none disabled:opacity-40',
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      )}
    >
      {children}
    </button>
  )
}
