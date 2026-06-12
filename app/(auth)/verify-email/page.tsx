import { Suspense } from 'react'
import type { Metadata } from 'next'
import { VerifyEmailView } from '@/features/auth/components/VerifyEmailView'

export const metadata: Metadata = {
  title: 'Verify Email — HealthBridge',
}

export default function VerifyEmailPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900">Email verification</h1>
        <p className="mt-1 text-sm text-slate-500">One moment while we verify your account</p>
      </div>
      {/* Suspense required because VerifyEmailView reads useSearchParams() */}
      <Suspense>
        <VerifyEmailView />
      </Suspense>
    </>
  )
}
