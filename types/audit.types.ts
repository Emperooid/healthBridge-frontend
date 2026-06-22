export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'FILE_UPLOAD'
  | 'FILE_ACCESS'
  | 'SHARE'

export interface AuditLog {
  id: string
  userId: string | null
  userName: string | null
  userRole: string | null
  action: AuditAction
  resourceType: string | null
  resourceId: string | null
  ipAddress: string | null
  userAgent: string | null
  timestamp: string
  details?: Record<string, unknown>
}
