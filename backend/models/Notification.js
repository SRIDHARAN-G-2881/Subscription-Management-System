import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["reminder", "offer", "system"], default: "system" },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  actionUrl: { type: String },         // link target for notification
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
