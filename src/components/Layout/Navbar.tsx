import React, { useState } from 'react';
import { Menu, X, Heart, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      onAuthClick();
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">LifeLink</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-red-600 transition-colors">
              Home
            </a>
            <a href="#donate" className="text-gray-700 hover:text-red-600 transition-colors">
              Donate
            </a>
            <a href="#request" className="text-gray-700 hover:text-red-600 transition-colors">
              Request
            </a>
            <a href="#camps" className="text-gray-700 hover:text-red-600 transition-colors">
              Blood Camps
            </a>
            <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors">
              About
            </a>
          </div>

          {/* Desktop Auth & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b">
                          {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                        </div>
                        <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Profile
                        </a>
                        <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Settings
                        </a>
                        <button
                          onClick={handleAuthClick}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors">
                Home
              </a>
              <a href="#donate" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors">
                Donate
              </a>
              <a href="#request" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors">
                Request
              </a>
              <a href="#camps" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors">
                Blood Camps
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors">
                About
              </a>
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-2">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {user?.name} ({user?.role})
                  </div>
                  <a href="#profile" className="block px-3 py-2 text-gray-700 hover:text-red-600 transition-colors">
                    Profile
                  </a>
                  <button
                    onClick={handleAuthClick}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;