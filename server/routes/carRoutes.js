import express from 'express';
import {
  addCar,
  getAllCars,
  getCarById,
  getMyCars,
  toggleCarAvailability,
  deleteCar,
} from '../controllers/carController.js';

import { protect, isOwner } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const carRouter = express.Router();

// Add Car
carRouter.post(
  '/add',
  protect,
  isOwner,
  upload.single('image'),
  addCar
);

// Get All Cars
carRouter.get('/all', getAllCars);

// Get Owner Cars
carRouter.get('/mycars', protect, isOwner, getMyCars);

// Toggle Availability
carRouter.put(
  '/toggle/:id',
  protect,
  isOwner,
  toggleCarAvailability
);

// Delete Car
carRouter.delete(
  '/delete/:id',
  protect,
  isOwner,
  deleteCar
);

// Get Single Car
carRouter.get('/:id', getCarById);

export default carRouter;