'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { usersService } from '@/services/users.service'
import { hospitalsService } from '@/services/hospitals.service'
import { assignDoctorSchema, type AssignDoctorFormData } from '@/utils/validators'
import type { User } from '@/types'

interface AssignDoctorModalProps {
  hospitalId: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AssignDoctorModal({ hospitalId, open, onClose, onSuccess }: AssignDoctorModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null)
  const [search, setSearch] = useState('')

  const { data: doctors } = useQuery({
    queryKey: ['users-doctors', search],
    queryFn: () => usersService.list({ role: 'DOCTOR', search, limit: 10 }),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignDoctorFormData>({ resolver: zodResolver(assignDoctorSchema) })

  function selectDoctor(doctor: User) {
    setSelectedDoctor(doctor)
    setValue('userId', doctor.id)
  }

  async function onSubmit(data: AssignDoctorFormData) {
    try {
      await hospitalsService.assignDoctor({
        hospitalId,
        userId: data.userId,
        licenseNumber: data.licenseNumber,
        specialization: data.specialization,
      })
      toast.success('Doctor assigned successfully')
      reset()
      setSelectedDoctor(null)
      setSearch('')
      onSuccess()
      onClose()
    } catch {
      toast.error('Failed to assign doctor')
    }
  }

  function handleClose() {
    reset()
    setSelectedDoctor(null)
    setSearch('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Assign Doctor"
      description="Search for a doctor and enter their credentials"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Doctor search */}
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Search Doctor
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a name or email..."
            className="mt-1.5 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />

          {doctors?.data && doctors.data.length > 0 && !selectedDoctor && (
            <div className="mt-1 rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden">
              {doctors.data.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => selectDoctor(doc)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <Avatar name={doc.name} size="sm" />
                  <div>
                    <p className="font-medium text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedDoctor && (
            <div className="mt-2 flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <Avatar name={selectedDoctor.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{selectedDoctor.name}</p>
                  <p className="text-xs text-slate-500">{selectedDoctor.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedDoctor(null); setValue('userId', '') }}
                className="text-xs text-slate-500 hover:text-red-600"
              >
                Change
              </button>
            </div>
          )}

          {errors.userId && (
            <p className="mt-1 text-xs text-red-600">{errors.userId.message}</p>
          )}
          <input type="hidden" {...register('userId')} />
        </div>

        <Input
          label="License Number"
          placeholder="e.g. MED-123456"
          error={errors.licenseNumber?.message}
          {...register('licenseNumber')}
        />

        <Input
          label="Specialization (optional)"
          placeholder="e.g. Cardiology, Pediatrics"
          error={errors.specialization?.message}
          {...register('specialization')}
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Assign Doctor
          </Button>
        </div>
      </form>
    </Modal>
  )
}
