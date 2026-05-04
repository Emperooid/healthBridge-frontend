import { api } from './api'
import type { AuditLog, PaginatedResponse } from '@/types'

export interface AuditFilters {
  userId?: string
  action?: string
  resourceType?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export const auditService = {
  list: (filters?: AuditFilters) =>
    api.get<PaginatedResponse<AuditLog>>('/audit', { params: filters }).then((r) => r.data),

  getByUser: (userId: string) =>
    api.get<AuditLog[]>(`/audit/user/${userId}`).then((r) => r.data),
}
