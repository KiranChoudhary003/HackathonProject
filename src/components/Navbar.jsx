import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Plus, Heart, LogOut } from 'lucide-react';
import GoogleAuth from './GoogleAuth';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Heart className="text-blue-600" size={28} />
            <span className="font-bold text-xl text-gray-800">HealthCare</span>
          </div>

          <div className="flex gap-1 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Home size={18} />
              <span className="font-medium">Home</span>
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <LayoutDashboard size={18} />
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink
              to="/create"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Plus size={18} />
              <span className="font-medium">Create</span>
            </NavLink>

            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Heart size={18} />
              <span className="font-medium">Hospitals</span>
            </NavLink>

            {!isAuthenticated && (
              <div className="ml-2">
                <GoogleAuth />
              </div>
            )}

            {isAuthenticated && (
              <button
                onClick={logout}
                className="ml-2 flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} />
                <span className="text-sm font-medium hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
