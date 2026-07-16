import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const res = await axios.get(`${API_URL}/cars/all`);
        setFeaturedCars(res.data.cars.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedCars();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-white px-6 md:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Find, Book & Drive Your Dream Car
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Best cars, best prices, across every major Indian city.
          </p>
          <Link to="/cars">
            <button className="mt-8 bg-blue-600 text-white font-medium px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-sm">
              Explore Cars
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="px-6 md:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Cars</h2>
          <Link to="/cars" className="text-blue-600 font-medium text-sm hover:underline">
            View All →
          </Link>
        </div>

        {loading && (
          <p className="text-gray-400 text-center py-10">Loading cars...</p>
        )}

        {!loading && featuredCars.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-2">🚗</p>
            <p className="text-gray-500">No cars available right now.</p>
          </div>
        )}

        {!loading && featuredCars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <Link
                to={`/cars/${car._id}`}
                key={car._id}
                className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center text-5xl overflow-hidden">
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
                  <h3 className="font-semibold text-gray-900">{car.brand} {car.model}</h3>
                  <p className="text-sm text-gray-500 mt-1">{car.location} · {car.seating_capacity} Seats</p>
                  <p className="mt-2 font-bold text-gray-900">₹{car.pricePerDay.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500">/ day</span></p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;