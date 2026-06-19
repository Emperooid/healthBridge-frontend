import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import type { SessionPayload } from '@/types'

const encodedKey = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'healthbridge-dev-secret-key-change-in-production'
)

async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const cookie = req.cookies.get('hb_session')?.value
  if (!cookie) return null
  try {
    const { payload } = await jwtVerify(cookie, encodedKey, { algorithms: ['HS256'] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/register-hospital']

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/patients',
  '/hospitals',
  '/audit-logs',
  '/appointments',
  '/notifications',
  '/profile',
  '/share',
  '/users',
]

const ROLE_GUARDS: { prefix: string; roles: string[] }[] = [
  { prefix: '/dashboard/admin', roles: ['admin'] },
  { prefix: '/dashboard/doctor', roles: ['doctor'] },
  { prefix: '/dashboard/patient', roles: ['patient'] },
  { prefix: '/users', roles: ['admin'] },
  { prefix: '/audit-logs', roles: ['admin'] },
]

const ROLE_HOME: Record<string, string> = {
  admin: '/dashboard/admin',
  doctor: '/dashboard/doctor',
  patient: '/dashboard/patient',
}

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(prefix + '/')
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getSession(request)

  const isAuthRoute = AUTH_ROUTES.some((r) => matchesPrefix(pathname, r))
  const isProtected = PROTECTED_PREFIXES.some((p) => matchesPrefix(pathname, p))

  // Logged-in users don't need auth pages — send them home
  if (isAuthRoute && session) {
    return NextResponse.redirect(
      new URL(ROLE_HOME[session.role] ?? '/dashboard/patient', request.url)
    )
  }

  // Unauthenticated access to protected route → login, preserve intended destination
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // RBAC: block access to another role's area
  if (session) {
    for (const guard of ROLE_GUARDS) {
      if (matchesPrefix(pathname, guard.prefix) && !guard.roles.includes(session.role)) {
        return NextResponse.redirect(
          new URL(ROLE_HOME[session.role] ?? '/dashboard/patient', request.url)
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
