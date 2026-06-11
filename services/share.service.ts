import { api } from './api'
import type { ShareLink, ShareGrant, CreateShareLinkData, CreateShareGrantData, SharedTokenData } from '@/types'

export const shareService = {
  getLinks: () =>
    api.get<ShareLink[]>('/share/links').then((r) => r.data),

  createLink: (data: CreateShareLinkData) =>
    api.post<ShareLink>('/share/links', data).then((r) => r.data),

  revokeLink: (linkId: string) =>
    api.patch<ShareLink>(`/share/links/${linkId}/revoke`).then((r) => r.data),

  getQrCode: (linkId: string) =>
    api.get<{ qrCode: string }>(`/share/links/${linkId}/qr`).then((r) => r.data),

  getGrants: () =>
    api.get<ShareGrant[]>('/share/grants').then((r) => r.data),

  createGrant: (data: CreateShareGrantData) =>
    api.post<ShareGrant>('/share/grants', data).then((r) => r.data),

  revokeGrant: (grantId: string) =>
    api.patch<ShareGrant>(`/share/grants/${grantId}/revoke`).then((r) => r.data),

  resolveToken: (token: string) =>
    api.get<SharedTokenData>(`/share/resolve/${token}`).then((r) => r.data),
}
