'use server'

import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types'

export async function writeSession(
  userId: string,
  role: UserRole,
  email: string,
  name: string
) {
  await createSession({ userId, role, email, name })
}

export async function clearSession() {
  await deleteSession()
  redirect('/login')
}
