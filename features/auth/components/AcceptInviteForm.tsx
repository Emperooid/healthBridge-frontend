'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authService } from '@/services/auth.service'
import { acceptInviteSchema, type AcceptInviteFormData } from '@/utils/validators'

interface InvitedUser {
  firstName: string
  lastName: string
  email: string
}

export function AcceptInviteForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [invitedUser, setInvitedUser] = useState<InvitedUser | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(true)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteFormData>({ resolver: zodResolver(acceptInviteSchema) })

  useEffect(() => {
    if (!token) {
      setTokenError('This invitation link is invalid or missing. Please ask your admin to resend the invitation.')
      setVerifying(false)
      return
    }

    authService.verifyInviteToken(token)
      .then((data) => {
        setInvitedUser(data)
        setVerifying(false)
      })
      .catch(() => {
        // If verify endpoint doesn't exist or token is invalid,
        // let the user still try to submit (the POST will catch it)
        setVerifying(false)
      })
  }, [token])

  async function onSubmit(data: AcceptInviteFormData) {
    if (!token) return
    try {
      await authService.acceptInvite(token, data.password)
      setDone(true)
      toast.success('Account activated! You can now sign in.')
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message
      if (msg?.toLowerCase().includes('expired')) {
        toast.error('This invitation has expired. Ask your admin to send a new one.')
      } else if (msg?.toLowerCase().includes('invalid')) {
        toast.error('Invalid invitation link. Please check the link or contact your admin.')
      } else {
        toast.error(msg ?? 'Failed to activate account. Please try again.')
      }
    }
  }

  if (verifying) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    )
  }

  if (!token || tokenError) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900">Invalid invitation</h3>
        <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
          {tokenError ?? 'This invitation link is invalid. Please contact your hospital admin for a new invite.'}
        </p>
        <Link href="/login" className="mt-5 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Back to sign in
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900">Account activated!</h3>
        <p className="mt-2 text-sm text-slate-500">
          Your doctor account is ready. Sign in to access your HealthBridge dashboard.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="mt-5 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Go to sign in
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Invited user info */}
      {invitedUser && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3.5">
          <p className="text-xs font-semibold text-blue-700 mb-1">You were invited as a doctor</p>
          <p className="text-sm font-medium text-blue-900">
            {invitedUser.firstName} {invitedUser.lastName}
          </p>
          <p className="text-xs text-blue-600">{invitedUser.email}</p>
        </div>
      )}

      <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
        <p className="text-xs text-amber-700">
          Choose a strong password to protect your account. You can change it anytime from your profile.
        </p>
      </div>

      <Input
        label="New password"
        type="password"
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        hint="Uppercase, lowercase, number & special character required"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm password"
        type="password"
        placeholder="Repeat password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        Activate my account
      </Button>

      <p className="text-center text-sm text-slate-500">
        Wrong account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
          Sign in instead
        </Link>
      </p>
    </form>
  )
}
