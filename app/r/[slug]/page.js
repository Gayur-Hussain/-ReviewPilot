import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import CustomerReviewFlow from "@/components/shared/CustomerReviewFlow"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

// Generate SEO metadata based on business slug
export async function generateMetadata({ params }) {
  const { slug } = await params
  await connectDB()

  const business = await Business.findOne({ slug: slug.toLowerCase().trim() })
  if (!business) {
    return {
      title: "Business Not Found | ReviewPilot",
      description: "No review profile found for this business.",
    }
  }

  return {
    title: `Rate Our Service - ${business.name}`,
    description: `Help us improve! Leave private feedback or draft an AI review for ${business.name}.`,
    openGraph: {
      title: `Rate Our Service - ${business.name}`,
      description: `Leave your feedback or Google review for ${business.name}.`,
      type: "website",
    }
  }
}

export default async function CustomerReviewPage({ params }) {
  const { slug } = await params
  await connectDB()

  const businessRaw = await Business.findOne({ slug: slug.toLowerCase().trim() }).lean()
  if (!businessRaw) {
    notFound()
  }

  // Parse for Client Component hydration safety
  const business = JSON.parse(JSON.stringify(businessRaw))

  return (
    <main className="min-h-screen bg-slate-950">
      <CustomerReviewFlow business={business} />
    </main>
  )
}
