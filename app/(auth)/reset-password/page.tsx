import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password — CliniLynk',
}

export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900">Set new password</h1>
        <p className="mt-1 text-sm text-slate-500">Choose a strong password for your account</p>
      </div>
      {/* Suspense required because ResetPasswordForm reads useSearchParams() */}
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </>
  )
}
