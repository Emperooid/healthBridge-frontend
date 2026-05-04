'use client'

import { use, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { HospitalForm } from '@/features/hospitals/components/HospitalForm'
import { hospitalsService } from '@/services/hospitals.service'
import { capitalise } from '@/utils/format'

export default function HospitalDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const [editOpen, setEditOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: hospital, isLoading } = useQuery({
    queryKey: ['hospital', id],
    queryFn: () => hospitalsService.getById(id),
  })

  const { data: doctors } = useQuery({
    queryKey: ['hospital-doctors', id],
    queryFn: () => hospitalsService.getDoctors(id),
    enabled: !!hospital,
  })

  if (isLoading) return <CardSkeleton />
  if (!hospital) return <p className="text-slate-500">Hospital not found.</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/hospitals" className="text-sm text-slate-500 hover:text-slate-700">← Hospitals</Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{hospital.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={hospital.status === 'active' ? 'success' : 'warning'}>{capitalise(hospital.status)}</Badge>
              <Badge variant="default">{capitalise(hospital.type)}</Badge>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>Edit</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Contact Info</CardTitle></CardHeader>
          <div className="divide-y divide-slate-100">
            {[
              { label: 'Address', value: hospital.address },
              { label: 'City', value: hospital.city },
              { label: 'State', value: hospital.state },
              { label: 'Phone', value: hospital.phone },
              { label: 'Email', value: hospital.email },
              ...(hospital.website ? [{ label: 'Website', value: hospital.website }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2.5 text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-900 text-right max-w-45 truncate">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Doctors ({doctors?.length ?? 0})</CardTitle>
            </CardHeader>
            {!doctors?.length ? (
              <p className="py-8 text-center text-sm text-slate-500">No doctors assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                    <Avatar name={doctor.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{doctor.name}</p>
                      <p className="text-xs text-slate-500">{doctor.specialty} • {doctor.patientCount} patients</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Hospital" size="lg">
        <HospitalForm hospital={hospital} onSuccess={() => {
          setEditOpen(false)
          queryClient.invalidateQueries({ queryKey: ['hospital', id] })
        }} />
      </Modal>
    </div>
  )
}
