import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AcceptInviteForm } from '@/features/auth/components/AcceptInviteForm'

export const metadata: Metadata = {
  title: 'Activate Account — CliniLynk',
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
    </div>
  )
}

export default function AcceptInvitePage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900">Activate your account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Set a password to complete your CliniLynk doctor account
        </p>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <AcceptInviteForm />
      </Suspense>
    </>
  )
}
