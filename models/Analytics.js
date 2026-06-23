import mongoose, { Schema } from 'mongoose'

const AnalyticsSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  dateString: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
  scans: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  reviewsGenerated: { type: Number, default: 0 },
  googleClicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

// Compound index to ensure uniqueness of analytics record per business per day
AnalyticsSchema.index({ businessId: 1, dateString: 1 }, { unique: true })

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema)
