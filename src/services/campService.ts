import { supabase } from '../lib/supabase'
import { isSupabaseConfigured } from '../lib/supabase'
import { BloodCamp } from '../types'

export class CampService {
  static async createCamp(campData: {
    hospitalId: string
    title: string
    description?: string
    date: string
    time: string
    address: string
    city: string
    state: string
    slotsAvailable: number
  }) {
    try {
      const { data, error } = await supabase
        .from('blood_camps')
        .insert({
          hospital_id: campData.hospitalId,
          title: campData.title,
          description: campData.description,
          date: campData.date,
          time: campData.time,
          address: campData.address,
          city: campData.city,
          state: campData.state,
          latitude: 0, // Will be geocoded
          longitude: 0,
          slots_available: campData.slotsAvailable,
          slots_booked: 0,
          status: 'upcoming'
        })
        .select()
        .single()

      if (error) throw error

      // Notify donors in the area
      await this.notifyLocalDonors(data.id, campData.city)

      return data
    } catch (error) {
      console.error('Create camp error:', error)
      throw error
    }
  }

  static async getCamps(filters?: {
    hospitalId?: string
    status?: string
    city?: string
  }) {
    try {
      if (!isSupabaseConfigured()) {
        return []; // Return empty array for demo mode
      }

      // Simplified query without complex joins for now
      let query = supabase
        .from('blood_camps')
        .select('*')
        .order('date', { ascending: true })

      if (filters?.hospitalId) {
        query = query.eq('hospital_id', filters.hospitalId)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }

      const { data, error } = await query

      if (error) throw error

      return data?.map(camp => ({
        id: camp.id,
        hospitalId: camp.hospital_id,
        hospitalName: camp.hospitals.users.name,
        title: camp.title,
        date: camp.date,
        time: camp.time,
        location: {
          address: camp.address,
          city: camp.city,
          state: camp.state,
          latitude: camp.latitude,
          longitude: camp.longitude
        },
        slotsAvailable: camp.slots_available,
        slotsBooked: camp.slots_booked,
        registeredDonors: [], // Will be populated separately
        status: camp.status
      })) || []
    } catch (error) {
      console.log('Database not available, using demo mode:', error)
      return [] // Return empty array instead of throwing
    }
  }

  static async registerForCamp(campId: string, donorId: string) {
    try {
      // Check if already registered
      const { data: existing } = await supabase
        .from('camp_registrations')
        .select('id')
        .eq('camp_id', campId)
        .eq('donor_id', donorId)
        .single()

      if (existing) {
        throw new Error('Already registered for this camp')
      }

      // Register for camp
      const { error: regError } = await supabase
        .from('camp_registrations')
        .insert({
          camp_id: campId,
          donor_id: donorId
        })

      if (regError) throw regError

      // Update slots booked
      const { error: updateError } = await supabase.rpc('increment_camp_slots', {
        camp_id: campId
      })

      if (updateError) throw updateError

      return true
    } catch (error) {
      console.error('Register for camp error:', error)
      throw error
    }
  }

  private static async notifyLocalDonors(campId: string, city: string) {
    try {
      // Find donors in the city
      const { data: donors, error } = await supabase
        .from('donors')
        .select('user_id')
        .eq('city', city)
        .eq('available', true)

      if (error) throw error

      // Create notifications
      if (donors && donors.length > 0) {
        const notifications = donors.map(donor => ({
          user_id: donor.user_id,
          title: 'New Blood Camp',
          message: `Blood donation camp scheduled in ${city}`,
          type: 'camp_reminder' as const,
          priority: 'medium' as const,
          action_url: `/camps/${campId}`
        }))

        await supabase
          .from('notifications')
          .insert(notifications)
      }
    } catch (error) {
      console.error('Notify local donors error:', error)
    }
  }
}