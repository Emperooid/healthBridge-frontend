import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/utils/format'
import type { PatientListItem } from '@/types'

interface PatientCardProps {
  patient: PatientListItem
}

export function PatientCard({ patient }: PatientCardProps) {
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()

  return (
    <Link href={`/patients/${patient.id}`}>
      <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
        <Avatar name={patient.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-slate-900">{patient.name}</p>
            <Badge variant="default">{patient.bloodType}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {age} yrs • {patient.gender} • {patient.email}
          </p>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
              {patient.hospitalName}
            </span>
            {patient.lastVisit && (
              <span className="text-xs text-slate-500">
                Last visit: {formatDate(patient.lastVisit)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
