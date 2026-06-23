import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        <div className="space-y-4 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ReviewPilot (the "Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">2. Description of Service</h2>
            <p>
              ReviewPilot provides local businesses with AI-assisted customer review suggestion tools and rating-routing interfaces to help collect customer feedback.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">3. User Responsibilities</h2>
            <p>
              You agree to provide accurate and complete information during onboarding and setting up your Google Review link. You are solely responsible for compliance with Google's Terms of Service regarding review acquisition and guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">4. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Customer feedback collected through the private rating route (1-3 stars) is stored securely in our database and shared only with your account.
            </p>
          </section>
        </div>

        <div className="border-t border-slate-200 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ReviewPilot. All rights reserved.
        </div>
      </div>
    </div>
  )
}
