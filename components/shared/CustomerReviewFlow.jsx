"use client"

import { useState, useEffect } from "react"
import { Sparkles, Copy, Check, ArrowLeft } from "lucide-react"
import { toast, Toaster } from "sonner"

export default function CustomerReviewFlow({ business }) {
  const [step, setStep] = useState(1) // 1: Highlights Selection, 2: AI Suggestions
  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)

  // List of positive tags (increased to 12 tags)
  const tagsList = [
    { label: "Excellent Service", value: "excellent service" },
    { label: "Friendly Staff", value: "friendly staff" },
    { label: "High Quality", value: "high quality" },
    { label: "Great Value", value: "great value" },
    { label: "Cleanliness", value: "cleanliness" },
    { label: "Fast Response", value: "fast response" },
    { label: "Professional Team", value: "professional team" },
    { label: "Highly Recommended", value: "highly recommended" },
    { label: "Welcoming Atmosphere", value: "welcoming atmosphere" },
    { label: "Prompt Delivery", value: "prompt delivery" },
    { label: "Great Communication", value: "great communication" },
    { label: "Attention to Detail", value: "attention to detail" }
  ]

  // Track visit on mount
  useEffect(() => {
    if (business?._id) {
      const isQrScan = typeof window !== "undefined" && window.location.search.includes("src=qr")
      fetch("/api/public/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business._id, isQrScan })
      }).catch(err => console.error("Tracking error:", err))
    }
  }, [business])

  // Handle tag toggle
  const toggleTag = (tagVal) => {
    if (selectedTags.includes(tagVal)) {
      setSelectedTags(selectedTags.filter(t => t !== tagVal))
    } else {
      setSelectedTags([...selectedTags, tagVal])
    }
  }

  // Generate AI Review Suggestions (using hardcoded rating 5)
  const handleGenerateSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/public/generate-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business._id,
          rating: 5,
          tags: selectedTags,
          staffName: "",
          additionalDetails: ""
        })
      })

      const data = await response.json()
      if (response.ok) {
        setSuggestions(data.reviews || [])
        setStep(2)
      } else {
        toast.error(data.error || "Failed to generate suggestions.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate suggestions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Copy suggestion text and redirect to Google Review Page
  const handleResponseClick = async (reviewText, idx) => {
    try {
      await navigator.clipboard.writeText(reviewText)
      setCopiedIndex(idx)
      toast.success("Review copied! Redirecting to Google...")
    } catch (err) {
      console.error("Clipboard copy failed:", err)
      toast.error("Failed to copy review. Redirecting anyway...")
    }

    try {
      // Log click event
      await fetch("/api/public/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business._id })
      })
    } catch (err) {
      console.error(err)
    }

    // Redirect to Google review page after a short delay so user sees copied state
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = business.googleReviewUrl
      }
    }, 800)
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 text-slate-900 py-12 px-4 relative overflow-hidden font-sans">
      <Toaster position="top-center" theme="light" />
      
      {/* Background radial glow */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 sm:w-125 h-75 sm:h-125 rounded-full bg-blue-100 blur-[120px]" />
      </div>

      <div className="w-full max-w-md mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl relative z-10 my-auto">
        
        {/* Step 1: Highlights Selection */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            {/* Logo / Brand Header */}
            <div className="space-y-3">
              {business.logoUrl ? (
                <img src={business.logoUrl} alt={business.name} className="h-20 w-20 rounded-full mx-auto object-cover border border-slate-200" />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center font-bold text-2xl">
                  {business.name ? business.name.charAt(0) : "B"}
                </div>
              )}
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{business.name}</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Select what you liked to generate AI review suggestions
              </p>
            </div>

            {/* Tags Grid */}
            <div className="space-y-2.5 text-left">
              <div className="flex flex-wrap gap-2 justify-center">
                {tagsList.map(tag => (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={`py-2 px-3.5 text-xs sm:text-sm rounded-full border transition duration-150 active:scale-95 cursor-pointer ${
                      selectedTags.includes(tag.value)
                        ? "bg-blue-50 border-blue-500 text-blue-600 font-semibold shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerateSuggestions}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 transition duration-150 active:scale-98 mt-4"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Generating reviews...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Reviews</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Suggestions List */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Logo / Brand Header */}
            <div className="text-center space-y-3">
              {business.logoUrl ? (
                <img src={business.logoUrl} alt={business.name} className="h-16 w-16 rounded-full mx-auto object-cover border border-slate-200" />
              ) : (
                <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center font-bold text-xl">
                  {business.name ? business.name.charAt(0) : "B"}
                </div>
              )}
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{business.name}</h2>
              <div className="flex items-center justify-center gap-1.5 text-blue-600 font-semibold text-sm">
                <Sparkles size={16} />
                <span>Review Suggestions</span>
              </div>
            </div>

            {/* Compact Step Guide / Instructions Box */}
            <div className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3 text-center space-y-1.5">
              <p className="font-bold text-slate-700">How to review:</p>
              <div className="flex flex-col gap-1.5 items-start max-w-70 mx-auto text-[11px] text-slate-650">
                <div className="flex items-start gap-2 text-left">
                  <span className="h-4 w-4 rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold flex items-center justify-center mt-0.5 shrink-0">1</span>
                  <div>
                    <span className="font-bold text-slate-800">Tap to Copy: </span>
                    <span>Tap your favorite review</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-left">
                  <span className="h-4 w-4 rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold flex items-center justify-center mt-0.5 shrink-0">2</span>
                  <div>
                    <span className="font-bold text-slate-800">Paste on Google: </span>
                    <span>Review page opens next</span>
                  </div>
                </div>
              </div>
            </div>

            {/* List of Suggestions */}
            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
              {suggestions.map((reviewText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResponseClick(reviewText, idx)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 relative group cursor-pointer ${
                    copiedIndex === idx
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md shadow-emerald-500/5 scale-[0.98]"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:shadow-md hover:shadow-slate-100 active:scale-[0.99] hover:-translate-y-0.5"
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed pr-8 font-medium">
                    {reviewText}
                  </p>
                  
                  {/* Visual action prompt */}
                  <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold transition-all duration-150 ${
                    copiedIndex === idx ? "text-emerald-600" : "text-blue-600 opacity-80 group-hover:opacity-100"
                  }`}>
                    <Sparkles size={10} />
                    <span>{copiedIndex === idx ? "Copied! Opening Google..." : "Tap to Copy & Open Google"}</span>
                  </div>

                  <div className={`absolute top-4 right-4 ${copiedIndex === idx ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                    {copiedIndex === idx ? <Check size={16} className="animate-bounce" /> : <Copy size={16} />}
                  </div>
                </button>
              ))}
            </div>

            {/* Back Button */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setSuggestions([])
                  setStep(1)
                }}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <ArrowLeft size={12} />
                <span>Change Highlight Areas</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
