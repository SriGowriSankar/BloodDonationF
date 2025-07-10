import React, { createContext, useContext, useState, useEffect } from 'react';
import { DonationRequest, BloodCamp, Donor, BloodGroup, User, BloodInventory, Notification, ContactRequest, InventoryUpdate, AnalyticsData } from '../types';

interface AppContextType {
  donationRequests: DonationRequest[];
  bloodCamps: BloodCamp[];
  donors: Donor[];
  users: User[];
  bloodInventory: BloodInventory[];
  notifications: Notification[];
  addDonationRequest: (request: Omit<DonationRequest, 'id' | 'createdAt'>) => void;
  updateDonationRequest: (id: string, updates: Partial<DonationRequest>) => void;
  addBloodCamp: (camp: Omit<BloodCamp, 'id'>) => void;
  registerForCamp: (campId: string, donorId: string) => void;
  searchDonors: (filters: {
    bloodGroup?: BloodGroup;
    location?: string;
    available?: boolean;
    maxDistance?: number;
    lastDonationDays?: number;
  }) => Donor[];
  contactDonor: (donorId: string, request: ContactRequest) => Promise<void>;
  updateBloodInventory: (bloodGroup: BloodGroup, update: InventoryUpdate) => void;
  getInventoryAlerts: () => Array<{ type: string; message: string }>;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  updateNotificationSettings: (settings: any) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  verifyUser: (userId: string) => void;
  sendNotificationToUser: (userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>) => void;
  getAnalyticsData: (timeRange: 'week' | 'month' | 'quarter' | 'year') => AnalyticsData;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donationRequests, setDonationRequests] = useState<DonationRequest[]>([]);
  const [bloodCamps, setBloodCamps] = useState<BloodCamp[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bloodInventory, setBloodInventory] = useState<BloodInventory[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize with mock data
    const mockRequests: DonationRequest[] = [
      {
        id: '1',
        recipientId: '1',
        recipientName: 'Emergency Patient',
        bloodGroup: 'O-',
        unitsNeeded: 2,
        location: {
          address: '123 Hospital St',
          city: 'New York',
          state: 'NY',
          latitude: 40.7128,
          longitude: -74.0060,
        },
        urgency: 'emergency',
        status: 'pending',
        matchedDonors: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        recipientId: '2',
        recipientName: 'John Smith',
        bloodGroup: 'A+',
        unitsNeeded: 1,
        location: {
          address: '456 Main St',
          city: 'Los Angeles',
          state: 'CA',
          latitude: 34.0522,
          longitude: -118.2437,
        },
        urgency: 'medium',
        status: 'pending',
        matchedDonors: [],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    const mockCamps: BloodCamp[] = [
      {
        id: '1',
        hospitalId: '1',
        hospitalName: 'City General Hospital',
        title: 'Community Blood Drive',
        date: '2024-01-15',
        time: '09:00 AM - 5:00 PM',
        location: {
          address: '789 Community Center Ave',
          city: 'New York',
          state: 'NY',
          latitude: 40.7580,
          longitude: -73.9855,
        },
        slotsAvailable: 50,
        slotsBooked: 23,
        registeredDonors: [],
        status: 'upcoming',
      },
    ];

    const mockDonors: Donor[] = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1234567890',
        role: 'donor',
        verified: true,
        createdAt: new Date().toISOString(),
        bloodGroup: 'O-',
        age: 28,
        gender: 'female',
        location: {
          address: '321 Donor Ave',
          city: 'New York',
          state: 'NY',
          latitude: 40.7389,
          longitude: -73.9889,
        },
        available: true,
        donationHistory: [],
      },
      {
        id: '2',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '+1234567891',
        role: 'donor',
        verified: true,
        createdAt: new Date().toISOString(),
        bloodGroup: 'A+',
        age: 35,
        gender: 'male',
        location: {
          address: '654 Health St',
          city: 'Los Angeles',
          state: 'CA',
          latitude: 34.0522,
          longitude: -118.2437,
        },
        available: true,
        donationHistory: [],
      },
    ];

    const mockUsers: User[] = [
      ...mockDonors,
      {
        id: '3',
        name: 'City General Hospital',
        email: 'admin@citygeneral.com',
        phone: '+1234567892',
        role: 'hospital',
        verified: true,
        createdAt: new Date().toISOString(),
        status: 'active',
      },
      {
        id: '4',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1234567893',
        role: 'recipient',
        verified: true,
        createdAt: new Date().toISOString(),
        status: 'active',
      },
    ];

    const mockInventory: BloodInventory[] = [
      { bloodGroup: 'A+', unitsAvailable: 45, lastUpdated: new Date().toISOString(), expiringUnits: 3 },
      { bloodGroup: 'A-', unitsAvailable: 23, lastUpdated: new Date().toISOString(), expiringUnits: 1 },
      { bloodGroup: 'B+', unitsAvailable: 67, lastUpdated: new Date().toISOString(), expiringUnits: 5 },
      { bloodGroup: 'B-', unitsAvailable: 12, lastUpdated: new Date().toISOString(), expiringUnits: 0 },
      { bloodGroup: 'AB+', unitsAvailable: 34, lastUpdated: new Date().toISOString(), expiringUnits: 2 },
      { bloodGroup: 'AB-', unitsAvailable: 8, lastUpdated: new Date().toISOString(), expiringUnits: 1 },
      { bloodGroup: 'O+', unitsAvailable: 89, lastUpdated: new Date().toISOString(), expiringUnits: 7 },
      { bloodGroup: 'O-', unitsAvailable: 15, lastUpdated: new Date().toISOString(), expiringUnits: 2 },
    ];

    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: '1',
        title: 'Emergency Blood Request',
        message: 'Urgent O- blood needed at City General Hospital',
        type: 'emergency',
        priority: 'high',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: '1',
        title: 'Blood Camp Reminder',
        message: 'Community Blood Drive tomorrow at 9 AM',
        type: 'camp_reminder',
        priority: 'medium',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    setDonationRequests(mockRequests);
    setBloodCamps(mockCamps);
    setDonors(mockDonors);
    setUsers(mockUsers);
    setBloodInventory(mockInventory);
    setNotifications(mockNotifications);
  }, []);

  const addDonationRequest = (request: Omit<DonationRequest, 'id' | 'createdAt'>) => {
    const newRequest: DonationRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDonationRequests(prev => [newRequest, ...prev]);
  };

  const updateDonationRequest = (id: string, updates: Partial<DonationRequest>) => {
    setDonationRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const addBloodCamp = (camp: Omit<BloodCamp, 'id'>) => {
    const newCamp: BloodCamp = {
      ...camp,
      id: Date.now().toString(),
    };
    setBloodCamps(prev => [newCamp, ...prev]);
  };

  const registerForCamp = (campId: string, donorId: string) => {
    setBloodCamps(prev =>
      prev.map(camp =>
        camp.id === campId
          ? {
              ...camp,
              registeredDonors: [...camp.registeredDonors, donorId],
              slotsBooked: camp.slotsBooked + 1,
            }
          : camp
      )
    );
  };

  const searchDonors = (filters: {
    bloodGroup?: BloodGroup;
    location?: string;
    available?: boolean;
    maxDistance?: number;
    lastDonationDays?: number;
  }) => {
    return donors.filter(donor => {
      if (filters.bloodGroup && donor.bloodGroup !== filters.bloodGroup) {
        return false;
      }
      if (filters.location && !donor.location.city.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.available !== undefined && donor.available !== filters.available) {
        return false;
      }
      if (filters.lastDonationDays && donor.lastDonationDate) {
        const daysSinceLastDonation = Math.floor((Date.now() - new Date(donor.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastDonation < filters.lastDonationDays) {
          return false;
        }
      }
      return true;
    });
  };

  const contactDonor = async (donorId: string, request: ContactRequest) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add notification to donor
    const newNotification: Notification = {
      id: Date.now().toString(),
      userId: donorId,
      title: 'New Contact Request',
      message: `${request.senderName} has sent you a message: ${request.message}`,
      type: 'donation_request',
      priority: request.urgency,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const updateBloodInventory = (bloodGroup: BloodGroup, update: InventoryUpdate) => {
    setBloodInventory(prev =>
      prev.map(item =>
        item.bloodGroup === bloodGroup
          ? {
              ...item,
              unitsAvailable: Math.max(0, item.unitsAvailable + update.units),
              lastUpdated: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const getInventoryAlerts = () => {
    const alerts: Array<{ type: string; message: string }> = [];
    
    bloodInventory.forEach(item => {
      if (item.unitsAvailable === 0) {
        alerts.push({
          type: 'critical',
          message: `${item.bloodGroup} blood is out of stock`,
        });
      } else if (item.unitsAvailable < 10) {
        alerts.push({
          type: 'warning',
          message: `${item.bloodGroup} blood is running low (${item.unitsAvailable} units remaining)`,
        });
      }
      
      if (item.expiringUnits && item.expiringUnits > 0) {
        alerts.push({
          type: 'warning',
          message: `${item.expiringUnits} units of ${item.bloodGroup} blood expiring soon`,
        });
      }
    });
    
    return alerts;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const updateNotificationSettings = (settings: any) => {
    // Store notification settings (would typically be saved to backend)
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, status } : user
      )
    );
  };

  const verifyUser = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, verified: true } : user
      )
    );
  };

  const sendNotificationToUser = (userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      userId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const getAnalyticsData = (timeRange: 'week' | 'month' | 'quarter' | 'year'): AnalyticsData => {
    // Mock analytics data - in real app, this would come from backend
    return {
      totalDonations: 1247,
      donationsChange: 12.5,
      activeUsers: 15420,
      usersChange: 8.3,
      totalRequests: 89,
      requestsChange: -5.2,
      totalCamps: 23,
      campsChange: 15.7,
      dailyDonations: [12, 19, 15, 22, 18, 25, 20],
      bloodGroupDistribution: [
        { bloodGroup: 'O+', count: 45, percentage: 35 },
        { bloodGroup: 'A+', count: 38, percentage: 30 },
        { bloodGroup: 'B+', count: 20, percentage: 16 },
        { bloodGroup: 'AB+', count: 15, percentage: 12 },
        { bloodGroup: 'O-', count: 8, percentage: 6 },
        { bloodGroup: 'A-', count: 1, percentage: 1 },
        { bloodGroup: 'B-', count: 0, percentage: 0 },
        { bloodGroup: 'AB-', count: 0, percentage: 0 },
      ],
      requestStatus: [
        { status: 'completed', count: 45 },
        { status: 'pending', count: 23 },
        { status: 'matched', count: 15 },
        { status: 'cancelled', count: 6 },
      ],
      geographicData: [
        { city: 'New York', count: 234 },
        { city: 'Los Angeles', count: 189 },
        { city: 'Chicago', count: 156 },
        { city: 'Houston', count: 134 },
        { city: 'Phoenix', count: 98 },
      ],
      topHospitals: [
        { name: 'City General Hospital', location: 'New York', donations: 89 },
        { name: 'Metro Medical Center', location: 'Los Angeles', donations: 76 },
        { name: 'Central Hospital', location: 'Chicago', donations: 65 },
        { name: 'Regional Medical', location: 'Houston', donations: 54 },
      ],
      recentActivity: [
        { type: 'donation', description: 'New blood donation at City General', timestamp: '2 hours ago' },
        { type: 'request', description: 'Emergency request for O- blood', timestamp: '4 hours ago' },
        { type: 'camp', description: 'Blood camp scheduled for tomorrow', timestamp: '6 hours ago' },
        { type: 'user', description: 'New donor registered', timestamp: '8 hours ago' },
      ],
    };
  };

  return (
    <AppContext.Provider
      value={{
        donationRequests,
        bloodCamps,
        donors,
        users,
        bloodInventory,
        notifications,
        addDonationRequest,
        updateDonationRequest,
        addBloodCamp,
        registerForCamp,
        searchDonors,
        contactDonor,
        updateBloodInventory,
        getInventoryAlerts,
        markNotificationAsRead,
        deleteNotification,
        updateNotificationSettings,
        updateUserStatus,
        verifyUser,
        sendNotificationToUser,
        getAnalyticsData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};