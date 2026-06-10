import { api } from './api'
import type { Notification, NotificationFilters, PaginatedResponse } from '@/types'

export const notificationsService = {
  list: (filters?: NotificationFilters) =>
    api.get<PaginatedResponse<Notification>>('/notifications', { params: filters }).then((r) => r.data),

  unreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count').then((r) => r.data),

  markRead: (id: string) =>
    api.patch<Notification>(`/notifications/${id}/read`).then((r) => r.data),

  markAllRead: () =>
    api.patch('/notifications/read-all').then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/notifications/${id}`).then((r) => r.data),
}
