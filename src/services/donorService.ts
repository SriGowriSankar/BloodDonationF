import { supabase } from '../lib/supabase'
import { Donor, BloodGroup } from '../types'

export class DonorService {
  static async searchDonors(filters: {
    bloodGroup?: BloodGroup
    city?: string
    available?: boolean
    maxDistance?: number
  }) {
    try {
      let query = supabase
        .from('donors')
        .select(`
          *,
          users!inner(name, email, phone, verified)
        `)

      if (filters.bloodGroup) {
        query = query.eq('blood_group', filters.bloodGroup)
      }

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }

      if (filters.available !== undefined) {
        query = query.eq('available', filters.available)
      }

      const { data, error } = await query

      if (error) throw error

      return data?.map(donor => ({
        id: donor.id,
        name: donor.users.name,
        email: donor.users.email,
        phone: donor.users.phone,
        role: 'donor' as const,
        verified: donor.users.verified,
        createdAt: donor.created_at,
        bloodGroup: donor.blood_group as BloodGroup,
        age: donor.age,
        gender: donor.gender,
        location: {
          address: donor.address,
          city: donor.city,
          state: donor.state,
          latitude: donor.latitude,
          longitude: donor.longitude
        },
        lastDonationDate: donor.last_donation_date,
        available: donor.available,
        medicalConditions: donor.medical_conditions,
        rating: donor.rating,
        donationHistory: [] // Will be populated separately
      })) || []
    } catch (error) {
      console.error('Search donors error:', error)
      throw error
    }
  }

  static async updateDonorProfile(userId: string, updates: Partial<Donor>) {
    try {
      const { data, error } = await supabase
        .from('donors')
        .update({
          blood_group: updates.bloodGroup,
          age: updates.age,
          gender: updates.gender,
          address: updates.location?.address,
          city: updates.location?.city,
          state: updates.location?.state,
          latitude: updates.location?.latitude,
          longitude: updates.location?.longitude,
          available: updates.available,
          medical_conditions: updates.medicalConditions,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update donor profile error:', error)
      throw error
    }
  }

  static async getDonorProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select(`
          *,
          users!inner(name, email, phone, verified)
        `)
        .eq('user_id', userId)
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.users.name,
        email: data.users.email,
        phone: data.users.phone,
        role: 'donor' as const,
        verified: data.users.verified,
        createdAt: data.created_at,
        bloodGroup: data.blood_group as BloodGroup,
        age: data.age,
        gender: data.gender,
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          latitude: data.latitude,
          longitude: data.longitude
        },
        lastDonationDate: data.last_donation_date,
        available: data.available,
        medicalConditions: data.medical_conditions,
        rating: data.rating,
        donationHistory: []
      }
    } catch (error) {
      console.error('Get donor profile error:', error)
      throw error
    }
  }

  static async recordDonation(donationData: {
    donorId: string
    recipientId?: string
    hospitalId: string
    bloodGroup: BloodGroup
    units: number
    campId?: string
    notes?: string
  }) {
    try {
      const { data, error } = await supabase
        .from('donation_records')
        .insert({
          donor_id: donationData.donorId,
          recipient_id: donationData.recipientId,
          hospital_id: donationData.hospitalId,
          blood_group: donationData.bloodGroup,
          units: donationData.units,
          date: new Date().toISOString(),
          camp_id: donationData.campId,
          notes: donationData.notes,
          verified: false
        })
        .select()
        .single()

      if (error) throw error

      // Update donor's last donation date
      await supabase
        .from('donors')
        .update({
          last_donation_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', donationData.donorId)

      return data
    } catch (error) {
      console.error('Record donation error:', error)
      throw error
    }
  }
}