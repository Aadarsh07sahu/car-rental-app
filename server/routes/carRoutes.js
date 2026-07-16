
import express from 'express';
import { addCar, getAllCars, getCarById, getMyCars, toggleCarAvailability } from '../controllers/carController.js';
import { protect, isOwner } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const carRouter = express.Router();

carRouter.post('/add', protect, isOwner, upload.single('image'), addCar);
carRouter.get('/all', getAllCars);
carRouter.get('/mycars', protect, isOwner, getMyCars);
carRouter.put('/toggle/:id', protect, isOwner, toggleCarAvailability);
carRouter.get('/:id', getCarById);

export default carRouter;