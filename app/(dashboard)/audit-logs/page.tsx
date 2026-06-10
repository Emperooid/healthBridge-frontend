'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { auditService } from '@/services/audit.service'
import { formatDateTime, capitalise } from '@/utils/format'
import type { AuditAction } from '@/types'

const actionVariants: Partial<Record<AuditAction, 'info' | 'success' | 'warning' | 'error' | 'purple'>> = {
  login: 'success',
  create_record: 'success',
  create_hospital: 'success',
  create_user: 'success',
  upload_file: 'success',
  update_record: 'warning',
  update_hospital: 'warning',
  update_user: 'warning',
  delete_record: 'error',
  delete_user: 'error',
  assign_doctor: 'purple',
  view_patient: 'info',
  view_record: 'info',
  download_file: 'info',
}

export default function AuditLogsPage() {
  const [action, setAction] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', { action, page }],
    queryFn: () => auditService.list({ action: action || undefined, page, limit: 20 }),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Audit Logs</h1>
          <p className="mt-0.5 text-sm text-slate-500">{data?.total ?? 0} entries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          options={[
            { value: 'login', label: 'Login' },
            { value: 'logout', label: 'Logout' },
            { value: 'view_patient', label: 'View Patient' },
            { value: 'create_record', label: 'Create Record' },
            { value: 'update_record', label: 'Update Record' },
            { value: 'delete_record', label: 'Delete Record' },
            { value: 'upload_file', label: 'Upload File' },
            { value: 'assign_doctor', label: 'Assign Doctor' },
            { value: 'create_hospital', label: 'Create Hospital' },
          ]}
          placeholder="All actions"
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1) }}
          className="w-48"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-5"><TableSkeleton rows={10} /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['User', 'Action', 'Resource', 'IP Address', 'Time'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.data.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{log.userName}</p>
                      <p className="text-xs text-slate-500 capitalize">{log.userRole}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={actionVariants[log.action] ?? 'default'}>
                        {capitalise(log.action.replace(/_/g, ' '))}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700 truncate max-w-[200px]">{log.resourceName}</p>
                      <p className="text-xs text-slate-400 capitalize">{log.resourceType}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && !data?.data.length && (
            <div className="flex flex-col items-center py-16 text-slate-500">
              <svg className="mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm font-medium">No log entries found</p>
            </div>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex justify-center border-t border-slate-200 px-4 py-3">
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}
