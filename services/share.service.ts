import { api } from './api'
import type { ShareLink, ShareGrant, CreateShareLinkData, CreateShareGrantData, SharedTokenData } from '@/types'

export const shareService = {
  getLinks: (patientId: string) =>
    api.get<ShareLink[]>(`/share/links`, { params: { patientId } }).then((r) => r.data),

  createLink: (patientId: string, data: CreateShareLinkData) =>
    api.post<ShareLink>('/share/links', { patientId, ...data }).then((r) => r.data),

  revokeLink: (linkId: string) =>
    api.patch<ShareLink>(`/share/links/${linkId}/revoke`).then((r) => r.data),

  getGrants: (patientId: string) =>
    api.get<ShareGrant[]>('/share/grants', { params: { patientId } }).then((r) => r.data),

  createGrant: (patientId: string, data: CreateShareGrantData) =>
    api.post<ShareGrant>('/share/grants', { patientId, ...data }).then((r) => r.data),

  revokeGrant: (grantId: string) =>
    api.patch<ShareGrant>(`/share/grants/${grantId}/revoke`).then((r) => r.data),

  resolveToken: (token: string) =>
    api.get<SharedTokenData>(`/share/resolve/${token}`).then((r) => r.data),
}
