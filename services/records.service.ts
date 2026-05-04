import { api } from './api'
import type { MedicalRecord, PaginatedResponse } from '@/types'

export interface RecordFilters {
  page?: number
  limit?: number
}

export interface CreateRecordData {
  patientId: string
  type: MedicalRecord['type']
  title: string
  description: string
  date: string
  crossHospitalAccess?: boolean
}

export const recordsService = {
  // All records (admin = all, doctor = own, patient = own)
  list: (filters?: RecordFilters) =>
    api.get<PaginatedResponse<MedicalRecord>>('/records', { params: filters }).then((r) => r.data),

  // All records for a specific patient
  getByPatient: (patientId: string) =>
    api.get<MedicalRecord[]>(`/records/patient/${patientId}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<MedicalRecord>(`/records/${id}`).then((r) => r.data),

  create: (data: CreateRecordData) =>
    api.post<MedicalRecord>('/records', data).then((r) => r.data),

  update: (id: string, data: Partial<CreateRecordData>) =>
    api.patch<MedicalRecord>(`/records/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/records/${id}`).then((r) => r.data),
}
