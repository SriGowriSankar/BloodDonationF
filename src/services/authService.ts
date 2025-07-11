import { supabase } from '../lib/supabase'
import { User } from '../types'

export class AuthService {
  static async signUp(email: string, password: string, userData: Partial<User>) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            name: userData.name || '',
            phone: userData.phone || '',
            role: userData.role || 'donor',
            verified: false,
            status: 'active'
          })
          .select()
          .single()

        if (profileError) throw profileError

        // If donor, create donor profile
        if (userData.role === 'donor') {
          const { error: donorError } = await supabase
            .from('donors')
            .insert({
              user_id: authData.user.id,
              blood_group: 'A+', // Default, will be updated in profile
              age: 25,
              gender: 'male',
              address: '',
              city: '',
              state: '',
              latitude: 0,
              longitude: 0,
              available: true
            })

          if (donorError) throw donorError
        }

        // If hospital, create hospital profile
        if (userData.role === 'hospital') {
          const { error: hospitalError } = await supabase
            .from('hospitals')
            .insert({
              user_id: authData.user.id,
              address: '',
              contact_person: userData.name || '',
              license_number: '',
              verification_status: 'pending'
            })

          if (hospitalError) throw hospitalError
        }

        return { user: userProfile, session: authData.session }
      }

      throw new Error('User creation failed')
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Get user profile
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profileError) throw profileError

        return { user: userProfile, session: authData.session }
      }

      throw new Error('Sign in failed')
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) return null

      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) throw error

      return userProfile
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  static async updateProfile(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }
}