'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { hospitalsService } from '@/services/hospitals.service'
import { useAuthStore } from '@/store/auth.store'
import { hospitalRegistrationSchema, type HospitalRegistrationFormData } from '@/utils/validators'
import type { UserRole } from '@/types'

const HOSPITAL_TYPES = [
  { value: 'GENERAL', label: 'General Hospital' },
  { value: 'CLINIC', label: 'Clinic' },
  { value: 'SPECIALIST', label: 'Specialist Hospital' },
  { value: 'TEACHING', label: 'Teaching Hospital' },
  { value: 'PRIVATE', label: 'Private Hospital' },
  { value: 'FEDERAL', label: 'Federal Hospital' },
]

export function RegisterHospitalForm() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HospitalRegistrationFormData>({
    resolver: zodResolver(hospitalRegistrationSchema),
  })

  async function onSubmit(data: HospitalRegistrationFormData) {
    const { confirmPassword: _, hospitalName, adminPassword, ...rest } = data
    try {
      const response = await hospitalsService.registerHospital({
        ...rest,
        name: hospitalName,
        adminPassword,
      })
      const user = {
        ...response.user,
        name: `${response.user.firstName ?? ''} ${response.user.lastName ?? ''}`.trim(),
        role: ((response.user.role as string) ?? '').toLowerCase() as UserRole,
      }
      setUser(user, response.accessToken)
      toast.success(`Welcome, ${user.firstName}! Your hospital is ready.`)
      router.push('/dashboard/admin')
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message ?? 'Registration failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Hospital info section */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          Hospital information
        </h2>
        <div className="space-y-4">
          <Input
            label="Hospital name"
            type="text"
            placeholder="Lagos General Hospital"
            error={errors.hospitalName?.message}
            {...register('hospitalName')}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Hospital type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('hospitalType')}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              <option value="">Select hospital type</option>
              {HOSPITAL_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.hospitalType && (
              <p className="text-xs text-red-600">{errors.hospitalType.message}</p>
            )}
          </div>

          <Input
            label="Street address"
            type="text"
            placeholder="123 Hospital Road"
            error={errors.address?.message}
            {...register('address')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              placeholder="Lagos"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="State"
              type="text"
              placeholder="Lagos State"
              error={errors.state?.message}
              {...register('state')}
            />
          </div>

          <Input
            label="License / Registration number"
            type="text"
            placeholder="LGS-HOS-0001"
            error={errors.licenseNumber?.message}
            {...register('licenseNumber')}
          />
        </div>
      </div>

      {/* Admin account section */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-1 pb-2 border-b border-slate-200">
          Admin account
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          This person will be the primary administrator for your hospital on HealthBridge.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              type="text"
              placeholder="John"
              error={errors.adminFirstName?.message}
              {...register('adminFirstName')}
            />
            <Input
              label="Last name"
              type="text"
              placeholder="Okafor"
              error={errors.adminLastName?.message}
              {...register('adminLastName')}
            />
          </div>

          <Input
            label="Admin email"
            type="email"
            placeholder="admin@yourhospital.com"
            error={errors.adminEmail?.message}
            {...register('adminEmail')}
          />

          <Input
            label="Phone number"
            type="tel"
            placeholder="+234 800 000 0000"
            error={errors.adminPhone?.message}
            {...register('adminPhone')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            hint="Uppercase, lowercase, number & special character required"
            error={errors.adminPassword?.message}
            {...register('adminPassword')}
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Register hospital
      </Button>

      <p className="text-center text-xs text-slate-500">
        By registering, you agree to our{' '}
        <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
      </p>
    </form>
  )
}
