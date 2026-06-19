import { api } from './api'
import type { AuthResponse, LoginCredentials, RegisterCredentials, User, UserRole } from '@/types'

function normalizeUser(raw: Record<string, unknown>): User {
  const firstName = (raw.firstName as string) ?? ''
  const lastName = (raw.lastName as string) ?? ''
  return {
    ...(raw as Omit<User, 'name' | 'role'>),
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    role: ((raw.role as string) ?? '').toLowerCase() as UserRole,
  }
}

function normalizeAuth(raw: AuthResponse): AuthResponse {
  return { ...raw, user: normalizeUser(raw.user as unknown as Record<string, unknown>) }
}

export const authService = {
  login: (data: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => normalizeAuth(r.data)),

  register: (data: RegisterCredentials) =>
    api.post<AuthResponse>('/auth/register', {
      ...data,
      role: data.role.toUpperCase(),
    }).then((r) => normalizeAuth(r.data)),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }).then((r) => normalizeAuth(r.data)),

  logout: () =>
    api.post('/auth/logout').then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),

  verifyEmail: (token: string) =>
    api.get('/auth/verify-email', { params: { token } }).then((r) => r.data),

  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }).then((r) => r.data),

  // Authenticated variant — for logged-in users who need a new link (no email body needed)
  resendVerificationMe: () =>
    api.post('/auth/resend-verification/me').then((r) => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),

  verifyInviteToken: (token: string) =>
    api.get<{ firstName: string; lastName: string; email: string; role: string }>('/auth/invite/verify', { params: { token } }).then((r) => r.data),

  acceptInvite: (token: string, password: string) =>
    api.post('/auth/accept-invite', { token, password }).then((r) => r.data),
}
