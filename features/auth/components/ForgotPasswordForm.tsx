'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authService } from '@/services/auth.service'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/validators'

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) })

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      await authService.forgotPassword(data.email)
    } catch {
      // Show success regardless to prevent email enumeration
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Check your email</h3>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;ve sent password reset instructions to your email address.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        hint="Enter the email associated with your account"
        {...register('email')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        Send reset link
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
