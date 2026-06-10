'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { MedicalTimeline } from '@/features/patients/components/MedicalTimeline'
import { FileUploader } from '@/features/patients/components/FileUploader'
import { CreateRecordModal } from '@/features/patients/components/CreateRecordModal'
import { recordsService } from '@/services/records.service'
import { filesService } from '@/services/files.service'
import { patientsService } from '@/services/patients.service'
import { useAuthStore } from '@/store/auth.store'

export default function PatientRecordsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const { data: records, isLoading } = useQuery({
    queryKey: ['patient-records', id],
    queryFn: () => recordsService.getByPatient(id),
  })

  const { data: patient } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsService.getById(id),
  })

  const createRecord = useMutation({
    mutationFn: (data: Parameters<typeof recordsService.create>[0]) =>
      recordsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-records', id] })
    },
  })

  async function handleUpload(files: File[]) {
    const record = await createRecord.mutateAsync({
      patientId: id,
      doctorId: user?.id ?? '',
      hospitalId: patient?.hospitalId ?? '',
      title: 'Document Upload',
      description: `${files.length} file(s) uploaded`,
      visitDate: new Date().toISOString(),
    })
    for (const file of files) {
      await filesService.upload(record.id, file)
    }
    await queryClient.invalidateQueries({ queryKey: ['patient-records', id] })
    setUploadOpen(false)
    toast.success('Files uploaded successfully')
  }

  const canCreateRecord = user?.role === 'doctor' || user?.role === 'admin'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/patients/${id}`} className="text-xs font-medium text-slate-500 hover:text-slate-700">
            ← Patient Profile
          </Link>
          <h1 className="mt-2 text-xl font-bold text-slate-900">
            {patient?.name ? `${patient.name}'s Records` : 'Medical Records'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">{records?.length ?? 0} records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload
          </Button>
          {canCreateRecord && (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Record
            </Button>
          )}
        </div>
      </div>

      {/* Summary stats */}
      {records && records.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-3">
          {(['ACTIVE', 'DRAFT', 'ARCHIVED'] as const).map((status) => {
            const count = records.filter((r) => r.status === status).length
            return (
              <div key={status} className="flex items-center gap-1.5">
                <Badge
                  variant={status === 'ACTIVE' ? 'success' : status === 'DRAFT' ? 'warning' : 'default'}
                  dot
                >
                  {count} {status.charAt(0) + status.slice(1).toLowerCase()}
                </Badge>
              </div>
            )
          })}
        </div>
      )}

      {/* Records timeline */}
      <Card padding="none">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">All Records</h2>
        </div>
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded bg-slate-100" />)}
          </div>
        ) : (
          <MedicalTimeline records={records ?? []} />
        )}
      </Card>

      {/* Upload modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Documents" description="Attach files to a new medical record" size="lg">
        <FileUploader onUpload={handleUpload} />
      </Modal>

      {/* Create record modal */}
      {canCreateRecord && (
        <CreateRecordModal
          patientId={id}
          doctorId={user?.id ?? ''}
          hospitalId={patient?.hospitalId ?? ''}
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['patient-records', id] })}
        />
      )}
    </div>
  )
}
