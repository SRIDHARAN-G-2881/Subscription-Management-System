import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  status: { type: String, enum: ["active", "cancelled", "expired"], default: "active" },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  renewalDate: { type: Date },
  lastRenewedAt: { type: Date },
  nextBillingDate: { type: Date },
  usageGB: { type: Number, default: 0 },
  discountApplied: {
    couponCode: { type: String },
    discountPercent: { type: Number }
  }
}, { timestamps: true });

export default mongoose.model("Subscription", subscriptionSchema);
