import type { Metadata } from 'next'
import { Card } from '@/components/ui/Card'
import { HospitalForm } from '@/features/hospitals/components/HospitalForm'

export const metadata: Metadata = { title: 'New Hospital — HealthBridge' }

export default function NewHospitalPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Hospital</h1>
        <p className="text-sm text-slate-500">Register a new hospital on the platform</p>
      </div>
      <Card>
        <HospitalForm />
      </Card>
    </div>
  )
}
