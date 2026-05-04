'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SearchBar } from '@/components/ui/SearchBar'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { auditService } from '@/services/audit.service'
import { formatDateTime, capitalise } from '@/utils/format'
import type { AuditAction } from '@/types'

const actionVariants: Record<AuditAction, 'info' | 'success' | 'warning' | 'error' | 'default' | 'purple'> = {
  login: 'success',
  logout: 'default',
  view_patient: 'info',
  view_record: 'info',
  create_record: 'success',
  update_record: 'warning',
  delete_record: 'error',
  upload_file: 'success',
  download_file: 'info',
  create_hospital: 'success',
  update_hospital: 'warning',
  assign_doctor: 'purple',
  create_user: 'success',
  update_user: 'warning',
  delete_user: 'error',
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', { search, action, page }],
    queryFn: () => auditService.list({ action: action || undefined, page, limit: 20 }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-sm text-slate-500">Track all platform activity</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchBar placeholder="Search by user or resource..." onSearch={setSearch} className="flex-1 min-w-48" />
        <Select
          options={[
            { value: 'login', label: 'Login' },
            { value: 'view_patient', label: 'View Patient' },
            { value: 'create_record', label: 'Create Record' },
            { value: 'delete_record', label: 'Delete Record' },
            { value: 'upload_file', label: 'Upload File' },
          ]}
          placeholder="All actions"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-44"
        />
      </div>

      <Card padding="none">
        <CardHeader className="px-6 pt-5">
          <CardTitle>Activity Log</CardTitle>
          <span className="text-sm text-slate-500">{data?.total ?? 0} entries</span>
        </CardHeader>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6"><TableSkeleton rows={8} /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  {['User', 'Action', 'Resource', 'IP Address', 'Timestamp'].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.data.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{log.userName}</p>
                        <p className="text-xs text-slate-500 capitalize">{log.userRole}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={actionVariants[log.action] ?? 'default'}>
                        {capitalise(log.action)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{log.resourceName}</p>
                      <p className="text-xs text-slate-400">{log.resourceType}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex justify-center border-t border-slate-200 px-6 py-4">
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  )
}
