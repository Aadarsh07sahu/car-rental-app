import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [booking, setBooking] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const days = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  };

  const totalDays = calculateDays();
  const estimatedTotal = car && pickupDate && returnDate ? totalDays * car.pricePerDay : 0;

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`${API_URL}/cars/${id}`);
        setCar(res.data.car);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book a car');
      navigate('/login');
      return;
    }

    setBooking(true);
    try {
      await axios.post(
        `${API_URL}/bookings/create`,
        { carId: id, pickupDate, returnDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking confirmed!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <p className="text-center py-20 text-gray-400">Loading car details...</p>;
  }

  if (!car) {
    return <p className="text-center py-20 text-gray-500">Car not found.</p>;
  }

  return (
    <div className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
      <Link to="/cars" className="text-sm text-gray-500 hover:text-blue-600">← Back to Cars</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        <div>
         <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-7xl overflow-hidden">
 {car.image ? (
  <img
    src={car.image}
    alt={`${car.brand} ${car.model}`}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.parentElement.innerHTML = '🚗';
      e.target.parentElement.classList.add('text-5xl');
    }}
  />
) : (
  '🚗'
)}
</div>

          <h1 className="text-2xl font-bold text-gray-900 mt-6">{car.brand} {car.model}</h1>
          <p className="text-gray-500">{car.location} · {car.year}</p>

          <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
            <div className="border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-gray-400">Category</p>
              <p className="font-medium text-gray-900">{car.category}</p>
            </div>
            <div className="border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-gray-400">Seats</p>
              <p className="font-medium text-gray-900">{car.seating_capacity}</p>
            </div>
            <div className="border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-gray-400">Fuel Type</p>
              <p className="font-medium text-gray-900">{car.fuel_type}</p>
            </div>
            <div className="border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-gray-400">Transmission</p>
              <p className="font-medium text-gray-900">{car.transmission}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-400 text-sm mb-1">About this car</p>
            <p className="text-gray-700">{car.description}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-6 h-fit">
          <p className="text-2xl font-bold text-gray-900">₹{car.pricePerDay.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500">/ day</span></p>

          <form onSubmit={handleBooking} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                min={today}
                onChange={(e) => setPickupDate(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Return Date</label>
              <input
                type="date"
                value={returnDate}
                min={pickupDate || today}
                onChange={(e) => setReturnDate(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {pickupDate && returnDate && (
              <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{totalDays} {totalDays === 1 ? 'day' : 'days'}</p>
                  <p className="text-xs text-gray-400">₹{car.pricePerDay.toLocaleString('en-IN')} × {totalDays}</p>
                </div>
                <p className="text-xl font-bold text-gray-900">₹{estimatedTotal.toLocaleString('en-IN')}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={booking}
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60"
            >
              {booking ? 'Booking...' : 'Book Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;