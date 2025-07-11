import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import Overview from './Overview';
import BloodRequests from './BloodRequests';
import BloodCamps from './BloodCamps';
import DonorSearch from './DonorSearch';
import BloodInventory from './BloodInventory';
import Analytics from './Analytics';
import Notifications from './Notifications';
import UserManagement from './UserManagement';

const Dashboard: React.FC = () => {
  const { user, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          {isDemo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700 mb-2">Demo Mode: Use these accounts to login:</p>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• donor@demo.com</div>
                <div>• recipient@demo.com</div>
                <div>• hospital@demo.com</div>
                <div>• admin@demo.com</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'requests':
        return <BloodRequests />;
      case 'camps':
        return <BloodCamps />;
      case 'donors':
        return <DonorSearch />;
      case 'inventory':
        return <BloodInventory />;
      case 'analytics':
        return <Analytics />;
      case 'notifications':
        return <Notifications />;
      case 'users':
        return <UserManagement />;
      case 'profile':
        return (
          <div className="space-y-6">
            {isDemo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Demo Mode</h3>
                <p className="text-sm text-yellow-700">
                  You're using the demo version. To enable full functionality including data persistence, 
                  please set up Supabase by clicking "Connect to Supabase" in the top right.
                </p>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={user.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Update Profile
              </button>
            </div>
            </div>
          </div>
        );
      case 'donations':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Donations</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">Your donation history will appear here.</p>
            </div>
          </div>
        );
      case 'donors':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Donors</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">Search for blood donors in your area.</p>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Blood Inventory</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">Manage your blood inventory here.</p>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">Manage platform users here.</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">Platform analytics and reports will appear here.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="text-center py-12">
              <p className="text-gray-600">Application settings and preferences.</p>
            </div>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;