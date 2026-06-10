'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { recordsService } from '@/services/records.service'
import { createRecordSchema, type CreateRecordFormData } from '@/utils/validators'

interface CreateRecordModalProps {
  patientId: string
  doctorId: string
  hospitalId: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateRecordModal({
  patientId,
  doctorId,
  hospitalId,
  open,
  onClose,
  onSuccess,
}: CreateRecordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRecordFormData>({ resolver: zodResolver(createRecordSchema) })

  async function onSubmit(data: CreateRecordFormData) {
    try {
      await recordsService.create({
        patientId,
        doctorId,
        hospitalId,
        title: data.title,
        description: data.description,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        prescription: data.prescription,
        visitDate: data.visitDate || new Date().toISOString(),
        status: data.status ?? 'ACTIVE',
      })
      toast.success('Medical record created')
      reset()
      onSuccess()
      onClose()
    } catch {
      toast.error('Failed to create record')
    }
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Medical Record"
      description="Create a new record for this patient"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Title"
              placeholder="e.g. Annual checkup, Follow-up visit"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>

          <Input
            label="Visit Date"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            error={errors.visitDate?.message}
            {...register('visitDate')}
          />

          <Select
            label="Status"
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'ARCHIVED', label: 'Archived' },
            ]}
            defaultValue="ACTIVE"
            {...register('status')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="General notes about this visit..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Diagnosis (optional)
          </label>
          <textarea
            rows={2}
            placeholder="Diagnosis or findings..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
            {...register('diagnosis')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Treatment (optional)
            </label>
            <textarea
              rows={2}
              placeholder="Treatment plan..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
              {...register('treatment')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Prescription (optional)
            </label>
            <textarea
              rows={2}
              placeholder="Medications prescribed..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
              {...register('prescription')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Create Record
          </Button>
        </div>
      </form>
    </Modal>
  )
}
