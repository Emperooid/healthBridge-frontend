import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: ReactNode
  accentColor?: string
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  accentColor = 'bg-blue-600',
  className,
}: StatCardProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg border border-slate-200 bg-white px-5 py-4', className)}>
      <div className={cn('absolute left-0 top-0 bottom-0 w-1', accentColor)} />
      <div className="flex items-start justify-between">
        <div className="ml-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
          {change && (
            <p
              className={cn(
                'mt-1 flex items-center gap-1 text-xs font-medium',
                changeType === 'up'
                  ? 'text-emerald-600'
                  : changeType === 'down'
                  ? 'text-red-600'
                  : 'text-slate-500'
              )}
            >
              {changeType === 'up' && '↑'}
              {changeType === 'down' && '↓'}
              {change}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          {icon}
        </div>
      </div>
    </div>
  )
}
