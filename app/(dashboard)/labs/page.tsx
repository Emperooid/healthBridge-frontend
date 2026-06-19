'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { labsService } from '@/services/labs.service'
import { PatientSearchField } from '@/features/patients/components/PatientSearchField'
import { useAuthStore } from '@/store/auth.store'
import { formatDate, formatDateTime } from '@/utils/format'
import type { LabOrderStatus, LabResult } from '@/types'

const statusVariant: Record<LabOrderStatus, 'warning' | 'info' | 'success' | 'error'> = {
  PENDING: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
}

const interpretationVariant = {
  NORMAL: 'success' as const,
  ABNORMAL: 'warning' as const,
  CRITICAL: 'error' as const,
}

const orderSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  tests: z.array(z.object({ name: z.string().min(1) })).min(1, 'At least one test is required'),
  notes: z.string().optional(),
})

type OrderForm = z.infer<typeof orderSchema>

function ResultsModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { data: results, isLoading } = useQuery({
    queryKey: ['lab-results', orderId],
    queryFn: () => labsService.getResults(orderId),
  })

  return (
    <Modal open onClose={onClose} title="Lab Results" size="md">
      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : !results?.length ? (
        <p className="py-8 text-center text-sm text-slate-500">No results available yet.</p>
      ) : (
        <div className="space-y-3">
          {results.map((r: LabResult) => (
            <div key={r.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-slate-900">{r.testName ?? 'Result'}</p>
                {r.interpretation && (
                  <Badge variant={interpretationVariant[r.interpretation]}>{r.interpretation}</Badge>
                )}
              </div>
              {(r.value || r.unit) && (
                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-semibold">{r.value}</span>
                  {r.unit && <span className="ml-1 text-slate-500">{r.unit}</span>}
                  {r.referenceRange && <span className="ml-2 text-xs text-slate-400">(ref: {r.referenceRange})</span>}
                </p>
              )}
              {r.notes && <p className="mt-1 text-xs text-slate-500">{r.notes}</p>}
              {r.fileUrl && (
                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  View report
                </a>
              )}
              <p className="mt-2 text-[10px] text-slate-400">{formatDateTime(r.resultedAt ?? r.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

export default function LabsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [orderOpen, setOrderOpen] = useState(false)
  const [viewResultsId, setViewResultsId] = useState<string | null>(null)
  const [selectedPatientName, setSelectedPatientName] = useState('')
  const isDoctor = user?.role === 'doctor'
  const isPatient = user?.role === 'patient'

  const { data, isLoading } = useQuery({
    queryKey: ['lab-orders', user?.id, user?.role],
    queryFn: () =>
      labsService.listOrders({
        ...(isDoctor ? { doctorId: user?.id } : {}),
        ...(isPatient ? { patientId: user?.id } : {}),
      }),
  })

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: { tests: [{ name: '' }] },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'tests' })

  const createMutation = useMutation({
    mutationFn: (d: OrderForm) =>
      labsService.createOrder({ ...d, tests: d.tests.map((t) => t.name) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-orders'] })
      form.reset({ tests: [{ name: '' }] })
      setSelectedPatientName('')
      setOrderOpen(false)
      toast.success('Lab order created')
    },
    onError: () => toast.error('Failed to create order'),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lab Orders</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isPatient ? 'Your lab orders and results' : 'Lab orders you have placed'}
          </p>
        </div>
        {isDoctor && (
          <Button size="sm" onClick={() => { setOrderOpen(true); setSelectedPatientName('') }}>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Order Lab Test
          </Button>
        )}
      </div>

      <Card padding="none">
        {isLoading ? (
          <div className="p-5"><TableSkeleton rows={5} /></div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center py-16 text-slate-500">
            <svg className="mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p className="text-sm font-medium">No lab orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tests</th>
                  {!isPatient && (
                    <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Patient</th>
                  )}
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Ordered</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.data.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {order.tests.map((t) => (
                          <span key={t} className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">{t}</span>
                        ))}
                      </div>
                    </td>
                    {!isPatient && (
                      <td className="px-5 py-3 text-slate-600">{order.patientName ?? '—'}</td>
                    )}
                    <td className="px-5 py-3">
                      <Badge variant={statusVariant[order.status]}>{order.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(order.orderedAt ?? order.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      {order.status === 'COMPLETED' && (
                        <button
                          onClick={() => setViewResultsId(order.id)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          View results →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Order modal */}
      <Modal
        open={orderOpen}
        onClose={() => { setOrderOpen(false); setSelectedPatientName(''); form.reset({ tests: [{ name: '' }] }) }}
        title="Order Lab Test"
        description="Create a lab order for a patient"
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
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tests</label>
            <div className="space-y-2">
              {fields.map((field, i) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={`Test ${i + 1} (e.g. CBC, LFT)`}
                    {...form.register(`tests.${i}.name`)}
                  />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => append({ name: '' })}
              className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              + Add test
            </button>
          </div>
          <Input
            label="Notes (optional)"
            placeholder="Clinical context or special instructions"
            {...form.register('notes')}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { setOrderOpen(false); setSelectedPatientName(''); form.reset({ tests: [{ name: '' }] }) }}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Ordering...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Results modal */}
      {viewResultsId && (
        <ResultsModal orderId={viewResultsId} onClose={() => setViewResultsId(null)} />
      )}
    </div>
  )
}
