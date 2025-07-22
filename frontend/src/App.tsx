import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { AddVehicle } from './pages/AddVehicle';
import { SearchAndBook } from './pages/SearchAndBook';
import { BookingHistory } from './pages/BookingHistory';
import { Truck } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FleetLink</h1>
                  <p className="text-sm text-gray-500">Logistics Vehicle Booking</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/search" element={<SearchAndBook />} />
            <Route path="/bookings" element={<BookingHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;