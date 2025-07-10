import React, { useState } from 'react';
import { Plus, MapPin, Clock, AlertTriangle, Heart, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';

const BloodRequests: React.FC = () => {
  const { user } = useAuth();
  const { donationRequests, addDonationRequest, updateDonationRequest, searchDonors } = useApp();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    recipientName: '',
    bloodGroup: 'A+' as BloodGroup,
    unitsNeeded: 1,
    location: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'emergency',
    contactPhone: '',
    hospitalName: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest = {
      recipientId: user?.id || '1',
      recipientName: formData.recipientName,
      bloodGroup: formData.bloodGroup,
      unitsNeeded: formData.unitsNeeded,
      location: {
        address: formData.location,
        city: 'Current City',
        state: 'Current State',
        latitude: 0,
        longitude: 0,
      },
      urgency: formData.urgency,
      status: 'pending' as const,
      matchedDonors: [],
      hospitalId: user?.role === 'hospital' ? user.id : undefined,
    };

    addDonationRequest(newRequest);
    setShowRequestForm(false);
    setFormData({
      recipientName: '',
      bloodGroup: 'A+',
      unitsNeeded: 1,
      location: '',
      urgency: 'medium',
      contactPhone: '',
      hospitalName: '',
      notes: '',
    });
  };

  const handleMatchDonors = (requestId: string, bloodGroup: BloodGroup) => {
    const matchedDonors = searchDonors({ bloodGroup, available: true });
    updateDonationRequest(requestId, {
      matchedDonors: matchedDonors.map(d => d.id),
      status: matchedDonors.length > 0 ? 'matched' : 'pending',
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'matched': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredRequests = user?.role === 'recipient' 
    ? donationRequests.filter(req => req.recipientId === user.id)
    : donationRequests;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blood Requests</h2>
          <p className="text-gray-600">
            {user?.role === 'recipient' && 'Manage your blood requests and track their status'}
            {user?.role === 'donor' && 'View and respond to blood requests in your area'}
            {user?.role === 'hospital' && 'Manage blood requests from patients and recipients'}
            {user?.role === 'admin' && 'Monitor and manage all blood requests on the platform'}
          </p>
        </div>
        {(user?.role === 'recipient' || user?.role === 'hospital') && (
          <button
            onClick={() => setShowRequestForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Request</span>
          </button>
        )}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Create Blood Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Units Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Hospital address or location"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{request.recipientName}</h3>
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{request.location.address}</span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency.toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                  {request.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-600" />
                <span className="text-sm text-gray-600">
                  Blood Group: <span className="font-medium text-red-600">{request.bloodGroup}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600">
                  Units: <span className="font-medium">{request.unitsNeeded}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {request.matchedDonors.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Matched Donors: {request.matchedDonors.length}
                </p>
                <div className="flex space-x-2">
                  {request.matchedDonors.slice(0, 3).map((donorId, index) => (
                    <div key={index} className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                  ))}
                  {request.matchedDonors.length > 3 && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{request.matchedDonors.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {user?.role === 'donor' && request.status === 'pending' && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Respond to Request
                  </button>
                )}
                {(user?.role === 'hospital' || user?.role === 'admin') && (
                  <button
                    onClick={() => handleMatchDonors(request.id, request.bloodGroup)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Find Donors
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {selectedRequest === request.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {selectedRequest === request.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">{request.location.address}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Created:</span> {new Date(request.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span> {request.status}
                      </p>
                      {request.hospitalId && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Hospital:</span> Verified Medical Center
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Blood Requests</h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'recipient' && "You haven't created any blood requests yet."}
              {user?.role === 'donor' && "There are no active blood requests in your area."}
              {user?.role === 'hospital' && "No blood requests are currently pending."}
              {user?.role === 'admin' && "No blood requests are currently in the system."}
            </p>
            {(user?.role === 'recipient' || user?.role === 'hospital') && (
              <button
                onClick={() => setShowRequestForm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Create Your First Request
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodRequests;