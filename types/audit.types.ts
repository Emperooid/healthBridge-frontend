export type AuditAction =
  | 'login'
  | 'logout'
  | 'view_patient'
  | 'view_record'
  | 'create_record'
  | 'update_record'
  | 'delete_record'
  | 'upload_file'
  | 'download_file'
  | 'create_hospital'
  | 'update_hospital'
  | 'assign_doctor'
  | 'create_user'
  | 'update_user'
  | 'delete_user'

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: AuditAction
  resourceType: string
  resourceId: string
  resourceName: string
  ipAddress: string
  userAgent: string
  timestamp: string
  details?: Record<string, unknown>
}
