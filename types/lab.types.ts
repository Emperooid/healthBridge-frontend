export type LabOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface LabOrder {
  id: string
  patientId: string
  patientName?: string
  doctorId: string
  doctorName?: string
  hospitalId?: string
  visitId?: string
  tests: string[]
  status: LabOrderStatus
  notes?: string
  orderedAt: string
  createdAt: string
}

export interface LabResult {
  id: string
  orderId: string
  testName?: string
  value?: string
  unit?: string
  referenceRange?: string
  interpretation?: 'NORMAL' | 'ABNORMAL' | 'CRITICAL'
  fileUrl?: string
  notes?: string
  resultedAt: string
  createdAt: string
}

export interface CreateLabOrderData {
  patientId: string
  visitId?: string
  tests: string[]
  notes?: string
}

export interface CreateLabResultData {
  orderId: string
  testName?: string
  value?: string
  unit?: string
  referenceRange?: string
  interpretation?: LabResult['interpretation']
  fileUrl?: string
  notes?: string
}
