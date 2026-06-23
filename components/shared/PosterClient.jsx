"use client"

import { useState } from "react"
import { QrCode, Printer, Globe, Palette, Sparkles, Star } from "lucide-react"

export default function PosterClient({ business, qrDataUrl }) {
  const [language, setLanguage] = useState(business.posterConfig?.language || "en")
  const [themeColor, setThemeColor] = useState(business.posterConfig?.primaryColor || "#2563eb")

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const element = document.getElementById("poster-pdf-template")
      if (!element) {
        throw new Error("PDF template element not found")
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      })

      pdf.addImage(imgData, "PNG", 0, 0, 210, 297)
      pdf.save(`${business.slug}-review-poster.pdf`)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      alert("Failed to download PDF. Please try again.")
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Poster translations
  const content = {
    en: {
      headline: "Scan the QR Code",
      subheadline: "Share Your Valuable Review",
      additional: "Your feedback helps us improve our services.",
      footer: "Thank you for your visit!"
    },
    hi: {
      headline: "QR Scan Karein",
      subheadline: "Aur Apna Keemti Review Dein",
      additional: "आपका फीडबैक हमें अपनी सेवाएं बेहतर बनाने में मदद करता है।",
      footer: "हमारी दुकान पर आने के लिए धन्यवाद!"
    }
  }

  const activeContent = content[language]

  // Color options
  const colors = [
    { name: "Sapphire Blue", value: "#2563eb" },
    { name: "Emerald Green", value: "#10b981" },
    { name: "Crimson Red", value: "#dc2626" },
    { name: "Deep Indigo", value: "#4f46e5" },
    { name: "Carbon Black", value: "#0f172a" }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">QR Poster Generator</h1>
          <p className="text-sm text-slate-600 mt-1">
            Customize and print a professional feedback flyer for your counters
          </p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPdf ? (
            <>
              <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <QrCode size={18} />
              <span>Download Poster (PDF)</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Language Selection */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe size={18} className="text-blue-600" />
              Poster Language
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                  language === "en"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                English Version
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                  language === "hi"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                हिन्दी / Hinglish
              </button>
            </div>
          </div>

          {/* Theme Color Selection */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Palette size={18} className="text-blue-600" />
              Theme Accent Color
            </h3>
            <div className="flex flex-col gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setThemeColor(c.value)}
                  className={`flex items-center gap-3 w-full p-2.5 text-xs rounded-xl border text-left transition cursor-pointer ${
                    themeColor === c.value
                      ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span
                    style={{ backgroundColor: c.value }}
                    className="h-4 w-4 rounded-full border border-slate-200 shrink-0"
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="lg:col-span-2 flex justify-center bg-slate-100/50 p-4 sm:p-6 rounded-2xl border border-slate-200">
          <div className="w-full max-w-[420px] aspect-[1/1.414] bg-white text-slate-900 rounded-lg shadow-2xl p-4 sm:p-8 flex flex-col justify-between items-center relative overflow-hidden border border-slate-200">
            
            {/* Top Border Band */}
            <div
              style={{ backgroundColor: themeColor }}
              className="absolute top-0 left-0 right-0 h-3 sm:h-4"
            />

            {/* Business Header */}
            <div className="w-full text-center mt-3 sm:mt-6 space-y-1.5 sm:space-y-3">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt="Business Logo"
                  className="h-10 w-10 sm:h-14 sm:w-14 rounded-full mx-auto object-cover border-2 border-slate-200"
                />
              ) : (
                <div
                  style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                  className="h-9 w-9 sm:h-12 sm:w-12 rounded-full mx-auto flex items-center justify-center font-bold text-xs sm:text-lg border border-slate-100"
                >
                  {business.name.charAt(0)}
                </div>
              )}
              <h2 className="text-xs sm:text-lg font-bold tracking-tight uppercase text-slate-800 truncate px-2">
                {business.name}
              </h2>
            </div>

            {/* Headlines */}
            <div className="text-center space-y-1 sm:space-y-2 max-w-sm mt-2 sm:mt-4">
              <h1
                style={{ color: themeColor }}
                className="text-lg sm:text-2xl font-extrabold tracking-tight"
              >
                {activeContent.headline}
              </h1>
              <p className="text-[10px] sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {activeContent.subheadline}
              </p>
            </div>

            {/* QR Code Container */}
            <div
              style={{ borderColor: themeColor }}
              className="my-3 sm:my-6 p-2 sm:p-4 bg-white rounded-2xl sm:rounded-3xl border-2 sm:border-4 shadow-xl flex items-center justify-center aspect-square"
            >
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="h-28 w-28 sm:h-44 sm:w-44 object-contain" />
              ) : (
                <QrCode className="h-28 w-28 sm:h-44 sm:w-44 text-slate-300" />
              )}
            </div>

            {/* Bottom Info */}
            <div className="w-full text-center space-y-2 sm:space-y-4 mb-3 sm:mb-6">
              <div className="flex items-center justify-center gap-0.5 sm:gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed px-2">
                {activeContent.additional}
              </p>
            </div>

            {/* Footer */}
            <div className="w-full border-t border-slate-100 pt-2 sm:pt-3 text-center flex items-center justify-between text-[8px] sm:text-[9px] text-slate-400">
              <span>{activeContent.footer}</span>
              <span className="font-semibold tracking-wider">POWERED BY REVIEWPILOT</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRINT-ONLY STYLES & CONTAINER ─────────────────────────── */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide everything except the print area */
          header, aside, main > *:not(.print-area), .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
          }
          .print-area {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 210mm !important;
            height: 297mm !important;
            padding: 20mm 15mm 15mm 15mm !important;
            box-sizing: border-box !important;
            background-color: white !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
        }
      `}</style>

      {/* Hidden during normal view, shown during printing */}
      <div className="print-area hidden bg-white text-slate-900 flex-col justify-between items-center">
        {/* Top Border Band */}
        <div
          style={{ backgroundColor: themeColor }}
          className="w-full h-5 absolute top-0 left-0 right-0"
        />

        {/* Business Header */}
        <div className="w-full text-center mt-8 space-y-4">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt="Logo"
              className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-slate-200"
            />
          ) : (
            <div
              style={{ backgroundColor: `${themeColor}12`, color: themeColor }}
              className="h-16 w-16 rounded-full mx-auto flex items-center justify-center font-bold text-2xl border border-slate-200"
            >
              {business.name.charAt(0)}
            </div>
          )}
          <h2 className="text-2xl font-extrabold tracking-tight uppercase text-slate-800 mt-2">
            {business.name}
          </h2>
        </div>

        {/* Headlines */}
        <div className="text-center space-y-3 max-w-lg mt-6">
          <h1
            style={{ color: themeColor }}
            className="text-4xl font-black tracking-tight"
          >
            {activeContent.headline}
          </h1>
          <p className="text-lg font-bold text-slate-600 uppercase tracking-widest mt-2">
            {activeContent.subheadline}
          </p>
        </div>

        {/* QR Code Container */}
        <div
          style={{ borderColor: themeColor }}
          className="my-10 p-6 bg-white rounded-[40px] border-8 shadow-2xl flex items-center justify-center aspect-square"
        >
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code" className="h-64 w-64 object-contain" />
          )}
        </div>

        {/* Bottom Info */}
        <div className="w-full text-center space-y-6 mb-8">
          <div className="flex items-center justify-center gap-1.5 text-amber-500 scale-125">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={20} className="fill-amber-500" />
            ))}
          </div>
          <p className="text-base text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
            {activeContent.additional}
          </p>
        </div>

        {/* Footer */}
        <div className="w-full border-t border-slate-200 pt-4 text-center flex items-center justify-between text-xs text-slate-400">
          <span>{activeContent.footer}</span>
          <span className="font-extrabold tracking-wider">POWERED BY REVIEWPILOT</span>
        </div>
      </div>

      {/* Off-screen A4 Template for PDF Generation */}
      <div 
        id="poster-pdf-template"
        className="flex flex-col justify-between items-center p-12 relative"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "794px",
          height: "1123px",
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          fontFamily: "Inter, system-ui, sans-serif"
        }}
      >
        {/* Top Border Band */}
        <div
          style={{ backgroundColor: themeColor }}
          className="w-full h-6 absolute top-0 left-0 right-0"
        />

        {/* Business Header */}
        <div className="w-full text-center mt-12" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt="Logo"
              className="h-24 w-24 rounded-full mx-auto object-cover"
              style={{ border: "2px solid #e2e8f0" }}
            />
          ) : (
            <div
              className="h-20 w-20 rounded-full mx-auto font-bold text-3xl"
              style={{
                backgroundColor: `${themeColor}12`,
                color: themeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #e2e8f0"
              }}
            >
              {business.name.charAt(0)}
            </div>
          )}
          <h2 className="text-3xl font-extrabold tracking-tight uppercase mt-2 animate-none" style={{ color: "#1e293b" }}>
            {business.name}
          </h2>
        </div>

        {/* Headlines */}
        <div className="text-center mt-8" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <h1
            style={{ color: themeColor }}
            className="text-5xl font-black tracking-tight"
          >
            {activeContent.headline}
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest mt-2" style={{ color: "#475569" }}>
            {activeContent.subheadline}
          </p>
        </div>

        {/* QR Code Container */}
        <div
          style={{
            borderColor: themeColor,
            borderStyle: "solid",
            borderWidth: "8px",
            borderRadius: "40px",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
            margin: "48px 0",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
          className="aspect-square"
        >
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code" className="h-64 w-64 object-contain" />
          )}
        </div>

        {/* Bottom Info */}
        <div className="w-full text-center mb-12" style={{ display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }}>
          <div className="flex items-center justify-center gap-2 scale-150">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={24} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <p className="text-lg font-bold max-w-md mx-auto leading-relaxed" style={{ color: "#475569" }}>
            {activeContent.additional}
          </p>
        </div>

        {/* Footer */}
        <div 
          className="w-full pt-6 text-center flex items-center justify-between text-xs" 
          style={{ borderTop: "1px solid #e2e8f0", color: "#94a3b8" }}
        >
          <span>{activeContent.footer}</span>
          <span className="font-extrabold tracking-wider">POWERED BY REVIEWPILOT</span>
        </div>
      </div>
    </div>
  )
}
