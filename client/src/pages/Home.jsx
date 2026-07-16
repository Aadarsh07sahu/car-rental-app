import { Link } from 'react-router-dom';

function Home() {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { brand: 'Maruti Suzuki Swift', location: 'Mumbai', price: 1500, seats: 5 },
            { brand: 'Hyundai Creta', location: 'Delhi', price: 2800, seats: 5 },
            { brand: 'Toyota Innova', location: 'Bangalore', price: 3200, seats: 7 },
            { brand: 'Honda City', location: 'Pune', price: 2200, seats: 5 },
          ].map((car, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-40 bg-gray-100 flex items-center justify-center text-5xl">
                🚗
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{car.brand}</h3>
                <p className="text-sm text-gray-500 mt-1">{car.location} · {car.seats} Seats</p>
                <p className="mt-2 font-bold text-gray-900">₹{car.price.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500">/ day</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;