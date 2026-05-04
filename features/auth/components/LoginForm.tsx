'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { writeSession } from '@/app/actions/auth'
import { loginSchema, type LoginFormData } from '@/utils/validators'
import type { UserRole } from '@/types'

const roleDashboards: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  doctor: '/dashboard/doctor',
  patient: '/dashboard/patient',
}

export function LoginForm() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await authService.login(data)
      setUser(response.user, response.accessToken, response.refreshToken)
      await writeSession(response.user.id, response.user.role, response.user.email, response.user.name)
      toast.success(`Welcome back, ${response.user.name}!`)
      router.push(roleDashboards[response.user.role])
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ??
        'Invalid credentials. Please try again.'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Sign in
      </Button>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
          Create one
        </Link>
      </p>
    </form>
  )
}
