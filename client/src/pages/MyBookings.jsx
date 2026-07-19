import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

function MyBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const handleCancel = async (bookingId) => {
    try {
      await axios.put(
        `${API_URL}/bookings/cancel/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const statusColor = {
    pending: 'bg-yellow-50 text-yellow-600',
    confirmed: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-600',
    completed: 'bg-orange-50 text-orange-600',
  };

  if (!token) {
    return <p className="text-center py-20 text-gray-500">Please login to view your bookings.</p>;
  }

  return (
    <div className="px-6 md:px-12 py-10 max-w-3xl mx-auto bg-gray-50 min-h-[80vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {loading && <p className="text-gray-400 text-center py-10">Loading bookings...</p>}

      {!loading && bookings.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 px-6">
          <p className="text-5xl mb-3">📅</p>
          <p className="text-gray-500 font-medium">You haven't booked any car yet.</p>
          <p className="text-sm text-gray-400 mt-1">Explore our collection and book your first ride.</p>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-16 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center text-3xl shrink-0">
                {b.car?.image ? (
                  <img src={b.car.image} alt={b.car.model} className="w-full h-full object-cover" />
                ) : (
                  '🚗'
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{b.car?.brand} {b.car?.model}</p>
                <p className="text-sm text-gray-500">
                  {new Date(b.pickupDate).toLocaleDateString('en-IN')} - {new Date(b.returnDate).toLocaleDateString('en-IN')}
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">₹{b.totalPrice.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor[b.status]}`}>
                {b.status}
              </span>
              {b.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancel(b._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;