'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { writeSession } from '@/app/actions/auth'
import { loginSchema, type LoginFormData } from '@/utils/validators'
import type { UserRole } from '@/types'

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 30

const roleDashboards: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  doctor: '/dashboard/doctor',
  patient: '/dashboard/patient',
}

export function LoginForm() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  // Brute-force protection
  const failCount = useRef(0)
  const lockTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0)

  // Unverified-email state — set when login returns 403
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [resending, setResending] = useState(false)

  useEffect(() => () => { if (lockTimer.current) clearInterval(lockTimer.current) }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  function startLockout() {
    let remaining = LOCKOUT_SECONDS
    setLockSecondsLeft(remaining)
    lockTimer.current = setInterval(() => {
      remaining -= 1
      setLockSecondsLeft(remaining)
      if (remaining <= 0) {
        clearInterval(lockTimer.current!)
        failCount.current = 0
        setLockSecondsLeft(0)
      }
    }, 1000)
  }

  async function handleResend() {
    if (!unverifiedEmail) return
    setResending(true)
    try {
      await authService.resendVerification(unverifiedEmail)
      toast.success('Verification email resent — check your inbox')
    } catch {
      toast.error('Failed to resend. Please try again in a moment.')
    } finally {
      setResending(false)
    }
  }

  async function onSubmit(data: LoginFormData) {
    if (lockSecondsLeft > 0) return
    setUnverifiedEmail(null)

    try {
      const response = await authService.login(data)
      failCount.current = 0
      setUser(response.user, response.accessToken)
      await writeSession(response.user.id, response.user.role, response.user.email, response.user.name)
      toast.success(`Welcome back, ${response.user.name}!`)
      router.push(roleDashboards[response.user.role])
    } catch (err: unknown) {
      const httpStatus = (err as { response?: { status?: number } })?.response?.status

      // 403 = account exists but email is not yet verified
      if (httpStatus === 403) {
        setUnverifiedEmail(data.email)
        return
      }

      failCount.current += 1
      if (failCount.current >= MAX_ATTEMPTS) {
        startLockout()
        toast.error(`Too many failed attempts. Please wait ${LOCKOUT_SECONDS} seconds.`)
      } else {
        const remaining = MAX_ATTEMPTS - failCount.current
        const message =
          (err as { message?: string })?.message ?? 'Invalid credentials. Please try again.'
        toast.error(
          `${message}${remaining <= 2 ? ` (${remaining} attempt${remaining === 1 ? '' : 's'} left)` : ''}`
        )
      }
    }
  }

  const isLocked = lockSecondsLeft > 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        disabled={isLocked}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        disabled={isLocked}
        {...register('password')}
      />

      {/* Email not verified banner */}
      {unverifiedEmail && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-800">Email not verified</p>
          <p className="mt-0.5 text-xs text-amber-700">
            Check your inbox for the verification link.{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-semibold underline underline-offset-2 hover:text-amber-900 disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend email'}
            </button>
          </p>
        </div>
      )}

      {/* Lockout countdown */}
      {isLocked && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-600">
          Too many failed attempts — try again in {lockSecondsLeft}s
        </p>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" loading={isSubmitting && !isLocked} disabled={isLocked} className="w-full">
        {isLocked ? `Locked (${lockSecondsLeft}s)` : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
          Create one
        </Link>
      </p>
    </form>
  )
}
