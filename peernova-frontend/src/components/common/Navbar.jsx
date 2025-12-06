import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  return (
    <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">Peer</span>
            <span className="text-gray-400">Nova</span>
          </h1>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-white border-white'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-white border-white'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
                  }`
                }
              >
                Login
              </NavLink>
              <Link to="/signup">
                <button className="btn-primary text-sm">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-white border-white'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/study-groups"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-white border-white'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
                  }`
                }
              >
                Study Groups
              </NavLink>
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-white border-white'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
                  }`
                }
              >
                Resources
              </NavLink>

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full bg-[#111111] border border-[#333333] px-3 py-1.5 text-sm text-white hover:border-[#666666] transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
                    {getInitials(user?.name || user?.fullName || user?.email)}
                  </div>
                  <span className="text-xs text-gray-300 max-w-[120px] truncate">
                    {user?.name || user?.fullName || user?.email}
                  </span>
                  <ChevronDownIcon className="h-3 w-3 text-gray-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#111111] border border-[#1a1a1a] shadow-lg py-1 text-sm">
                    <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-3 py-2 text-gray-200 hover:bg-[#1a1a1a]"
                    >
                      View Profile
                    </button>
                    <div className="my-1 border-t border-[#1a1a1a]" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-gray-300 hover:bg-[#1a1a1a]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          {!isAuthenticated ? (
            <Link to="/signup">
              <button className="btn-primary text-xs">
                Sign Up
              </button>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-[#111111] hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Toggle navigation</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu for authenticated users */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block px-2 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-white text-black' : 'text-gray-300 hover:bg-[#111111]'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/study-groups"
              className={({ isActive }) =>
                `block px-2 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-white text-black' : 'text-gray-300 hover:bg-[#111111]'
                }`
              }
            >
              Study Groups
            </NavLink>
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `block px-2 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-white text-black' : 'text-gray-300 hover:bg-[#111111]'
                }`
              }
            >
              Resources
            </NavLink>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="block w-full text-left px-2 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#111111]"
            >
              View Profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full text-left px-2 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#111111]"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
