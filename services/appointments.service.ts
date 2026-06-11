import { api } from './api'
import type { Appointment, AppointmentFilters, CreateAppointmentData, AppointmentStatus, PaginatedResponse } from '@/types'

export const appointmentsService = {
  list: (filters?: AppointmentFilters) =>
    api.get<PaginatedResponse<Appointment>>('/appointments', { params: filters }).then((r) => r.data),

  mine: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Appointment>>('/appointments/mine', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Appointment>(`/appointments/${id}`).then((r) => r.data),

  create: (data: CreateAppointmentData) =>
    api.post<Appointment>('/appointments', data).then((r) => r.data),

  update: (id: string, data: Partial<CreateAppointmentData>) =>
    api.patch<Appointment>(`/appointments/${id}`, data).then((r) => r.data),

  updateStatus: (id: string, status: AppointmentStatus, notes?: string) =>
    api.patch<Appointment>(`/appointments/${id}/status`, { status, notes }).then((r) => r.data),

  cancel: (id: string, reason?: string) =>
    api.patch<Appointment>(`/appointments/${id}/cancel`, { reason }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/appointments/${id}`).then((r) => r.data),
}
