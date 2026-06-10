'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { shareService } from '@/services/share.service'
import { formatDate, formatDateTime } from '@/utils/format'
import type { ShareScope, MedicalRecord } from '@/types'

const scopeLabels: Record<ShareScope, string> = {
  ALL: 'All Records',
  RECORDS: 'Medical Records',
  LABS: 'Lab Results',
  PRESCRIPTIONS: 'Prescriptions',
}

function RecordCard({ record }: { record: MedicalRecord }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900">{record.title}</p>
          <p className="mt-1 text-sm text-slate-600">{record.description}</p>
        </div>
        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {record.status ?? 'Active'}
        </span>
      </div>

      {(record.diagnosis || record.treatment || record.prescription) && (
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-slate-100 pt-4">
          {record.diagnosis && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Diagnosis</dt>
              <dd className="mt-0.5 text-sm text-slate-700">{record.diagnosis}</dd>
            </div>
          )}
          {record.treatment && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Treatment</dt>
              <dd className="mt-0.5 text-sm text-slate-700">{record.treatment}</dd>
            </div>
          )}
          {record.prescription && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Prescription</dt>
              <dd className="mt-0.5 text-sm text-slate-700">{record.prescription}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        {record.doctorName && <span>Dr. {record.doctorName}</span>}
        {record.hospitalName && <span>· {record.hospitalName}</span>}
        <span>· {formatDate(record.visitDate ?? record.createdAt)}</span>
      </div>

      {record.attachments?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          {record.attachments.map((file) => (
            <a
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {file.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusScreen({ icon, title, message }: { icon: React.ReactNode; title: string; message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Sign in to HealthBridge →
        </Link>
      </div>
    </div>
  )
}

export default function SharedRecordsPage() {
  const { token } = useParams<{ token: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['shared-token', token],
    queryFn: () => shareService.resolveToken(token),
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading shared records…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    const msg = (error as { response?: { status: number } })?.response?.status === 404
      ? 'This share link is invalid or does not exist.'
      : 'This share link has expired or been revoked.'

    return (
      <StatusScreen
        title="Link unavailable"
        message={msg}
        icon={
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    )
  }

  const isExpired = data.expiresAt ? new Date(data.expiresAt) < new Date() : false

  if (isExpired) {
    return (
      <StatusScreen
        title="Link expired"
        message={`This share link expired on ${formatDateTime(data.expiresAt!)}.`}
        icon={
          <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900">HealthBridge</span>
          </div>
          <span className="text-xs text-slate-400">Read-only shared view</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Share metadata */}
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Shared by</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{data.patient.name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {scopeLabels[data.scope]}
              </span>
              {data.expiresAt && (
                <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                  Expires {formatDateTime(data.expiresAt)}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-md bg-amber-50 border border-amber-100 px-3 py-2.5 text-xs text-amber-700">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            This is a confidential patient record. Do not share this link further.
          </div>
        </div>

        {/* Records */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {data.records?.length ?? 0} record{data.records?.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {!data.records?.length ? (
          <div className="rounded-lg border border-slate-200 bg-white py-16 text-center">
            <p className="text-sm text-slate-500">No records are included in this share.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-400">
          Powered by{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            HealthBridge
          </Link>{' '}
          · Patient-controlled health records
        </p>
      </main>
    </div>
  )
}
