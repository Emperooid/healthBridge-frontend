export interface Hospital {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  isActive?: boolean
  doctorCount?: number
  patientCount?: number
  createdAt: string
  updatedAt: string
}

export interface HospitalDoctor {
  id: string
  userId?: string
  name: string
  email: string
  specialization?: string
  specialty?: string
  licenseNumber?: string
  patientCount?: number
  joinedAt?: string
}

export interface CreateHospitalData {
  name: string
  address: string
  phone?: string
  email?: string
}

export interface AssignDoctorData {
  hospitalId: string
  userId: string
  specialization?: string
  licenseNumber: string
}
