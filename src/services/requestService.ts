import { supabase } from '../lib/supabase'
import { isSupabaseConfigured } from '../lib/supabase'
import { DonationRequest, BloodGroup } from '../types'

export class RequestService {
  static async createRequest(requestData: {
    recipientId: string
    recipientName: string
    bloodGroup: BloodGroup
    unitsNeeded: number
    address: string
    city: string
    state: string
    urgency: 'low' | 'medium' | 'high' | 'emergency'
    hospitalId?: string
    notes?: string
  }) {
    try {
      const { data, error } = await supabase
        .from('donation_requests')
        .insert({
          recipient_id: requestData.recipientId,
          recipient_name: requestData.recipientName,
          blood_group: requestData.bloodGroup,
          units_needed: requestData.unitsNeeded,
          address: requestData.address,
          city: requestData.city,
          state: requestData.state,
          latitude: 0, // Will be geocoded
          longitude: 0,
          urgency: requestData.urgency,
          hospital_id: requestData.hospitalId,
          notes: requestData.notes,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      // Send notifications to matching donors
      await this.notifyMatchingDonors(data.id, requestData.bloodGroup, requestData.city)

      return data
    } catch (error) {
      console.error('Create request error:', error)
      throw error
    }
  }

  static async getRequests(filters?: {
    recipientId?: string
    status?: string
    urgency?: string
  }) {
    try {
      if (!isSupabaseConfigured()) {
        return []; // Return empty array for demo mode
      }

      let query = supabase
        .from('donation_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.recipientId) {
        query = query.eq('recipient_id', filters.recipientId)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.urgency) {
        query = query.eq('urgency', filters.urgency)
      }

      const { data, error } = await query

      if (error) throw error

      return data?.map(request => ({
        id: request.id,
        recipientId: request.recipient_id,
        recipientName: request.recipient_name,
        bloodGroup: request.blood_group as BloodGroup,
        unitsNeeded: request.units_needed,
        location: {
          address: request.address,
          city: request.city,
          state: request.state,
          latitude: request.latitude,
          longitude: request.longitude
        },
        urgency: request.urgency,
        status: request.status,
        matchedDonors: [], // Will be populated separately
        hospitalId: request.hospital_id,
        scheduledDate: request.scheduled_date,
        createdAt: request.created_at
      })) || []
    } catch (error) {
      console.log('Database not available, using demo mode:', error)
      return [] // Return empty array instead of throwing
    }
  }

  static async updateRequestStatus(requestId: string, status: string, updates?: any) {
    try {
      const { data, error } = await supabase
        .from('donation_requests')
        .update({
          status,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update request status error:', error)
      throw error
    }
  }

  private static async notifyMatchingDonors(requestId: string, bloodGroup: BloodGroup, city: string) {
    try {
      // Find matching donors
      const { data: donors, error } = await supabase
        .from('donors')
        .select('user_id')
        .eq('blood_group', bloodGroup)
        .eq('city', city)
        .eq('available', true)

      if (error) throw error

      // Create notifications for matching donors
      if (donors && donors.length > 0) {
        const notifications = donors.map(donor => ({
          user_id: donor.user_id,
          title: 'New Blood Request',
          message: `Urgent ${bloodGroup} blood needed in ${city}`,
          type: 'donation_request' as const,
          priority: 'high' as const,
          action_url: `/requests/${requestId}`
        }))

        await supabase
          .from('notifications')
          .insert(notifications)
      }
    } catch (error) {
      console.error('Notify matching donors error:', error)
    }
  }
}