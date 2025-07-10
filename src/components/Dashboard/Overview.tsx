import React from 'react';
import { Heart, Users, Calendar, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const Overview: React.FC = () => {
  const { user } = useAuth();
  const { donationRequests, bloodCamps, donors } = useApp();

  const getDashboardStats = () => {
    switch (user?.role) {
      case 'donor':
        return [
          { label: 'Total Donations', value: '12', icon: Heart, color: 'bg-red-500' },
          { label: 'Lives Saved', value: '36', icon: Users, color: 'bg-green-500' },
          { label: 'Upcoming Camps', value: '3', icon: Calendar, color: 'bg-blue-500' },
          { label: 'Active Requests', value: donationRequests.length, icon: AlertTriangle, color: 'bg-orange-500' },
        ];
      case 'recipient':
        return [
          { label: 'Active Requests', value: '2', icon: AlertTriangle, color: 'bg-red-500' },
          { label: 'Matched Donors', value: '8', icon: Users, color: 'bg-green-500' },
          { label: 'Completed', value: '1', icon: Heart, color: 'bg-blue-500' },
          { label: 'Response Time', value: '4h', icon: Clock, color: 'bg-purple-500' },
        ];
      case 'hospital':
        return [
          { label: 'Blood Units', value: '248', icon: Heart, color: 'bg-red-500' },
          { label: 'Active Donors', value: '1.2k', icon: Users, color: 'bg-green-500' },
          { label: 'This Month', value: '89', icon: TrendingUp, color: 'bg-blue-500' },
          { label: 'Camps Organized', value: '15', icon: Calendar, color: 'bg-orange-500' },
        ];
      case 'admin':
        return [
          { label: 'Total Users', value: '15.4k', icon: Users, color: 'bg-blue-500' },
          { label: 'Active Requests', value: donationRequests.length, icon: AlertTriangle, color: 'bg-red-500' },
          { label: 'Blood Camps', value: bloodCamps.length, icon: Calendar, color: 'bg-green-500' },
          { label: 'Donations', value: '2.3k', icon: Heart, color: 'bg-purple-500' },
        ];
      default:
        return [];
    }
  };

  const stats = getDashboardStats();

  const getRecentActivity = () => {
    switch (user?.role) {
      case 'donor':
        return [
          { action: 'Donated blood at City Hospital', time: '2 days ago', type: 'success' },
          { action: 'Registered for blood camp', time: '1 week ago', type: 'info' },
          { action: 'Profile updated', time: '2 weeks ago', type: 'default' },
        ];
      case 'recipient':
        return [
          { action: 'New donor matched for your request', time: '2 hours ago', type: 'success' },
          { action: 'Blood request submitted', time: '1 day ago', type: 'info' },
          { action: 'Request fulfilled successfully', time: '1 week ago', type: 'success' },
        ];
      case 'hospital':
        return [
          { action: 'Blood inventory updated', time: '30 minutes ago', type: 'info' },
          { action: 'New donor registered', time: '2 hours ago', type: 'success' },
          { action: 'Blood camp scheduled', time: '1 day ago', type: 'info' },
        ];
      case 'admin':
        return [
          { action: 'New hospital verified', time: '1 hour ago', type: 'success' },
          { action: 'Emergency request resolved', time: '3 hours ago', type: 'warning' },
          { action: 'Monthly report generated', time: '1 day ago', type: 'info' },
        ];
      default:
        return [];
    }
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600">
          {user?.role === 'donor' && "Thank you for being a life-saving hero. Your donations make a real difference."}
          {user?.role === 'recipient' && "We're here to help you find the blood you need quickly and safely."}
          {user?.role === 'hospital' && "Manage your blood inventory and coordinate with donors efficiently."}
          {user?.role === 'admin' && "Monitor platform activity and ensure smooth operations for all users."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' :
                    activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user?.role === 'donor' && (
                <>
                  <button className="flex items-center space-x-2 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Donate Now</span>
                  </button>
                  <button className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Find Camps</span>
                  </button>
                </>
              )}
              {user?.role === 'recipient' && (
                <>
                  <button className="flex items-center space-x-2 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">New Request</span>
                  </button>
                  <button className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Find Donors</span>
                  </button>
                </>
              )}
              {user?.role === 'hospital' && (
                <>
                  <button className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Heart className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Update Inventory</span>
                  </button>
                  <button className="flex items-center space-x-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Schedule Camp</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;