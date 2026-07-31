import { NextRequest } from 'next/server'
import { verifyToken } from './auth'

export function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  const cookieToken = request.cookies.get('token')?.value
  return cookieToken || null
}

export function requireAuth(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) return null
  return verifyToken(token)
}

export function requireAdmin(request: NextRequest) {
  const user = requireAuth(request)
  if (!user || user.role !== 'admin') return null
  return user
}
