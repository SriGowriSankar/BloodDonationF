import { supabase } from '../lib/supabase'
import { BloodGroup, BloodInventory } from '../types'

export class InventoryService {
  static async getInventory(hospitalId: string) {
    try {
      const { data, error } = await supabase
        .from('blood_inventory')
        .select('*')
        .eq('hospital_id', hospitalId)

      if (error) throw error

      return data?.map(item => ({
        bloodGroup: item.blood_group as BloodGroup,
        unitsAvailable: item.units_available,
        expiringUnits: item.expiring_units,
        lastUpdated: item.last_updated
      })) || []
    } catch (error) {
      console.error('Get inventory error:', error)
      throw error
    }
  }

  static async updateInventory(
    hospitalId: string,
    bloodGroup: BloodGroup,
    units: number,
    updatedBy: string,
    reason: string
  ) {
    try {
      // Check if inventory exists
      const { data: existing } = await supabase
        .from('blood_inventory')
        .select('*')
        .eq('hospital_id', hospitalId)
        .eq('blood_group', bloodGroup)
        .single()

      if (existing) {
        // Update existing inventory
        const newUnits = Math.max(0, existing.units_available + units)
        
        const { data, error } = await supabase
          .from('blood_inventory')
          .update({
            units_available: newUnits,
            last_updated: new Date().toISOString(),
            updated_by: updatedBy
          })
          .eq('hospital_id', hospitalId)
          .eq('blood_group', bloodGroup)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Create new inventory entry
        const { data, error } = await supabase
          .from('blood_inventory')
          .insert({
            hospital_id: hospitalId,
            blood_group: bloodGroup,
            units_available: Math.max(0, units),
            expiring_units: 0,
            updated_by: updatedBy
          })
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Update inventory error:', error)
      throw error
    }
  }

  static async getInventoryAlerts(hospitalId: string) {
    try {
      const { data, error } = await supabase
        .from('blood_inventory')
        .select('*')
        .eq('hospital_id', hospitalId)

      if (error) throw error

      const alerts: Array<{ type: string; message: string }> = []

      data?.forEach(item => {
        if (item.units_available === 0) {
          alerts.push({
            type: 'critical',
            message: `${item.blood_group} blood is out of stock`
          })
        } else if (item.units_available < 10) {
          alerts.push({
            type: 'warning',
            message: `${item.blood_group} blood is running low (${item.units_available} units remaining)`
          })
        }

        if (item.expiring_units > 0) {
          alerts.push({
            type: 'warning',
            message: `${item.expiring_units} units of ${item.blood_group} blood expiring soon`
          })
        }
      })

      return alerts
    } catch (error) {
      console.error('Get inventory alerts error:', error)
      return []
    }
  }

  static async initializeInventory(hospitalId: string) {
    try {
      const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
      
      const inventoryData = bloodGroups.map(bloodGroup => ({
        hospital_id: hospitalId,
        blood_group: bloodGroup,
        units_available: 0,
        expiring_units: 0,
        updated_by: hospitalId
      }))

      const { data, error } = await supabase
        .from('blood_inventory')
        .insert(inventoryData)
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Initialize inventory error:', error)
      throw error
    }
  }
}