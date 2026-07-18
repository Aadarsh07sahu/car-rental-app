import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AutocompleteInput from '../components/AutocompleteInput';
import { carBrands, brandNames } from '../data/carData';
import { API_URL } from '../config';

function OwnerDashboard() {
  const { token, user } = useAuth();
  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    brand: '', model: '', year: '', category: 'Hatchback',
    seating_capacity: '', fuel_type: 'Petrol', transmission: 'Manual',
    pricePerDay: '', location: '', description: '',
  });

  const availableModels = form.brand && carBrands[form.brand] ? carBrands[form.brand] : [];

  const fetchMyCars = async () => {
    try {
      const res = await axios.get(`${API_URL}/cars/mycars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyCars(res.data.cars);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMyCars();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBrandChange = (value) => {
    setForm({ ...form, brand: value, model: '' });
  };

  const handleModelChange = (value) => {
    setForm({ ...form, model: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error('Please select an image for the car');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('image', imageFile);

      await axios.post(`${API_URL}/cars/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Car added successfully!');
      setForm({
        brand: '', model: '', year: '', category: 'Hatchback',
        seating_capacity: '', fuel_type: 'Petrol', transmission: 'Manual',
        pricePerDay: '', location: '', description: '',
      });
      setImageFile(null);
      fetchMyCars();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add car');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (carId) => {
    try {
      await axios.put(`${API_URL}/cars/toggle/${carId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Availability updated');
      fetchMyCars();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (carId) => {
    const confirmed = window.confirm('Are you sure you want to delete this car?');
    if (!confirmed) {
      return;
    }

    setDeletingId(carId);
    try {
      await axios.delete(`${API_URL}/cars/delete/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Car deleted successfully');
      fetchMyCars();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete car');
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return <p className="text-center py-20 text-gray-500">Please login to access the dashboard.</p>;
  }

  if (user.role !== 'owner') {
    return <p className="text-center py-20 text-gray-500">Access denied. This page is for car owners only.</p>;
  }

  return (
    <div className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Owner Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Car</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <AutocompleteInput
                value={form.brand}
                onChange={handleBrandChange}
                options={brandNames}
                placeholder="Brand (e.g. Tata)"
              />
              <AutocompleteInput
                value={form.model}
                onChange={handleModelChange}
                options={availableModels}
                placeholder={form.brand ? 'Model (e.g. Nexon)' : 'Select brand first'}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Car Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="Year" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location (e.g. Mumbai)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select name="category" value={form.category} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Hatchback</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>MUV</option>
              </select>
              <input name="seating_capacity" type="number" value={form.seating_capacity} onChange={handleChange} placeholder="Seats" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>CNG</option>
              </select>
              <select name="transmission" value={form.transmission} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </div>

            <input name="pricePerDay" type="number" value={form.pricePerDay} onChange={handleChange} placeholder="Price per day (₹)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />

            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description" rows="3" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" required />

            <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60">
              {submitting ? 'Adding...' : 'Add Car'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Cars</h2>
          {loading && <p className="text-gray-400">Loading...</p>}
          {!loading && myCars.length === 0 && <p className="text-gray-500">You haven't added any car yet.</p>}

          <div className="space-y-3">
            {myCars.map((car) => (
              <div key={car._id} className="border border-gray-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-2xl">
                    {car.image ? <img src={car.image} alt={car.model} className="w-full h-full object-cover" /> : '🚗'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{car.brand} {car.model}</p>
                    <p className="text-xs text-gray-500">₹{car.pricePerDay.toLocaleString('en-IN')}/day · {car.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(car._id)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium ${car.isAvailable ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {car.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    disabled={deletingId === car._id}
                    className="text-xs px-3 py-1.5 rounded-full font-medium bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 disabled:opacity-60"
                  >
                    {deletingId === car._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;