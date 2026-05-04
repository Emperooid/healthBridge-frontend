'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { MedicalTimeline } from '@/features/patients/components/MedicalTimeline'
import { patientsService } from '@/services/patients.service'
import { recordsService } from '@/services/records.service'
import { formatDate, capitalise } from '@/utils/format'

export default function PatientProfilePage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)

  const { data: patient, isLoading: loadingPatient } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsService.getById(id),
  })

  const { data: records, isLoading: loadingRecords } = useQuery({
    queryKey: ['patient-records', id],
    queryFn: () => recordsService.getByPatient(id),
    enabled: !!patient,
  })

  if (loadingPatient) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CardSkeleton />
        <div className="lg:col-span-2"><CardSkeleton /></div>
      </div>
    )
  }

  if (!patient) return <p className="text-slate-500">Patient not found.</p>

  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/patients" className="text-sm text-slate-500 hover:text-slate-700">
          ← Patients
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <Card>
            <div className="flex flex-col items-center text-center">
              <Avatar name={patient.name} size="xl" className="mb-3" />
              <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
              <p className="text-sm text-slate-500">{patient.email}</p>
              <div className="mt-2 flex gap-2 flex-wrap justify-center">
                <Badge variant="default">{patient.bloodType}</Badge>
                <Badge variant="info">{capitalise(patient.gender)}</Badge>
              </div>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {[
                { label: 'Date of Birth', value: formatDate(patient.dateOfBirth) },
                { label: 'Age', value: `${age} years` },
                { label: 'Phone', value: patient.phone },
                { label: 'Hospital', value: patient.hospitalName },
                { label: 'Doctor', value: patient.assignedDoctorName ?? 'Unassigned' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2.5 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-900 text-right max-w-45 truncate">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="sm">
            <p className="text-sm font-semibold text-slate-900 mb-3">Emergency Contact</p>
            <div className="divide-y divide-slate-100">
              {[
                { label: 'Name', value: patient.emergencyContact.name },
                { label: 'Phone', value: patient.emergencyContact.phone },
                { label: 'Relation', value: capitalise(patient.emergencyContact.relationship) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <Link href={`/patients/${id}/records`} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </Link>
            </CardHeader>
            {loadingRecords ? (
              <CardSkeleton />
            ) : (
              <MedicalTimeline records={records?.slice(0, 3) ?? []} />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
