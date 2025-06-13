const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock saved properties data
let savedProperties = [
  {
    id: '1',
    propertyId: '1',
    savedDate: '2024-01-15T10:30:00Z',
    notes: 'Love the open floor plan and natural light'
  },
  {
    id: '2', 
    propertyId: '3',
    savedDate: '2024-01-20T14:15:00Z',
    notes: ''
  }
];

class SavedPropertyService {
  static async getAll() {
    await delay(250);
    return [...savedProperties];
  }

  static async getById(id) {
    await delay(200);
    const saved = savedProperties.find(sp => sp.id === id);
    return saved ? { ...saved } : null;
  }

  static async getByPropertyId(propertyId) {
    await delay(200);
    const saved = savedProperties.find(sp => sp.propertyId === propertyId);
    return saved ? { ...saved } : null;
  }

  static async create(savedProperty) {
    await delay(300);
    const newSaved = {
      ...savedProperty,
      id: Date.now().toString(),
      savedDate: savedProperty.savedDate || new Date().toISOString()
    };
    savedProperties.push(newSaved);
    return { ...newSaved };
  }

  static async update(id, data) {
    await delay(250);
    const index = savedProperties.findIndex(sp => sp.id === id);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    savedProperties[index] = { ...savedProperties[index], ...data };
    return { ...savedProperties[index] };
  }

  static async delete(id) {
    await delay(200);
    const index = savedProperties.findIndex(sp => sp.id === id);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    savedProperties.splice(index, 1);
    return { success: true };
  }

  static async removeByPropertyId(propertyId) {
    await delay(200);
    const index = savedProperties.findIndex(sp => sp.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    savedProperties.splice(index, 1);
    return { success: true };
  }
}

export default SavedPropertyService;