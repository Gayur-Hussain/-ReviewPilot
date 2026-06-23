import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import OnboardingForm from '@/components/shared/OnboardingForm'
import { createBusiness } from '@/actions/onboarding'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  const user = await getAuthUser()
  if (!user) redirect('/sign-in')

  if (user.role === 'admin') redirect('/admin')

  await connectDB()
  const { default: Business } = await import('@/models/Business')
  const existing = await Business.findOne({ userId: user._id })
  
  if (existing?.isOnboarded) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <OnboardingForm action={createBusiness} />
    </main>
  )
}
