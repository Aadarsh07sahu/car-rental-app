import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

// Helper: check karo car available hai in dates ke liye
const isCarAvailable = async (carId, pickupDate, returnDate) => {
  const overlappingBookings = await Booking.find({
    car: carId,
    status: { $ne: 'cancelled' },
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });
  return overlappingBookings.length === 0;
};

// CREATE BOOKING (logged-in user)
export const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    // Pickup date aaj ya future mein honi chahiye
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);

    if (pickup < today) {
      return res.status(400).json({ success: false, message: 'Pickup date cannot be in the past' });
    }

    // Return date, pickup date se pehle nahi honi chahiye
    if (returnD < pickup) {
      return res.status(400).json({ success: false, message: 'Return date cannot be before pickup date' });
    }

    const available = await isCarAvailable(carId, pickupDate, returnDate);
    if (!available) {
      return res.status(400).json({ success: false, message: 'Car is not available for these dates' });
    }

    // Total din calculate karo (minimum 1 din charge hoga, chahe same-day booking ho)
    const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)));
    const totalPrice = days * car.pricePerDay;

    const booking = await Booking.create({
      car: carId,
      user: req.user._id,
      owner: car.owner,
      pickupDate,
      returnDate,
      totalPrice,
    });

    res.status(201).json({ success: true, booking });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MY BOOKINGS (logged-in user)
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CANCEL BOOKING (logged-in user)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled', booking });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};