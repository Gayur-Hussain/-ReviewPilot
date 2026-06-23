import mongoose, { Schema } from 'mongoose'

const OTPSchema = new Schema({
  email:     { type: String, required: true, lowercase: true, index: true },
  otpHash:   { type: String, required: true },
  purpose:   { type: String, enum: ['email-verify', 'password-reset'], required: true },
  attempts:  { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.OTP || mongoose.model('OTP', OTPSchema)
