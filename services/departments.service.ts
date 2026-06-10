import { api } from './api'
import type { Department, CreateDepartmentData } from '@/types'

export const departmentsService = {
  list: (hospitalId: string) =>
    api.get<Department[]>(`/hospitals/${hospitalId}/departments`).then((r) => r.data),

  create: (hospitalId: string, data: CreateDepartmentData) =>
    api.post<Department>(`/hospitals/${hospitalId}/departments`, data).then((r) => r.data),

  update: (id: string, data: Partial<CreateDepartmentData>) =>
    api.patch<Department>(`/hospitals/departments/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/hospitals/departments/${id}`).then((r) => r.data),
}
