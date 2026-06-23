import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'

export async function POST(request) {
  try {
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    await connectDB()

    const otpDoc = await OTP.findOne({
      email: email.toLowerCase().trim(),
      purpose: 'password-reset',
    })

    if (!otpDoc) {
      return NextResponse.json({ error: 'OTP not found or expired. Please request a new one.' }, { status: 400 })
    }

    if (otpDoc.expiresAt < new Date()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 })
    }

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

    const passwordHash = await bcrypt.hash(newPassword, 12)
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { passwordHash, isVerified: true },
      { returnDocument: 'after' }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await OTP.deleteMany({ email: email.toLowerCase().trim(), purpose: 'password-reset' })

    return NextResponse.json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 })
  }
}
