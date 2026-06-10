'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { hospitalsService } from '@/services/hospitals.service'
import { createHospitalSchema, type CreateHospitalFormData } from '@/utils/validators'
import type { Hospital } from '@/types'

interface HospitalFormProps {
  hospital?: Hospital
  onSuccess?: () => void
}

export function HospitalForm({ hospital, onSuccess }: HospitalFormProps) {
  const router = useRouter()
  const isEdit = !!hospital

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateHospitalFormData>({
    resolver: zodResolver(createHospitalSchema),
    defaultValues: hospital
      ? {
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          email: hospital.email,
        }
      : undefined,
  })

  async function onSubmit(data: CreateHospitalFormData) {
    try {
      if (isEdit) {
        await hospitalsService.update(hospital.id, data)
        toast.success('Hospital updated successfully')
      } else {
        const created = await hospitalsService.create(data)
        toast.success('Hospital created successfully')
        router.push(`/hospitals/${created.id}`)
      }
      onSuccess?.()
    } catch {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} hospital`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Hospital name" placeholder="City General Hospital" error={errors.name?.message} {...register('name')} />
      <Input label="Address" placeholder="123 Medical Drive, Lagos" error={errors.address?.message} {...register('address')} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Phone (optional)" type="tel" placeholder="+234 800 000 0000" error={errors.phone?.message} {...register('phone')} />
        <Input label="Email (optional)" type="email" placeholder="info@hospital.com" error={errors.email?.message} {...register('email')} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Save changes' : 'Create hospital'}
        </Button>
      </div>
    </form>
  )
}
