import { redirect } from 'next/navigation'
import { getOptionalSession } from '@/lib/dal'
import { LandingPage } from '@/components/landing/LandingPage'

export default async function RootPage() {
  const session = await getOptionalSession()

  if (session?.userId) {
    const dest =
      { admin: '/dashboard/admin', doctor: '/dashboard/doctor', patient: '/dashboard/patient' }[session.role] ??
      '/dashboard/patient'
    redirect(dest)
  }

  return <LandingPage />
}
