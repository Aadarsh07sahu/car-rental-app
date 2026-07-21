import express from 'express';
import { createBooking, getUserBookings, getOwnerBookings, cancelBooking, acceptBooking, rejectBooking } from '../controllers/bookingController.js';
import { protect, isOwner } from '../middleware/auth.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, isOwner, getOwnerBookings);
bookingRouter.put('/cancel/:id', protect, cancelBooking);
bookingRouter.put('/accept/:id', protect, isOwner, acceptBooking);
bookingRouter.put('/reject/:id', protect, isOwner, rejectBooking);

export default bookingRouter;