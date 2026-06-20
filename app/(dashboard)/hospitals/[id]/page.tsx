'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { HospitalForm } from '@/features/hospitals/components/HospitalForm'
import { AssignDoctorModal } from '@/features/hospitals/components/AssignDoctorModal'
import { hospitalsService } from '@/services/hospitals.service'
import { departmentsService } from '@/services/departments.service'

export default function HospitalDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const [editOpen, setEditOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const queryClient = useQueryClient()

  const { data: hospital, isLoading } = useQuery({
    queryKey: ['hospital', id],
    queryFn: () => hospitalsService.getById(id),
  })

  const { data: departments, isLoading: loadingDepts } = useQuery({
    queryKey: ['hospital-departments', id],
    queryFn: () => departmentsService.list(id),
    enabled: !!hospital,
  })

  const createDeptMutation = useMutation({
    mutationFn: (name: string) => departmentsService.create(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospital-departments', id] })
      setNewDeptName('')
      setDeptModalOpen(false)
      toast.success('Department added')
    },
    onError: () => toast.error('Failed to add department'),
  })

  const deleteDeptMutation = useMutation({
    mutationFn: (deptId: string) => departmentsService.delete(deptId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hospital-departments', id] }),
    onError: () => toast.error('Failed to delete department'),
  })

  const { data: doctors, isLoading: loadingDoctors } = useQuery({
    queryKey: ['hospital-doctors', id],
    queryFn: () => hospitalsService.getDoctors(id),
    enabled: !!hospital,
  })

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="h-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="lg:col-span-2 h-48 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    )
  }

  if (!hospital) return <p className="text-slate-500">Hospital not found.</p>

  return (
    <div className="space-y-5">
      {/* Breadcrumb + header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/hospitals" className="text-xs font-medium text-slate-500 hover:text-slate-700">
            ← Hospitals
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{hospital.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={hospital.isActive !== false ? 'success' : 'warning'} dot>
                  {hospital.isActive !== false ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-8">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button size="sm" onClick={() => setAssignOpen(true)}>
            Assign Doctor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Contact info */}
        <div className="space-y-4">
          <Card padding="none">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Contact Info</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { label: 'Address', value: hospital.address },
                { label: 'Phone', value: hospital.phone },
                { label: 'Email', value: hospital.email },
              ]
                .filter((row) => row.value)
                .map(({ label, value }) => (
                  <div key={label} className="px-5 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-0.5 text-sm text-slate-800">{value}</p>
                  </div>
                ))}
            </div>
          </Card>

          <Card padding="none">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Stats</h2>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-slate-600">Doctors</span>
                <span className="text-sm font-bold text-slate-900">{doctors?.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-slate-600">Patients</span>
                <span className="text-sm font-bold text-slate-900">{hospital.patientCount ?? 0}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Doctors list */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                Assigned Doctors ({doctors?.length ?? 0})
              </h2>
              <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
                + Assign
              </Button>
            </div>

            {loadingDoctors ? (
              <div className="p-5"><TableSkeleton rows={4} /></div>
            ) : !doctors?.length ? (
              <div className="flex flex-col items-center py-14 text-slate-500">
                <svg className="mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm font-medium">No doctors assigned</p>
                <button
                  onClick={() => setAssignOpen(true)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Assign a doctor →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Doctor</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Specialization</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Patients</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {doctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={doctor.name} size="sm" />
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 truncate">{doctor.name}</p>
                              <p className="text-xs text-slate-500 truncate">{doctor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{doctor.specialization ?? '—'}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{doctor.patientCount ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Departments */}
      <Card padding="none">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            Departments ({departments?.length ?? 0})
          </h2>
          <Button size="sm" variant="outline" onClick={() => setDeptModalOpen(true)}>
            + Add
          </Button>
        </div>
        {loadingDepts ? (
          <div className="p-5"><TableSkeleton rows={2} /></div>
        ) : !departments?.length ? (
          <div className="flex flex-col items-center py-10 text-slate-500">
            <p className="text-sm">No departments yet</p>
            <button onClick={() => setDeptModalOpen(true)} className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700">
              Add one →
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-5">
            {departments.map((dept) => (
              <div key={dept.id} className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5">
                <span className="text-sm font-medium text-slate-700">{dept.name}</span>
                <button
                  onClick={() => deleteDeptMutation.mutate(dept.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${dept.name}`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Hospital" size="md">
        <HospitalForm
          hospital={hospital}
          onSuccess={() => {
            setEditOpen(false)
            queryClient.invalidateQueries({ queryKey: ['hospital', id] })
            queryClient.invalidateQueries({ queryKey: ['hospitals'] })
          }}
        />
      </Modal>

      {/* Add department modal */}
      <Modal open={deptModalOpen} onClose={() => setDeptModalOpen(false)} title="Add Department">
        <div className="space-y-4">
          <Input
            label="Department name"
            placeholder="e.g. Cardiology"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeptModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => newDeptName.trim() && createDeptMutation.mutate(newDeptName.trim())}
              disabled={!newDeptName.trim() || createDeptMutation.isPending}
            >
              {createDeptMutation.isPending ? 'Adding...' : 'Add Department'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign doctor modal */}
      <AssignDoctorModal
        hospitalId={id}
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['hospital-doctors', id] })}
      />
    </div>
  )
}
