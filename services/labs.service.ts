import { api } from './api'
import type { LabOrder, LabResult, CreateLabOrderData, CreateLabResultData, PaginatedResponse } from '@/types'

export const labsService = {
  listOrders: (params?: { patientId?: string; doctorId?: string; status?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<LabOrder>>('/labs/orders', { params }).then((r) => r.data),

  getOrder: (id: string) =>
    api.get<LabOrder>(`/labs/orders/${id}`).then((r) => r.data),

  createOrder: (data: CreateLabOrderData) =>
    api.post<LabOrder>('/labs/orders', data).then((r) => r.data),

  updateOrder: (id: string, data: { status?: string; notes?: string }) =>
    api.patch<LabOrder>(`/labs/orders/${id}`, data).then((r) => r.data),

  addResult: (data: CreateLabResultData) =>
    api.post<LabResult>('/labs/results', data).then((r) => r.data),

  getResults: (orderId: string) =>
    api.get<LabResult[]>(`/labs/orders/${orderId}/results`).then((r) => r.data),
}
