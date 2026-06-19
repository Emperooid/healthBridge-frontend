import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterHospitalForm } from '@/features/auth/components/RegisterHospitalForm'

export const metadata: Metadata = {
  title: 'Register Your Hospital — HealthBridge',
  description: 'Bring your hospital onto the HealthBridge platform. Manage records, appointments, and your medical team from one place.',
}

export default function RegisterHospitalPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900">HealthBridge</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Already registered? Sign in →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        {/* Page header */}
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
            For Healthcare Providers
          </span>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Register your hospital</h1>
          <p className="mt-2 text-sm text-slate-600">
            Get your hospital on HealthBridge in minutes. Your admin account lets you invite doctors and manage everything from day one.
          </p>
        </div>

        {/* Benefit pills */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {[
            '✓ Free 30-day trial',
            '✓ No credit card needed',
            '✓ Invite doctors immediately',
          ].map((item) => (
            <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
              {item}
            </span>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <RegisterHospitalForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Are you a patient?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Create a patient account instead →
          </Link>
        </p>
      </main>
    </div>
  )
}
