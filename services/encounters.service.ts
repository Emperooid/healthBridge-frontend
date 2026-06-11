import { api } from './api'
import type { Visit, EncounterNote, CreateVisitData, CreateEncounterNoteData, PaginatedResponse } from '@/types'

export const encountersService = {
  createVisit: (data: CreateVisitData) =>
    api.post<Visit>('/encounters/visits', data).then((r) => r.data),

  listVisits: (params?: { patientId?: string; doctorId?: string; status?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Visit>>('/encounters/visits', { params }).then((r) => r.data),

  getVisit: (id: string) =>
    api.get<Visit>(`/encounters/visits/${id}`).then((r) => r.data),

  updateVisit: (id: string, data: Partial<CreateVisitData> & { status?: string }) =>
    api.patch<Visit>(`/encounters/visits/${id}`, data).then((r) => r.data),

  addNote: (data: CreateEncounterNoteData) =>
    api.post<EncounterNote>('/encounters/notes', data).then((r) => r.data),

  getNotes: (visitId: string) =>
    api.get<EncounterNote[]>(`/encounters/visits/${visitId}/notes`).then((r) => r.data),

  updateNote: (id: string, data: Partial<CreateEncounterNoteData>) =>
    api.patch<EncounterNote>(`/encounters/notes/${id}`, data).then((r) => r.data),
}
