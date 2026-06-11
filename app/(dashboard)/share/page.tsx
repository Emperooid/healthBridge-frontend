'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { shareService } from '@/services/share.service'
import { useAuthStore } from '@/store/auth.store'
import { formatDateTime } from '@/utils/format'
import type { ShareScope } from '@/types'

const linkSchema = z.object({
  scope: z.enum(['ALL', 'RECORDS', 'LABS', 'PRESCRIPTIONS']),
  expiresAt: z.string().optional(),
  maxAccess: z.string().optional(),
})

const grantSchema = z.object({
  grantedToEmail: z.string().email('Please enter a valid email address'),
  scope: z.enum(['ALL', 'RECORDS', 'LABS', 'PRESCRIPTIONS']),
  expiresAt: z.string().optional(),
})

type LinkForm = z.infer<typeof linkSchema>
type GrantForm = z.infer<typeof grantSchema>

const scopeLabels: Record<ShareScope, string> = {
  ALL: 'All Records',
  RECORDS: 'Medical Records',
  LABS: 'Lab Results',
  PRESCRIPTIONS: 'Prescriptions',
}

const scopeOptions = [
  { value: 'ALL', label: 'All Records' },
  { value: 'RECORDS', label: 'Medical Records' },
  { value: 'LABS', label: 'Lab Results' },
  { value: 'PRESCRIPTIONS', label: 'Prescriptions' },
]

function QRCode({ value }: { value: string }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(value)}`
  return <img src={url} alt="QR Code" className="h-32 w-32 rounded-md border border-slate-200" />
}

export default function ShareRecordsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [grantModalOpen, setGrantModalOpen] = useState(false)
  const [createdLink, setCreatedLink] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { data: links, isLoading: loadingLinks } = useQuery({
    queryKey: ['share-links'],
    queryFn: () => shareService.getLinks(),
    enabled: !!user?.id,
  })

  const { data: grants, isLoading: loadingGrants } = useQuery({
    queryKey: ['share-grants'],
    queryFn: () => shareService.getGrants(),
    enabled: !!user?.id,
  })

  const linkForm = useForm<LinkForm>({
    resolver: zodResolver(linkSchema),
    defaultValues: { scope: 'ALL' },
  })

  const grantForm = useForm<GrantForm>({
    resolver: zodResolver(grantSchema),
    defaultValues: { scope: 'ALL' },
  })

  const createLinkMutation = useMutation({
    mutationFn: (data: LinkForm) => shareService.createLink({
      ...data,
      maxAccess: data.maxAccess ? parseInt(data.maxAccess, 10) : undefined,
    }),
    onSuccess: (link) => {
      queryClient.invalidateQueries({ queryKey: ['share-links'] })
      const shareUrl = `${window.location.origin}/shared/${link.token}`
      setCreatedLink(shareUrl)
      linkForm.reset()
      setLinkModalOpen(false)
      toast.success('Share link created')
    },
    onError: () => toast.error('Failed to create link'),
  })

  const revokeLinkMutation = useMutation({
    mutationFn: (id: string) => shareService.revokeLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['share-links'] })
      toast.success('Link revoked')
    },
    onError: () => toast.error('Failed to revoke link'),
  })

  const createGrantMutation = useMutation({
    mutationFn: (data: GrantForm) => shareService.createGrant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['share-grants'] })
      grantForm.reset()
      setGrantModalOpen(false)
      toast.success('Access granted')
    },
    onError: () => toast.error('Failed to grant access'),
  })

  const revokeGrantMutation = useMutation({
    mutationFn: (id: string) => shareService.revokeGrant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['share-grants'] })
      toast.success('Access revoked')
    },
    onError: () => toast.error('Failed to revoke access'),
  })

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const activeLinks = links?.filter((l) => l.status === 'ACTIVE') ?? []
  const expiredLinks = links?.filter((l) => l.status !== 'ACTIVE') ?? []
  const activeGrants = grants?.filter((g) => !g.revokedAt) ?? []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Share Records</h1>
          <p className="mt-0.5 text-sm text-slate-500">Control who can access your medical records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setGrantModalOpen(true)}>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Grant Access
          </Button>
          <Button size="sm" onClick={() => setLinkModalOpen(true)}>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Create Link
          </Button>
        </div>
      </div>

      {/* Created link banner */}
      {createdLink && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-800 mb-1">Share link created</p>
              <p className="text-xs text-emerald-700 break-all font-mono">{createdLink}</p>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <QRCode value={createdLink} />
              <button
                onClick={() => copyToClipboard(createdLink, 'new')}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
              >
                {copiedId === 'new' ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>
          <button
            onClick={() => setCreatedLink(null)}
            className="mt-3 text-xs text-emerald-600 hover:text-emerald-800"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Share Links */}
        <Card padding="none">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Share Links</h2>
            <Badge variant={activeLinks.length > 0 ? 'info' : 'default'}>{activeLinks.length} active</Badge>
          </div>
          {loadingLinks ? (
            <div className="p-5 space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded bg-slate-100" />)}
            </div>
          ) : links?.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-500">
              <svg className="mb-2 h-8 w-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="text-sm">No share links yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {links?.map((link) => {
                const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/shared/${link.token}`
                return (
                  <div key={link.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={link.status === 'ACTIVE' ? 'success' : 'default'}>{link.status}</Badge>
                          <Badge variant="default">{scopeLabels[link.scope]}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-400 font-mono truncate">{link.token}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {link.accessCount} / {link.maxAccess ?? '∞'} accesses
                          {link.expiresAt && ` · Expires ${formatDateTime(link.expiresAt)}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {link.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => copyToClipboard(shareUrl, link.id)}
                              className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              {copiedId === link.id ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                              onClick={() => revokeLinkMutation.mutate(link.id)}
                              disabled={revokeLinkMutation.isPending}
                              className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Revoke
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Access Grants */}
        <Card padding="none">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Access Grants</h2>
            <Badge variant={activeGrants.length > 0 ? 'info' : 'default'}>{activeGrants.length} active</Badge>
          </div>
          {loadingGrants ? (
            <div className="p-5 space-y-3">
              {[1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded bg-slate-100" />)}
            </div>
          ) : grants?.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-500">
              <svg className="mb-2 h-8 w-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-sm">No access grants yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {grants?.map((grant) => (
                <div key={grant.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{grant.grantedToName}</p>
                      <p className="text-xs text-slate-500">{grant.grantedToEmail}</p>
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        <Badge variant={grant.revokedAt ? 'error' : 'success'}>
                          {grant.revokedAt ? 'Revoked' : 'Active'}
                        </Badge>
                        <Badge variant="default">{scopeLabels[grant.scope]}</Badge>
                        {grant.expiresAt && (
                          <span className="text-xs text-slate-400">Expires {formatDateTime(grant.expiresAt)}</span>
                        )}
                      </div>
                    </div>
                    {!grant.revokedAt && (
                      <button
                        onClick={() => revokeGrantMutation.mutate(grant.id)}
                        disabled={revokeGrantMutation.isPending}
                        className="shrink-0 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Create Link Modal */}
      <Modal
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        title="Create Share Link"
        description="Generate a link that lets anyone with it view your records"
      >
        <form onSubmit={linkForm.handleSubmit((data) => createLinkMutation.mutate(data))} className="space-y-4">
          <Select
            label="Scope"
            options={scopeOptions}
            error={linkForm.formState.errors.scope?.message}
            {...linkForm.register('scope')}
          />
          <Input
            label="Expiry Date (optional)"
            type="datetime-local"
            {...linkForm.register('expiresAt')}
          />
          <Input
            label="Max Accesses (optional)"
            type="number"
            min={1}
            max={100}
            placeholder="Unlimited"
            error={linkForm.formState.errors.maxAccess?.message}
            {...linkForm.register('maxAccess')}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setLinkModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createLinkMutation.isPending}>
              {createLinkMutation.isPending ? 'Creating...' : 'Create Link'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Grant Access Modal */}
      <Modal
        open={grantModalOpen}
        onClose={() => setGrantModalOpen(false)}
        title="Grant Access"
        description="Give a specific person access to your records by email"
      >
        <form onSubmit={grantForm.handleSubmit((data) => createGrantMutation.mutate(data))} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="doctor@hospital.com"
            error={grantForm.formState.errors.grantedToEmail?.message}
            {...grantForm.register('grantedToEmail')}
          />
          <Select
            label="Scope"
            options={scopeOptions}
            error={grantForm.formState.errors.scope?.message}
            {...grantForm.register('scope')}
          />
          <Input
            label="Expiry Date (optional)"
            type="datetime-local"
            {...grantForm.register('expiresAt')}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setGrantModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createGrantMutation.isPending}>
              {createGrantMutation.isPending ? 'Granting...' : 'Grant Access'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
