export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
export type RecordType = 'diagnosis' | 'prescription' | 'lab_result' | 'imaging' | 'surgery' | 'note'

export interface Patient {
  id: string
  name: string
  email: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  bloodType: BloodType
  phone: string
  address: string
  hospitalId: string
  hospitalName: string
  assignedDoctorId?: string
  assignedDoctorName?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: string
  updatedAt: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  hospitalId: string
  hospitalName: string
  type: RecordType
  title: string
  description: string
  date: string
  attachments: MedicalAttachment[]
  crossHospitalAccess: boolean
  createdAt: string
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
  name: string
  email: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  bloodType: BloodType
  hospitalName: string
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
