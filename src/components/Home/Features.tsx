import React from 'react';
import { Search, Clock, Shield, MapPin, Bell, Heart } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: 'Smart Matching',
      description: 'Advanced algorithms to find the best donor matches based on blood type, location, and availability.',
      color: 'bg-blue-500',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Real-Time Updates',
      description: 'Get instant notifications about blood requests, donation opportunities, and emergency alerts.',
      color: 'bg-green-500',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Verified Network',
      description: 'All donors and hospitals are verified for safety and authenticity through our rigorous screening process.',
      color: 'bg-purple-500',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Location-Based',
      description: 'Find donors and blood banks near you with our precise location-based search and mapping system.',
      color: 'bg-orange-500',
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: 'Emergency Alerts',
      description: 'Critical blood shortage alerts and emergency requests are prioritized and sent immediately.',
      color: 'bg-red-500',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Impact Tracking',
      description: 'Track your donation history and see the real impact of your contributions to the community.',
      color: 'bg-pink-500',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose LifeLink?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with compassionate care to create 
            the most efficient blood donation network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
                <div className={`${feature.color} p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of heroes who are already saving lives through blood donation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl">
                Become a Donor
              </button>
              <button className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-colors text-lg font-semibold">
                Request Blood
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;