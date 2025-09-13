
import bcrypt from 'bcryptjs';
import userModel from '../models/User.js';


// ─────────────── REGISTER ───────────────
export const register = async (req, res) => {
  const { name, email, password ,role} = req.body;
  
  if (!name || !email || !password||!role) {
      return res.status(400).json({
          success: false,
          message: "Name, email,password and role are required"
      });
  }

  try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
          return res.status(400).json({
              success: false,
              message: "Account already exists"
          });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new userModel({
          name,
          email,
          passwordHash: hashedPassword,
          role,
          isEmailVerified: false
      });

      await user.save();


      return res.status(201).json({
          success: true,
          message: "Account registered successfully",
          user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role:user.role,
              isEmailVerified: user.isEmailVerified
          }
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: error.message
      });
  }
};
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  // Validate input
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Email, password and role are required",
    });
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account is not registered. Please register and sign up.",
      });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check role (make sure login role matches stored role)
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to login as this role",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
      
      return res.status(200).json({
          success: true,
          message: "Successfully logged out"
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "Couldn't logout"
      });
  }
};