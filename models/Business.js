import mongoose, { Schema } from 'mongoose'

const BusinessSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true, index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  googleReviewUrl: { type: String, default: '' },
  logoUrl: { type: String, default: null },
  category: { type: String, default: 'General' },
  phone: { type: String },
  address: { type: String },
  isOnboarded: { type: Boolean, default: false },
  
  posterConfig: {
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    primaryColor: { type: String, default: '#2563eb' }, // Blue
    textColor: { type: String, default: '#1e293b' },
  },

  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema)
