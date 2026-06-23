import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import Feedback from "@/models/Feedback"
import { Mail, Phone, Calendar, User, Star } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function FeedbackPage() {
  const user = await getAuthUser()
  if (!user) redirect("/sign-in")

  await connectDB()
  const business = await Business.findOne({ userId: user._id })
  if (!business) redirect("/onboarding")

  const feedbacksRaw = await Feedback.find({ businessId: business._id })
    .sort({ createdAt: -1 })
    .lean()

  const feedbacks = JSON.parse(JSON.stringify(feedbacksRaw))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Private Feedback</h1>
        <p className="text-sm text-slate-600 mt-1">
          Review issues shared privately by customers who rated 1 to 3 stars.
        </p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm py-16 text-center text-slate-500 border-dashed">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-base font-bold text-slate-700">No private feedback yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Low ratings will trigger a feedback form instead of a Google Review redirect. You will see results here when they submit.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {feedbacks.map((fb, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {fb.customerName || "Anonymous Customer"}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
                      {fb.customerEmail && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} className="text-slate-400" />
                          {fb.customerEmail}
                        </span>
                      )}
                      {fb.customerPhone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-slate-400" />
                          {fb.customerPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1.5">
                  <div className="flex text-amber-500">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star key={i} className="fill-amber-500 text-amber-500 h-4 w-4" />
                    ))}
                    {Array.from({ length: 3 - fb.rating }).map((_, i) => (
                      <Star key={i} className="text-slate-200 h-4 w-4" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                "{fb.message}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MessageSquare(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
  )
}
