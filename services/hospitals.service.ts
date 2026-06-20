import { api } from './api'
import type { Hospital, HospitalDoctor, CreateHospitalData, AssignDoctorData, PaginatedResponse, RegisterHospitalData, User } from '@/types'

export interface HospitalFilters {
  search?: string
  isActive?: boolean
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

  update: (id: string, data: Partial<CreateHospitalData> & { isActive?: boolean }) =>
    api.patch<Hospital>(`/hospitals/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/hospitals/${id}`).then((r) => r.data),

  getDoctors: (hospitalId: string) =>
    api.get<HospitalDoctor[]>(`/hospitals/${hospitalId}/doctors`).then((r) => r.data),

  assignDoctor: (data: AssignDoctorData) =>
    api.post(`/hospitals/${data.hospitalId}/doctors`, {
      userId: data.userId,
      specialization: data.specialization,
      licenseNumber: data.licenseNumber,
    }).then((r) => r.data),

  listPublic: () =>
    api.get<{ id: string; name: string; address?: string; phone?: string; email?: string }[]>('/hospitals/public').then((r) => {
      // Normalize: plain array (current backend) or paginated {data:[]} (old Render build)
      const d = r.data as unknown
      return (Array.isArray(d) ? d : (d as any)?.data ?? []) as { id: string; name: string; address?: string; phone?: string; email?: string }[]
    }),

  registerHospital: (data: RegisterHospitalData) =>
    api.post<{ user: User & { role: string }; accessToken: string; hospital: { id: string; name: string } }>(
      '/hospitals/register', data
    ).then((r) => r.data),
}
