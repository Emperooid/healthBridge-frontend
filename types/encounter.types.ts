export type VisitStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Visit {
  id: string
  patientId: string
  patientName?: string
  doctorId: string
  doctorName?: string
  hospitalId: string
  hospitalName?: string
  status: VisitStatus
  reason?: string
  startedAt?: string
  completedAt?: string
  createdAt: string
}

export interface EncounterNote {
  id: string
  visitId: string
  doctorId: string
  doctorName?: string
  chiefComplaint?: string
  examination?: string
  diagnosis?: string
  notes?: string
  vitalSigns?: {
    temperature?: number
    bloodPressure?: string
    heartRate?: number
    weight?: number
    height?: number
  }
  createdAt: string
  updatedAt?: string
}

export interface CreateVisitData {
  patientId: string
  doctorId?: string
  hospitalId: string
  reason?: string
}

export interface CreateEncounterNoteData {
  visitId: string
  chiefComplaint?: string
  examination?: string
  diagnosis?: string
  notes?: string
  vitalSigns?: EncounterNote['vitalSigns']
}
