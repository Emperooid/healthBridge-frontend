'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/auth.service'

type VerifyState = 'loading' | 'success' | 'error'

export function VerifyEmailView() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<VerifyState>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setState('error')
      setErrorMessage('No verification token found in the link.')
      return
    }
    authService
      .verifyEmail(token)
      .then(() => setState('success'))
      .catch((err: unknown) => {
        setState('error')
        setErrorMessage(
          (err as { message?: string })?.message ??
            'Verification failed. The link may have expired or already been used.'
        )
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="text-sm text-slate-500">Verifying your email…</p>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Email verified</h3>
        <p className="mt-2 text-sm text-slate-600">
          Your account is now active. You can sign in.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">Verification failed</h3>
      <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
      <Link
        href="/forgot-password"
        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Request a new link
      </Link>
    </div>
  )
}
