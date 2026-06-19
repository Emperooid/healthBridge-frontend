'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Avatar } from '@/components/ui/Avatar'
import { Pagination } from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { InviteDoctorModal } from '@/features/hospitals/components/InviteDoctorModal'
import { usersService } from '@/services/users.service'
import { formatDate } from '@/utils/format'
import type { UserRole } from '@/types'

const roleBadge: Record<string, 'purple' | 'info' | 'success'> = {
  admin: 'purple',
  doctor: 'info',
  patient: 'success',
}

export default function UsersPage() {
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [inviteOpen, setInviteOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['users', { role, page }],
    queryFn: () => usersService.list({ role: role || undefined, page, limit: 20 }),
  })

  const toggleStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      usersService.updateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User status updated')
    },
    onError: () => toast.error('Failed to update status'),
  })

  const changeRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      usersService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Role updated')
    },
    onError: () => toast.error('Failed to update role'),
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User Management</h1>
          <p className="mt-0.5 text-sm text-slate-500">{data?.total ?? 0} total users</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Invite Doctor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          options={[
            { value: 'admin', label: 'Admins' },
            { value: 'doctor', label: 'Doctors' },
            { value: 'patient', label: 'Patients' },
          ]}
          placeholder="All roles"
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1) }}
          className="w-40"
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.data.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={roleBadge[user.role] ?? 'default'}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.isActive !== false ? 'success' : 'error'} dot>
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            changeRole.mutate({ id: user.id, role: e.target.value as UserRole })
                          }
                          className="h-7 rounded border border-slate-300 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="admin">Admin</option>
                          <option value="doctor">Doctor</option>
                          <option value="patient">Patient</option>
                        </select>

                        <Button
                          size="sm"
                          variant={user.isActive !== false ? 'outline' : 'primary'}
                          onClick={() =>
                            toggleStatus.mutate({ id: user.id, isActive: !(user.isActive !== false) })
                          }
                        >
                          {user.isActive !== false ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && !data?.data.length && (
            <div className="flex flex-col items-center py-16 text-slate-500">
              <svg className="mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium">No users found</p>
              <p className="mt-1 text-xs text-slate-400">Invite a doctor to get started</p>
            </div>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex justify-center border-t border-slate-200 px-4 py-3">
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <InviteDoctorModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
      />
    </div>
  )
}
