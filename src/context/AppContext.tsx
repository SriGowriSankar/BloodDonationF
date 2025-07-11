import React, { createContext, useContext, useState } from 'react';
import { DonationRequest, BloodCamp, Donor, BloodGroup, User, BloodInventory, Notification, ContactRequest, InventoryUpdate, AnalyticsData } from '../types';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [donationRequests, setDonationRequests] = useState<DonationRequest[]>([]);
  const [bloodCamps, setBloodCamps] = useState<BloodCamp[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bloodInventory, setBloodInventory] = useState<BloodInventory[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
    // Return mock donors for demo
    return donors;
  };

  const contactDonor = async (donorId: string, request: ContactRequest) => {
    // Mock contact functionality
    console.log('Contacting donor:', donorId, request);
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
    return [];
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