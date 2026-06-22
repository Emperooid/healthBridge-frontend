import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterHospitalForm } from '@/features/auth/components/RegisterHospitalForm'

export const metadata: Metadata = {
  title: 'Hospital Registration — CliniLynk',
  description: 'Register your hospital on CliniLynk. Manage records, appointments, and your medical team in one place.',
}

export default function RegisterHospitalPage() {
  return (
    <>
      <div className="mb-7">
        {/* Role badge */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Healthcare Provider
        </div>
        <h1 className="text-xl font-bold text-slate-900">Register your hospital</h1>
        <p className="mt-1 text-sm text-slate-500">
          Set up your institution and admin account — invite your team on day one
        </p>
      </div>

      {/* Benefit pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {['Free 30-day trial', 'No credit card needed', 'Invite doctors immediately'].map((item) => (
          <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
            ✓ {item}
          </span>
        ))}
      </div>

      {/* Patient redirect */}
      <div className="mb-5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
        <p className="text-xs text-slate-600">Registering as a patient instead?</p>
        <Link
          href="/register"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Patient registration →
        </Link>
      </div>

      <RegisterHospitalForm />
    </>
  )
}
