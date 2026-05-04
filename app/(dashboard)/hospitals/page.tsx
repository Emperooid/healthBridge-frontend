'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { SearchBar } from '@/components/ui/SearchBar'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { HospitalCard } from '@/features/hospitals/components/HospitalCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { hospitalsService } from '@/services/hospitals.service'

export default function HospitalsPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['hospitals', { search, type, page }],
    queryFn: () => hospitalsService.list({ search, type: type || undefined, page, limit: 12 }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospitals</h1>
          <p className="text-sm text-slate-500">{data?.total ?? 0} hospitals registered</p>
        </div>
        <Link href="/hospitals/new">
          <Button size="sm">+ New Hospital</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchBar
          placeholder="Search hospitals..."
          onSearch={setSearch}
          className="flex-1 min-w-48"
        />
        <Select
          options={[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
            { value: 'clinic', label: 'Clinic' },
          ]}
          placeholder="All types"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-36"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
          {!data?.data.length && (
            <div className="flex flex-col items-center py-16 text-slate-500">
              <svg className="h-12 w-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
              <p className="font-medium">No hospitals found</p>
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
