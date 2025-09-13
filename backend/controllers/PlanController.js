import Plan from "../models/Plan.js";

export const createPlan = async (req, res) => {
  try {
    const { title, description, features, price, quotaGB, tier, isActive, imageUrl } = req.body;

    // Validate required fields
    if (!title || !price || !quotaGB || !tier) {
      return res.status(400).json({
        success: false,
        message: "Title, price, quotaGB, and tier are required"
      });
    }

    const newPlan = new Plan({
      title,
      description,
      features,
      price,
      quotaGB,
      tier,
      isActive,
      imageUrl
    });

    const savedPlan = await newPlan.save();

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      plan: savedPlan
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc   Get all plans
// @route  GET /api/plans
// @access Public (or User/Admin)
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    return res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update a plan
// @route  PUT /api/plans/:id
// @access Admin
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }
    return res.status(200).json({ success: true, message: "Plan updated", plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete a plan
// @route  DELETE /api/plans/:id
// @access Admin
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }
    return res.status(200).json({ success: true, message: "Plan deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
