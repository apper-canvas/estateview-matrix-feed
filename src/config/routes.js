import Browse from '../pages/Browse';
import PropertyDetails from '../pages/PropertyDetails';
import MapView from '../pages/MapView';
import SavedProperties from '../pages/SavedProperties';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Home',
    component: Browse
  },
  map: {
    id: 'map',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
  },
  saved: {
    id: 'saved',
    label: 'Saved Properties',
    path: '/saved',
    icon: 'Heart',
    component: SavedProperties
  },
  property: {
    id: 'property',
    label: 'Property Details',
    path: '/property/:id',
    icon: 'Building',
    component: PropertyDetails,
    hidden: true
  }
};

export const routeArray = Object.values(routes);