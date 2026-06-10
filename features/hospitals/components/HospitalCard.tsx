import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { capitalise } from '@/utils/format'
import type { Hospital } from '@/types'

interface HospitalCardProps {
  hospital: Hospital
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Link href={`/hospitals/${hospital.id}`}>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all h-full">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          {hospital.isActive !== undefined && (
            <Badge variant={hospital.isActive ? 'success' : 'warning'}>
              {hospital.isActive ? 'Active' : 'Inactive'}
            </Badge>
          )}
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">{hospital.name}</h3>
        <p className="mt-0.5 text-sm text-slate-500 truncate">{hospital.address}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {hospital.doctorCount ?? 0} doctors
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {hospital.patientCount ?? 0} patients
          </span>
        </div>
      </div>
    </Link>
  )
}
