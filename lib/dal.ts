import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from './session'
import type { SessionPayload, UserRole } from '@/types'

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession()

  if (!session?.userId) {
    redirect('/login')
  }

  return session
})

export const verifyRole = cache(async (allowedRoles: UserRole[]): Promise<SessionPayload> => {
  const session = await verifySession()

  if (!allowedRoles.includes(session.role)) {
    redirect('/unauthorized')
  }

  return session
})

export const getOptionalSession = cache(async (): Promise<SessionPayload | null> => {
  return getSession()
})
