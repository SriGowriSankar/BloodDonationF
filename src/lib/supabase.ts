import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         !supabaseUrl.includes('your_') && 
         !supabaseAnonKey.includes('your_') &&
         supabaseUrl !== 'your_supabase_project_url' &&
         supabaseAnonKey !== 'your_supabase_anon_key'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          role: 'donor' | 'recipient' | 'hospital' | 'admin'
          verified: boolean
          status: 'active' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone: string
          role: 'donor' | 'recipient' | 'hospital' | 'admin'
          verified?: boolean
          status?: 'active' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          role?: 'donor' | 'recipient' | 'hospital' | 'admin'
          verified?: boolean
          status?: 'active' | 'suspended'
          updated_at?: string
        }
      }
      donors: {
        Row: {
          id: string
          user_id: string
          blood_group: string
          age: number
          gender: 'male' | 'female' | 'other'
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          last_donation_date: string | null
          available: boolean
          medical_conditions: string[] | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          blood_group: string
          age: number
          gender: 'male' | 'female' | 'other'
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          last_donation_date?: string | null
          available?: boolean
          medical_conditions?: string[] | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          blood_group?: string
          age?: number
          gender?: 'male' | 'female' | 'other'
          address?: string
          city?: string
          state?: string
          latitude?: number
          longitude?: number
          last_donation_date?: string | null
          available?: boolean
          medical_conditions?: string[] | null
          rating?: number | null
          updated_at?: string
        }
      }
      hospitals: {
        Row: {
          id: string
          user_id: string
          address: string
          contact_person: string
          verification_status: 'pending' | 'verified' | 'rejected'
          license_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address: string
          contact_person: string
          verification_status?: 'pending' | 'verified' | 'rejected'
          license_number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          address?: string
          contact_person?: string
          verification_status?: 'pending' | 'verified' | 'rejected'
          license_number?: string
          updated_at?: string
        }
      }
      blood_inventory: {
        Row: {
          id: string
          hospital_id: string
          blood_group: string
          units_available: number
          expiring_units: number
          last_updated: string
          updated_by: string
        }
        Insert: {
          id?: string
          hospital_id: string
          blood_group: string
          units_available: number
          expiring_units?: number
          last_updated?: string
          updated_by: string
        }
        Update: {
          units_available?: number
          expiring_units?: number
          last_updated?: string
          updated_by?: string
        }
      }
      donation_requests: {
        Row: {
          id: string
          recipient_id: string
          recipient_name: string
          blood_group: string
          units_needed: number
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          urgency: 'low' | 'medium' | 'high' | 'emergency'
          status: 'pending' | 'matched' | 'completed' | 'cancelled'
          hospital_id: string | null
          scheduled_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          recipient_name: string
          blood_group: string
          units_needed: number
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          urgency: 'low' | 'medium' | 'high' | 'emergency'
          status?: 'pending' | 'matched' | 'completed' | 'cancelled'
          hospital_id?: string | null
          scheduled_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          recipient_name?: string
          blood_group?: string
          units_needed?: number
          address?: string
          city?: string
          state?: string
          latitude?: number
          longitude?: number
          urgency?: 'low' | 'medium' | 'high' | 'emergency'
          status?: 'pending' | 'matched' | 'completed' | 'cancelled'
          hospital_id?: string | null
          scheduled_date?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      blood_camps: {
        Row: {
          id: string
          hospital_id: string
          title: string
          description: string | null
          date: string
          time: string
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          slots_available: number
          slots_booked: number
          status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hospital_id: string
          title: string
          description?: string | null
          date: string
          time: string
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          slots_available: number
          slots_booked?: number
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          date?: string
          time?: string
          address?: string
          city?: string
          state?: string
          latitude?: number
          longitude?: number
          slots_available?: number
          slots_booked?: number
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          updated_at?: string
        }
      }
      camp_registrations: {
        Row: {
          id: string
          camp_id: string
          donor_id: string
          registered_at: string
        }
        Insert: {
          id?: string
          camp_id: string
          donor_id: string
          registered_at?: string
        }
        Update: {
          registered_at?: string
        }
      }
      donation_records: {
        Row: {
          id: string
          donor_id: string
          recipient_id: string | null
          hospital_id: string
          blood_group: string
          units: number
          date: string
          camp_id: string | null
          verified: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          donor_id: string
          recipient_id?: string | null
          hospital_id: string
          blood_group: string
          units: number
          date: string
          camp_id?: string | null
          verified?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          recipient_id?: string | null
          hospital_id?: string
          blood_group?: string
          units?: number
          date?: string
          camp_id?: string | null
          verified?: boolean
          notes?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'donation_request' | 'camp_reminder' | 'donor_match' | 'emergency' | 'admin'
          priority: 'low' | 'medium' | 'high'
          read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'donation_request' | 'camp_reminder' | 'donor_match' | 'emergency' | 'admin'
          priority: 'low' | 'medium' | 'high'
          read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          message?: string
          type?: 'donation_request' | 'camp_reminder' | 'donor_match' | 'emergency' | 'admin'
          priority?: 'low' | 'medium' | 'high'
          read?: boolean
          action_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}