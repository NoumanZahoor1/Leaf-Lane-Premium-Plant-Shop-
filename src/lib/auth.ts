import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'plantshop-secret-key'

export function signToken(payload: { id: number; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string }
  } catch {
    return null
  }
}
