import propertyData from '../mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PropertyService {
  static async getAll() {
    await delay(300);
    return [...propertyData];
  }

  static async getById(id) {
    await delay(200);
    const property = propertyData.find(p => p.id === id);
    return property ? { ...property } : null;
  }

  static async search(query) {
    await delay(400);
    if (!query.trim()) {
      return [...propertyData];
    }
    
    const searchTerm = query.toLowerCase();
    return propertyData.filter(property =>
      property.address.toLowerCase().includes(searchTerm) ||
      property.city.toLowerCase().includes(searchTerm) ||
      property.state.toLowerCase().includes(searchTerm) ||
      property.zipCode.includes(searchTerm) ||
      property.propertyType.toLowerCase().includes(searchTerm)
    );
  }

  static async filter(filters) {
    await delay(350);
    let filtered = [...propertyData];

    // Price filtering
    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }

    // Bedrooms filtering
    if (filters.bedroomsMin) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin);
    }

    // Bathrooms filtering
    if (filters.bathroomsMin) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin);
    }

    // Square feet filtering
    if (filters.squareFeetMin) {
      filtered = filtered.filter(p => p.squareFeet >= filters.squareFeetMin);
    }

    // Property type filtering
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType));
    }

    // Features filtering
    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter(p => 
        filters.features.every(feature => 
          p.features && p.features.includes(feature)
        )
      );
    }

    return filtered;
  }

  static async create(property) {
    await delay(300);
    const newProperty = {
      ...property,
      id: Date.now().toString(),
      listingDate: new Date().toISOString()
    };
    return { ...newProperty };
  }

  static async update(id, data) {
    await delay(250);
    const property = propertyData.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property, ...data };
  }

  static async delete(id) {
    await delay(200);
    const property = propertyData.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { success: true };
  }
}

export default PropertyService;