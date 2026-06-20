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
import { useAuthStore } from '@/store/auth.store'
import { acceptInviteSchema, type AcceptInviteFormData } from '@/utils/validators'

interface InvitedUser {
  firstName: string
  lastName: string
  email: string
  specialization?: string
}

export function AcceptInviteForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const { setUser } = useAuthStore()

  const [invitedUser, setInvitedUser] = useState<InvitedUser | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(true)

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
      .catch((err: unknown) => {
        const msg = ((err as { message?: string })?.message ?? '').toLowerCase()
        if (msg.includes('expired') || msg.includes('gone')) {
          setTokenError('This invitation has expired. Ask your hospital admin to send a new invite.')
        } else if (msg.includes('invalid') || msg.includes('not found')) {
          setTokenError('This invitation link is invalid. Please contact your hospital admin.')
        }
        // If the endpoint isn't implemented yet, let through silently so the POST catches it
        setVerifying(false)
      })
  }, [token])

  async function onSubmit(data: AcceptInviteFormData) {
    if (!token) return
    try {
      const response = await authService.acceptInvite(token, data.password)
      setUser(response.user, response.accessToken)
      toast.success('Account activated! Taking you to your dashboard…')
      router.push('/dashboard/doctor')
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? ''
      if (msg.toLowerCase().includes('expired')) {
        toast.error('This invitation has expired. Ask your admin to send a new one.')
      } else if (msg.toLowerCase().includes('invalid')) {
        toast.error('Invalid invitation link. Please check the link or contact your admin.')
      } else {
        toast.error(msg || 'Failed to activate account. Please try again.')
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
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900">Invalid invitation</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">
          {tokenError ?? 'This invitation link is invalid. Please contact your hospital admin for a new invite.'}
        </p>
        <Link href="/login" className="mt-5 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Invited user info */}
      {invitedUser && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3.5">
          <p className="mb-1 text-xs font-semibold text-blue-700">You were invited as a doctor</p>
          <p className="text-sm font-medium text-blue-900">
            {invitedUser.firstName} {invitedUser.lastName}
          </p>
          <p className="text-xs text-blue-600">{invitedUser.email}</p>
          {invitedUser.specialization && (
            <p className="mt-0.5 text-xs text-blue-500">{invitedUser.specialization}</p>
          )}
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
