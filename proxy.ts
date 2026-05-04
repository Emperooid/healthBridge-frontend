import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

const publicRoutes = ['/login', '/register', '/forgot-password', '/unauthorized']
const adminRoutes = ['/dashboard/admin', '/hospitals', '/audit-logs']
const doctorRoutes = ['/dashboard/doctor']
const patientRoutes = ['/dashboard/patient']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isPublicRoute = publicRoutes.some((r) => path === r || path.startsWith(r + '/'))
  const isApiRoute = path.startsWith('/api')
  const isStaticRoute = path.startsWith('/_next') || path.startsWith('/favicon') || path === '/'

  if (isApiRoute || isStaticRoute) return NextResponse.next()

  const cookieStore = await cookies()
  const session = await decrypt(cookieStore.get('hb_session')?.value)

  if (!session?.userId) {
    if (isPublicRoute) return NextResponse.next()
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isPublicRoute) {
    const roleDest = {
      admin: '/dashboard/admin',
      doctor: '/dashboard/doctor',
      patient: '/dashboard/patient',
    }[session.role as string]
    return NextResponse.redirect(new URL(roleDest ?? '/dashboard/admin', req.nextUrl))
  }

  const isAdminRoute = adminRoutes.some((r) => path === r || path.startsWith(r + '/'))
  const isDoctorRoute = doctorRoutes.some((r) => path === r || path.startsWith(r + '/'))
  const isPatientRoute = patientRoutes.some((r) => path === r || path.startsWith(r + '/'))

  if (isAdminRoute && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.nextUrl))
  }
  if (isDoctorRoute && session.role !== 'doctor') {
    return NextResponse.redirect(new URL('/unauthorized', req.nextUrl))
  }
  if (isPatientRoute && session.role !== 'patient') {
    return NextResponse.redirect(new URL('/unauthorized', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
