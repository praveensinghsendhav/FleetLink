import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Search, Calendar } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/add-vehicle', label: 'Add Vehicle', icon: Plus },
    { path: '/search', label: 'Search & Book', icon: Search },
    { path: '/bookings', label: 'Booking History', icon: Calendar },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`inline-flex items-center px-1 pt-1 pb-4 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}