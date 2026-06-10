export interface Department {
  id: string
  hospitalId: string
  name: string
  description?: string
  createdAt: string
}

export interface CreateDepartmentData {
  name: string
  description?: string
}
