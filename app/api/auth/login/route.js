import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { setAuthCookie } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    // Generic message to prevent email enumeration
    if (!user || !user.isVerified)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    await setAuthCookie({ _id: user._id.toString(), email: user.email, role: user.role })

    return NextResponse.json({ success: true, role: user.role })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}
