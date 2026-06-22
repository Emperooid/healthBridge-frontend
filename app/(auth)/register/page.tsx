import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Patient Registration — CliniLynk',
}

export default function RegisterPage() {
  return (
    <>
      <div className="mb-7">
        {/* Role badge */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Patient Account
        </div>
        <h1 className="text-xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Register to manage your personal health records
        </p>
      </div>

      {/* Hospital admin redirect */}
      <div className="mb-5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
        <p className="text-xs text-slate-600">Registering a hospital instead?</p>
        <Link
          href="/register-hospital"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Hospital registration →
        </Link>
      </div>

      <RegisterForm />
    </>
  )
}
