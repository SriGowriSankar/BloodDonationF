import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Filter, Star, Clock, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BloodGroup, Donor } from '../../types';

const DonorSearch: React.FC = () => {
  const { user } = useAuth();
  const { donors, searchDonors, contactDonor } = useApp();
  const [searchFilters, setSearchFilters] = useState({
    bloodGroup: '' as BloodGroup | '',
    location: '',
    maxDistance: 50,
    available: true,
    lastDonationDays: 90,
  });
  const [searchResults, setSearchResults] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'lastDonation' | 'rating'>('distance');

  useEffect(() => {
    handleSearch();
  }, [searchFilters, sortBy]);

  const handleSearch = () => {
    const results = searchDonors({
      bloodGroup: searchFilters.bloodGroup || undefined,
      location: searchFilters.location,
      available: searchFilters.available,
      maxDistance: searchFilters.maxDistance,
      lastDonationDays: searchFilters.lastDonationDays,
    });

    // Sort results
    const sortedResults = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'lastDonation':
          const aDate = new Date(a.lastDonationDate || 0);
          const bDate = new Date(b.lastDonationDate || 0);
          return bDate.getTime() - aDate.getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setSearchResults(sortedResults);
  };

  const handleContactDonor = async (donorId: string, message: string) => {
    try {
      await contactDonor(donorId, {
        senderId: user?.id || '',
        senderName: user?.name || '',
        message,
        urgency: 'medium',
      });
      alert('Contact request sent successfully!');
    } catch (error) {
      alert('Failed to send contact request. Please try again.');
    }
  };

  const getBloodGroupCompatibility = (donorGroup: BloodGroup, recipientGroup: BloodGroup) => {
    const compatibility: Record<BloodGroup, BloodGroup[]> = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+'],
    };
    
    return compatibility[donorGroup]?.includes(recipientGroup) || false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Find Blood Donors</h2>
          <p className="text-gray-600">Search for verified blood donors in your area</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <select
              value={searchFilters.bloodGroup}
              onChange={(e) => setSearchFilters({ ...searchFilters, bloodGroup: e.target.value as BloodGroup })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any Blood Group</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={searchFilters.location}
              onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City or ZIP code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Distance (km)
            </label>
            <select
              value={searchFilters.maxDistance}
              onChange={(e) => setSearchFilters({ ...searchFilters, maxDistance: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="distance">Distance</option>
              <option value="lastDonation">Last Donation</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Only
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={searchFilters.available}
                  onChange={(e) => setSearchFilters({ ...searchFilters, available: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Show only available donors</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Donation (days ago)
              </label>
              <select
                value={searchFilters.lastDonationDays}
                onChange={(e) => setSearchFilters({ ...searchFilters, lastDonationDays: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>6 months</option>
                <option value={365}>1 year</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Results ({searchResults.length} donors found)
            </h3>
            <div className="text-sm text-gray-600">
              Showing donors within {searchFilters.maxDistance}km
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {searchResults.map((donor) => (
            <div key={donor.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{donor.name}</h4>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                        {donor.bloodGroup}
                      </span>
                      {donor.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          {donor.location.city}, {donor.location.state}
                          {donor.distance && ` (${donor.distance}km away)`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          Last donation: {donor.lastDonationDate 
                            ? new Date(donor.lastDonationDate).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">
                          Rating: {donor.rating || 'N/A'}/5
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        donor.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {donor.available ? 'Available' : 'Not Available'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {donor.donationHistory.length} donations completed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedDonor(selectedDonor === donor.id ? null : donor.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {selectedDonor === donor.id ? 'Hide Details' : 'View Details'}
                  </button>
                  {donor.available && (
                    <button
                      onClick={() => {
                        const message = prompt('Enter your message to the donor:');
                        if (message) {
                          handleContactDonor(donor.id, message);
                        }
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Contact Donor
                    </button>
                  )}
                </div>
              </div>

              {selectedDonor === donor.id && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Donor Information</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Age:</span>
                          <span className="text-sm font-medium">{donor.age} years</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Gender:</span>
                          <span className="text-sm font-medium capitalize">{donor.gender}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">{donor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">{donor.email}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Donation History</h5>
                      <div className="space-y-2">
                        {donor.donationHistory.slice(0, 3).map((donation, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {new Date(donation.date).toLocaleDateString()} - {donation.units} unit(s)
                          </div>
                        ))}
                        {donor.donationHistory.length === 0 && (
                          <div className="text-sm text-gray-500">No previous donations</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {donor.medicalConditions && donor.medicalConditions.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Medical Notes</h5>
                      <div className="text-sm text-gray-600">
                        {donor.medicalConditions.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {searchResults.length === 0 && (
            <div className="p-12 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Donors Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or expanding the search radius.
              </p>
              <button
                onClick={() => setSearchFilters({
                  bloodGroup: '',
                  location: '',
                  maxDistance: 100,
                  available: true,
                  lastDonationDays: 365,
                })}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorSearch;