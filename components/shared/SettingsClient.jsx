"use client"

import { useState } from "react"
import { toast } from "sonner"
import { updateBusiness } from "@/actions/business"
import { ShieldCheck, Building2, Link2, Phone, MapPin, Loader2, ExternalLink } from "lucide-react"

export default function SettingsClient({ business }) {
  const [isPendingProfile, setIsPendingProfile] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: business.name || "",
    googleReviewUrl: business.googleReviewUrl || "",
    category: business.category || "General",
    phone: business.phone || "",
    address: business.address || "",
    logoUrl: business.logoUrl || "",
  })

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsPendingProfile(true)
    
    const formData = new FormData()
    formData.append("name", profileForm.name)
    formData.append("googleReviewUrl", profileForm.googleReviewUrl)
    formData.append("category", profileForm.category)
    formData.append("phone", profileForm.phone)
    formData.append("address", profileForm.address)
    formData.append("logoUrl", profileForm.logoUrl)

    const result = await updateBusiness(null, formData)
    setIsPendingProfile(false)

    if (result.success) {
      toast.success(result.message || "Profile updated successfully")
    } else {
      toast.error(result.error || "Failed to update profile")
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your business profile preferences and Google Review link configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Business Profile</h3>
            <p className="text-xs text-slate-500 mb-6">Update your business details that appear on the customer rating page</p>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {/* Business Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Business Name
                </label>
                <div className="relative rounded-xl">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Building2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Google Review Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Google Review Link
                </label>
                <div className="relative rounded-xl">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Link2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    required
                    value={profileForm.googleReviewUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, googleReviewUrl: e.target.value })}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Category & Logo Side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Category
                  </label>
                  <select
                    value={profileForm.category}
                    onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer appearance-none"
                  >
                    <option value="General">General / Other</option>
                    <option value="Restaurant">Restaurant / Café</option>
                    <option value="Medical">Dental / Medical Clinic</option>
                    <option value="Salon">Salon / Spa</option>
                    <option value="Hotel">Hotel / Resort</option>
                    <option value="Retail">Retail Shop / Store</option>
                    <option value="Gym">Gym / Fitness Center</option>
                    <option value="Services">Professional Services</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Logo Image URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.logoUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Phone & Address Side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Phone Number
                  </label>
                  <div className="relative rounded-xl">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Address
                  </label>
                  <div className="relative rounded-xl">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPendingProfile}
                className="rounded-xl py-2.5 px-6 text-sm font-semibold text-white shadow shadow-blue-500/20 transition-all hover:bg-blue-500 disabled:opacity-60 bg-blue-600 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isPendingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Column (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Public Link Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" />
              Public Review Link
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              This is the URL that your customers will visit when they scan the QR code. You can display it on flyers, menus, or receipts.
            </p>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 break-all font-mono text-[11px] text-blue-600 font-semibold">
              <a
                href={process.env.NEXT_PUBLIC_APP_URL
                  ? `${process.env.NEXT_PUBLIC_APP_URL}/r/${business.slug}`
                  : typeof window !== 'undefined'
                    ? `${window.location.origin}/r/${business.slug}`
                    : `/r/${business.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center justify-between gap-2"
              >
                <span>
                  {process.env.NEXT_PUBLIC_APP_URL
                    ? `${process.env.NEXT_PUBLIC_APP_URL}/r/${business.slug}`
                    : typeof window !== 'undefined'
                      ? `${window.location.origin}/r/${business.slug}`
                      : `/r/${business.slug}`}
                </span>
                <ExternalLink size={12} className="inline shrink-0 text-blue-500 hover:text-blue-700" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
