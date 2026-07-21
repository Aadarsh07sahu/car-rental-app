import express from 'express';
import { createBooking, getUserBookings, getOwnerBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect, isOwner } from '../middleware/auth.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, isOwner, getOwnerBookings);
bookingRouter.put('/cancel/:id', protect, cancelBooking);

export default bookingRouter;