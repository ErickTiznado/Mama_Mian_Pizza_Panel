// Hook compartido para cargar Google Maps API una sola vez
import { useJsApiLoader } from '@react-google-maps/api';

// API Key de Google Maps
const GOOGLE_MAPS_API_KEY = 'AIzaSyDAiO05_RG1ycHFVfvcUyCEG6g4pfWQ8VY';

// Configuración única para toda la aplicación
const libraries = ['places', 'directions', 'geometry'];

// Hook singleton para Google Maps
export const useGoogleMaps = () => {
  return useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
    preventGoogleFontsLoading: true,
    version: "weekly",
    language: 'es',
    region: 'SV'
  });
};
