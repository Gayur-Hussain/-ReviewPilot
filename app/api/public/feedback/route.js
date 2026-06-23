import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Feedback from '@/models/Feedback'

export async function POST(request) {
  try {
    const { businessId, rating, customerName, customerEmail, customerPhone, message } = await request.json()

    if (!businessId || !rating || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required feedback fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 3) {
      return NextResponse.json({ error: 'Invalid rating for private feedback' }, { status: 400 })
    }

    await connectDB()

    const newFeedback = await Feedback.create({
      businessId,
      rating,
      customerName: customerName?.trim() || 'Anonymous',
      customerEmail: customerEmail?.trim() || '',
      customerPhone: customerPhone?.trim() || '',
      message: message.trim(),
    })

    return NextResponse.json({ success: true, feedbackId: newFeedback._id })
  } catch (error) {
    console.error('Error saving feedback:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
