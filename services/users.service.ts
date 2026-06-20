import { api } from './api'
import type { User, UserRole, PaginatedResponse } from '@/types'

export interface UserFilters {
  search?: string
  role?: string
  hospitalId?: string
  page?: number
  limit?: number
}

export const usersService = {
  list: (filters?: UserFilters) =>
    api.get<PaginatedResponse<User>>('/users', { params: filters }).then((r) => r.data),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`).then((r) => r.data),

  create: (data: Partial<User> & { password: string }) =>
    api.post<User>('/users', data).then((r) => r.data),

  update: (id: string, data: Partial<User>) =>
    api.patch<User>(`/users/${id}`, data).then((r) => r.data),

  updateRole: (id: string, role: UserRole) =>
    api.patch<User>(`/users/${id}/role`, { role: role.toUpperCase() }).then((r) => r.data),

  updateStatus: (id: string, isActive: boolean) =>
    api.patch<User>(`/users/${id}/status`, { isActive }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/users/${id}`).then((r) => r.data),

  invite: (data: { firstName: string; lastName: string; email: string; licenseNumber: string; specialization?: string; hospitalId?: string }) =>
    api.post('/users/invite', data).then((r) => r.data),
}
