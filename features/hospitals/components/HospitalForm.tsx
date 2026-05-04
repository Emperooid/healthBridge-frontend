'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
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
          city: hospital.city,
          state: hospital.state,
          phone: hospital.phone,
          email: hospital.email,
          website: hospital.website,
          type: hospital.type,
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="City" placeholder="Lagos" error={errors.city?.message} {...register('city')} />
        <Input label="State" placeholder="Lagos State" error={errors.state?.message} {...register('state')} />
      </div>
      <Input label="Address" placeholder="123 Medical Drive" error={errors.address?.message} {...register('address')} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Phone" type="tel" placeholder="+234 800 000 0000" error={errors.phone?.message} {...register('phone')} />
        <Input label="Email" type="email" placeholder="info@hospital.com" error={errors.email?.message} {...register('email')} />
      </div>
      <Input label="Website (optional)" type="url" placeholder="https://hospital.com" error={errors.website?.message} {...register('website')} />
      <Select
        label="Hospital type"
        options={[
          { value: 'public', label: 'Public' },
          { value: 'private', label: 'Private' },
          { value: 'clinic', label: 'Clinic' },
        ]}
        placeholder="Select type"
        error={errors.type?.message}
        {...register('type')}
      />
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
