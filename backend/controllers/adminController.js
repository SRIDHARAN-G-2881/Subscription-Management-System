import User from '../models/User.js';
import AdminAction from '../models/AdminAction.js';

// Promote a user to admin by email or id (kept for backwards-compat)
export const promoteUser = async (req, res, next) => {
  try {
    const { email, userId } = req.body;
    if (!email && !userId) return res.status(400).json({ message: 'Provide email or userId' });

    const query = email ? { email: email.toLowerCase() } : { _id: userId };
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') return res.status(200).json({ message: 'User already admin' });

    const oldRole = user.role;
    user.role = 'admin';
    await user.save();

    // audit
    await AdminAction.create({
      actorId: req.userId,
      actorEmail: req.user?.email || '',
      action: 'role-change',
      targetUserId: user._id,
      targetEmail: user.email,
      oldRole,
      newRole: user.role
    });

    // return minimal user info
    return res.json({ message: 'User promoted to admin', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

// List users with simple pagination and search
export const listUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const q = (req.query.q || '').trim();

    const filter = {};
    if (q) {
      filter.$or = [
        { email: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name email role authProvider createdAt');

    return res.json({ users, meta: { page, limit, total } });
  } catch (err) {
    next(err);
  }
};

// Update user's role (admin-only)
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const allowed = ['admin', 'staff'];
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent removing the last admin
    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) return res.status(403).json({ message: 'Cannot remove the last admin' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // audit
    await AdminAction.create({
      actorId: req.userId,
      actorEmail: req.user?.email || '',
      action: 'role-change',
      targetUserId: user._id,
      targetEmail: user.email,
      oldRole,
      newRole: user.role
    });

    return res.json({ message: 'Role updated', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

export default { promoteUser, listUsers, updateUserRole };
