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
      <section className="relative bg-white px-6 md:px-12 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Find, Book & Drive Your <span className="text-orange-500">Dream Car</span>
            </h1>
            <p className="mt-5 text-gray-500 text-lg">
              Best cars, best prices, across every major Indian city.
            </p>
            <Link to="/cars">
              <button className="mt-8 bg-orange-500 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Explore Cars
              </button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-orange-100 rounded-[2.5rem] rotate-2 scale-95"></div>
            <div className="relative w-full h-72 md:h-96 rounded-[2.5rem] shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1735620731955-b047a7122892?auto=format&fit=crop&w=1200&q=80"
                alt="Premium SUV"
                className="w-full h-full object-cover object-[center_60%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="px-6 md:px-12 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Cars</h2>
            <Link to="/cars" className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors duration-200">
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
                  className="block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
        </div>
      </section>
    </div>
  );
}

export default Home;