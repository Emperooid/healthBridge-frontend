'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authService } from '@/services/auth.service'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/validators'

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) })

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Invalid reset link</h3>
        <p className="mt-2 text-sm text-slate-600">
          This link is missing a reset token. Please request a new one.
        </p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Request new link
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Password updated</h3>
        <p className="mt-2 text-sm text-slate-600">
          Your password has been reset successfully. You can now sign in.
        </p>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </div>
    )
  }

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      await authService.resetPassword(token!, data.password)
      setDone(true)
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ??
        'Reset failed. The link may have expired — please request a new one.'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="New password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        hint="Min 8 chars — uppercase, lowercase, number, and special character required"
        {...register('password')}
      />
      <Input
        label="Confirm new password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        Reset password
      </Button>

      <p className="text-center text-sm text-slate-600">
        Remembered your password?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </p>
    </form>
  )
}
