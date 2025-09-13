import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recommendedPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  reason: { type: String },
  confidence: { type: Number }
}, { timestamps: true });

export default mongoose.model("Recommendation", recommendationSchema);
