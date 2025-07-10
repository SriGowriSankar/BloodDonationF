import React, { useState } from 'react';
import { Plus, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { BloodGroup } from '../../types';

const BloodInventory: React.FC = () => {
  const { user } = useAuth();
  const { bloodInventory, updateBloodInventory, getInventoryAlerts } = useApp();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('A+');
  const [updateData, setUpdateData] = useState({
    units: 0,
    operation: 'add' as 'add' | 'remove',
    reason: '',
    expiryDate: '',
  });

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const alerts = getInventoryAlerts();

  const handleUpdateInventory = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateBloodInventory(selectedBloodGroup, {
      units: updateData.operation === 'add' ? updateData.units : -updateData.units,
      reason: updateData.reason,
      expiryDate: updateData.expiryDate,
      updatedBy: user?.id || '',
    });

    setShowUpdateForm(false);
    setUpdateData({
      units: 0,
      operation: 'add',
      reason: '',
      expiryDate: '',
    });
  };

  const getStockLevel = (units: number) => {
    if (units === 0) return { level: 'empty', color: 'bg-red-500', text: 'Empty' };
    if (units < 10) return { level: 'critical', color: 'bg-red-400', text: 'Critical' };
    if (units < 25) return { level: 'low', color: 'bg-orange-400', text: 'Low' };
    if (units < 50) return { level: 'medium', color: 'bg-yellow-400', text: 'Medium' };
    return { level: 'good', color: 'bg-green-400', text: 'Good' };
  };

  const getTotalUnits = () => {
    return bloodInventory.reduce((total, item) => total + item.unitsAvailable, 0);
  };

  const getExpiringUnits = () => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    return bloodInventory.reduce((total, item) => {
      return total + (item.expiringUnits || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blood Inventory</h2>
          <p className="text-gray-600">Manage your blood bank inventory and stock levels</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Report</span>
          </button>
          <button
            onClick={() => setShowUpdateForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Update Stock</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-800">Inventory Alerts</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className="text-sm text-red-700">
                • {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Units</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalUnits()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{getExpiringUnits()}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {bloodInventory.filter(item => item.unitsAvailable < 10).length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <RefreshCw className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bloodGroups.map((bloodGroup) => {
          const inventory = bloodInventory.find(item => item.bloodGroup === bloodGroup);
          const units = inventory?.unitsAvailable || 0;
          const stockLevel = getStockLevel(units);
          
          return (
            <div key={bloodGroup} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">{bloodGroup}</div>
                    <div className="text-sm text-gray-600">Blood Group</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{units}</div>
                    <div className="text-sm text-gray-600">Units</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Stock Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stockLevel.level === 'good' ? 'bg-green-100 text-green-800' :
                      stockLevel.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      stockLevel.level === 'low' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stockLevel.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${stockLevel.color}`}
                      style={{ width: `${Math.min((units / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{inventory?.lastUpdated ? new Date(inventory.lastUpdated).toLocaleDateString() : 'Never'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiring (3 days):</span>
                    <span className="text-orange-600">{inventory?.expiringUnits || 0}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBloodGroup(bloodGroup);
                    setShowUpdateForm(true);
                  }}
                  className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Update Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {bloodInventory.slice(0, 5).map((item, index) => (
            <div key={index} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-medium text-sm">{item.bloodGroup}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Stock Update</div>
                  <div className="text-sm text-gray-600">
                    {item.lastUpdated ? new Date(item.lastUpdated).toLocaleString() : 'No recent updates'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{item.unitsAvailable} units</div>
                <div className="text-sm text-gray-600">Current stock</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Form Modal */}
      {showUpdateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Update Blood Stock</h3>
            <form onSubmit={handleUpdateInventory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  value={selectedBloodGroup}
                  onChange={(e) => setSelectedBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operation
                </label>
                <select
                  value={updateData.operation}
                  onChange={(e) => setUpdateData({ ...updateData, operation: e.target.value as 'add' | 'remove' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="add">Add Stock</option>
                  <option value="remove">Remove Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Units
                </label>
                <input
                  type="number"
                  min="1"
                  value={updateData.units}
                  onChange={(e) => setUpdateData({ ...updateData, units: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={updateData.reason}
                  onChange={(e) => setUpdateData({ ...updateData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select reason</option>
                  <option value="donation">New Donation</option>
                  <option value="transfusion">Blood Transfusion</option>
                  <option value="expired">Expired Units</option>
                  <option value="testing">Quality Testing</option>
                  <option value="transfer">Transfer to Another Bank</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {updateData.operation === 'add' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={updateData.expiryDate}
                    onChange={(e) => setUpdateData({ ...updateData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodInventory;