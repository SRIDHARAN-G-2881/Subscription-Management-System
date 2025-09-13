import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },  
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("AuditLog", auditLogSchema);
