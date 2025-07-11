import React, { createContext, useContext, useState, useEffect } from 'react';
import { DonationRequest, BloodCamp, Donor, BloodGroup, User, BloodInventory, Notification, ContactRequest, InventoryUpdate, AnalyticsData } from '../types';
import { DonorService } from '../services/donorService';
import { RequestService } from '../services/requestService';
import { CampService } from '../services/campService';
import { InventoryService } from '../services/inventoryService';
import { NotificationService } from '../services/notificationService';
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

  useEffect(() => {
    // Load data when user is authenticated
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_') || supabaseKey.includes('your_')) {
        console.log('Supabase not configured, using demo mode');
        return;
      }

      // Load requests
      const requests = await RequestService.getRequests();
      setDonationRequests(requests);

      // Load camps
      const camps = await CampService.getCamps();
      setBloodCamps(camps);

      // Load notifications
      if (user) {
        const userNotifications = await NotificationService.getNotifications(user.id);
        setNotifications(userNotifications);
      }

      // Load inventory if hospital
      if (user?.role === 'hospital') {
        const inventory = await InventoryService.getInventory(user.id);
        setBloodInventory(inventory);
      }
    } catch (error) {
      console.log('Database not set up, running in demo mode:', error);
      // Don't throw error, just run in demo mode
    }
  };

  const addDonationRequest = (request: Omit<DonationRequest, 'id' | 'createdAt'>) => {
    if (!user) return;

    RequestService.createRequest({
      recipientId: user.id,
      recipientName: request.recipientName,
      bloodGroup: request.bloodGroup,
      unitsNeeded: request.unitsNeeded,
      address: request.location.address,
      city: request.location.city,
      state: request.location.state,
      urgency: request.urgency,
      hospitalId: request.hospitalId,
    }).then(newRequest => {
      const formattedRequest: DonationRequest = {
        id: newRequest.id,
        recipientId: newRequest.recipient_id,
        recipientName: newRequest.recipient_name,
        bloodGroup: newRequest.blood_group as BloodGroup,
        unitsNeeded: newRequest.units_needed,
        location: {
          address: newRequest.address,
          city: newRequest.city,
          state: newRequest.state,
          latitude: newRequest.latitude,
          longitude: newRequest.longitude
        },
        urgency: newRequest.urgency,
        status: newRequest.status,
        matchedDonors: [],
        hospitalId: newRequest.hospital_id,
        scheduledDate: newRequest.scheduled_date,
        createdAt: newRequest.created_at
      };
      setDonationRequests(prev => [formattedRequest, ...prev]);
    }).catch(error => {
      console.error('Error creating request:', error);
    });
  };

  const updateDonationRequest = (id: string, updates: Partial<DonationRequest>) => {
    RequestService.updateRequestStatus(id, updates.status || 'pending', updates)
      .then(() => {
        setDonationRequests(prev =>
          prev.map(request =>
            request.id === id ? { ...request, ...updates } : request
          )
        );
      })
      .catch(error => {
        console.error('Error updating request:', error);
      });
  };

  const addBloodCamp = (camp: Omit<BloodCamp, 'id'>) => {
    if (!user) return;

    CampService.createCamp({
      hospitalId: user.id,
      title: camp.title,
      date: camp.date,
      time: camp.time,
      address: camp.location.address,
      city: camp.location.city,
      state: camp.location.state,
      slotsAvailable: camp.slotsAvailable
    }).then(newCamp => {
      const formattedCamp: BloodCamp = {
        id: newCamp.id,
        hospitalId: newCamp.hospital_id,
        hospitalName: user.name,
        title: newCamp.title,
        date: newCamp.date,
        time: newCamp.time,
        location: {
          address: newCamp.address,
          city: newCamp.city,
          state: newCamp.state,
          latitude: newCamp.latitude,
          longitude: newCamp.longitude
        },
        slotsAvailable: newCamp.slots_available,
        slotsBooked: newCamp.slots_booked,
        registeredDonors: [],
        status: newCamp.status
      };
      setBloodCamps(prev => [formattedCamp, ...prev]);
    }).catch(error => {
      console.error('Error creating camp:', error);
    });
  };

  const registerForCamp = (campId: string, donorId: string) => {
    CampService.registerForCamp(campId, donorId)
      .then(() => {
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
      })
      .catch(error => {
        console.error('Error registering for camp:', error);
      });
  };

  const searchDonors = (filters: {
    bloodGroup?: BloodGroup;
    location?: string;
    available?: boolean;
    maxDistance?: number;
    lastDonationDays?: number;
  }) => {
    // For now, return filtered mock data
    // In production, this would call DonorService.searchDonors
    DonorService.searchDonors({
      bloodGroup: filters.bloodGroup,
      city: filters.location,
      available: filters.available
    }).then(results => {
      setDonors(results);
    }).catch(error => {
      console.error('Error searching donors:', error);
    });
    
    return donors;
  };

  const contactDonor = async (donorId: string, request: ContactRequest) => {
    try {
      await NotificationService.createNotification({
        userId: donorId,
        title: 'New Contact Request',
        message: `${request.senderName} has sent you a message: ${request.message}`,
        type: 'donation_request',
        priority: request.urgency
      });
    } catch (error) {
      console.error('Error contacting donor:', error);
      throw error;
    }
  };

  const updateBloodInventory = (bloodGroup: BloodGroup, update: InventoryUpdate) => {
    if (!user) return;

    InventoryService.updateInventory(
      user.id,
      bloodGroup,
      update.units,
      update.updatedBy,
      update.reason
    ).then(() => {
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
    }).catch(error => {
      console.error('Error updating inventory:', error);
    });
  };

  const getInventoryAlerts = () => {
    if (!user || user.role !== 'hospital') return [];

    // For now, return local alerts
    // In production, this would call InventoryService.getInventoryAlerts
    return InventoryService.getInventoryAlerts(user.id);
  };

  const markNotificationAsRead = (id: string) => {
    NotificationService.markAsRead(id)
      .then(() => {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      })
      .catch(error => {
        console.error('Error marking notification as read:', error);
      });
  };

  const deleteNotification = (id: string) => {
    NotificationService.deleteNotification(id)
      .then(() => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
      })
      .catch(error => {
        console.error('Error deleting notification:', error);
      });
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
    NotificationService.createNotification({
      userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      actionUrl: notification.actionUrl
    }).then(newNotification => {
      const formattedNotification: Notification = {
        id: newNotification.id,
        userId: newNotification.user_id,
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        priority: newNotification.priority,
        read: newNotification.read,
        actionUrl: newNotification.action_url,
        createdAt: newNotification.created_at
      };
      setNotifications(prev => [formattedNotification, ...prev]);
    }).catch(error => {
      console.error('Error sending notification:', error);
    });
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