import mongoose, { Schema } from 'mongoose'

const FeedbackSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 3 },
  customerName: { type: String, default: 'Anonymous' },
  customerEmail: { type: String },
  customerPhone: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema)
