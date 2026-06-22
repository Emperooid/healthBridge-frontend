'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { prescriptionsService } from '@/services/prescriptions.service'
import { PatientSearchField } from '@/features/patients/components/PatientSearchField'
import { useAuthStore } from '@/store/auth.store'
import { formatDate } from '@/utils/format'
import type { PrescriptionStatus } from '@/types'

const statusVariant: Record<PrescriptionStatus, 'success' | 'info' | 'warning' | 'error'> = {
  ACTIVE: 'success',
  COMPLETED: 'info',
  CANCELLED: 'error',
}

const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  drug: z.string().min(1, 'Drug name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.string().optional(),
})

type PrescriptionForm = z.infer<typeof prescriptionSchema>

const frequencyOptions = [
  { value: 'Once daily', label: 'Once daily' },
  { value: 'Twice daily', label: 'Twice daily' },
  { value: 'Three times daily', label: 'Three times daily' },
  { value: 'Four times daily', label: 'Four times daily' },
  { value: 'Every 8 hours', label: 'Every 8 hours' },
  { value: 'As needed', label: 'As needed (PRN)' },
]

export default function PrescriptionsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedPatientName, setSelectedPatientName] = useState('')
  const isDoctor = user?.role === 'doctor'
  const isPatient = user?.role === 'patient'

  const { data, isLoading } = useQuery({
    queryKey: ['prescriptions', user?.id, user?.role],
    queryFn: () =>
      isPatient
        ? prescriptionsService.mine()
        : prescriptionsService.list(),
  })

  const form = useForm<PrescriptionForm>({ resolver: zodResolver(prescriptionSchema) })

  const createMutation = useMutation({
    mutationFn: (d: PrescriptionForm) => prescriptionsService.create(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
      form.reset()
      setSelectedPatientName('')
      setCreateOpen(false)
      toast.success('Prescription created')
    },
    onError: () => toast.error('Failed to create prescription'),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      prescriptionsService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
      toast.success('Status updated')
    },
    onError: () => toast.error('Failed to update status'),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Prescriptions</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isPatient ? 'Your prescriptions' : 'Prescriptions you have written'}
          </p>
        </div>
        {isDoctor && (
          <Button size="sm" onClick={() => { setCreateOpen(true); setSelectedPatientName('') }}>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Prescription
          </Button>
        )}
      </div>

      <Card padding="none">
        {isLoading ? (
          <div className="p-5"><TableSkeleton rows={5} /></div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <svg className="mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">No prescriptions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Drug</th>
                  {!isPatient && (
                    <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Patient</th>
                  )}
                  {isPatient && (
                    <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Doctor</th>
                  )}
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Dosage</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                  {isDoctor && <th className="px-5 py-2.5" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.data.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-900">{rx.drug}</td>
                    {!isPatient && (
                      <td className="px-5 py-3 text-slate-600">{rx.patientName ?? '—'}</td>
                    )}
                    {isPatient && (
                      <td className="px-5 py-3 text-slate-600">{rx.doctorName ?? '—'}</td>
                    )}
                    <td className="px-5 py-3 text-slate-600">{rx.dosage}</td>
                    <td className="px-5 py-3 text-slate-600">{rx.frequency}</td>
                    <td className="px-5 py-3 text-slate-600">{rx.duration}</td>
                    <td className="px-5 py-3">
                      <Badge variant={statusVariant[rx.status] ?? 'default'}>{rx.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(rx.prescribedAt ?? rx.createdAt)}</td>
                    {isDoctor && (
                      <td className="px-5 py-3 text-right">
                        {rx.status === 'ACTIVE' && (
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: rx.id, status: 'COMPLETED' })}
                            className="text-xs font-medium text-slate-500 hover:text-slate-700"
                          >
                            Mark complete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create modal (doctor only) */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setSelectedPatientName(''); form.reset() }}
        title="New Prescription"
        description="Write a prescription for a patient"
        size="md"
      >
        <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <PatientSearchField
            value={form.watch('patientId') ?? ''}
            displayName={selectedPatientName}
            onSelect={(id, name) => {
              form.setValue('patientId', id, { shouldValidate: true })
              setSelectedPatientName(name)
            }}
            onClear={() => {
              form.setValue('patientId', '', { shouldValidate: true })
              setSelectedPatientName('')
            }}
            error={form.formState.errors.patientId?.message}
            doctorId={user?.id}
          />
          <Input
            label="Drug / Medication"
            placeholder="e.g. Amoxicillin 500mg"
            error={form.formState.errors.drug?.message}
            {...form.register('drug')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Dosage"
              placeholder="e.g. 1 tablet"
              error={form.formState.errors.dosage?.message}
              {...form.register('dosage')}
            />
            <Input
              label="Duration"
              placeholder="e.g. 7 days"
              error={form.formState.errors.duration?.message}
              {...form.register('duration')}
            />
          </div>
          <Select
            label="Frequency"
            options={frequencyOptions}
            error={form.formState.errors.frequency?.message}
            {...form.register('frequency')}
          />
          <Input
            label="Special Instructions (optional)"
            placeholder="e.g. Take after meals"
            {...form.register('instructions')}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { setCreateOpen(false); setSelectedPatientName(''); form.reset() }}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Prescription'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
