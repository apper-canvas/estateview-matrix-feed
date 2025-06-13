const { ApperClient } = window.ApperSDK;

class SavedPropertyService {
  static getApperClient() {
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  static async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "Tags" } },
          { "Field": { "Name": "Owner" } },
          { "Field": { "Name": "property_id" } },
          { "Field": { "Name": "saved_date" } },
          { "Field": { "Name": "notes" } }
        ]
      };
      
      const response = await client.fetchRecords('saved_property', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: ["Id", "Name", "Tags", "Owner", "property_id", "saved_date", "notes"]
      };
      
      const response = await client.getRecordById('saved_property', id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching saved property with ID ${id}:`, error);
      throw error;
    }
  }

  static async getByPropertyId(propertyId) {
    try {
      const client = this.getApperClient();
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "Tags" } },
          { "Field": { "Name": "Owner" } },
          { "Field": { "Name": "property_id" } },
          { "Field": { "Name": "saved_date" } },
          { "Field": { "Name": "notes" } }
        ],
        "where": [
          {
            "FieldName": "property_id",
            "Operator": "ExactMatch",
            "Values": [propertyId.toString()]
          }
        ]
      };
      
      const response = await client.fetchRecords('saved_property', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching saved property by property ID ${propertyId}:`, error);
      throw error;
    }
  }

  static async create(savedProperty) {
    try {
      const client = this.getApperClient();
      
      // Only include Updateable fields
      const savedPropertyData = {
        Name: savedProperty.Name || `Saved Property ${savedProperty.property_id}`,
        Tags: savedProperty.Tags || '',
        Owner: savedProperty.Owner,
        property_id: parseInt(savedProperty.property_id || savedProperty.propertyId),
        saved_date: savedProperty.saved_date || savedProperty.savedDate || new Date().toISOString(),
        notes: savedProperty.notes || ''
      };
      
      const params = {
        records: [savedPropertyData]
      };
      
      const response = await client.createRecord('saved_property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to save property');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating saved property:", error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const client = this.getApperClient();
      
      // Only include Updateable fields
      const updateData = {
        Id: id,
        ...Object.fromEntries(
          Object.entries(data).filter(([key]) => 
            ['Name', 'Tags', 'Owner', 'property_id', 'saved_date', 'notes'].includes(key)
          )
        )
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await client.updateRecord('saved_property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update saved property');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating saved property:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const client = this.getApperClient();
      const params = {
        RecordIds: [id]
      };
      
      const response = await client.deleteRecord('saved_property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete saved property');
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting saved property:", error);
      throw error;
    }
  }

  static async removeByPropertyId(propertyId) {
    try {
      // First find the saved property by property_id
      const savedProperty = await this.getByPropertyId(propertyId);
      if (!savedProperty) {
        throw new Error('Saved property not found');
      }
      
      // Then delete it by its ID
      return await this.delete(savedProperty.Id);
    } catch (error) {
      console.error("Error removing saved property by property ID:", error);
      throw error;
    }
  }
}

export default SavedPropertyService;