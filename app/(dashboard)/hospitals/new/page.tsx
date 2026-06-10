import type { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { HospitalForm } from '@/features/hospitals/components/HospitalForm'

export const metadata: Metadata = { title: 'New Hospital — HealthBridge' }

export default function NewHospitalPage() {
  return (
    <div className="max-w-lg space-y-5">
      <div>
        <Link href="/hospitals" className="text-xs font-medium text-slate-500 hover:text-slate-700">
          ← Hospitals
        </Link>
        <h1 className="mt-2 text-xl font-bold text-slate-900">Add Hospital</h1>
        <p className="mt-0.5 text-sm text-slate-500">Register a new hospital on the platform</p>
      </div>
      <Card>
        <HospitalForm />
      </Card>
    </div>
  )
}
