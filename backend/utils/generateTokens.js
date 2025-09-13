// utils/generateTokens.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET or JWT_REFRESH_SECRET is not set in .env');
}

// Now accept an object { userId, role }
export const generateAccessToken = ({ userId, role }) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = ({ userId, role }) => {
  return jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
