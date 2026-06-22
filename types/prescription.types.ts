export type PrescriptionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface Prescription {
  id: string
  patientId: string
  patientName?: string
  doctorId: string
  doctorName?: string
  hospitalId?: string
  hospitalName?: string
  visitId?: string
  drug: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  status: PrescriptionStatus
  prescribedAt: string
  createdAt: string
}

export interface CreatePrescriptionData {
  patientId: string
  visitId?: string
  drug: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}
