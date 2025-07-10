import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const BloodCamps: React.FC = () => {
  const { user } = useAuth();
  const { bloodCamps, addBloodCamp, registerForCamp } = useApp();
  const [showCampForm, setShowCampForm] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    slotsAvailable: 50,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCamp = {
      hospitalId: user?.id || '1',
      hospitalName: user?.name || 'Hospital Name',
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: {
        address: formData.location,
        city: 'Current City',
        state: 'Current State',
        latitude: 0,
        longitude: 0,
      },
      slotsAvailable: formData.slotsAvailable,
      slotsBooked: 0,
      registeredDonors: [],
      status: 'upcoming' as const,
    };

    addBloodCamp(newCamp);
    setShowCampForm(false);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      slotsAvailable: 50,
      description: '',
    });
  };

  const handleRegister = (campId: string) => {
    if (user?.id) {
      registerForCamp(campId, user.id);
    }
  };

  const isRegistered = (camp: any) => {
    return camp.registeredDonors.includes(user?.id || '');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredCamps = user?.role === 'hospital' 
    ? bloodCamps.filter(camp => camp.hospitalId === user.id)
    : bloodCamps;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blood Donation Camps</h2>
          <p className="text-gray-600">
            {user?.role === 'donor' && 'Find and register for blood donation camps in your area'}
            {user?.role === 'hospital' && 'Organize and manage blood donation camps'}
            {user?.role === 'admin' && 'Monitor and manage all blood donation camps'}
          </p>
        </div>
        {user?.role === 'hospital' && (
          <button
            onClick={() => setShowCampForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Schedule Camp</span>
          </button>
        )}
      </div>

      {/* Camp Form Modal */}
      {showCampForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Schedule Blood Camp</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Camp Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Community Blood Drive"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="9:00 AM - 5:00 PM"
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
                  placeholder="Complete address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Slots
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.slotsAvailable}
                  onChange={(e) => setFormData({ ...formData, slotsAvailable: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional details about the camp..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCampForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Schedule Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Camps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCamps.map((camp) => (
          <div key={camp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{camp.title}</h3>
                    <p className="text-sm text-gray-600">{camp.hospitalName}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(camp.status)}`}>
                  {camp.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {new Date(camp.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{camp.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{camp.location.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {camp.slotsBooked} / {camp.slotsAvailable} slots booked
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(camp.slotsBooked / camp.slotsAvailable) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {camp.slotsAvailable - camp.slotsBooked} slots remaining
                </p>
              </div>

              <div className="flex items-center justify-between">
                {user?.role === 'donor' && (
                  <button
                    onClick={() => handleRegister(camp.id)}
                    disabled={isRegistered(camp) || camp.slotsBooked >= camp.slotsAvailable}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isRegistered(camp)
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : camp.slotsBooked >= camp.slotsAvailable
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {isRegistered(camp) ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <span>Register</span>
                    )}
                  </button>
                )}
                {user?.role === 'hospital' && (
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Manage Camp
                  </button>
                )}
                <button
                  onClick={() => setSelectedCamp(selectedCamp === camp.id ? null : camp.id)}
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  {selectedCamp === camp.id ? 'Less' : 'More'}
                </button>
              </div>

              {selectedCamp === camp.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-2">Camp Details</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Organizer:</span> {camp.hospitalName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Registered Donors:</span> {camp.registeredDonors.length}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Status:</span> {camp.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      Join this camp to make a difference in your community. Every donation saves up to 3 lives!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCamps.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Blood Camps</h3>
          <p className="text-gray-600 mb-6">
            {user?.role === 'donor' && "No blood donation camps are currently scheduled in your area."}
            {user?.role === 'hospital' && "You haven't scheduled any blood donation camps yet."}
            {user?.role === 'admin' && "No blood donation camps are currently scheduled."}
          </p>
          {user?.role === 'hospital' && (
            <button
              onClick={() => setShowCampForm(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Schedule Your First Camp
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BloodCamps;