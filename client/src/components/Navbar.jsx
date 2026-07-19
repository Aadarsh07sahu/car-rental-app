import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🚗</span>

        <span className="text-xl font-bold text-gray-900 tracking-tight">
          Drive<span className="text-orange-500">India</span>
        </span>
      </Link>

      {/* Navigation */}

      <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-600">

        <Link
          to="/"
          className="hover:text-orange-500 transition-colors duration-200"
        >
          Home
        </Link>

        <Link
          to="/cars"
          className="hover:text-orange-500 transition-colors duration-200"
        >
          Cars
        </Link>

        {user && (
          <Link
            to="/my-bookings"
            className="hover:text-orange-500 transition-colors duration-200"
          >
            My Bookings
          </Link>
        )}

        {user?.role === 'owner' && (
          <Link
            to="/dashboard"
            className="hover:text-orange-500 transition-colors duration-200"
          >
            Dashboard
          </Link>
        )}

      </div>

      {/* Right Side */}

      {!user ? (
        <div className="flex items-center gap-3">

          <Link to="/login">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors duration-200">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
              Sign Up
            </button>
          </Link>

        </div>
      ) : (

        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-2 hover:shadow-md hover:border-orange-200 transition-all duration-200"
          >

           <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center">
  {user.profileImage ? (
    <img
      src={user.profileImage}
      alt={user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-white font-bold">
      {user.name?.charAt(0).toUpperCase()}
    </span>
  )}
</div>

            <div className="hidden md:block text-left">

              <p className="text-sm font-semibold text-gray-900">

                {user.name}

              </p>

              <p className="text-xs text-gray-500">

                {user.role}

              </p>

            </div>

          </button>

          {open && (

            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block px-5 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-150"
              >
                👤 My Profile
              </Link>

              <Link
                to="/my-bookings"
                onClick={() => setOpen(false)}
                className="block px-5 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-150"
              >
                📅 My Bookings
              </Link>

              {user.role === 'owner' && (

                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-150"
                >
                  🚗 Dashboard
                </Link>

              )}

              <hr className="border-gray-100" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                Logout
              </button>

            </div>

          )}

        </div>

      )}

    </nav>
  );
}

export default Navbar;