'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { appointmentsService } from '@/services/appointments.service'
import { hospitalsService } from '@/services/hospitals.service'
import { useAuthStore } from '@/store/auth.store'

const schema = z.object({
  hospitalId: z.string().min(1, 'Please select a hospital'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  title: z.string().min(2, 'Title is required'),
  reason: z.string().min(10, 'Please describe your reason (min 10 characters)'),
  type: z.enum(['CONSULTATION', 'FOLLOW_UP', 'LAB_REVIEW', 'PROCEDURE', 'EMERGENCY']),
  scheduledAt: z.string().min(1, 'Please select a date and time'),
  duration: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function BookAppointmentPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'CONSULTATION', duration: '30' },
  })

  const watchHospital = watch('hospitalId')

  const { data: hospitalsData } = useQuery({
    queryKey: ['hospitals-public'],
    queryFn: () => hospitalsService.listPublic(),
  })

  const { data: doctorsData } = useQuery({
    queryKey: ['doctors-in-hospital', watchHospital],
    queryFn: () => hospitalsService.getDoctors(watchHospital),
    enabled: !!watchHospital,
  })

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const { duration, ...rest } = data
      return appointmentsService.create({
        ...rest,
        durationMinutes: duration ? parseInt(duration, 10) : 30,
        patientId: user!.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment booked successfully')
      router.push('/appointments')
    },
    onError: () => toast.error('Failed to book appointment'),
  })

  const hospitalOptions = hospitalsData?.map((h) => ({ value: h.id, label: h.name })) ?? []
  const doctorOptions = doctorsData?.map((d) => ({ value: d.userId ?? d.id, label: d.name })) ?? []

  const minDateTime = new Date()
  minDateTime.setMinutes(minDateTime.getMinutes() + 30)
  const minDateTimeStr = minDateTime.toISOString().slice(0, 16)

  return (
    <div className="space-y-5">
      <div>
        <Link href="/appointments" className="text-xs font-medium text-slate-500 hover:text-slate-700">
          ← Appointments
        </Link>
        <h1 className="mt-2 text-xl font-bold text-slate-900">Book Appointment</h1>
        <p className="mt-0.5 text-sm text-slate-500">Schedule a new appointment with a doctor</p>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Appointment Details</h2>
              <div className="space-y-4">
                <Input
                  label="Title"
                  placeholder="e.g. Annual Check-up"
                  error={errors.title?.message}
                  {...register('title')}
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                    Reason for Visit
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your symptoms or reason for this visit..."
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                    {...register('reason')}
                  />
                  {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason.message}</p>}
                </div>
                {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any additional information for the doctor..."
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                    {...register('notes')}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Schedule</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  label="Type"
                  options={[
                    { value: 'CONSULTATION', label: 'Consultation' },
                    { value: 'FOLLOW_UP', label: 'Follow-up' },
                    { value: 'LAB_REVIEW', label: 'Lab Review' },
                    { value: 'PROCEDURE', label: 'Procedure' },
                    { value: 'EMERGENCY', label: 'Emergency' },
                  ]}
                  error={errors.type?.message}
                  {...register('type')}
                />
                <Input
                  label="Duration (minutes)"
                  type="number"
                  min={15}
                  max={240}
                  step={15}
                  error={errors.duration?.message}
                  {...register('duration')}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Date & Time"
                    type="datetime-local"
                    min={minDateTimeStr}
                    error={errors.scheduledAt?.message}
                    {...register('scheduledAt')}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Provider</h2>
              <div className="space-y-4">
                <Select
                  label="Hospital"
                  options={hospitalOptions}
                  placeholder="Select hospital..."
                  error={errors.hospitalId?.message}
                  {...register('hospitalId', {
                    onChange: () => setValue('doctorId', ''),
                  })}
                />
                <Select
                  label="Doctor"
                  options={doctorOptions}
                  placeholder={watchHospital ? 'Select doctor...' : 'Select hospital first'}
                  disabled={!watchHospital}
                  error={errors.doctorId?.message}
                  {...register('doctorId')}
                />
              </div>
            </Card>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-1">Note</p>
              <p className="text-xs text-blue-600">
                Your appointment will be in <strong>Pending</strong> status until confirmed by the doctor or hospital staff.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
