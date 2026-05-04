'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { MedicalTimeline } from '@/features/patients/components/MedicalTimeline'
import { FileUploader } from '@/features/patients/components/FileUploader'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { recordsService } from '@/services/records.service'
import { filesService } from '@/services/files.service'

export default function PatientRecordsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const [uploadOpen, setUploadOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: records, isLoading } = useQuery({
    queryKey: ['patient-records', id],
    queryFn: () => recordsService.getByPatient(id),
  })

  const createRecord = useMutation({
    mutationFn: (data: Parameters<typeof recordsService.create>[0]) =>
      recordsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-records', id] })
    },
  })

  async function handleUpload(files: File[]) {
    // Create a record to hold the uploaded files
    const record = await createRecord.mutateAsync({
      patientId: id,
      type: 'note',
      title: 'Document Upload',
      description: `${files.length} file(s) uploaded`,
      date: new Date().toISOString(),
      crossHospitalAccess: false,
    })

    // Upload each file and attach to the new record
    for (const file of files) {
      await filesService.upload(record.id, file)
    }

    await queryClient.invalidateQueries({ queryKey: ['patient-records', id] })
    setUploadOpen(false)
    toast.success('Files uploaded successfully')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href={`/patients/${id}`} className="text-sm text-slate-500 hover:text-slate-700">
          ← Patient Profile
        </Link>
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          + Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <span className="text-sm text-slate-500">{records?.length ?? 0} records</span>
        </CardHeader>
        {isLoading ? <CardSkeleton /> : <MedicalTimeline records={records ?? []} />}
      </Card>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Documents" size="lg">
        <FileUploader onUpload={handleUpload} />
      </Modal>
    </div>
  )
}
