import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(`${API_URL}/cars/all`);
        setCars(res.data.cars);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="px-6 md:px-12 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">All Cars</h1>
      <p className="text-gray-500 mb-8">
        {loading ? 'Loading cars...' : `Choose from ${cars.length} cars available across India`}
      </p>

      <div className="flex flex-wrap gap-3 mb-8">
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
          <option>All Locations</option>
          <option>Mumbai</option>
          <option>Delhi</option>
          <option>Bangalore</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700">
          <option>All Categories</option>
          <option>Hatchback</option>
          <option>Sedan</option>
          <option>SUV</option>
          <option>MUV</option>
        </select>
      </div>

      {loading && (
        <p className="text-gray-400 text-center py-10">Loading cars...</p>
      )}

      {!loading && cars.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">🚗</p>
          <p className="text-gray-500">No cars available right now.</p>
        </div>
      )}

      {!loading && cars.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Link to={`/cars/${car._id}`} key={car._id} className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="h-44 bg-gray-100 flex items-center justify-center text-5xl overflow-hidden">
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
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{car.brand} {car.model}</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">{car.category}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{car.location} · {car.seating_capacity} Seats</p>
                <p className="mt-3 font-bold text-gray-900">₹{car.pricePerDay.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500">/ day</span></p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cars;