'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, Sparkles, Star } from 'lucide-react'

const RESEND_TIMEOUT = 60

export default function SignUpPage() {
  const router = useRouter()

  // Step 1: registration fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Step 2: OTP
  const [otp, setOtp] = useState('')
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const otpInputsRef = useRef([])

  // UI state
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const countdownRef = useRef(null)

  function startCountdown() {
    setResendCountdown(RESEND_TIMEOUT)
  }

  useEffect(() => {
    if (resendCountdown <= 0) {
      if (countdownRef.current) clearInterval(countdownRef.current)
      return
    }
    countdownRef.current = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [resendCountdown])

  // Custom OTP inputs handling
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return // Only allow single digits
    
    const newValues = [...otpValues]
    newValues[index] = value
    setOtpValues(newValues)
    
    const combinedOtp = newValues.join('')
    setOtp(combinedOtp)

    // Focus next input if a number is entered
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
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword) {
      setError('All fields are required.')
      toast.error('All fields are required.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      toast.error('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Sending verification code...')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || 'Failed to register.'
        setError(errorMsg)
        toast.error(errorMsg, { id: toastId })
        return
      }

      toast.success('Verification code sent to your email!', { id: toastId })
      setStep(2)
      startCountdown()
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Please enter a 6-digit code.')
      toast.error('Please enter a 6-digit code.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Verifying code...')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || 'Verification failed. Please check the code.'
        setError(errorMsg)
        toast.error(errorMsg, { id: toastId })
        return
      }

      toast.success('Email verified successfully! Logging you in...', { id: toastId })
      
      // Perform hard navigation to onboard layout
      setTimeout(() => {
        window.location.href = '/onboarding'
      }, 500)

    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    setLoading(true)
    const toastId = toast.loading('Resending code...')

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'email-verify' }),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || 'Failed to resend code.'
        setError(errorMsg)
        toast.error(errorMsg, { id: toastId })
        return
      }

      toast.success('Verification code resent successfully!', { id: toastId })
      startCountdown()
    } catch (err) {
      console.error(err)
      setError('Failed to resend code. Please try again.')
      toast.error('Failed to resend code. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900 font-sans">
      {/* Left Side: Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-50/50 via-slate-50 to-slate-100 p-12 flex-col justify-between overflow-hidden border-r border-slate-200">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-100 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-100 blur-[100px]" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2 group outline-none">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">ReviewPilot</span>
        </Link>

        <div className="relative z-10 my-auto max-w-lg space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
              Turn Happy Customers Into Google Reviews
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Register your business, generate your custom review-routing QR code, and start collecting verified, high-quality review suggestions today.
            </p>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Star className="fill-blue-600/10" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Direct Routing</h4>
                <p className="text-xs text-slate-500">Promote positive ratings, capture feedback privately</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <div className="flex-1 rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
                <span className="block text-lg font-bold text-emerald-600">4-5 ★</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Google Redirect</span>
              </div>
              <div className="flex-1 rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
                <span className="block text-lg font-bold text-rose-600">1-3 ★</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Private Form</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-550">
          © {new Date().getFullYear()} ReviewPilot. All rights reserved.
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 bg-white relative">
        <Link href="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2 group outline-none">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg group-hover:bg-blue-500 transition-colors">
            R
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">ReviewPilot</span>
        </Link>

        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step === s
                      ? 'bg-blue-600 text-white shadow shadow-blue-500/20 scale-110'
                      : step > s
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-slate-100 text-slate-450 border border-slate-200'
                  }`}
                >
                  {step > s ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                {s < 2 && <div className={`h-px w-8 transition-colors ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {/* Form Header */}
          <div className="mb-8">
            {step === 1 ? (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Create your account
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Get started with ReviewPilot for free
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Verify your email
                </h1>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  We sent a 6-digit verification code to{' '}
                  <span className="font-semibold text-slate-800">{email}</span>
                </p>
              </>
            )}
          </div>

          {/* Step 1: Registration form */}
          {step === 1 && (
            <form onSubmit={handleRegister} className="space-y-5" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-slate-700">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                id="signup-submit"
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account…
                  </span>
                ) : 'Continue'}
              </button>
            </form>
          )}

          {/* Step 2: OTP verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6" noValidate>
              {/* Native OTP Inputs */}
              <div className="flex flex-col items-center gap-4">
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

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                id="signup-verify-submit"
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Verifying…
                  </span>
                ) : 'Verify & Continue'}
              </button>

              {/* Resend */}
              <div className="text-center text-sm text-slate-500">
                Didn&apos;t receive it?{' '}
                {resendCountdown > 0 ? (
                  <span className="font-semibold text-slate-500">
                    Resend in {resendCountdown}s
                  </span>
                ) : (
                  <button
                    id="signup-resend-otp"
                    type="button"
                    onClick={handleResend}
                    className="font-semibold text-blue-600 hover:underline underline-offset-2 focus:outline-none cursor-pointer"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-semibold text-blue-600 hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
