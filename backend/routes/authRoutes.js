import express from 'express';
import { register, login, logout } from '../controllers/authController.js';


const authroute = express.Router();

authroute.post('/register',register);
authroute.post('/login',login);
authroute.post('/logout',logout);   
export default authroute;


