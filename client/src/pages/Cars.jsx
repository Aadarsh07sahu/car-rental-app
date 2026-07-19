import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

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

  // Unique locations from database
  const locations = [
    'All Locations',
    ...new Set(cars.map((car) => car.location)),
  ];

  // Filter cars
  const filteredCars = cars.filter((car) => {
    const locationMatch =
      selectedLocation === 'All Locations' ||
      car.location === selectedLocation;

    const categoryMatch =
      selectedCategory === 'All Categories' ||
      car.category === selectedCategory;

    return locationMatch && categoryMatch;
  });

  return (
    <div className="px-6 md:px-12 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
        All Cars
      </h1>

      <p className="text-gray-500 mb-8">
        {loading
          ? 'Loading cars...'
          : `Choose from ${filteredCars.length} cars available across India`}
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow duration-200"
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow duration-200"
        >
          <option>All Categories</option>
          <option>Hatchback</option>
          <option>Sedan</option>
          <option>SUV</option>
          <option>MUV</option>
        </select>

        <button
          onClick={() => {
            setSelectedLocation('All Locations');
            setSelectedCategory('All Categories');
          }}
          className="border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-200"
        >
          Reset Filters
        </button>
      </div>

      {loading && (
        <p className="text-gray-400 text-center py-10">
          Loading cars...
        </p>
      )}

      {!loading && filteredCars.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">🚗</p>
          <p className="text-gray-500">
            No cars found for selected filters.
          </p>
        </div>
      )}

      {!loading && filteredCars.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Link
              key={car._id}
              to={`/cars/${car._id}`}
              className="block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
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
                  <h3 className="font-semibold text-gray-900">
                    {car.brand} {car.model}
                  </h3>

                  <span className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-medium">
                    {car.category}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {car.location} · {car.seating_capacity} Seats
                </p>

                <p className="mt-3 font-bold text-gray-900">
                  ₹{car.pricePerDay.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-500">
                    {' '}
                    / day
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cars;