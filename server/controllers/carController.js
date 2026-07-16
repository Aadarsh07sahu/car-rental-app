import Car from '../models/Car.js';
import cloudinary from '../configs/cloudinary.js';

// ADD CAR (sirf logged-in user/owner)
export const addCar = async (req, res) => {
  try {
    const { brand, model, year, category, seating_capacity, fuel_type, transmission, pricePerDay, location, description } = req.body;

    let imageUrl = req.body.image || '';

    // Agar file upload hui hai, to Cloudinary pe upload karo
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'drivein-india-cars' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const car = await Car.create({
      owner: req.user._id,
      brand,
      model,
      image: imageUrl,
      year,
      category,
      seating_capacity,
      fuel_type,
      transmission,
      pricePerDay,
      location,
      description,
    });

    res.status(201).json({ success: true, car });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL CARS (koi bhi dekh sakta hai, login zaroori nahi)
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    res.status(200).json({ success: true, cars });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MY CARS (owner ki apni add ki hui cars)
export const getMyCars = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id });
    res.status(200).json({ success: true, cars });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// TOGGLE AVAILABILITY (car ko available/unavailable karna)
export const toggleCarAvailability = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.status(200).json({ success: true, car });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE CAR BY ID
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.status(200).json({ success: true, car });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};