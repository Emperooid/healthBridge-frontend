import { api } from './api'
import type { Prescription, CreatePrescriptionData, PaginatedResponse } from '@/types'

export const prescriptionsService = {
  list: (params?: { patientId?: string; doctorId?: string; status?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Prescription>>('/prescriptions', { params }).then((r) => r.data),

  mine: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Prescription>>('/prescriptions/mine', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Prescription>(`/prescriptions/${id}`).then((r) => r.data),

  create: (data: CreatePrescriptionData) =>
    api.post<Prescription>('/prescriptions', data).then((r) => r.data),

  update: (id: string, data: Partial<CreatePrescriptionData> & { status?: string }) =>
    api.patch<Prescription>(`/prescriptions/${id}`, data).then((r) => r.data),
}
