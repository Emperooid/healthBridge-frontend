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
import { registerSchema, type RegisterFormData } from '@/utils/validators'

type Screen = 'form' | 'check-email' | 'timeout' | 'conflict'

function classifyError(err: unknown): { screen: Screen; message?: string } {
  const code = (err as { code?: string })?.code ?? ''
  const status = (err as { response?: { status?: number } })?.response?.status
  const msg = (err as { message?: string })?.message ?? ''

  if (status === 409) return { screen: 'conflict' }
  if (
    code === 'ECONNABORTED' ||
    code === 'ERR_NETWORK' ||
    code === 'ENOTFOUND' ||
    msg.toLowerCase().includes('timeout') ||
    msg.toLowerCase().includes('network error')
  ) return { screen: 'timeout' }
  return { screen: 'form', message: msg || 'Registration failed. Please try again.' }
}

export function RegisterForm() {
  const [screen, setScreen] = useState<Screen>('form')
  const [pendingEmail, setPendingEmail] = useState('')
  const [resending, setResending] = useState(false)

  const { data: hospitals } = useQuery({
    queryKey: ['hospitals-public'],
    queryFn: () => hospitalsService.listPublic(),
    retry: false,
  })

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterFormData) {
    try {
      await authService.register({ ...data, role: 'patient' })
      setPendingEmail(data.email)
      setScreen('check-email')
    } catch (err) {
      const { screen: next, message } = classifyError(err)
      if (next === 'form') {
        toast.error(message!)
      } else {
        setPendingEmail(getValues('email'))
        setScreen(next)
      }
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

  // ── Email sent ───────────────────────────────────────────────────────────────
  if (screen === 'check-email') {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Check your email</h3>
          <p className="mt-2 text-sm text-slate-600">
            We sent a verification link to{' '}
            <span className="font-medium text-slate-800">{pendingEmail}</span>.
            Click it to activate your account.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          Didn&apos;t receive it?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Resend verification email'}
          </button>
        </p>
        <Link href="/login" className="inline-block text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Back to sign in
        </Link>
      </div>
    )
  }

  // ── Timeout / network error ──────────────────────────────────────────────────
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
            The server is warming up. Your account may already have been created —
            check your email for a verification link, or try signing in with the
            credentials you just entered.
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
            onClick={handleResend}
            disabled={resending || !pendingEmail}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {resending ? 'Sending…' : 'Send verification email to ' + pendingEmail}
          </button>
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

  // ── Email already registered ─────────────────────────────────────────────────
  if (screen === 'conflict') {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Account already exists</h3>
          <p className="mt-2 text-sm text-slate-600">
            <span className="font-medium text-slate-800">{pendingEmail}</span> is already
            registered. Sign in, or reset your password if you&apos;ve forgotten it.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign in
          </Link>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>
          <button
            onClick={() => { setScreen('form'); setPendingEmail('') }}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  // ── Main registration form ───────────────────────────────────────────────────
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

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Your hospital <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <select
          {...register('hospitalId')}
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        >
          <option value="">Select your hospital</option>
          {hospitals?.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500">You can update this later in your profile.</p>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating account…' : 'Create patient account'}
      </Button>

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
