import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String },           // display headline
  description: { type: String },
  imageUrl: { type: String },         // optionally show banner
  discountPercent: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  conditions: {
    minTier: { type: Number },
    maxUsage: { type: Number }
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Discount", discountSchema);
