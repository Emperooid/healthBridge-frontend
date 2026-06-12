export type UserRole = 'admin' | 'doctor' | 'patient'

export interface User {
  id: string
  firstName: string
  lastName: string
  name: string  // constructed: firstName + ' ' + lastName
  email: string
  phone?: string
  role: UserRole
  isActive?: boolean
  createdAt: string
}

export interface SessionPayload {
  userId: string
  role: UserRole
  email: string
  name: string
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string  // no longer returned in body — now an HttpOnly cookie
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
