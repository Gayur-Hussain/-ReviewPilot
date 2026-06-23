import Analytics from '@/models/Analytics'
import { connectDB } from '@/lib/db'

export async function trackEvent(businessId, field) {
  try {
    if (!businessId) return
    await connectDB()
    
    const now = new Date()
    const kolkataFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    
    const parts = kolkataFormatter.formatToParts(now)
    const partMap = {}
    parts.forEach(p => partMap[p.type] = p.value)
    
    const yearStr = partMap.year
    const monthStr = String(partMap.month).padStart(2, '0')
    const dayStr = String(partMap.day).padStart(2, '0')
    const dateString = `${yearStr}-${monthStr}-${dayStr}`

    const allowedFields = ['scans', 'uniqueVisitors', 'reviewsGenerated', 'googleClicks']
    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid analytics field: ${field}`)
    }

    await Analytics.findOneAndUpdate(
      { businessId, dateString },
      { $inc: { [field]: 1 } },
      { upsert: true, new: true }
    )
  } catch (error) {
    console.error('Error tracking analytics event:', error)
  }
}

export async function getBusinessAnalytics(businessId) {
  try {
    await connectDB()
    
    // Fetch last 30 days of daily stats
    const dailyStats = await Analytics.find({ businessId })
      .sort({ dateString: -1 })
      .limit(30)
      .lean()
    
    // Sort in ascending order for charts
    dailyStats.reverse()

    // Calculate aggregate totals
    const aggregates = await Analytics.aggregate([
      { $match: { businessId } },
      {
        $group: {
          _id: null,
          totalScans: { $sum: '$scans' },
          totalUniqueVisitors: { $sum: '$uniqueVisitors' },
          totalReviewsGenerated: { $sum: '$reviewsGenerated' },
          totalGoogleClicks: { $sum: '$googleClicks' }
        }
      }
    ])

    const totals = aggregates[0] || {
      totalScans: 0,
      totalUniqueVisitors: 0,
      totalReviewsGenerated: 0,
      totalGoogleClicks: 0
    }

    return {
      dailyStats,
      totals
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return {
      dailyStats: [],
      totals: {
        totalScans: 0,
        totalUniqueVisitors: 0,
        totalReviewsGenerated: 0,
        totalGoogleClicks: 0
      }
    }
  }
}
