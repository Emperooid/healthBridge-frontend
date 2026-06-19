'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { patientsService } from '@/services/patients.service'
import type { PatientListItem } from '@/types'

interface PatientSearchFieldProps {
  value: string
  displayName: string
  onSelect: (id: string, name: string) => void
  onClear: () => void
  error?: string
  doctorId?: string
}

export function PatientSearchField({
  value,
  displayName,
  onSelect,
  onClear,
  error,
  doctorId,
}: PatientSearchFieldProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['patient-search', search, doctorId],
    queryFn: () => patientsService.list({ search, doctorId, limit: 8 }),
    enabled: search.length > 1 && !value,
  })

  function handleSelect(patient: PatientListItem) {
    onSelect(patient.id, patient.name)
    setSearch('')
    setOpen(false)
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Patient <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {value ? (
          <div className="flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3">
            <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="flex-1 truncate text-sm text-slate-900">{displayName}</span>
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Clear patient selection"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Search by name or email…"
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {open && data && data.data.length > 0 && (
              <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                {data.data.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onMouseDown={() => handleSelect(patient)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{patient.name}</p>
                      <p className="truncate text-xs text-slate-500">{patient.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {open && search.length > 1 && data?.data.length === 0 && (
              <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white p-3 text-center shadow-lg">
                <p className="text-sm text-slate-500">No patients found</p>
              </div>
            )}
          </>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
