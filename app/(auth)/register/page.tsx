import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account — HealthBridge',
}

export default function RegisterPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Register to access the HealthBridge platform</p>
      </div>
      <RegisterForm />
    </>
  )
}
