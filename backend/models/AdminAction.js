import mongoose from 'mongoose';

const adminActionSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorEmail: { type: String },
  action: { type: String, required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetEmail: { type: String },
  oldRole: { type: String },
  newRole: { type: String },
  ip: { type: String }
}, { timestamps: true });

export default mongoose.model('AdminAction', adminActionSchema);
