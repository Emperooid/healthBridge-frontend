import type { User, UserRole } from '@/types'

export function normalizeUser(raw: Record<string, unknown> | undefined | null): User {
  if (!raw) return { id: '', email: '', firstName: '', lastName: '', name: '', role: 'patient' as UserRole, isActive: true, createdAt: new Date().toISOString() }
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
