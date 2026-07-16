import express from 'express';
import { createBooking, getUserBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.put('/cancel/:id', protect, cancelBooking);

export default bookingRouter;