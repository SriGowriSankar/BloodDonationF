export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'donor' | 'recipient' | 'hospital' | 'admin';
  verified: boolean;
  createdAt: string;
  status?: 'active' | 'suspended';
  rating?: number;
  distance?: number;
}

export interface Donor extends User {
  bloodGroup: BloodGroup;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: Location;
  lastDonationDate?: string;
  available: boolean;
  medicalConditions?: string[];
  donationHistory: DonationRecord[];
}

export interface Recipient extends User {
  bloodGroupNeeded: BloodGroup;
  unitsNeeded: number;
  hospitalId?: string;
  emergencyFlag: boolean;
  requestStatus: 'pending' | 'matched' | 'completed' | 'cancelled';
}

export interface Hospital extends User {
  address: string;
  contactPerson: string;
  inventory: BloodInventory[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface Location {
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface BloodInventory {
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  lastUpdated: string;
  expiringUnits?: number;
}

export interface DonationRequest {
  id: string;
  recipientId: string;
  recipientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  location: Location;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'matched' | 'completed' | 'cancelled';
  matchedDonors: string[];
  hospitalId?: string;
  scheduledDate?: string;
  createdAt: string;
}

export interface BloodCamp {
  id: string;
  hospitalId: string;
  hospitalName: string;
  title: string;
  date: string;
  time: string;
  location: Location;
  slotsAvailable: number;
  slotsBooked: number;
  registeredDonors: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface DonationRecord {
  id: string;
  donorId: string;
  recipientId?: string;
  hospitalId: string;
  bloodGroup: BloodGroup;
  units: number;
  date: string;
  campId?: string;
  verified: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'donation_request' | 'camp_reminder' | 'donor_match' | 'emergency' | 'admin';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ContactRequest {
  senderId: string;
  senderName: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface InventoryUpdate {
  units: number;
  reason: string;
  expiryDate?: string;
  updatedBy: string;
}

export interface AnalyticsData {
  totalDonations: number;
  donationsChange: number;
  activeUsers: number;
  usersChange: number;
  totalRequests: number;
  requestsChange: number;
  totalCamps: number;
  campsChange: number;
  dailyDonations: number[];
  bloodGroupDistribution: Array<{
    bloodGroup: BloodGroup;
    count: number;
    percentage: number;
  }>;
  requestStatus: Array<{
    status: string;
    count: number;
  }>;
  geographicData: Array<{
    city: string;
    count: number;
  }>;
  topHospitals: Array<{
    name: string;
    location: string;
    donations: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  emergencyOnly: boolean;
}