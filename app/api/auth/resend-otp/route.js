import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'
import { sendOTPEmail } from '@/lib/mailer'

export async function POST(request) {
  try {
    const { email, purpose = 'email-verify' } = await request.json()

    if (!email)
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user)
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })

    // Rate limit: max 1 OTP per 60 seconds
    const recent = await OTP.findOne({ email: email.toLowerCase().trim(), purpose })
    if (recent) {
      const secondsAgo = (Date.now() - new Date(recent.createdAt).getTime()) / 1000
      if (secondsAgo < 60)
        return NextResponse.json(
          { error: `Please wait ${Math.ceil(60 - secondsAgo)} seconds before requesting a new OTP` },
          { status: 429 }
        )
    }

    const otp     = String(Math.floor(100000 + Math.random() * 900000))
    const otpHash = await bcrypt.hash(otp, 10)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await OTP.deleteMany({ email: email.toLowerCase().trim(), purpose })
    await OTP.create({ email: email.toLowerCase().trim(), otpHash, purpose, expiresAt })
    await sendOTPEmail({ to: email, otp, purpose })

    return NextResponse.json({ success: true, message: 'OTP sent to your email' })

  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 })
  }
}
