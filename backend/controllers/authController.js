// controllers/authController.js
import bcrypt from 'bcryptjs';
import passport from 'passport';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';

// ─────────────── REGISTER ───────────────
export const register = async (req, res, next) => {
  try {
  const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Force default role to 'staff' for manual/local signups regardless of client input
    const created = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'staff',
      authProvider: 'local'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: created._id,
        name: created.name,
        email: created.email,
        role: created.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────── LOGIN ───────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Check if user signed up with Google OAuth
    if (user.authProvider === 'google') {
      return res.status(401).json({ message: 'Please sign in with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Include role inside token payload
    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────── DASHBOARD ───────────────
export const dashboard = async (req, res) => {
  res.json({ message: `Welcome ${req.user.role} ${req.userId}` });
};

// ─────────────── GOOGLE OAUTH ───────────────
export const googleAuth = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ message: 'Google OAuth is not configured' });
  }
  return passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?googleAuth=error&message=Google OAuth is not configured`);
  }
  return passport.authenticate('google', { session: false }, async (err, user) => {
    try {
      if (err) {
        console.error('Google OAuth error:', err);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?googleAuth=error`);
      }
      
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?googleAuth=error`);
      }
      
      // Generate tokens for the user
      const accessToken = generateAccessToken({ userId: user._id, role: user.role });
      const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

      const isProd = process.env.NODE_ENV === 'production';

      // Set cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect to frontend with success message
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?googleAuth=success&role=${user.role}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?googleAuth=error`);
    }
  })(req, res, next);
};

// ─────────────── LOGOUT ───────────────
export const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};
