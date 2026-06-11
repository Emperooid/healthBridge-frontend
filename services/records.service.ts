import { api } from './api'
import type { MedicalRecord, PaginatedResponse } from '@/types'

export interface RecordFilters {
  patientId?: string
  doctorId?: string
  hospitalId?: string
  status?: string
  page?: number
  limit?: number
}

export interface CreateRecordData {
  patientId: string
  doctorId: string
  hospitalId: string
  title: string
  description: string
  diagnosis?: string
  treatment?: string
  prescription?: string
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  visitDate?: string
}

export const recordsService = {
  list: (filters?: RecordFilters) =>
    api.get<PaginatedResponse<MedicalRecord>>('/records', { params: filters }).then((r) => r.data),

  mine: () =>
    api.get<PaginatedResponse<MedicalRecord>>('/records/mine').then((r) => r.data),

  getByPatient: (patientId: string) =>
    api.get<PaginatedResponse<MedicalRecord>>(`/records/patient/${patientId}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<MedicalRecord>(`/records/${id}`).then((r) => r.data),

  create: (data: CreateRecordData) =>
    api.post<MedicalRecord>('/records', data).then((r) => r.data),

  update: (id: string, data: Partial<CreateRecordData>) =>
    api.patch<MedicalRecord>(`/records/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/records/${id}`).then((r) => r.data),
}
