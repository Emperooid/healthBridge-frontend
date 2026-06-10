import { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

export function Card({ className, padding = 'md', children, ...props }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  }
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm font-semibold text-slate-900 uppercase tracking-wide', className)} {...props}>
      {children}
    </h3>
  )
}
