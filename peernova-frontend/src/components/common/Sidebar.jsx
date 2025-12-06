import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BookOpenIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/study-groups', label: 'Study Groups', icon: UserGroupIcon },
  { to: '/resources', label: 'Resources', icon: BookOpenIcon },
  { to: '/profile', label: 'Profile', icon: UserIcon },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay sidebar */}
      <div className="lg:hidden">
        {/* Trigger is handled by Navbar's mobile menu; Sidebar just renders as static in layout for desktop.
            For mobile we mirror the same structure but rely on a parent to control visibility if needed later. */}
      </div>

      {/* Desktop / large screens sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#111111] border-r border-[#1a1a1a] h-[calc(100vh-56px)] sticky top-14 transition-all duration-300 ease-out ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header / logo area */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#1a1a1a]">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-semibold text-white hover:text-gray-300 transition-colors"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black text-sm font-bold">
              PN
            </span>
            {isOpen && (
              <span className="whitespace-nowrap">
                Peer<span className="text-gray-400">Nova</span>
              </span>
            )}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
                }`
              }
            >
                <IconComponent className="h-5 w-5" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 py-3 border-t border-[#1a1a1a]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;


