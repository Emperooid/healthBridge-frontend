'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { clearSession } from '@/app/actions/auth'
import { authService } from '@/services/auth.service'
import { changePasswordSchema, type ChangePasswordFormData } from '@/utils/validators'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function ChangePasswordForm() {
  const { clearAuth } = useAuthStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({ resolver: zodResolver(changePasswordSchema) })

  async function onSubmit(data: ChangePasswordFormData) {
    try {
      await authService.changePassword(data.currentPassword, data.newPassword)
      toast.success('Password changed. Signing you out of all devices…')
      reset()
      // Backend revokes all sessions on success — clear local state and redirect to login
      clearAuth()
      await clearSession()
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ?? 'Failed to change password. Please try again.'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        hint="Min 8 chars — uppercase, lowercase, number, and special character required"
        {...register('newPassword')}
      />
      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmNewPassword?.message}
        {...register('confirmNewPassword')}
      />
      <div className="flex justify-end pt-1">
        <Button type="submit" loading={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
          Change password
        </Button>
      </div>
    </form>
  )
}
