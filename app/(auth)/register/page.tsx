import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account — HealthBridge',
}

export default function RegisterPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
        <p className="mt-1 text-sm text-slate-600">Join HealthBridge to manage your healthcare</p>
      </div>
      <RegisterForm />
    </>
  )
}
