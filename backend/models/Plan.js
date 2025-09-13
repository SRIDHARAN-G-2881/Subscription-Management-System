import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  features: [String],             // list of feature bullet points
  price: { type: Number, required: true },
  quotaGB: { type: Number, required: true },
  tier: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  imageUrl: { type: String }      // icon or image representing plan
}, { timestamps: true });

export default mongoose.model("Plan", planSchema);
