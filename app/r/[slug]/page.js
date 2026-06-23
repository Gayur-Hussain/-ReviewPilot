import { connectDB } from "@/lib/db"
import Business from "@/models/Business"
import CustomerReviewFlow from "@/components/shared/CustomerReviewFlow"
import { notFound } from "next/navigation"
import { cache } from "react"

export const dynamic = "force-dynamic"

// Cache business database query to prevent duplicate requests during rendering
const getBusinessBySlug = cache(async (slug) => {
  await connectDB()
  return await Business.findOne({ slug: slug.toLowerCase().trim() }).lean()
})

// Generate SEO metadata based on business slug
export async function generateMetadata({ params }) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)
  if (!business) {
    return {
      title: "Business Not Found | ReviewPilot",
      description: "No review profile found for this business.",
    }
  }

  return {
    title: `Rate Our Service - ${business.name}`,
    description: `Help us improve! Draft an AI review for ${business.name}.`,
    openGraph: {
      title: `Rate Our Service - ${business.name}`,
      description: `Leave your Google review for ${business.name}.`,
      type: "website",
    }
  }
}

export default async function CustomerReviewPage({ params }) {
  const { slug } = await params
  const businessRaw = await getBusinessBySlug(slug)
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
