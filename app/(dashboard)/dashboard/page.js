import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import { getBusinessAnalytics } from "@/lib/analytics"
import Link from "next/link"
import {
  QrCode,
  Eye,
  MousePointerClick,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Phone
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) redirect("/sign-in")

  await connectDB()
  
  const business = await Business.findOne({ userId: user._id }).lean()
  if (!business || !business.isOnboarded) {
    redirect("/onboarding")
  }

  // Fetch analytics
  const { dailyStats, totals } = await getBusinessAnalytics(business._id.toString())

  // Calculate conversions
  const clickThroughRate = totals.totalUniqueVisitors > 0
    ? Math.round((totals.totalGoogleClicks / totals.totalUniqueVisitors) * 100)
    : 0

  const suggestionsRatio = totals.totalUniqueVisitors > 0
    ? Math.round((totals.totalReviewsGenerated / totals.totalUniqueVisitors) * 100)
    : 0

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Overview of reviews and customer routing for <span className="font-semibold text-blue-600">{business.name}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/poster"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition cursor-pointer"
          >
            <QrCode size={16} />
            Generate QR Poster
          </Link>
        </div>
      </div>

      {/* Business Details Quick Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200">
                {business.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-3">{business.name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-y-1.5 gap-x-4 mt-3 text-xs text-slate-600">
                {business.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    {business.address}
                  </span>
                )}
                {business.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} className="text-slate-400" />
                    {business.phone}
                  </span>
                )}
              </div>
            </div>
            {business.logoUrl ? (
              <img src={business.logoUrl} alt="Logo" className="h-16 w-16 rounded-xl object-cover border border-slate-200" />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                {business.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-200 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-xs text-slate-500">
              Routing URL: <Link href={`/r/${business.slug}`} target="_blank" className="text-blue-600 hover:underline">{`/r/${business.slug}`}</Link>
            </span>
            <Link
              href="/dashboard/settings"
              className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1 transition"
            >
              Edit business info
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* QR Quick Access Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-700">Your Review QR</h4>
            <p className="text-xs text-slate-500">Customers scan to review</p>
          </div>
          <div className="my-4 bg-white p-2.5 rounded-xl border border-slate-100 shadow-lg">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/r/${business.slug}?src=qr`
              )}`}
              alt="QR Code"
              className="h-24 w-24"
            />
          </div>
          <Link
            href="/dashboard/poster"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 transition"
          >
            Download QR Poster (A4)
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Scans */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Total Scans</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <QrCode size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">{totals.totalScans}</span>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              Scans from QR poster
            </p>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Unique Visitors</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Eye size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">{totals.totalUniqueVisitors}</span>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp size={12} className="text-emerald-500" />
              Unique device count
            </p>
          </div>
        </div>

        {/* Reviews Generated */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Reviews Drafted</span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">{totals.totalReviewsGenerated}</span>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-purple-600 font-semibold">{suggestionsRatio}%</span> generation rate
            </p>
          </div>
        </div>

        {/* Google Clicks */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Google Clicks</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MousePointerClick size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">{totals.totalGoogleClicks}</span>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-600 font-semibold">{clickThroughRate}%</span> CTR conversion
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Layout */}
      <div className="grid gap-6 lg:grid-cols-1">
        {/* Custom Daily Bar Chart (Full Width) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Traffic & Routing</h3>
              <p className="text-xs text-slate-500 mt-0.5">Performance statistics for the last 14 days</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2.5 w-2.5 rounded bg-blue-500 inline-block" /> Scans
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500 inline-block" /> Google Clicks
              </span>
            </div>
          </div>

          {/* SVG/HTML Chart Container */}
          <div className="h-64 flex flex-col justify-between">
            {dailyStats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                No visitor statistics recorded yet.
              </div>
            ) : (
              <div className="h-full w-full flex items-end gap-2.5 px-2 pt-4">
                {dailyStats.slice(-14).map((day, idx) => {
                  const maxVal = Math.max(...dailyStats.map(d => Math.max(d.scans, d.googleClicks, 1)))
                  const scansHeight = Math.max(5, (day.scans / maxVal) * 85)
                  const clicksHeight = Math.max(5, (day.googleClicks / maxVal) * 85)

                  // Format short date (e.g. 24 Jun)
                  let displayDate = ''
                  try {
                    const parsedDate = new Date(day.dateString)
                    displayDate = parsedDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
                  } catch {
                    displayDate = day.dateString.slice(5)
                  }

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full group">
                      {/* Bar values tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-8 bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-700 flex gap-2 pointer-events-none shadow-md z-10">
                        <span>Scans: {day.scans}</span>
                        <span>Clicks: {day.googleClicks}</span>
                      </div>
                      
                      <div className="w-full flex items-end justify-center gap-1 h-[80%]">
                        {/* Scan bar */}
                        <div
                          style={{ height: `${scansHeight}%` }}
                          className="w-3 bg-blue-500 hover:bg-blue-400 rounded-t transition-all duration-300"
                        />
                        {/* Click bar */}
                        <div
                          style={{ height: `${clicksHeight}%` }}
                          className="w-3 bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all duration-300"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">
                        {displayDate}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
