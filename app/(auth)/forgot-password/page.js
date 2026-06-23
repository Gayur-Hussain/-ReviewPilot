'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, ArrowLeft, KeyRound, Mail } from 'lucide-react'

const RESEND_TIMEOUT = 60

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const otpInputsRef = useRef([])
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1 = Request OTP, 2 = Verify and Reset
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const countdownIntervalRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      return
    }
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [countdown])

  // Custom OTP inputs handling
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return
    
    const newValues = [...otpValues]
    newValues[index] = value
    setOtpValues(newValues)
    
    const combinedOtp = newValues.join('')
    setOtp(combinedOtp)

    if (value !== '' && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otpValues[index] === '' && index > 0) {
        const newValues = [...otpValues]
        newValues[index - 1] = ''
        setOtpValues(newValues)
        setOtp(newValues.join(''))
        otpInputsRef.current[index - 1]?.focus()
      } else {
        const newValues = [...otpValues]
        newValues[index] = ''
        setOtpValues(newValues)
        setOtp(newValues.join(''))
      }
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '')
    if (!pastedData) return

    const newValues = [...otpValues]
    for (let i = 0; i < 6; i++) {
      newValues[i] = pastedData[i] || ''
    }
    setOtpValues(newValues)
    setOtp(newValues.join(''))

    const focusIndex = Math.min(pastedData.length, 5)
    otpInputsRef.current[focusIndex]?.focus()
  }

  async function handleSendOTP(e) {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address.')
      toast.error('Please enter your email address.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Sending reset code...')

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'password-reset' }),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || 'Failed to send reset code.'
        setError(errorMsg)
        toast.error(errorMsg, { id: toastId })
        return
      }

      toast.success('Reset code sent successfully!', { id: toastId })
      setStep(2)
      setCountdown(RESEND_TIMEOUT)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Please enter a 6-digit verification code.')
      toast.error('Please enter a 6-digit verification code.')
      return
    }

    if (!newPassword || !confirmPassword) {
      setError('All fields are required.')
      toast.error('All fields are required.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      toast.error('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Resetting password...')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || 'Failed to reset password.'
        setError(errorMsg)
        toast.error(errorMsg, { id: toastId })
        return
      }

      toast.success('Password reset successfully! Redirecting...', { id: toastId })
      setTimeout(() => {
        router.push('/sign-in')
      }, 1000)

    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  async function handleResendOTP() {
    setError('')
    setLoading(true)
    const toastId = toast.loading('Resending code...')

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'password-reset' }),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || 'Failed to resend code.'
        setError(errorMsg)
        toast.error(errorMsg, { id: toastId })
        return
      }

      toast.success('Verification code resent successfully!', { id: toastId })
      setCountdown(60)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-slate-900 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 group outline-none">
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              R
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">ReviewPilot</span>
          </Link>
        </div>

        {/* Back Link */}
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 group transition"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to sign in
        </Link>

        {/* Header Icon */}
        <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-205 flex items-center justify-center text-blue-600 mb-6">
          {step === 1 ? <Mail size={24} /> : <KeyRound size={24} />}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
          {step === 1 ? 'Forgot password?' : 'Reset your password'}
        </h1>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          {step === 1
            ? 'No worries, we will send you a 6-digit verification code to reset your password.'
            : 'Enter the verification code sent to your email and choose a secure new password.'}
        </p>

        {/* Step 1: Send OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-55 border border-red-200 px-4 py-3 text-sm text-red-600">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 cursor-pointer"
            >
              {loading ? 'Sending OTP…' : 'Send verification code'}
            </button>
          </form>
        )}

        {/* Step 2: Reset Form */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5" noValidate>
            {/* Native OTP Inputs */}
            <div className="flex flex-col items-center gap-4 py-2">
              <label className="block text-sm font-medium text-slate-700">
                Enter 6-digit Code
              </label>
              <div className="flex gap-2" onPaste={handleOtpPaste}>
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    ref={el => (otpInputsRef.current[i] = el)}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="h-12 w-10 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
                New password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm-new-password" className="block text-sm font-medium text-slate-700">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 cursor-pointer"
            >
              {loading ? 'Resetting password…' : 'Reset password'}
            </button>

            {/* Resend */}
            <div className="text-center text-sm text-slate-505 mt-4">
              Didn&apos;t receive it?{' '}
              {countdown > 0 ? (
                <span className="font-semibold text-slate-550">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="font-semibold text-blue-600 hover:underline underline-offset-2 focus:outline-none cursor-pointer"
                >
                  Resend code
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
