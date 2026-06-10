export type ShareScope = 'ALL' | 'RECORDS' | 'LABS' | 'PRESCRIPTIONS'
export type ShareLinkStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED'

export interface ShareLink {
  id: string
  patientId: string
  token: string
  scope: ShareScope
  expiresAt?: string
  accessCount: number
  maxAccess?: number
  status: ShareLinkStatus
  createdAt: string
}

export interface ShareGrant {
  id: string
  patientId: string
  grantedToId: string
  grantedToName: string
  grantedToEmail: string
  scope: ShareScope
  expiresAt?: string
  revokedAt?: string
  createdAt: string
}

export interface CreateShareLinkData {
  scope: ShareScope
  expiresAt?: string
  maxAccess?: number
}

export interface CreateShareGrantData {
  grantedToEmail: string
  scope: ShareScope
  expiresAt?: string
}

export interface SharedTokenData {
  patient: { id: string; name: string }
  scope: ShareScope
  expiresAt?: string
  records: import('./patient.types').MedicalRecord[]
}
