import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/userController.js';

import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const userRouter = express.Router();

// Authentication
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Profile
userRouter.get('/profile', protect, getProfile);
userRouter.put(
  '/profile',
  protect,
  upload.single('profileImage'),
  updateProfile
);
userRouter.put(
  '/change-password',
  protect,
  changePassword
);

export default userRouter;