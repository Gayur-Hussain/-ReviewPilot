import QRCode from "qrcode"
import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import PosterClient from "@/components/shared/PosterClient"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export default async function PosterPage() {
  const user = await getAuthUser()
  if (!user) redirect("/sign-in")

  await connectDB()
  const businessRaw = await Business.findOne({ userId: user._id }).lean()
  if (!businessRaw) redirect("/onboarding")

  const business = JSON.parse(JSON.stringify(businessRaw))

  // Resolve host from environment variable
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Customer landing page review link
  const targetUrl = `${origin}/r/${business.slug}?src=qr`

  // Generate QR image data URL
  let qrDataUrl = ""
  try {
    qrDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 500,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
  } catch (error) {
    console.error("QR Code generation error:", error)
  }

  return (
    <main className="min-h-screen">
      <PosterClient business={business} qrDataUrl={qrDataUrl} />
    </main>
  )
}
