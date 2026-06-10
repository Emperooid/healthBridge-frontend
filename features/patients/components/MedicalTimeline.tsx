import { Badge } from '@/components/ui/Badge'
import { FilePreview } from '@/components/ui/FilePreview'
import { formatDate } from '@/utils/format'
import type { MedicalRecord } from '@/types'

interface MedicalTimelineProps {
  records: MedicalRecord[]
}

const statusVariant = {
  ACTIVE: 'success',
  DRAFT: 'warning',
  ARCHIVED: 'default',
} as const

export function MedicalTimeline({ records }: MedicalTimelineProps) {
  if (!records.length) {
    return (
      <div className="flex flex-col items-center py-14 text-slate-500">
        <svg className="mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm font-medium">No medical records yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {records.map((record) => (
        <div key={record.id} className="flex gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
          {/* Date column */}
          <div className="w-20 shrink-0 text-right pt-0.5">
            <p className="text-xs font-semibold text-slate-600 leading-tight">
              {formatDate(record.visitDate ?? record.createdAt).split(' ').slice(0, 2).join(' ')}
            </p>
            <p className="text-xs text-slate-400">
              {formatDate(record.visitDate ?? record.createdAt).split(' ')[2] ?? ''}
            </p>
          </div>

          {/* Timeline connector */}
          <div className="flex flex-col items-center gap-1">
            <div className="mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-blue-500 bg-white shrink-0" />
            <div className="flex-1 w-px bg-slate-200" />
          </div>

          {/* Record content */}
          <div className="flex-1 min-w-0 pb-3">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <p className="text-sm font-semibold text-slate-900">{record.title}</p>
              {record.status && (
                <Badge variant={statusVariant[record.status] ?? 'default'}>
                  {record.status.charAt(0) + record.status.slice(1).toLowerCase()}
                </Badge>
              )}
            </div>

            {(record.doctorName || record.hospitalName) && (
              <p className="mt-0.5 text-xs text-slate-500">
                {record.doctorName ? `Dr. ${record.doctorName}` : ''}
                {record.doctorName && record.hospitalName ? ' · ' : ''}
                {record.hospitalName ?? ''}
              </p>
            )}

            <p className="mt-1.5 text-sm text-slate-700">{record.description}</p>

            {(record.diagnosis || record.treatment || record.prescription) && (
              <div className="mt-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 space-y-1">
                {record.diagnosis && (
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-500">Diagnosis: </span>
                    {record.diagnosis}
                  </p>
                )}
                {record.treatment && (
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-500">Treatment: </span>
                    {record.treatment}
                  </p>
                )}
                {record.prescription && (
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-500">Prescription: </span>
                    {record.prescription}
                  </p>
                )}
              </div>
            )}

            {record.attachments?.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {record.attachments.map((attachment) => (
                  <FilePreview key={attachment.id} attachment={attachment} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
