import { api } from './api'
import type { MedicalAttachment } from '@/types'

export const filesService = {
  // Upload a file and attach it to a record (multipart/form-data, field: file)
  upload: (recordId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api
      .post<MedicalAttachment>(`/files/upload/${recordId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  // List all files attached to a record
  listByRecord: (recordId: string) =>
    api.get<MedicalAttachment[]>(`/files/record/${recordId}`).then((r) => r.data),

  // Get a pre-signed S3 download URL (expires 1 hr)
  getDownloadUrl: (fileId: string) =>
    api.get<{ url: string }>(`/files/${fileId}/url`).then((r) => r.data),

  delete: (fileId: string) =>
    api.delete(`/files/${fileId}`).then((r) => r.data),
}
