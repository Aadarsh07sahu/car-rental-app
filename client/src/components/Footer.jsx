import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🚗</span>
            <span className="text-xl font-bold text-white tracking-tight">
              Drive<span className="text-orange-500">India</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Find, book and drive your dream car. The easiest way to rent or list a car across India.
          </p>
          <p className="text-sm text-white font-medium mt-4">Built by Aadarsh Sahu</p>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <a href="https://www.linkedin.com/in/aadarsh-sahu-b51856280/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors duration-200">
  LinkedIn
</a>
            <span className="text-gray-600">|</span>
            <a href="https://github.com/Aadarsh07sahu/car-rental-app" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors duration-200">
              GitHub
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-orange-400 transition-colors duration-200">Home</Link></li>
            <li><Link to="/cars" className="hover:text-orange-400 transition-colors duration-200">Browse Cars</Link></li>
            <li><Link to="/my-bookings" className="hover:text-orange-400 transition-colors duration-200">My Bookings</Link></li>
          </ul>
        </div>

        {/* Get Started */}
        <div>
          <h3 className="text-white font-semibold mb-4">Get Started</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-orange-400 transition-colors duration-200">Create Account</Link></li>
            <li><Link to="/login" className="hover:text-orange-400 transition-colors duration-200">Login</Link></li>
            <li>
              <Link to="/cars" className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200">
                Explore Cars →
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} DriveIndia. All Rights Reserved.</p>
          <p>Built with the MongoDB | Express | React | Node.js | Cloudinary | Vercel | Render</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;