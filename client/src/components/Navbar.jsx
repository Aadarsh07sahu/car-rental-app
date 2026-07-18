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
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-md border-b border-gray-200">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🚗</span>

        <span className="text-xl font-bold text-gray-900">
          Drive<span className="text-blue-600">India</span>
        </span>
      </Link>

      {/* Navigation */}

      <div className="hidden md:flex items-center gap-10 text-sm font-medium">

        <Link
          to="/"
          className="hover:text-blue-600 transition"
        >
          Home
        </Link>

        <Link
          to="/cars"
          className="hover:text-blue-600 transition"
        >
          Cars
        </Link>

        {user && (
          <Link
            to="/my-bookings"
            className="hover:text-blue-600 transition"
          >
            My Bookings
          </Link>
        )}

        {user?.role === 'owner' && (
          <Link
            to="/dashboard"
            className="hover:text-blue-600 transition"
          >
            Dashboard
          </Link>
        )}

      </div>

      {/* Right Side */}

      {!user ? (
        <div className="flex items-center gap-3">

          <Link to="/login">
            <button className="px-4 py-2 hover:text-blue-600">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full">
              Sign Up
            </button>
          </Link>

        </div>
      ) : (

        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 border rounded-full px-3 py-2 hover:shadow"
          >

           <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
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

              <p className="text-sm font-semibold">

                {user.name}

              </p>

              <p className="text-xs text-gray-500">

                {user.role}

              </p>

            </div>

          </button>

          {open && (

            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border overflow-hidden">

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block px-5 py-3 hover:bg-gray-100"
              >
                👤 My Profile
              </Link>

              <Link
                to="/my-bookings"
                onClick={() => setOpen(false)}
                className="block px-5 py-3 hover:bg-gray-100"
              >
                📅 My Bookings
              </Link>

              {user.role === 'owner' && (

                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3 hover:bg-gray-100"
                >
                  🚗 Dashboard
                </Link>

              )}

              <hr />

              <button
                onClick={handleLogout}
                className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50"
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