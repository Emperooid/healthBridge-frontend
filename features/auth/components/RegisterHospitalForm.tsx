'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { hospitalsService } from '@/services/hospitals.service'
import { hospitalRegistrationSchema, type HospitalRegistrationFormData } from '@/utils/validators'

type Screen = 'form' | 'timeout' | 'conflict'

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
  const [screen, setScreen] = useState<Screen>('form')
  const [conflictField, setConflictField] = useState<'email' | 'license' | null>(null)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<HospitalRegistrationFormData>({
    resolver: zodResolver(hospitalRegistrationSchema),
  })

  async function onSubmit(data: HospitalRegistrationFormData) {
    const { confirmPassword: _, hospitalName, adminPassword, adminEmail, adminFirstName, adminLastName, ...rest } = data
    try {
      await hospitalsService.registerHospital({
        ...rest,
        name: hospitalName,
        adminPassword,
        adminEmail,
        adminFirstName,
        adminLastName,
      })

      toast.success('Hospital registered! Sign in with your admin credentials to continue.', { duration: 5000 })
      router.push('/login')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      const status = (err as { response?: { status?: number } })?.response?.status
      const msg = (err as { message?: string })?.message ?? ''

      if (status === 409) {
        setConflictField(msg.toLowerCase().includes('license') ? 'license' : 'email')
        setScreen('conflict')
        return
      }

      if (
        code === 'ECONNABORTED' || code === 'ERR_NETWORK' || code === 'ENOTFOUND' ||
        msg.toLowerCase().includes('timeout') || msg.toLowerCase().includes('network error')
      ) {
        setScreen('timeout')
        return
      }

      toast.error(msg || 'Registration failed. Please try again.')
    }
  }

  if (screen === 'timeout') {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Taking longer than expected</h3>
          <p className="mt-2 text-sm text-slate-600">
            The server is warming up. Your hospital may already have been registered —
            try signing in with your admin credentials, or wait a moment and try again.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Admin email: <span className="font-medium">{getValues('adminEmail')}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try signing in
          </Link>
          <button
            onClick={() => setScreen('form')}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Try registering again
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'conflict') {
    const isLicense = conflictField === 'license'
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {isLicense ? 'License number already registered' : 'Email already registered'}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {isLicense
              ? 'A hospital with that license number already exists on CliniLynk. Contact support if you think this is an error.'
              : `${getValues('adminEmail')} already has an account. Sign in with your existing credentials.`}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {!isLicense && (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign in
            </Link>
          )}
          {!isLicense && (
            <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Forgot password?
            </Link>
          )}
          <button
            onClick={() => { setScreen('form'); setConflictField(null) }}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Go back and update the form
          </button>
        </div>
      </div>
    )
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
          This person will be the primary administrator for your hospital on CliniLynk.
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
