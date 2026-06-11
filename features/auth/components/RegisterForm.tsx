'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { writeSession } from '@/app/actions/auth'
import { registerSchema, type RegisterFormData } from '@/utils/validators'
import type { UserRole } from '@/types'

const roleDashboards: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  doctor: '/dashboard/doctor',
  patient: '/dashboard/patient',
}

export function RegisterForm() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterFormData) {
    try {
      const response = await authService.register(data)
      setUser(response.user, response.accessToken, response.refreshToken)
      await writeSession(response.user.id, response.user.role, response.user.email, response.user.name)
      toast.success('Account created successfully!')
      router.push(roleDashboards[response.user.role])
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ??
        'Registration failed. Please try again.'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First name"
          type="text"
          placeholder="Jane"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Last name"
          type="text"
          placeholder="Smith"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>
      <Input
        label="Email address"
        type="email"
        placeholder="you@hospital.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        hint="Min 8 chars — uppercase, lowercase, number, and special character required"
        {...register('password')}
      />
      <Select
        label="Account type"
        options={[
          { value: 'patient', label: 'Patient' },
          { value: 'doctor', label: 'Doctor' },
          { value: 'admin', label: 'Administrator' },
        ]}
        placeholder="Select your role"
        error={errors.role?.message}
        {...register('role')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        Create account
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-slate-500">
        By creating an account, you agree to our{' '}
        <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
      </p>
    </form>
  )
}
