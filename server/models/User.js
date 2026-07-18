import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Existing Fields
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['user', 'owner'],
      default: 'user',
    },

    // ===== Profile Fields =====

    firstName: {
      type: String,
      default: '',
      trim: true,
    },

    lastName: {
      type: String,
      default: '',
      trim: true,
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;