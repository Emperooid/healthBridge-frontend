export interface Hospital {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  website?: string
  type: 'public' | 'private' | 'clinic'
  status: 'active' | 'inactive'
  adminId: string
  doctorCount: number
  patientCount: number
  createdAt: string
  updatedAt: string
}

export interface HospitalDoctor {
  id: string
  name: string
  email: string
  specialty: string
  patientCount: number
  joinedAt: string
}

export interface CreateHospitalData {
  name: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  website?: string
  type: 'public' | 'private' | 'clinic'
}

export interface AssignDoctorData {
  doctorId: string
  hospitalId: string
}
