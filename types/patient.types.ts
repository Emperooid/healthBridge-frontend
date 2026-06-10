export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export interface Patient {
  id: string
  userId: string
  name: string
  email: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  bloodType?: BloodType
  phone?: string
  allergies?: string[]
  emergencyContact?: string
  hospitalId: string
  hospitalName?: string
  assignedDoctorId?: string
  assignedDoctorName?: string
  createdAt: string
  updatedAt: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  doctorName?: string
  hospitalId: string
  hospitalName?: string
  title: string
  description: string
  diagnosis?: string
  treatment?: string
  prescription?: string
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  visitDate?: string
  attachments: MedicalAttachment[]
  createdAt: string
  updatedAt?: string
}

export interface MedicalAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: string
}

export interface PatientListItem {
  id: string
  userId?: string
  name: string
  email: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  bloodType?: BloodType
  hospitalName?: string
  assignedDoctorName?: string
  lastVisit?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
