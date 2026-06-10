import type { ReactNode } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { verifySession } from '@/lib/dal'

export default async function Layout({ children }: { children: ReactNode }) {
  await verifySession()
  return <DashboardLayout>{children}</DashboardLayout>
}
