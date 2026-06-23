'use server'

import { getAuthUser } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Business from '@/models/Business'
import { revalidatePath } from 'next/cache'

export async function updateBusiness(prevState, formData) {
  const user = await getAuthUser()
  if (!user) return { error: 'Unauthorized' }

  const name = formData.get('name')
  const googleReviewUrl = formData.get('googleReviewUrl')
  const category = formData.get('category')
  const phone = formData.get('phone')
  const address = formData.get('address')
  const logoUrl = formData.get('logoUrl')

  if (!name?.trim()) {
    return { error: 'Business name is required' }
  }

  if (!googleReviewUrl?.trim()) {
    return { error: 'Google Review Link is required' }
  }

  try {
    await connectDB()

    const updateData = {
      name: name.trim(),
      googleReviewUrl: googleReviewUrl.trim(),
      category: category?.trim() || 'General',
      phone: phone?.trim() || '',
      address: address?.trim() || '',
    }

    if (logoUrl !== undefined) {
      updateData.logoUrl = logoUrl?.trim() || null
    }

    const updated = await Business.findOneAndUpdate(
      { userId: user._id },
      updateData,
      { new: true }
    )

    if (!updated) {
      return { error: 'Business profile not found.' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/settings')
    return { success: true, message: 'Settings updated successfully!' }

  } catch (error) {
    console.error("Update settings error:", error)
    return { error: 'Something went wrong. Please try again.' }
  }
}
