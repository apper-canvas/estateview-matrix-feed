const { ApperClient } = window.ApperSDK;

class PropertyService {
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
          { "Field": { "Name": "address" } },
          { "Field": { "Name": "city" } },
          { "Field": { "Name": "state" } },
          { "Field": { "Name": "zip_code" } },
          { "Field": { "Name": "price" } },
          { "Field": { "Name": "bedrooms" } },
          { "Field": { "Name": "bathrooms" } },
          { "Field": { "Name": "square_feet" } },
          { "Field": { "Name": "property_type" } },
          { "Field": { "Name": "year_built" } },
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "features" } },
          { "Field": { "Name": "images" } },
          { "Field": { "Name": "coordinates" } },
          { "Field": { "Name": "listing_date" } },
          { "Field": { "Name": "status" } }
        ]
      };
      
      const response = await client.fetchRecords('property', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          "Id", "Name", "Tags", "Owner", "address", "city", "state", "zip_code",
          "price", "bedrooms", "bathrooms", "square_feet", "property_type", 
          "year_built", "description", "features", "images", "coordinates", 
          "listing_date", "status"
        ]
      };
      
      const response = await client.getRecordById('property', id, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  }

  static async create(property) {
    try {
      const client = this.getApperClient();
      
      // Only include Updateable fields
      const propertyData = {
        Name: property.Name,
        Tags: property.Tags,
        Owner: property.Owner,
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zip_code,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        square_feet: property.square_feet,
        property_type: property.property_type,
        year_built: property.year_built,
        description: property.description,
        features: property.features,
        images: property.images,
        coordinates: property.coordinates,
        listing_date: property.listing_date,
        status: property.status
      };
      
      const params = {
        records: [propertyData]
      };
      
      const response = await client.createRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create property');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating property:", error);
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
            ['Name', 'Tags', 'Owner', 'address', 'city', 'state', 'zip_code',
             'price', 'bedrooms', 'bathrooms', 'square_feet', 'property_type',
             'year_built', 'description', 'features', 'images', 'coordinates',
             'listing_date', 'status'].includes(key)
          )
        )
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await client.updateRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update property');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const client = this.getApperClient();
      const params = {
        RecordIds: [id]
      };
      
      const response = await client.deleteRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete property');
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }
}

export default PropertyService;