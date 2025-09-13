import dotenv from 'dotenv';
dotenv.config();
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './config/passport.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// CORS - allow credentials and origin from env (fallback)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// global error handler (after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
