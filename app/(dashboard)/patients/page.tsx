'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchBar } from '@/components/ui/SearchBar'
import { Pagination } from '@/components/ui/Pagination'
import { PatientCard } from '@/features/patients/components/PatientCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { patientsService } from '@/services/patients.service'

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['patients', { search, page }],
    queryFn: () => patientsService.list({ search, page, limit: 12 }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500">{data?.total ?? 0} patients total</p>
        </div>
      </div>

      <SearchBar
        placeholder="Search patients by name, email..."
        onSearch={setSearch}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
          {!data?.data.length && (
            <div className="flex flex-col items-center py-16 text-slate-500">
              <svg className="h-12 w-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="font-medium">No patients found</p>
            </div>
          )}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
