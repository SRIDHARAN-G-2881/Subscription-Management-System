// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Made optional for Google OAuth users
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
  avatar: { type: String }, // For Google profile picture
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff'
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
