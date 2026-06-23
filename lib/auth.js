import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET  = process.env.JWT_SECRET || 'fallback-secret-key-replace-in-env'
const COOKIE_NAME = 'reviewpilot_token'
const MAX_AGE     = 7 * 24 * 60 * 60 // 7 days in seconds

const key = new TextEncoder().encode(JWT_SECRET)

// ── Token ────────────────────────────────────────────────────────────────────

export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload // { _id, email, role, ... }
  } catch (error) {
    return null
  }
}

// ── Cookie ───────────────────────────────────────────────────────────────────

export async function setAuthCookie(payload) {
  const token       = await signToken(payload)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   MAX_AGE,
    path:     '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// ── Get current user (Server Components, Server Actions, API routes) ─────────

export async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const token       = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifyToken(token) // { _id, email, role, iat, exp }
  } catch {
    return null
  }
}

// ── Middleware helper (reads from request cookies) ───────────────────────────

export async function getAuthUserFromRequest(request) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifyToken(token)
  } catch {
    return null
  }
}
