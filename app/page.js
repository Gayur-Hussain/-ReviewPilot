import Link from "next/link"
import { Star, ShieldAlert, Sparkles, QrCode, TrendingUp, CheckCircle, ArrowRight, ArrowUpRight, BarChart3, ChevronRight, MessageSquare, ShieldCheck, Copy } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white relative overflow-hidden font-sans">

      {/* Premium CSS Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80 z-0" />

      {/* Decorative Radial Glowing Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-150 pointer-events-none overflow-hidden opacity-40 z-0">
        <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-blue-100/70 blur-[130px]" />
        <div className="absolute top-[-10%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/50 blur-[110px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-16 py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 hover:opacity-95 transition">
            <div className="h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-base sm:text-lg shadow shadow-blue-500/20">
              R
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">ReviewPilot</span>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-6">
            <Link href="/sign-in" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg sm:rounded-xl bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm font-bold text-white shadow shadow-blue-500/20 hover:bg-blue-500 transition-colors"
            >
              Register Business
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-24 pb-20 space-y-6 sm:space-y-8">

        <h1 className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-slate-900 max-w-4xl mx-auto">
          Get Genuine Google Reviews <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
            10x Faster with AI
          </span>
        </h1>

        <p className="text-sm sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
          ReviewPilot routes happy customers directly to Google Reviews with smart AI suggestions, while capturing constructive feedback privately to shield your public rating.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 max-w-md mx-auto">
          <Link
            href="/sign-in"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
          >
            Owner Dashboard
            <ArrowUpRight size={15} className="text-slate-400" />
          </Link>
        </div>

        {/* Live Flow Interactive Preview Mockup */}
        <div className="pt-10 sm:pt-16 max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-3xl" />

          <div className="relative rounded-2xl border border-slate-200 bg-white p-1 sm:p-2.5 shadow-xl">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 sm:p-7 text-left space-y-4 sm:space-y-6">

              {/* Mock Header */}
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-600 text-sm">
                    S
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">Spice & Stone Restaurant</h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">Customer feedback portal</p>
                  </div>
                </div>
                <span className="self-start xs:self-auto text-[9px] sm:text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">Live Preview</span>
              </div>

              {/* Steps Layout */}
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {/* Positives Route */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-5 space-y-3 sm:space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 sm:px-2.5 rounded-full">4-5 Star Rating</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">Google Redirect</span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-800">AI Suggestion Drafts</h5>
                  <div className="rounded-lg bg-slate-50 p-2.5 sm:p-3 border border-slate-200 text-[11px] sm:text-xs text-slate-700 leading-relaxed font-sans relative pr-8 pb-3">
                    {`Yahan ka khana aur service dono bahut hi badiya hain. Staff ka behavior cooperative tha, zaroor visit karein!`}
                    <div className="absolute bottom-2 right-2 h-5 w-5 rounded bg-white border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                      <Copy size={10} />
                    </div>
                  </div>
                  <div className="w-full text-center py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-[11px] sm:text-xs font-bold text-white flex items-center justify-center gap-1 cursor-pointer">
                    Submit on Google Review Page
                    <ArrowUpRight size={12} />
                  </div>
                </div>

                {/* Negatives Route */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-5 space-y-3 sm:space-y-4 flex flex-col justify-between shadow-sm">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] sm:text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 sm:px-2.5 rounded-full">1-3 Star Rating</span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400">Reputation Shield</span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-800">Private Feedback Form</h5>
                    <div className="space-y-2">
                      <div className="py-1.5 px-2.5 w-full bg-slate-50 border border-slate-200 rounded-md text-[10px] text-slate-400 flex items-center">Your Name...</div>
                      <div className="h-12 w-full bg-slate-50 border border-slate-200 rounded-md text-[10px] text-slate-400 pt-1.5 px-2.5">How can we improve?</div>
                    </div>
                  </div>
                  <div className="w-full text-center py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] sm:text-xs font-bold text-slate-500 cursor-pointer">
                    Send Privately to Owner
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-slate-200">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Features Built for Local Growth
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Everything your business needs to build customer trust, raise local SEO rank, and capture genuine customer reviews.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between group hover:border-blue-200 shadow-sm transition duration-200">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Star className="fill-blue-600/10" size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reputation Router</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                4-5 star reviews are routed straight to Google. 1-3 star reviews are routed to your private inbox so you can resolve the issue offline.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4 mt-6">
              <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase flex items-center gap-1 group-hover:text-blue-500">
                Reputation Shielding <ChevronRight size={10} />
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between group hover:border-purple-200 shadow-sm transition duration-200">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Sparkles size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Suggestion Writer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers choose key tags and we generate 5 unique, natural draft suggestions instantly. Copy with one click and post.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4 mt-6">
              <span className="text-[10px] font-bold text-purple-600 tracking-wider uppercase flex items-center gap-1 group-hover:text-purple-500">
                Openrouter Powered <ChevronRight size={10} />
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between group hover:border-emerald-200 shadow-sm transition duration-200">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <QrCode size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Printable QR Flyers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate high-contrast, ready-to-frame table flyers in A4 format. Fully localized with English and Hindi Hinglish translations.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4 mt-6">
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase flex items-center gap-1 group-hover:text-emerald-500">
                A4 PDF Print <ChevronRight size={10} />
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between group hover:border-indigo-200 shadow-sm transition duration-200">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Detailed Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log counts for daily scans, unique visitors, reviews drafted, and redirect clicks to measure conversion metrics and CTR.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4 mt-6">
              <span className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase flex items-center gap-1 group-hover:text-indigo-500">
                Dashboard Metrics <ChevronRight size={10} />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow shadow-blue-500/10">R</div>
            <span>© {new Date().getFullYear()} ReviewPilot. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
            <span className="text-slate-200">|</span>
            <span className="text-slate-500">Enterprise Review Routing System</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
