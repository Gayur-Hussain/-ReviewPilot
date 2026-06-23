import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { trackEvent } from '@/lib/analytics'

export async function POST(request) {
  try {
    const { businessId } = await request.json()
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 })
    }

    await connectDB()
    await trackEvent(businessId, 'googleClicks')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}
