import BrowsePage from '@/components/pages/BrowsePage';
import PropertyDetailsPage from '@/components/pages/PropertyDetailsPage';
import MapViewPage from '@/components/pages/MapViewPage';
import SavedPropertiesPage from '@/components/pages/SavedPropertiesPage';
import HomePage from '@/components/pages/HomePage';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Home',
component: BrowsePage
  },
  map: {
    id: 'map',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
component: MapViewPage
  },
  saved: {
    id: 'saved',
    label: 'Saved Properties',
    path: '/saved',
    icon: 'Heart',
component: SavedPropertiesPage
  },
property: {
    id: 'property',
    label: 'Property Details',
    path: '/property/:id',
    icon: 'Building',
    component: PropertyDetailsPage,
    hidden: true
  },
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: HomePage,
    hidden: true
  }
};

export const routeArray = Object.values(routes);