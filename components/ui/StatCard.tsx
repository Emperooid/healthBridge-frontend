import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: ReactNode
  iconBg?: string
  className?: string
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, iconBg = 'bg-blue-100', className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-6 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className={cn(
              'mt-1 text-xs font-medium',
              changeType === 'up' ? 'text-green-600' : changeType === 'down' ? 'text-red-600' : 'text-slate-500'
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  )
}
