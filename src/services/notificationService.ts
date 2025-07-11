import { supabase } from '../lib/supabase'
import { Notification } from '../types'

export class NotificationService {
  static async getNotifications(userId: string) {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_') || supabaseKey.includes('your_')) {
        return []; // Return empty array for demo mode
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        read: notification.read,
        actionUrl: notification.action_url,
        createdAt: notification.created_at
      })) || []
    } catch (error) {
      console.log('Database not available, using demo mode:', error)
      return [] // Return empty array instead of throwing
    }
  }

  static async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Mark as read error:', error)
      throw error
    }
  }

  static async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Delete notification error:', error)
      throw error
    }
  }

  static async createNotification(notificationData: {
    userId: string
    title: string
    message: string
    type: 'donation_request' | 'camp_reminder' | 'donor_match' | 'emergency' | 'admin'
    priority: 'low' | 'medium' | 'high'
    actionUrl?: string
  }) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notificationData.userId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          priority: notificationData.priority,
          action_url: notificationData.actionUrl,
          read: false
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Create notification error:', error)
      throw error
    }
  }

  static async sendBulkNotifications(notifications: Array<{
    userId: string
    title: string
    message: string
    type: 'donation_request' | 'camp_reminder' | 'donor_match' | 'emergency' | 'admin'
    priority: 'low' | 'medium' | 'high'
    actionUrl?: string
  }>) {
    try {
      const notificationData = notifications.map(notification => ({
        user_id: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        action_url: notification.actionUrl,
        read: false
      }))

      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Send bulk notifications error:', error)
      throw error
    }
  }
}