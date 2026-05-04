import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/format'
import { capitalise } from '@/utils/format'
import { FilePreview } from '@/components/ui/FilePreview'
import type { MedicalRecord } from '@/types'

interface MedicalTimelineProps {
  records: MedicalRecord[]
}

const typeVariants = {
  diagnosis: 'info',
  prescription: 'success',
  lab_result: 'warning',
  imaging: 'purple',
  surgery: 'error',
  note: 'default',
} as const

const typeIcons: Record<string, string> = {
  diagnosis: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  prescription: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  lab_result: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  imaging: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  surgery: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  note: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
}

export function MedicalTimeline({ records }: MedicalTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <svg className="h-12 w-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm font-medium">No medical records yet</p>
      </div>
    )
  }

  return (
    <div className="relative space-y-4">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />
      {records.map((record) => (
        <div key={record.id} className="relative flex gap-4">
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-slate-200">
            <svg
              className="h-4 w-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={typeIcons[record.type] ?? typeIcons.note}
              />
            </svg>
          </div>
          <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-slate-900">{record.title}</h4>
                  <Badge variant={typeVariants[record.type]}>{capitalise(record.type)}</Badge>
                  {record.crossHospitalAccess && (
                    <Badge variant="info">
                      <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Cross-hospital
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dr. {record.doctorName} • {record.hospitalName}
                </p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(record.date)}</span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{record.description}</p>
            {record.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
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
