import React, { useState } from 'react';
import { Truck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { vehicleApi } from '../services/api';

interface FormData {
  name: string;
  capacityKg: number;
  tyres: number;
}

interface FormErrors {
  name?: string;
  capacityKg?: string;
  tyres?: string;
}

export function AddVehicle() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    capacityKg: 0,
    tyres: 4,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vehicle name is required';
    }

    if (!formData.capacityKg || formData.capacityKg <= 0) {
      newErrors.capacityKg = 'Capacity must be greater than 0';
    }

    if (!formData.tyres || formData.tyres <= 0) {
      newErrors.tyres = 'Number of tyres must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      await vehicleApi.create(formData);
      setStatus('success');
      setMessage('Vehicle added successfully!');
      setFormData({ name: '', capacityKg: 0, tyres: 4 });
      setErrors({});
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'name' ? e.target.value : Number(e.target.value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add New Vehicle</h2>
              <p className="text-sm text-gray-600">Add a vehicle to your fleet</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {status !== 'idle' && (
            <div className={`p-4 rounded-lg flex items-center space-x-3 ${
              status === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange('name')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter vehicle name (e.g., Truck Alpha)"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="capacityKg" className="block text-sm font-medium text-gray-700 mb-2">
              Capacity (KG)
            </label>
            <input
              type="number"
              id="capacityKg"
              value={formData.capacityKg || ''}
              onChange={handleInputChange('capacityKg')}
              min="1"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.capacityKg ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter capacity in kilograms"
            />
            {errors.capacityKg && (
              <p className="mt-1 text-sm text-red-600">{errors.capacityKg}</p>
            )}
          </div>

          <div>
            <label htmlFor="tyres" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Tyres
            </label>
            <input
              type="number"
              id="tyres"
              value={formData.tyres || ''}
              onChange={handleInputChange('tyres')}
              min="2"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.tyres ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter number of tyres"
            />
            {errors.tyres && (
              <p className="mt-1 text-sm text-red-600">{errors.tyres}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isLoading ? 'Adding Vehicle...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}