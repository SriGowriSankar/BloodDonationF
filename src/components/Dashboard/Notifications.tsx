import React, { useState } from 'react';
import { Bell, Check, X, AlertTriangle, Heart, Calendar, Users, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead, deleteNotification, updateNotificationSettings } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    push: true,
    emergencyOnly: false,
    donationReminders: true,
    campNotifications: true,
    requestUpdates: true,
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'donation_request':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'camp_reminder':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'donor_match':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'emergency':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationPriority = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'medium':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-4 border-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-gray-300 bg-white';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'urgent') return notification.priority === 'high';
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
  };

  const handleSaveSettings = () => {
    updateNotificationSettings(notificationSettings);
    setShowSettings(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">
            Stay updated with blood requests, donations, and important alerts
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSettings(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              filter === 'all'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              filter === 'unread'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              filter === 'urgent'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Urgent ({notifications.filter(n => n.priority === 'high').length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-100">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 ${getNotificationPriority(notification.priority)} ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className={`mt-1 text-sm ${
                          !notification.read ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(notification.createdAt).toLocaleString()}</span>
                          <span className={`px-2 py-1 rounded-full ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {notification.priority} priority
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View Details →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
              <p className="text-gray-600">
                {filter === 'unread' && 'You have no unread notifications.'}
                {filter === 'urgent' && 'You have no urgent notifications.'}
                {filter === 'all' && 'You have no notifications yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Methods</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.email}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        email: e.target.checked
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.sms}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        sms: e.target.checked
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.push}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        push: e.target.checked
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.donationReminders}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        donationReminders: e.target.checked
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Donation reminders</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.campNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        campNotifications: e.target.checked
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Blood camp notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.requestUpdates}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        requestUpdates: e.target.checked
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Request status updates</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emergencyOnly}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        emergencyOnly: e.target.checked
                      })}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Emergency notifications only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;