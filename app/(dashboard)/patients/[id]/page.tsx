'use client'

import { use, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { MedicalTimeline } from '@/features/patients/components/MedicalTimeline'
import { patientsService } from '@/services/patients.service'
import { recordsService } from '@/services/records.service'
import { encountersService } from '@/services/encounters.service'
import { useAuthStore } from '@/store/auth.store'
import { formatDate, capitalise } from '@/utils/format'
import type { Visit, EncounterNote } from '@/types'

function EncounterModal({
  patientId,
  visit,
  onClose,
}: {
  patientId: string
  visit: Visit
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [complaint, setComplaint] = useState('')
  const [examination, setExamination] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [noteText, setNoteText] = useState('')

  const { data: notes } = useQuery({
    queryKey: ['encounter-notes', visit.id],
    queryFn: () => encountersService.getNotes(visit.id),
  })

  const addNoteMutation = useMutation({
    mutationFn: () =>
      encountersService.addNote({
        visitId: visit.id,
        chiefComplaint: complaint,
        examination,
        diagnosis,
        notes: noteText,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encounter-notes', visit.id] })
      queryClient.invalidateQueries({ queryKey: ['patient-visits', patientId] })
      setComplaint('')
      setExamination('')
      setDiagnosis('')
      setNoteText('')
      toast.success('Note saved')
    },
    onError: () => toast.error('Failed to save note'),
  })

  const completeVisitMutation = useMutation({
    mutationFn: () => encountersService.updateVisit(visit.id, { status: 'COMPLETED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-visits', patientId] })
      toast.success('Visit completed')
      onClose()
    },
    onError: () => toast.error('Failed to complete visit'),
  })

  return (
    <Modal open onClose={onClose} title="Encounter Notes" size="lg">
      <div className="space-y-5">
        {/* Existing notes */}
        {notes && notes.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Previous notes ({notes.length})</p>
            {notes.map((note: EncounterNote) => (
              <div key={note.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm space-y-1.5">
                {note.chiefComplaint && <p><span className="font-medium text-slate-600">Complaint:</span> {note.chiefComplaint}</p>}
                {note.examination && <p><span className="font-medium text-slate-600">Findings:</span> {note.examination}</p>}
                {note.diagnosis && <p><span className="font-medium text-slate-600">Assessment:</span> {note.diagnosis}</p>}
                {note.notes && <p><span className="font-medium text-slate-600">Plan:</span> {note.notes}</p>}
              </div>
            ))}
          </div>
        )}

        {/* New note form */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Add note</p>
          {[
            { label: 'Chief Complaint', value: complaint, set: setComplaint },
            { label: 'Examination Findings', value: examination, set: setExamination },
            { label: 'Assessment / Diagnosis', value: diagnosis, set: setDiagnosis },
            { label: 'Plan / Notes', value: noteText, set: setNoteText },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
              <textarea
                rows={2}
                value={value}
                onChange={(e) => set(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => completeVisitMutation.mutate()}
            disabled={completeVisitMutation.isPending}
          >
            Complete Visit
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            <Button
              size="sm"
              onClick={() => addNoteMutation.mutate()}
              disabled={addNoteMutation.isPending || (!complaint && !examination && !diagnosis && !noteText)}
            >
              {addNoteMutation.isPending ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default function PatientProfilePage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null)
  const isDoctor = user?.role === 'doctor'

  const { data: patient, isLoading: loadingPatient } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsService.getById(id),
  })

  const { data: records, isLoading: loadingRecords } = useQuery({
    queryKey: ['patient-records', id],
    queryFn: () => recordsService.getByPatient(id),
    enabled: !!patient,
  })

  const { data: visitsData } = useQuery({
    queryKey: ['patient-visits', id],
    queryFn: () => encountersService.listVisits({ patientId: id, limit: 5 }),
    enabled: !!patient && isDoctor,
  })

  const startVisitMutation = useMutation({
    mutationFn: () =>
      encountersService.createVisit({ patientId: id, hospitalId: patient!.hospitalId }),
    onSuccess: (visit) => {
      queryClient.invalidateQueries({ queryKey: ['patient-visits', id] })
      setActiveVisit(visit)
      toast.success('Visit started')
    },
    onError: () => toast.error('Failed to start visit'),
  })

  if (loadingPatient) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="lg:col-span-2 h-64 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    )
  }

  if (!patient) return <p className="text-slate-500">Patient not found.</p>

  const age = patient.dateOfBirth
    ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    : null

  const infoRows = [
    { label: 'Date of Birth', value: patient.dateOfBirth ? formatDate(patient.dateOfBirth) : null },
    { label: 'Age', value: age !== null ? `${age} years` : null },
    { label: 'Gender', value: patient.gender ? capitalise(patient.gender) : null },
    { label: 'Phone', value: patient.phone },
    { label: 'Hospital', value: patient.hospitalName },
    { label: 'Doctor', value: patient.assignedDoctorName ?? 'Unassigned' },
  ].filter((r) => r.value)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/patients" className="text-xs font-medium text-slate-500 hover:text-slate-700">
          ← Patients
        </Link>
        {isDoctor && (
          <Button size="sm" onClick={() => startVisitMutation.mutate()} disabled={startVisitMutation.isPending}>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {startVisitMutation.isPending ? 'Starting...' : 'Start Visit'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column: profile */}
        <div className="space-y-4">
          <Card padding="none">
            <div className="flex flex-col items-center px-5 py-6 text-center border-b border-slate-100">
              <Avatar name={patient.name} size="xl" className="mb-3" />
              <h2 className="text-base font-bold text-slate-900">{patient.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{patient.email}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap justify-center">
                {patient.bloodType && <Badge variant="info">{patient.bloodType}</Badge>}
                {patient.gender && (
                  <Badge variant="default">{capitalise(patient.gender)}</Badge>
                )}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {infoRows.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                  <span className="font-medium text-slate-800 text-right max-w-40 truncate">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {patient.emergencyContact && (
            <Card padding="sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Emergency Contact</p>
              <p className="text-sm text-slate-700">{patient.emergencyContact}</p>
            </Card>
          )}

          {patient.allergies && patient.allergies.length > 0 && (
            <Card padding="sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Allergies</p>
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.map((a) => (
                  <Badge key={a} variant="warning">{a}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right column: visits + medical records */}
        <div className="lg:col-span-2 space-y-5">
          {/* Recent visits (doctor only) */}
          {isDoctor && (
            <Card padding="none">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Recent Visits</h2>
              </div>
              {!visitsData?.data.length ? (
                <p className="py-8 text-center text-sm text-slate-500">No visits recorded.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {visitsData.data.map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between gap-4 px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            visit.status === 'COMPLETED' ? 'success'
                            : visit.status === 'IN_PROGRESS' ? 'info'
                            : visit.status === 'CANCELLED' ? 'error'
                            : 'warning'
                          }>
                            {visit.status.replace('_', ' ')}
                          </Badge>
                          {visit.reason && <p className="text-sm text-slate-700 truncate">{visit.reason}</p>}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">{formatDate(visit.createdAt)}</p>
                      </div>
                      {visit.status !== 'COMPLETED' && visit.status !== 'CANCELLED' && (
                        <button
                          onClick={() => setActiveVisit(visit)}
                          className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Add notes →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Medical records */}
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Medical Records</h2>
              <Link
                href={`/patients/${id}/records`}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>
            </div>
            {loadingRecords ? (
              <div className="p-5 animate-pulse space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded bg-slate-100" />)}
              </div>
            ) : (
              <MedicalTimeline records={records?.data?.slice(0, 5) ?? []} />
            )}
          </Card>
        </div>
      </div>
      {activeVisit && (
        <EncounterModal
          patientId={id}
          visit={activeVisit}
          onClose={() => setActiveVisit(null)}
        />
      )}
    </div>
  )
}
