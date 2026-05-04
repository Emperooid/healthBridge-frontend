'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { PatientCard } from '@/features/patients/components/PatientCard'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { patientsService } from '@/services/patients.service'
import { useAuthStore } from '@/store/auth.store'

export default function DoctorDashboard() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['my-patients', user?.id],
    queryFn: () => patientsService.list({ doctorId: user?.id, limit: 6 }),
    enabled: !!user?.id,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
        <p className="text-sm text-slate-500">Good to see you, Dr. {user?.name?.split(' ')[0]}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="My Patients"
          value={data?.total ?? 0}
          iconBg="bg-blue-100"
          icon={<svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          title="Records This Week"
          value={24}
          change="+8 from last week"
          changeType="up"
          iconBg="bg-green-100"
          icon={<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
        <StatCard
          title="Pending Reviews"
          value={7}
          iconBg="bg-amber-100"
          icon={<svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Patients</CardTitle>
          <Link href="/patients" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </CardHeader>
        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data?.data.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
            {!data?.data.length && (
              <p className="col-span-2 py-8 text-center text-sm text-slate-500">
                No patients assigned yet.
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
