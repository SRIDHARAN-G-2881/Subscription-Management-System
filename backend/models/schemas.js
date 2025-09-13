import mongoose from "mongoose";

// User Schema
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
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Plan Schema
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

const Plan = mongoose.model("Plan", planSchema);

// Subscription Schema
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

const Subscription = mongoose.model("Subscription", subscriptionSchema);

// Discount Schema
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

const Discount = mongoose.model("Discount", discountSchema);

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["reminder", "offer", "system"], default: "system" },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  actionUrl: { type: String },         // link target for notification
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

// Recommendation Schema
const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recommendedPlanId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  reason: { type: String },
  confidence: { type: Number }
}, { timestamps: true });

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

// AuditLog Schema
const auditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },  
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export {
  User,
  Plan,
  Subscription,
  Discount,
  Notification,
  Recommendation,
  AuditLog
};
