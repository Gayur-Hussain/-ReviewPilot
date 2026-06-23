"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  Building2, 
  Phone, 
  MapPin, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Link2
} from "lucide-react";

const initialState = { error: "" };

// Helper to slugify strings
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export default function OnboardingForm({ action }) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [name, setName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [hostUrl, setHostUrl] = useState(process.env.NEXT_PUBLIC_APP_URL || "");

  useEffect(() => {
    if (!hostUrl && typeof window !== "undefined") {
      setHostUrl(window.location.origin);
    }
  }, [hostUrl]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 text-slate-900 font-sans">
      
      {/* Left Panel: Information & Branding */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-blue-50/50 via-slate-50 to-slate-100 p-12 flex-col justify-between overflow-hidden border-r border-slate-200">
        {/* Glow Effects */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100 blur-[100px]" />
          <div className="absolute -bottom-[15%] -right-[15%] w-[60%] h-[60%] rounded-full bg-indigo-100 blur-[90px]" />
        </div>

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow shadow-blue-500/20">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">ReviewPilot</span>
        </div>

        {/* Feature List */}
        <div className="relative z-10 my-auto max-w-md space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-semibold text-blue-600">
              Onboarding Profile
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-slate-900">
              Initialize Your Business Dashboard
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We just need a few details about your business to generate your custom QR code poster and configure the review generator.
            </p>
          </div>

          <ul className="space-y-4 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <span>Instantly generates a custom QR Code poster</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <span>Protects business reputation (captures low ratings privately)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <span>AI review engine suggests genuine responses based on category</span>
            </li>
          </ul>
        </div>

        {/* Security badge */}
        <div className="relative z-10 flex items-center gap-2.5 border-t border-slate-200 pt-6 max-w-md">
          <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
          <span className="text-xs text-slate-500">Secure SaaS database encryption & protection</span>
        </div>
      </div>

      {/* Right Panel: Onboarding Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 md:w-1/2 md:px-20 lg:px-24 bg-white relative">
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">ReviewPilot</span>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="space-y-1 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Set up your profile
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Fill in the details below to initialize your digital workspace.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            
            {/* Business Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Business Name <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Building2 className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bella Italia Restaurant"
                  disabled={isPending}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
              {name && hostUrl && (
                <p className="text-xs text-blue-600 truncate mt-1.5 font-medium">
                  Public URL: <span>{hostUrl}/r/{slugify(name)}</span>
                </p>
              )}
            </div>

            {/* Hidden Slug Input (Automated) */}
            <input type="hidden" name="slug" value={slugify(name)} />

            {/* Google Review Link Input */}
            <div className="space-y-1.5">
              <label htmlFor="googleReviewUrl" className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Google Review Link <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Link2 className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="googleReviewUrl"
                  name="googleReviewUrl"
                  type="url"
                  required
                  value={googleUrl}
                  onChange={e => setGoogleUrl(e.target.value)}
                  placeholder="https://g.page/r/your-id/review"
                  disabled={isPending}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Paste the direct link to your Google Review page. Customers will be redirected here when they select 4-5 stars.
              </p>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Business Category
              </label>
              <div className="relative rounded-xl">
                <select
                  id="category"
                  name="category"
                  defaultValue="General"
                  disabled={isPending}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 appearance-none cursor-pointer"
                >
                  <option value="General">General / Other</option>
                  <option value="Restaurant">Restaurant / Café</option>
                  <option value="Medical">Dental / Medical Clinic</option>
                  <option value="Salon">Salon / Spa</option>
                  <option value="Hotel">Hotel / Resort</option>
                  <option value="Retail">Retail Shop / Store</option>
                  <option value="Gym">Gym / Fitness Center</option>
                  <option value="Services">Professional Services (Auto, Legal, Tech)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Phone Number
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  disabled={isPending}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-1.5">
              <label htmlFor="address" className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Business Address
              </label>
              <div className="relative rounded-xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="e.g. Chah Share, Rampur, Uttar Pradesh"
                  disabled={isPending}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow shadow-blue-500/20 transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed bg-blue-600 flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Configuring workspace...</span>
                </>
              ) : (
                <>
                  <span>Complete Onboarding</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
