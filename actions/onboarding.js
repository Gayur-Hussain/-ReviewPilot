'use server'

import { getAuthUser } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { redirect } from 'next/navigation'
import Business from '@/models/Business'

// Helper to slugify strings
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export async function createBusiness(prevState, formData) {
  const user = await getAuthUser()
  if (!user) redirect('/sign-in')

  const name = formData.get('name')
  const slugInput = formData.get('slug')
  const googleReviewUrl = formData.get('googleReviewUrl')
  const category = formData.get('category')
  const phone = formData.get('phone')
  const address = formData.get('address')

  if (!name?.trim()) {
    return { error: 'Business name is required' }
  }

  if (!googleReviewUrl?.trim()) {
    return { error: 'Google Review Link is required' }
  }

  let finalSlug = slugify(slugInput?.trim() || name.trim())
  if (!finalSlug) {
    finalSlug = 'business-' + Math.random().toString(36).substring(2, 8)
  }

  let onboardingDone = false
  try {
    await connectDB()

    // Verify if slug is already taken by someone else
    const slugOwner = await Business.findOne({ slug: finalSlug })
    if (slugOwner && slugOwner.userId.toString() !== user._id) {
      // Append a random number to slug
      finalSlug = `${finalSlug}-${Math.floor(1000 + Math.random() * 9000)}`
    }

    const existing = await Business.findOne({ userId: user._id })
    if (existing?.isOnboarded) {
      onboardingDone = true
    } else {
      await Business.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          name: name.trim(),
          slug: finalSlug,
          googleReviewUrl: googleReviewUrl.trim(),
          category: category?.trim() || 'General',
          phone: phone?.trim() || '',
          address: address?.trim() || '',
          isOnboarded: true,
        },
        { upsert: true, returnDocument: 'after' }
      )
      onboardingDone = true
    }
  } catch (error) {
    console.error("Onboarding error:", error)
    return { error: 'Something went wrong. Please try again.' }
  }

  if (onboardingDone) {
    redirect('/dashboard')
  }
}
