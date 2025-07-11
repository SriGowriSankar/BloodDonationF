/*
  # Blood Donation Platform Database Schema

  1. New Tables
    - `users` - Core user information for all roles
    - `donors` - Donor-specific information and preferences
    - `hospitals` - Hospital/blood bank information
    - `blood_inventory` - Blood stock management for hospitals
    - `donation_requests` - Blood requests from recipients
    - `blood_camps` - Blood donation events organized by hospitals
    - `camp_registrations` - Donor registrations for blood camps
    - `donation_records` - Historical record of all donations
    - `notifications` - System notifications for users

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure user data with proper permissions

  3. Functions
    - Helper functions for camp slot management
    - Geospatial functions for location-based searches
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table (core user information)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  role text NOT NULL CHECK (role IN ('donor', 'recipient', 'hospital', 'admin')),
  verified boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Donors table (donor-specific information)
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  blood_group text NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  age integer NOT NULL CHECK (age >= 18 AND age <= 65),
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  latitude decimal(10, 8) DEFAULT 0,
  longitude decimal(11, 8) DEFAULT 0,
  last_donation_date timestamptz,
  available boolean DEFAULT true,
  medical_conditions text[],
  rating decimal(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hospitals table (hospital/blood bank information)
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  address text NOT NULL,
  contact_person text NOT NULL,
  license_number text NOT NULL,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blood inventory table (hospital blood stock management)
CREATE TABLE IF NOT EXISTS blood_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(user_id) ON DELETE CASCADE,
  blood_group text NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units_available integer DEFAULT 0 CHECK (units_available >= 0),
  expiring_units integer DEFAULT 0 CHECK (expiring_units >= 0),
  last_updated timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id),
  UNIQUE(hospital_id, blood_group)
);

-- Donation requests table (blood requests from recipients)
CREATE TABLE IF NOT EXISTS donation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  blood_group text NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units_needed integer NOT NULL CHECK (units_needed > 0),
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  latitude decimal(10, 8) DEFAULT 0,
  longitude decimal(11, 8) DEFAULT 0,
  urgency text NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'completed', 'cancelled')),
  hospital_id uuid REFERENCES hospitals(user_id),
  scheduled_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blood camps table (blood donation events)
CREATE TABLE IF NOT EXISTS blood_camps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  latitude decimal(10, 8) DEFAULT 0,
  longitude decimal(11, 8) DEFAULT 0,
  slots_available integer NOT NULL CHECK (slots_available > 0),
  slots_booked integer DEFAULT 0 CHECK (slots_booked >= 0),
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Camp registrations table (donor registrations for camps)
CREATE TABLE IF NOT EXISTS camp_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_id uuid REFERENCES blood_camps(id) ON DELETE CASCADE,
  donor_id uuid REFERENCES donors(user_id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  UNIQUE(camp_id, donor_id)
);

-- Donation records table (historical donation records)
CREATE TABLE IF NOT EXISTS donation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(user_id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES users(id),
  hospital_id uuid REFERENCES hospitals(user_id) ON DELETE CASCADE,
  blood_group text NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  units integer NOT NULL CHECK (units > 0),
  date timestamptz NOT NULL,
  camp_id uuid REFERENCES blood_camps(id),
  verified boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Notifications table (system notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('donation_request', 'camp_reminder', 'donor_match', 'emergency', 'admin')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_city ON donors(city);
CREATE INDEX IF NOT EXISTS idx_donors_available ON donors(available);
CREATE INDEX IF NOT EXISTS idx_donation_requests_status ON donation_requests(status);
CREATE INDEX IF NOT EXISTS idx_donation_requests_urgency ON donation_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_blood_camps_date ON blood_camps(date);
CREATE INDEX IF NOT EXISTS idx_blood_camps_city ON blood_camps(city);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can insert users" ON users
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- RLS Policies for donors table
CREATE POLICY "Donors can manage own profile" ON donors
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can read donor profiles" ON donors
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for hospitals table
CREATE POLICY "Hospitals can manage own profile" ON hospitals
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can read hospital profiles" ON hospitals
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for blood_inventory table
CREATE POLICY "Hospitals can manage own inventory" ON blood_inventory
  FOR ALL TO authenticated
  USING (hospital_id = auth.uid());

CREATE POLICY "Anyone can read inventory" ON blood_inventory
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for donation_requests table
CREATE POLICY "Recipients can manage own requests" ON donation_requests
  FOR ALL TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Anyone can read requests" ON donation_requests
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for blood_camps table
CREATE POLICY "Hospitals can manage own camps" ON blood_camps
  FOR ALL TO authenticated
  USING (hospital_id = auth.uid());

CREATE POLICY "Anyone can read camps" ON blood_camps
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for camp_registrations table
CREATE POLICY "Donors can manage own registrations" ON camp_registrations
  FOR ALL TO authenticated
  USING (donor_id = auth.uid());

CREATE POLICY "Anyone can read registrations" ON camp_registrations
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for donation_records table
CREATE POLICY "Users can read own donation records" ON donation_records
  FOR SELECT TO authenticated
  USING (donor_id = auth.uid() OR recipient_id = auth.uid() OR hospital_id = auth.uid());

CREATE POLICY "Hospitals can insert donation records" ON donation_records
  FOR INSERT TO authenticated
  WITH CHECK (hospital_id = auth.uid());

-- RLS Policies for notifications table
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Helper function to increment camp slots
CREATE OR REPLACE FUNCTION increment_camp_slots(camp_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE blood_camps 
  SET slots_booked = slots_booked + 1,
      updated_at = now()
  WHERE id = camp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get nearby donors (simplified version without PostGIS)
CREATE OR REPLACE FUNCTION get_nearby_donors(
  target_lat decimal,
  target_lng decimal,
  radius_km integer DEFAULT 50,
  blood_group_filter text DEFAULT NULL
)
RETURNS TABLE (
  donor_id uuid,
  distance_km decimal
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.user_id,
    CAST(
      6371 * acos(
        cos(radians(target_lat)) * 
        cos(radians(d.latitude)) * 
        cos(radians(d.longitude) - radians(target_lng)) + 
        sin(radians(target_lat)) * 
        sin(radians(d.latitude))
      ) AS decimal(10,2)
    ) as distance
  FROM donors d
  WHERE d.available = true
    AND (blood_group_filter IS NULL OR d.blood_group = blood_group_filter)
    AND 6371 * acos(
      cos(radians(target_lat)) * 
      cos(radians(d.latitude)) * 
      cos(radians(d.longitude) - radians(target_lng)) + 
      sin(radians(target_lat)) * 
      sin(radians(d.latitude))
    ) <= radius_km
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;