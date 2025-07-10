import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, Ban, CheckCircle, AlertTriangle, Users, Mail, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const { users, updateUserStatus, verifyUser, sendNotificationToUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'donor' | 'recipient' | 'hospital'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userToView, setUserToView] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'verified' && user.verified) ||
                         (filterStatus === 'pending' && !user.verified) ||
                         (filterStatus === 'suspended' && user.status === 'suspended');
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleVerifyUser = (userId: string) => {
    verifyUser(userId);
  };

  const handleSuspendUser = (userId: string) => {
    updateUserStatus(userId, 'suspended');
  };

  const handleActivateUser = (userId: string) => {
    updateUserStatus(userId, 'active');
  };

  const handleViewUser = (user: User) => {
    setUserToView(user);
    setShowUserDetails(true);
  };

  const handleSendNotification = (userId: string) => {
    const message = prompt('Enter notification message:');
    if (message) {
      sendNotificationToUser(userId, {
        title: 'Admin Notification',
        message,
        type: 'admin',
        priority: 'medium',
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'donor': return 'bg-green-100 text-green-800';
      case 'recipient': return 'bg-blue-100 text-blue-800';
      case 'hospital': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (user: User) => {
    if (user.status === 'suspended') {
      return <Ban className="h-4 w-4 text-red-500" />;
    }
    if (user.verified) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage platform users, verification, and access control</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.verified).length}
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {users.filter(u => !u.verified).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by name or email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="donor">Donors</option>
              <option value="recipient">Recipients</option>
              <option value="hospital">Hospitals</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user)}
                      <span className="text-sm text-gray-600">
                        {user.status === 'suspended' ? 'Suspended' :
                         user.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      {!user.verified && user.status !== 'suspended' && (
                        <button
                          onClick={() => handleVerifyUser(user.id)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Verify
                        </button>
                      )}
                      {user.status !== 'suspended' ? (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleSendNotification(user.id)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Notify
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              No users match your current search criteria.
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && userToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{userToView.name}</h4>
                  <p className="text-gray-600">{userToView.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userToView.role)}`}>
                      {userToView.role.charAt(0).toUpperCase() + userToView.role.slice(1)}
                    </span>
                    {getStatusIcon(userToView)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">{userToView.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">{userToView.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Account Information</h5>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Joined:</span>
                      <span className="ml-2 font-medium">{new Date(userToView.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Verified:</span>
                      <span className="ml-2 font-medium">{userToView.verified ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 font-medium">{userToView.status || 'Active'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {userToView.role === 'donor' && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Donor Information</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      Additional donor-specific information would be displayed here,
                      such as blood group, donation history, and availability status.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSendNotification(userToView.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;