export type NotificationType =
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_reminder'
  | 'record_shared'
  | 'record_updated'
  | 'lab_result'
  | 'prescription'
  | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: string
}

export interface NotificationFilters {
  read?: boolean
  page?: number
  limit?: number
}
