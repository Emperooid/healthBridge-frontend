import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In — HealthBridge',
}

export default function LoginPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back — enter your credentials below</p>
      </div>
      <LoginForm />
    </>
  )
}
