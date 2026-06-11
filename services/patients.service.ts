import { api } from './api'
import type { Patient, PatientListItem, PaginatedResponse } from '@/types'

export interface PatientFilters {
  search?: string
  hospitalId?: string
  doctorId?: string
  page?: number
  limit?: number
}

export const patientsService = {
  list: (filters?: PatientFilters) =>
    api.get<PaginatedResponse<PatientListItem>>('/patients', { params: filters }).then((r) => r.data),

  me: () =>
    api.get<Patient>('/patients/me').then((r) => r.data),

  getById: (id: string) =>
    api.get<Patient>(`/patients/${id}`).then((r) => r.data),

  create: (data: Partial<Patient>) =>
    api.post<Patient>('/patients', data).then((r) => r.data),

  update: (id: string, data: Partial<Patient>) =>
    api.patch<Patient>(`/patients/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/patients/${id}`).then((r) => r.data),
}
