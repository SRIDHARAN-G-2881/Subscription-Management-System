// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  phone: { type: String },
  avatarUrl: { type: String },
  registeredAt: { type: Date, default: Date.now },
  profile: {
    address: { type: String },
    preferences: [String], 
    usageHistory: [
      {
        month: String,  
        usedGB: Number
      }
    ]
  },
  // Keep existing OAuth fields for backward compatibility
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
