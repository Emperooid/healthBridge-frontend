import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password — CliniLynk',
}

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
        <p className="mt-1 text-sm text-slate-600">No worries, we&apos;ll send you reset instructions</p>
      </div>
      <ForgotPasswordForm />
    </>
  )
}
