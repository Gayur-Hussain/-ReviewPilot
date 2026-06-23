import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'
import { sendOTPEmail } from '@/lib/mailer'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    if (password.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing)
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 12)
    await User.create({ email: email.toLowerCase().trim(), passwordHash, role: 'business', isVerified: false })

    // Generate 6-digit OTP
    const otp     = String(Math.floor(100000 + Math.random() * 900000))
    const otpHash = await bcrypt.hash(otp, 10)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Remove any existing OTPs for this email+purpose
    await OTP.deleteMany({ email: email.toLowerCase().trim(), purpose: 'email-verify' })
    await OTP.create({ email: email.toLowerCase().trim(), otpHash, purpose: 'email-verify', expiresAt })

    // Send OTP email
    await sendOTPEmail({ to: email, otp, purpose: 'email-verify' })

    return NextResponse.json({ success: true, message: 'OTP sent to your email' })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
