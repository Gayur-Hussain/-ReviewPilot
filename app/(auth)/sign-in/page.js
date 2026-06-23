'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, Sparkles, Star } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      toast.error('Email and password are required.')
      setError('Email and password are required.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Signing in...')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        const errorMsg = data.error || 'Invalid email or password.'
        setError(errorMsg)
        toast.error(errorMsg, { id: toastId })
        return
      }

      toast.success('Signed in successfully!', { id: toastId })

      // Perform hard navigation to clear caches and ensure cookies are picked up by Middleware
      setTimeout(() => {
        window.location.href = data.role === 'admin' ? '/admin' : '/dashboard'
      }, 500)

    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900 font-sans">
      {/* Left Side: Marketing - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-50/50 via-slate-50 to-slate-100 p-12 flex-col justify-between overflow-hidden border-r border-slate-200">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-100 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-100 blur-[100px]" />
        </div>

        {/* Header */}
        <Link href="/" className="relative z-10 flex items-center gap-2 group outline-none">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">ReviewPilot</span>
        </Link>

        {/* Body: Premium UI preview */}
        <div className="relative z-10 my-auto max-w-lg space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
              Get Genuine Google Reviews <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">10x Faster</span>
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Help your customers share their valuable experiences using smart AI-generated review suggestions. Boost your local search ranking automatically.
            </p>
          </div>

          {/* Premium CSS-based Mockup Card */}
          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">AI Suggestion Engine</h4>
                <p className="text-xs text-slate-500">5 genuine variations drafted instantly</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                "The dental checkup at City Dental was outstanding. Dr. Verma explained the entire procedure clearly and made me feel completely comfortable. Highly recommended!"
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span>Copy & Redirect Enabled</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} ReviewPilot. All rights reserved.
        </div>
      </div>

      {/* Right Side: Form (Full on mobile, 50% on desktop) */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 bg-white relative">
        {/* Mobile Header */}
        <Link href="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2 group outline-none">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg group-hover:bg-blue-500 transition-colors">
            R
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">ReviewPilot</span>
        </Link>

        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Sign in to your business dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="signin-email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="signin-email"
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
              <div className="flex items-center justify-between">
                <label htmlFor="signin-password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  href={email ? `/forgot-password?email=${encodeURIComponent(email)}` : "/forgot-password"}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="signin-submit"
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
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="font-semibold text-blue-600 hover:underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
