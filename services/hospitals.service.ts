import { api } from './api'
import type { Hospital, HospitalDoctor, CreateHospitalData, AssignDoctorData, PaginatedResponse } from '@/types'

export interface HospitalFilters {
  search?: string
  type?: string
  status?: string
  page?: number
  limit?: number
}

export const hospitalsService = {
  list: (filters?: HospitalFilters) =>
    api.get<PaginatedResponse<Hospital>>('/hospitals', { params: filters }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Hospital>(`/hospitals/${id}`).then((r) => r.data),

  create: (data: CreateHospitalData) =>
    api.post<Hospital>('/hospitals', data).then((r) => r.data),

  update: (id: string, data: Partial<CreateHospitalData>) =>
    api.patch<Hospital>(`/hospitals/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/hospitals/${id}`).then((r) => r.data),

  getDoctors: (hospitalId: string) =>
    api.get<HospitalDoctor[]>(`/hospitals/${hospitalId}/doctors`).then((r) => r.data),

  assignDoctor: (data: AssignDoctorData) =>
    api.post(`/hospitals/${data.hospitalId}/doctors`, { doctorId: data.doctorId }).then((r) => r.data),

  // Backend doesn't expose DELETE /hospitals/:id/doctors/:doctorId in the spec —
  // remove from UI until backend adds it, or use PATCH /users/:id/status instead
}
