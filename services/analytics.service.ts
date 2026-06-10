import { api } from './api'
import type { AnalyticsOverview, AnalyticsSeries, AnalyticsTimeSeries } from '@/types'

export const analyticsService = {
  overview: () =>
    api.get<AnalyticsOverview>('/analytics/overview').then((r) => r.data),

  patients: (params?: { from?: string; to?: string }) =>
    api.get<AnalyticsTimeSeries[]>('/analytics/patients', { params }).then((r) => r.data),

  appointments: (params?: { from?: string; to?: string }) =>
    api.get<AnalyticsTimeSeries[]>('/analytics/appointments', { params }).then((r) => r.data),

  records: (params?: { from?: string; to?: string }) =>
    api.get<AnalyticsTimeSeries[]>('/analytics/records', { params }).then((r) => r.data),

  hospitals: () =>
    api.get<AnalyticsSeries[]>('/analytics/hospitals').then((r) => r.data),

  labs: (params?: { from?: string; to?: string }) =>
    api.get<AnalyticsTimeSeries[]>('/analytics/labs', { params }).then((r) => r.data),

  prescriptions: (params?: { from?: string; to?: string }) =>
    api.get<AnalyticsTimeSeries[]>('/analytics/prescriptions', { params }).then((r) => r.data),
}
