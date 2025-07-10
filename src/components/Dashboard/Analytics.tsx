import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Heart, Calendar, Download, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Analytics: React.FC = () => {
  const { getAnalyticsData } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'donations' | 'requests' | 'camps' | 'users'>('donations');
  
  const analyticsData = getAnalyticsData(timeRange);

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className={`flex items-center space-x-1 mt-2 ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`h-4 w-4 ${change < 0 ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">
              {Math.abs(change)}% vs last {timeRange}
            </span>
          </div>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const SimpleBarChart = ({ data, label }: { data: number[]; label: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span>Last 7 days</span>
      </div>
      <div className="flex items-end space-x-2 h-32">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-red-500 rounded-t"
              style={{ height: `${(value / Math.max(...data)) * 100}%` }}
            />
            <span className="text-xs text-gray-500 mt-2">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor platform performance and blood donation trends</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Donations"
          value={analyticsData.totalDonations}
          change={analyticsData.donationsChange}
          icon={Heart}
          color="bg-red-500"
        />
        <MetricCard
          title="Active Users"
          value={analyticsData.activeUsers}
          change={analyticsData.usersChange}
          icon={Users}
          color="bg-blue-500"
        />
        <MetricCard
          title="Blood Requests"
          value={analyticsData.totalRequests}
          change={analyticsData.requestsChange}
          icon={BarChart3}
          color="bg-green-500"
        />
        <MetricCard
          title="Blood Camps"
          value={analyticsData.totalCamps}
          change={analyticsData.campsChange}
          icon={Calendar}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Daily Donations">
          <SimpleBarChart 
            data={analyticsData.dailyDonations} 
            label="Donations per day"
          />
        </ChartContainer>

        <ChartContainer title="Blood Group Distribution">
          <div className="space-y-3">
            {analyticsData.bloodGroupDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span className="text-sm font-medium">{item.bloodGroup}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="Request Status Overview">
          <div className="grid grid-cols-2 gap-4">
            {analyticsData.requestStatus.map((status, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  status.status === 'completed' ? 'bg-green-100' :
                  status.status === 'pending' ? 'bg-yellow-100' :
                  status.status === 'matched' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <span className={`text-xl font-bold ${
                    status.status === 'completed' ? 'text-green-600' :
                    status.status === 'pending' ? 'text-yellow-600' :
                    status.status === 'matched' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {status.count}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 capitalize">{status.status}</p>
              </div>
            ))}
          </div>
        </ChartContainer>

        <ChartContainer title="Geographic Distribution">
          <div className="space-y-3">
            {analyticsData.geographicData.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{location.city}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(location.count / Math.max(...analyticsData.geographicData.map(l => l.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{location.count}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Hospitals</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {analyticsData.topHospitals.map((hospital, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{hospital.name}</div>
                    <div className="text-sm text-gray-600">{hospital.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{hospital.donations}</div>
                  <div className="text-sm text-gray-600">donations</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="p-6 flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'donation' ? 'bg-green-500' :
                  activity.type === 'request' ? 'bg-blue-500' :
                  activity.type === 'camp' ? 'bg-purple-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{activity.description}</div>
                  <div className="text-xs text-gray-500">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;