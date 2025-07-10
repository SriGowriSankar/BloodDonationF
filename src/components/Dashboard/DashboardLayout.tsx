import React, { useState } from 'react';
import { Menu, X, Home, Users, Heart, Calendar, BarChart3, Settings, Bell, Search, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { notifications } = useApp();

  const unreadNotifications = notifications.filter(n => !n.read && n.userId === user?.id).length;

  const getNavigationItems = () => {
    const common = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'profile', label: 'Profile', icon: Users },
    ];

    switch (user?.role) {
      case 'donor':
        return [
          ...common,
          { id: 'donations', label: 'My Donations', icon: Heart },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
          { id: 'requests', label: 'Blood Requests', icon: Bell },
          { id: 'camps', label: 'Blood Camps', icon: Calendar },
        ];
      case 'recipient':
        return [
          ...common,
          { id: 'requests', label: 'My Requests', icon: Bell },
          { id: 'donors', label: 'Find Donors', icon: Search },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
        ];
      case 'hospital':
        return [
          ...common,
          { id: 'inventory', label: 'Blood Inventory', icon: Package },
          { id: 'requests', label: 'Blood Requests', icon: Bell },
          { id: 'camps', label: 'Blood Camps', icon: Calendar },
          { id: 'donors', label: 'Donor Network', icon: Search },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
        ];
      case 'admin':
        return [
          ...common,
          { id: 'users', label: 'Users', icon: Users },
          { id: 'requests', label: 'All Requests', icon: Bell },
          { id: 'camps', label: 'All Camps', icon: Calendar },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
        ];
      default:
        return common;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 p-2 rounded-full">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">LifeLink</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {user?.role?.toUpperCase()} DASHBOARD
            </div>
          </div>
          <div className="space-y-2 px-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-red-50 text-red-600 border-r-4 border-red-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex items-center justify-between flex-1">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-red-50 text-red-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                {activeTab === 'overview' ? 'Dashboard' : activeTab.replace('-', ' ')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <div className="text-sm text-gray-600 hidden md:block">
                Welcome back, <span className="font-medium">{user?.name}</span>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;