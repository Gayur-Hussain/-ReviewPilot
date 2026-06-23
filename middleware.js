import { NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/auth'

const PUBLIC_PATHS = [
  '/',
  '/sign-in',
  '/sign-up',
  '/terms',
  '/forgot-password',
]

function isPublic(pathname) {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith('/r/'))   return true // public business review pages (e.g. /r/joes-pizza)
  if (pathname.startsWith('/api/auth/')) return true // auth API routes
  if (pathname.startsWith('/api/public/')) return true // public API endpoints
  return false
}

export default async function middleware(request) {
  const { pathname } = request.nextUrl
  const user = await getAuthUserFromRequest(request)

  // Allow public routes through
  if (isPublic(pathname)) {
    // Redirect logged-in users away from landing page / sign-in / sign-up
    if (user && (pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up')) {
      const dest = user.role === 'admin' ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(dest, request.url))
    }
    return NextResponse.next()
  }

  // Not logged in → redirect to sign-in
  if (!user) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Admin route protection
  if (pathname.startsWith('/admin') && user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
