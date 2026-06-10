export interface AnalyticsOverview {
  totalPatients: number
  totalDoctors: number
  totalHospitals: number
  totalAppointments: number
  totalRecords: number
  totalLabOrders: number
  totalPrescriptions: number
  newPatientsThisMonth?: number
  appointmentsThisMonth?: number
}

export interface AnalyticsSeries {
  label: string
  value: number
}

export interface AnalyticsTimeSeries {
  date: string
  count: number
}
