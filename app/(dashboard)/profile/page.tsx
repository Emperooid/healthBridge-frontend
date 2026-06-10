'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { usersService } from '@/services/users.service'
import { useAuthStore } from '@/store/auth.store'
import { updateProfileSchema, type UpdateProfileFormData } from '@/utils/validators'
import { formatDate } from '@/utils/format'

const roleBadge: Record<string, 'purple' | 'info' | 'success'> = {
  admin: 'purple',
  doctor: 'info',
  patient: 'success',
}

export default function ProfilePage() {
  const { user, setUser, accessToken, refreshToken } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    },
  })

  async function onSubmit(data: UpdateProfileFormData) {
    if (!user) return
    try {
      const updated = await usersService.update(user.id, data)
      const firstName = (updated as { firstName?: string }).firstName ?? data.firstName
      const lastName = (updated as { lastName?: string }).lastName ?? data.lastName
      setUser(
        { ...user, ...updated, firstName, lastName, name: `${firstName} ${lastName}`.trim() },
        accessToken!,
        refreshToken!
      )
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  if (!user) return null

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Profile</h1>
        <p className="mt-0.5 text-sm text-slate-500">Manage your account information</p>
      </div>

      {/* Identity card */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <h2 className="text-base font-bold text-slate-900">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge variant={roleBadge[user.role] ?? 'default'}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              <Badge variant={user.isActive !== false ? 'success' : 'error'} dot>
                {user.isActive !== false ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member since</p>
            <p className="mt-0.5 font-medium text-slate-800">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">User ID</p>
            <p className="mt-0.5 font-mono text-xs text-slate-600 truncate">{user.id}</p>
          </div>
        </div>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Email address"
            type="email"
            value={user.email}
            disabled
            hint="Email cannot be changed"
          />

          <Input
            label="Phone number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="flex justify-end pt-1">
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Security (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">Password</p>
            <p className="text-xs text-slate-500">Last changed: unknown</p>
          </div>
          <Button variant="outline" size="sm" disabled>
            Change password
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-400">Password change is not yet available — contact your administrator.</p>
      </Card>
    </div>
  )
}
