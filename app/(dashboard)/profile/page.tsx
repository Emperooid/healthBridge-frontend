'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { usersService } from '@/services/users.service'
import { patientsService } from '@/services/patients.service'
import { useAuthStore } from '@/store/auth.store'
import { updateProfileSchema, type UpdateProfileFormData } from '@/utils/validators'
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm'
import { formatDate } from '@/utils/format'
import type { BloodType } from '@/types'

const roleBadge: Record<string, 'purple' | 'info' | 'success'> = {
  admin: 'purple',
  doctor: 'info',
  patient: 'success',
}

const healthSchema = z.object({
  bloodType: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  emergencyContact: z.string().optional(),
})

type HealthForm = z.infer<typeof healthSchema>

const bloodTypeOptions: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function ProfilePage() {
  const { user, setUser, accessToken } = useAuthStore()
  const queryClient = useQueryClient()
  const isPatient = user?.role === 'patient'

  // Basic profile form
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
        accessToken!
      )
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  // Patient health info
  const { data: patientProfile } = useQuery({
    queryKey: ['patient-me'],
    queryFn: () => patientsService.me(),
    enabled: isPatient,
  })

  const [allergies, setAllergies] = useState<string[]>([])
  const [allergyInput, setAllergyInput] = useState('')

  const healthForm = useForm<HealthForm>({
    resolver: zodResolver(healthSchema),
    defaultValues: { bloodType: '', gender: '', dateOfBirth: '', emergencyContact: '' },
  })

  useEffect(() => {
    if (patientProfile) {
      healthForm.reset({
        bloodType: patientProfile.bloodType ?? '',
        gender: patientProfile.gender ?? '',
        dateOfBirth: patientProfile.dateOfBirth ? patientProfile.dateOfBirth.slice(0, 10) : '',
        emergencyContact: patientProfile.emergencyContact ?? '',
      })
      setAllergies(patientProfile.allergies ?? [])
    }
  }, [patientProfile, healthForm])

  const updateHealthMutation = useMutation({
    mutationFn: (data: HealthForm) =>
      patientsService.update(patientProfile!.id, {
        bloodType: (data.bloodType as BloodType) || undefined,
        gender: (data.gender as 'MALE' | 'FEMALE' | 'OTHER') || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        emergencyContact: data.emergencyContact || undefined,
        allergies,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-me'] })
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] })
      toast.success('Health information updated')
    },
    onError: () => toast.error('Failed to update health information'),
  })

  function addAllergy() {
    const trimmed = allergyInput.trim()
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed])
    }
    setAllergyInput('')
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

      {/* Personal info form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      {/* Patient health info */}
      {isPatient && (
        <Card>
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
          </CardHeader>
          <p className="mb-4 text-xs text-slate-500">
            This information helps your care team provide better treatment.
          </p>
          <form
            onSubmit={healthForm.handleSubmit((d) => updateHealthMutation.mutate(d))}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Blood type</label>
                <select
                  {...healthForm.register('bloodType')}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select blood type</option>
                  {bloodTypeOptions.map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Gender</label>
                <select
                  {...healthForm.register('gender')}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Prefer not to say</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Date of birth</label>
                <input
                  type="date"
                  {...healthForm.register('dateOfBirth')}
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <Input
                label="Emergency contact"
                placeholder="Name and phone number"
                {...healthForm.register('emergencyContact')}
              />
            </div>

            {/* Allergies tag input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Allergies</label>
              {allergies.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => setAllergies(allergies.filter((a) => a !== allergy))}
                        className="ml-0.5 text-amber-500 hover:text-amber-800 transition-colors"
                        aria-label={`Remove ${allergy}`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addAllergy()
                    }
                  }}
                  placeholder="e.g. Penicillin, Peanuts"
                  className="h-9 flex-1 rounded-md border border-slate-300 px-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addAllergy}
                  disabled={!allergyInput.trim()}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-slate-400">Press Enter or click Add after each allergy</p>
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" loading={updateHealthMutation.isPending}>
                Save health info
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <p className="mb-4 text-xs text-slate-500">
          Changing your password will sign you out of all other devices immediately.
        </p>
        <ChangePasswordForm />
      </Card>
    </div>
  )
}
