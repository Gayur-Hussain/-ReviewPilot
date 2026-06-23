import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['business', 'admin'], default: 'business' },
  isVerified:   { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
