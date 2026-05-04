import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Admin Dashboard — HealthBridge' }

const mockStats = [
  { title: 'Total Hospitals', value: 48, change: '+3 this month', changeType: 'up' as const, iconBg: 'bg-blue-100' },
  { title: 'Total Doctors', value: 312, change: '+12 this month', changeType: 'up' as const, iconBg: 'bg-purple-100' },
  { title: 'Total Patients', value: '4,821', change: '+89 this week', changeType: 'up' as const, iconBg: 'bg-green-100' },
  { title: 'Active Records', value: '18,430', change: '+240 today', changeType: 'up' as const, iconBg: 'bg-amber-100' },
]

const recentActivity = [
  { id: '1', action: 'New hospital registered', details: 'Lagos University Teaching Hospital', time: '2 min ago', type: 'hospital' },
  { id: '2', action: 'Doctor assigned', details: 'Dr. Amaka Obi → General Hospital', time: '15 min ago', type: 'doctor' },
  { id: '3', action: 'New patient record', details: 'Record #4821 created', time: '32 min ago', type: 'patient' },
  { id: '4', action: 'Access granted', details: 'Cross-hospital record access', time: '1 hr ago', type: 'access' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Platform overview and management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/hospitals/new">
            <Button size="sm">+ New Hospital</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mockStats.map((stat, i) => (
          <StatCard
            key={i}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            iconBg={stat.iconBg}
            icon={
              <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <Link href="/audit-logs" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{item.action}</p>
                  <p className="text-xs text-slate-500">{item.details}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/hospitals', label: 'Manage Hospitals', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5' },
              { href: '/patients', label: 'View Patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
              { href: '/audit-logs', label: 'Audit Logs', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { href: '/hospitals/new', label: 'Add Hospital', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center hover:border-blue-300 hover:bg-blue-50 transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-700">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
