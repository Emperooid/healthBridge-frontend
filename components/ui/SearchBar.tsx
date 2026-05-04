'use client'

import { InputHTMLAttributes, useCallback } from 'react'
import { cn } from '@/utils/cn'

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  debounceMs?: number
}

export function SearchBar({ className, onSearch, debounceMs = 300, ...props }: SearchBarProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (onSearch) {
        onSearch(value)
      }
    },
    [onSearch]
  )

  return (
    <div className={cn('relative', className)}>
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        className={cn(
          'h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 text-sm',
          'placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
          'hover:border-slate-400 transition-colors'
        )}
        onChange={handleChange}
        {...props}
      />
    </div>
  )
}
