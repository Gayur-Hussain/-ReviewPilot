"use client"

import { useState, useEffect } from "react"
import { Star, Sparkles, Copy, Check, ArrowRight, ArrowLeft, Heart, Shield } from "lucide-react"
import { toast, Toaster } from "sonner"

export default function CustomerReviewFlow({ business }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [step, setStep] = useState(1) // 1: Rating, 2: Questions / Feedback Form, 3: AI Suggestions / Thanks
  const [loading, setLoading] = useState(false)

  // 1-3 Star Feedback Form state
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })

  // 4-5 Star AI Questions state
  const [selectedTags, setSelectedTags] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [hasCopiedAny, setHasCopiedAny] = useState(false)

  // List of positive tags
  const tagsList = [
    { label: "Excellent Service", value: "excellent service" },
    { label: "Friendly Staff", value: "friendly staff" },
    { label: "High Quality", value: "high quality" },
    { label: "Great Value", value: "great value" },
    { label: "Cleanliness", value: "cleanliness" },
    { label: "Fast Response", value: "fast response" }
  ]

  // Track visit on mount
  useEffect(() => {
    if (business?._id) {
      const isQrScan = window.location.search.includes("src=qr")
      fetch("/api/public/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business._id, isQrScan })
      }).catch(err => console.error("Tracking error:", err))
    }
  }, [business])

  // Handle rating click
  const handleRatingSelect = (selected) => {
    setRating(selected)
    setStep(2) // Move to next step immediately
  }

  // Handle tag toggle
  const toggleTag = (tagVal) => {
    if (selectedTags.includes(tagVal)) {
      setSelectedTags(selectedTags.filter(t => t !== tagVal))
    } else {
      setSelectedTags([...selectedTags, tagVal])
    }
  }

  // Submit private feedback (1-3 stars)
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (!feedbackForm.message.trim()) {
      toast.error("Please enter your message")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/public/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business._id,
          rating,
          customerName: feedbackForm.name,
          customerEmail: feedbackForm.email,
          customerPhone: feedbackForm.phone,
          message: feedbackForm.message
        })
      })

      if (response.ok) {
        toast.success("Feedback submitted. Thank you!")
        setStep(3)
      } else {
        toast.error("Failed to submit feedback. Please try again.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Generate AI Review Suggestions (4-5 stars)
  const handleGenerateSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/public/generate-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business._id,
          rating,
          tags: selectedTags,
          staffName: "",
          additionalDetails: ""
        })
      })

      const data = await response.json()
      if (response.ok) {
        setSuggestions(data.reviews || [])
        setStep(3)
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

  // Copy suggestion text
  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setHasCopiedAny(true)
    toast.success("Review copied to clipboard!")
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Handle Google redirect
  const handleGoogleRedirect = async () => {
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
    // Redirect in new tab
    window.open(business.googleReviewUrl, "_blank")
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 text-slate-900 py-12 px-4 relative overflow-hidden font-sans">
      <Toaster position="top-center" theme="light" />
      
      {/* Background radial glow */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blue-100 blur-[120px]" />
      </div>

      <div className="w-full max-w-md mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl relative z-10 my-auto">
        
        {/* Step 1: Rating Interface */}
        {step === 1 && (
          <div className="text-center space-y-8 py-4">
            {/* Logo / Initial */}
            <div className="space-y-4">
              {business.logoUrl ? (
                <img src={business.logoUrl} alt={business.name} className="h-20 w-20 rounded-full mx-auto object-cover border border-slate-200" />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center font-bold text-2xl">
                  {business.name.charAt(0)}
                </div>
              )}
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{business.name}</h2>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Thank you for visiting! How would you rate your experience with us today?
              </p>
            </div>

            {/* Clickable Stars */}
            <div className="flex justify-center items-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingSelect(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform active:scale-95 duration-100 cursor-pointer"
                >
                  <Star
                    size={38}
                    className={`transition-colors duration-150 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400 scale-110"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5 pt-4">
              <Shield size={14} className="text-slate-400" />
              <span>We protect your private data and feedback</span>
            </div>
          </div>
        )}

        {/* Step 2: Form Input */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              Change Rating
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Your Rating</span>
                <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
                  {rating} ★
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {rating >= 4 ? "Tell us what you liked!" : "Share your feedback"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {rating >= 4 
                  ? "We will generate custom AI suggestions in multiple languages you can copy to Google reviews."
                  : "Your response is private and shared only with the business management."}
              </p>
            </div>

            {/* 1-3 Stars: Feedback Form */}
            {rating <= 3 ? (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase">Your Name</label>
                  <input
                    type="text"
                    value={feedbackForm.name}
                    onChange={e => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Email</label>
                    <input
                      type="email"
                      value={feedbackForm.email}
                      onChange={e => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                      placeholder="john@example.com"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      value={feedbackForm.phone}
                      onChange={e => setFeedbackForm({ ...feedbackForm, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase">How can we improve? <span className="text-red-500">*</span></label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackForm.message}
                    onChange={e => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    placeholder="Describe your experience..."
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white shadow-lg shadow-red-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Private Feedback"}
                </button>
              </form>
            ) : (
              /* 4-5 Stars: Simplified AI suggestion details */
              <div className="space-y-6">
                {/* Tags grid */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Highlight Areas</label>
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map(tag => (
                      <button
                        key={tag.value}
                        type="button"
                        onClick={() => toggleTag(tag.value)}
                        className={`py-2 px-4 text-sm rounded-full border transition cursor-pointer ${
                          selectedTags.includes(tag.value)
                            ? "bg-blue-50 border-blue-500 text-blue-600 font-semibold"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateSuggestions}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 mt-4"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Drafting Suggestions...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Draft AI Suggestion Reviews</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success Screen / AI Suggestions */}
        {step === 3 && (
          <div className="space-y-6">
            {rating <= 3 ? (
              /* Low rating thank you */
              <div className="text-center py-6 space-y-4">
                <div className="h-14 w-14 rounded-full bg-red-50/50 border border-red-200 text-red-500 mx-auto flex items-center justify-center">
                  <Heart className="fill-red-500/10" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Thank You for Your Feedback</h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Your response has been submitted privately. We appreciate your honesty and will use your input to improve our service.
                </p>
                <button
                  onClick={() => {
                    setRating(0)
                    setFeedbackForm({ name: "", email: "", phone: "", message: "" })
                    setStep(1)
                  }}
                  className="mt-6 text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  Submit another rating
                </button>
              </div>
            ) : (
              /* High rating AI suggestions list */
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles size={20} className="text-blue-500" />
                    Review Suggestions
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Copy your favorite review below and paste it on our Google Review page!
                  </p>
                </div>

                <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                  {suggestions.map((reviewText, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 relative group">
                      <p className="text-xs text-slate-700 leading-relaxed pr-8 font-medium">
                        {reviewText}
                      </p>
                      
                      <button
                        onClick={() => handleCopyText(reviewText, idx)}
                        className={`absolute top-3 right-3 h-7 w-7 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                          copiedIndex === idx
                            ? "bg-emerald-50 border-emerald-500 text-emerald-600 animate-pulse"
                            : "border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                        title="Copy to clipboard"
                      >
                        {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleGoogleRedirect}
                    disabled={!hasCopiedAny}
                    className={`w-full py-3 rounded-xl text-sm font-semibold text-white shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition ${
                      hasCopiedAny
                        ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/10"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    }`}
                  >
                    <span>Open Google Review Page</span>
                    <ArrowRight size={16} />
                  </button>
                  {!hasCopiedAny && (
                    <p className="text-center text-[10px] text-slate-500">
                      Copy a review suggestion above first to enable the Google review button.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
