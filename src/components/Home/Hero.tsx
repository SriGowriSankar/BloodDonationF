import React from 'react';
import { Heart, Users, MapPin, Calendar } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section id="home" className="bg-gradient-to-br from-red-50 to-red-100 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Save Lives with
              <span className="text-red-600 block">Blood Donation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with local blood donors and recipients in your community. 
              Every donation counts, every life matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={onGetStarted}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Today
              </button>
              <button className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-colors text-lg font-semibold">
                Learn More
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl shadow-md mb-3">
                  <Users className="h-8 w-8 text-red-600 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Donors</div>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl shadow-md mb-3">
                  <Heart className="h-8 w-8 text-red-600 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Lives Saved</div>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl shadow-md mb-3">
                  <MapPin className="h-8 w-8 text-red-600 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Hospitals</div>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl shadow-md mb-3">
                  <Calendar className="h-8 w-8 text-red-600 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Camps</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="bg-red-600 p-4 rounded-full w-20 h-20 mx-auto mb-4">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Blood Request</h3>
                <p className="text-gray-600">Find donors in your area instantly</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <select className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option>Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Units"
                    className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Your Location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                  Find Donors
                </button>
              </div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-6 -right-6 bg-green-500 text-white p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm">Available</div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-500 text-white p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm">Verified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;