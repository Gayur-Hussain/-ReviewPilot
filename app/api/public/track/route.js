import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { trackEvent } from '@/lib/analytics'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { businessId, isQrScan } = await request.json()
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 })
    }

    await connectDB()

    const cookieStore = await cookies()
    const cookieName = `rp_visited_${businessId}`
    const hasVisited = cookieStore.get(cookieName)

    if (!hasVisited) {
      // Set visited cookie for 24 hours
      cookieStore.set(cookieName, 'true', {
        maxAge: 24 * 60 * 60,
        httpOnly: true,
        path: '/',
      })
      // Track unique visitor
      await trackEvent(businessId, 'uniqueVisitors')
    }

    if (isQrScan) {
      // Track QR scan
      await trackEvent(businessId, 'scans')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking visit:', error)
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}
