// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy (only if credentials are provided)
// Parse admin emails from env (comma-separated)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with this email but different auth provider
      const email = profile.emails[0].value.toLowerCase();
      user = await User.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.avatar = profile.photos[0]?.value;
        user.authProvider = 'google';
        // If email is in ADMIN_EMAILS, promote to admin
        if (ADMIN_EMAILS.includes(email)) {
          user.role = 'admin';
        }
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      user = await User.create({
        name: profile.displayName,
        email,
        googleId: profile.id,
        avatar: profile.photos[0]?.value,
        authProvider: 'google',
        role: ADMIN_EMAILS.includes(email) ? 'admin' : 'staff' // Role based on ADMIN_EMAILS
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
} else {
  console.log('⚠️  Google OAuth credentials not found. Google authentication will be disabled.');
  console.log('   To enable Google OAuth, add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file');
}

export default passport;
