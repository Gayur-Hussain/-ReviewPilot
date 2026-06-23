import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Business from '@/models/Business'
import SettingsClient from '@/components/shared/SettingsClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/sign-in')

  await connectDB()
  const businessRaw = await Business.findOne({ userId: user._id }).lean()
  if (!businessRaw) redirect('/onboarding')

  const business = JSON.parse(JSON.stringify(businessRaw))

  return (
    <main className="min-h-screen">
      <SettingsClient business={business} />
    </main>
  )
}
