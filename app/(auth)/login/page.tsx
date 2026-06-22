import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In — CliniLynk',
}

export default function LoginPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-900">Sign in to CliniLynk</h1>
        <p className="mt-1 text-sm text-slate-500">Select your role below, then enter your credentials</p>
      </div>
      <LoginForm />
    </>
  )
}
