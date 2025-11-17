import { Link, useLocation } from 'react-router-dom';

function Navbar({ isAuthenticated = false, onLogout }) {
  const location = useLocation();

  return (
    <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">Peer</span>
            <span className="text-gray-400">Nova</span>
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/login'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </Link>
              <Link to="/signup">
                <button className="btn-primary text-sm">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <button onClick={onLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {!isAuthenticated ? (
            <Link to="/signup">
              <button className="btn-primary text-xs">
                Sign Up
              </button>
            </Link>
          ) : (
            <button onClick={onLogout} className="btn-secondary text-xs">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
