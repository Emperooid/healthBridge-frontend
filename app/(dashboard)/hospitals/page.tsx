'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { hospitalsService } from '@/services/hospitals.service'

export default function HospitalsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['hospitals', { search, page }],
    queryFn: () => hospitalsService.list({ page, limit: 15 }),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Hospitals</h1>
          <p className="mt-0.5 text-sm text-slate-500">{data?.total ?? 0} registered</p>
        </div>
        <Link href="/hospitals/new">
          <Button size="sm">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Hospital
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search hospitals..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="h-9 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-5"><TableSkeleton rows={8} /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Hospital</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Doctors</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Patients</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.data.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{hospital.name}</p>
                          {hospital.email && <p className="text-xs text-slate-500 truncate">{hospital.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{hospital.address}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{hospital.doctorCount ?? 0}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{hospital.patientCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <Badge variant={hospital.isActive !== false ? 'success' : 'warning'} dot>
                        {hospital.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/hospitals/${hospital.id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && !data?.data.length && (
            <div className="flex flex-col items-center py-16 text-slate-500">
              <svg className="mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
              <p className="text-sm font-medium">No hospitals found</p>
              <Link href="/hospitals/new" className="mt-2 text-xs text-blue-600 hover:text-blue-700">
                Add one →
              </Link>
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
