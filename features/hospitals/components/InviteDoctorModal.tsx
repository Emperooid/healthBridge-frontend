'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { usersService } from '@/services/users.service'
import { inviteDoctorSchema, type InviteDoctorFormData } from '@/utils/validators'

interface InviteDoctorModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  hospitalId?: string
}

export function InviteDoctorModal({ open, onClose, onSuccess, hospitalId }: InviteDoctorModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteDoctorFormData>({ resolver: zodResolver(inviteDoctorSchema) })

  async function onSubmit(data: InviteDoctorFormData) {
    try {
      await usersService.invite({ ...data, hospitalId })
      toast.success(`Invitation sent to ${data.email}`)
      reset()
      onSuccess?.()
      onClose()
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message ?? 'Failed to send invitation')
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
      title="Invite Doctor"
      description="The doctor will receive an email with a link to set up their account."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Info banner */}
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-xs text-blue-700">
            The invited doctor will receive an email containing a secure link to activate their account and join your hospital.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            placeholder="Chidi"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last name"
            placeholder="Okeke"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="doctor@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="License number"
          placeholder="e.g. MED-2024-001"
          error={errors.licenseNumber?.message}
          {...register('licenseNumber')}
        />

        <Input
          label="Specialization"
          placeholder="e.g. Cardiology, Pediatrics (optional)"
          error={errors.specialization?.message}
          {...register('specialization')}
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Send invitation
          </Button>
        </div>
      </form>
    </Modal>
  )
}
