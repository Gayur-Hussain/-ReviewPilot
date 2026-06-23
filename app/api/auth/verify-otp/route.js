import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'
import { setAuthCookie } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp)
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })

    await connectDB()

    const otpDoc = await OTP.findOne({
      email:   email.toLowerCase().trim(),
      purpose: 'email-verify',
    })

    if (!otpDoc)
      return NextResponse.json({ error: 'OTP not found or expired. Please request a new one.' }, { status: 400 })

    if (otpDoc.expiresAt < new Date())
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 })

    const isMatch = await bcrypt.compare(otp.trim(), otpDoc.otpHash)
    if (!isMatch) {
      const attempts = (otpDoc.attempts || 0) + 1
      if (attempts >= 5) {
        await OTP.deleteOne({ _id: otpDoc._id })
        return NextResponse.json({ error: 'Incorrect OTP. Maximum attempts exceeded. Please request a new one.' }, { status: 400 })
      } else {
        await OTP.updateOne({ _id: otpDoc._id }, { $set: { attempts } })
        return NextResponse.json({ error: `Incorrect OTP. ${5 - attempts} attempts remaining.` }, { status: 400 })
      }
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { isVerified: true },
      { returnDocument: 'after' }
    )

    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Delete used OTP
    await OTP.deleteMany({ email: email.toLowerCase().trim(), purpose: 'email-verify' })

    // Set JWT auth cookie
    await setAuthCookie({ _id: user._id.toString(), email: user.email, role: user.role })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 })
  }
}
