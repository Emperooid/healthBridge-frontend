export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
export type AppointmentType = 'CONSULTATION' | 'FOLLOW_UP' | 'LAB_REVIEW' | 'PROCEDURE' | 'EMERGENCY'

export interface Appointment {
  id: string
  patientId: string
  patientName?: string
  doctorId: string
  doctorName?: string
  hospitalId: string
  hospitalName?: string
  title: string
  reason: string
  type: AppointmentType
  status: AppointmentStatus
  scheduledAt: string
  duration: number
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateAppointmentData {
  patientId: string
  doctorId: string
  hospitalId: string
  title: string
  reason: string
  type: AppointmentType
  scheduledAt: string
  durationMinutes?: number
  notes?: string
}

export interface AppointmentFilters {
  patientId?: string
  doctorId?: string
  hospitalId?: string
  status?: AppointmentStatus
  from?: string
  to?: string
  page?: number
  limit?: number
}
