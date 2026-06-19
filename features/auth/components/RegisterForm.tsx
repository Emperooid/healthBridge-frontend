'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authService } from '@/services/auth.service'
import { hospitalsService } from '@/services/hospitals.service'
import { useAuthStore } from '@/store/auth.store'
import { registerSchema, type RegisterFormData } from '@/utils/validators'

export function RegisterForm() {
  const { setUser } = useAuthStore()
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [resending, setResending] = useState(false)

  const { data: hospitals } = useQuery({
    queryKey: ['hospitals-public'],
    queryFn: () => hospitalsService.list({ limit: 100 }),
    retry: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterFormData) {
    try {
      const response = await authService.register({ ...data, role: 'patient' })
      setUser(response.user, response.accessToken)
      setPendingEmail(data.email)
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message ?? 'Registration failed. Please try again.')
    }
  }

  async function handleResend() {
    if (!pendingEmail) return
    setResending(true)
    try {
      await authService.resendVerification(pendingEmail)
      toast.success('Verification email resent — check your inbox')
    } catch {
      toast.error('Failed to resend. Please try again in a moment.')
    } finally {
      setResending(false)
    }
  }

  if (pendingEmail) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Check your email</h3>
        <p className="mt-2 text-sm text-slate-600">
          We sent a verification link to <span className="font-medium text-slate-800">{pendingEmail}</span>.
          Click the link to activate your account.
        </p>
        <p className="mt-4 text-xs text-slate-500">
          Didn&apos;t receive it?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend verification email'}
          </button>
        </p>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium text-slate-500 hover:text-slate-700">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        placeholder="you@example.com"
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
        hint="Uppercase, lowercase, number & special character required"
        {...register('password')}
      />

      {/* Hospital selector */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Your hospital <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <select
          {...register('hospitalId')}
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        >
          <option value="">Select your hospital</option>
          {hospitals?.data?.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500">You can update this later in your profile.</p>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Create patient account
      </Button>

      {/* Doctor callout */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold text-slate-700">Are you a healthcare professional?</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Doctors are invited by their hospital admin — contact your hospital administrator to get access.
        </p>
      </div>

      {/* Hospital callout */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-xs font-semibold text-blue-800">Want to bring your hospital to HealthBridge?</p>
        <p className="mt-0.5 text-xs text-blue-700">
          <Link href="/register-hospital" className="font-medium underline underline-offset-2 hover:text-blue-900">
            Register your institution →
          </Link>
        </p>
      </div>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">Sign in</Link>
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
