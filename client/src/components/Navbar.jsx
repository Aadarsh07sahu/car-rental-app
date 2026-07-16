import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🚗</span>
        <span className="text-xl font-bold text-gray-900 tracking-tight">
          Drive<span className="text-blue-600">India</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10 text-gray-600 font-medium text-sm">
        <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Home</Link>
        <Link to="/cars" className="hover:text-blue-600 transition-colors duration-200">Cars</Link>
        {user && (
          <Link to="/my-bookings" className="hover:text-blue-600 transition-colors duration-200">My Bookings</Link>
        )}
        {user?.role === 'owner' && (
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors duration-200">Dashboard</Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-700 font-medium">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-700 font-medium text-sm px-4 py-2 hover:text-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="text-gray-700 font-medium text-sm px-4 py-2 hover:text-blue-600 transition-colors duration-200">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-blue-600 text-white font-medium text-sm px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-sm">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;