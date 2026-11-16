export interface Place {
  name: string;
  lat: number;
  lng: number;
}

/**
 * Comunas y campus de Santiago con coordenadas aproximadas. Permite dibujar la ruta
 * en el mapa sin depender de un servicio de geocodificación (ni de una API key).
 */
export const PLACES: readonly Place[] = [
  { name: 'Campus San Joaquín', lat: -33.4985, lng: -70.614 },
  { name: 'Campus Casa Central', lat: -33.4411, lng: -70.6405 },
  { name: 'Santiago Centro', lat: -33.4489, lng: -70.6693 },
  { name: 'Estación Central', lat: -33.459, lng: -70.699 },
  { name: 'Independencia', lat: -33.414, lng: -70.665 },
  { name: 'Huechuraba', lat: -33.368, lng: -70.634 },
  { name: 'La Cisterna', lat: -33.529, lng: -70.664 },
  { name: 'La Florida', lat: -33.5227, lng: -70.599 },
  { name: 'La Reina', lat: -33.445, lng: -70.54 },
  { name: 'Las Condes', lat: -33.408, lng: -70.567 },
  { name: 'Lo Barnechea', lat: -33.352, lng: -70.518 },
  { name: 'Macul', lat: -33.49, lng: -70.599 },
  { name: 'Maipú', lat: -33.511, lng: -70.758 },
  { name: 'Ñuñoa', lat: -33.4569, lng: -70.5975 },
  { name: 'Peñalolén', lat: -33.486, lng: -70.542 },
  { name: 'Providencia', lat: -33.4314, lng: -70.6093 },
  { name: 'Pudahuel', lat: -33.44, lng: -70.76 },
  { name: 'Puente Alto', lat: -33.6117, lng: -70.5758 },
  { name: 'Quilicura', lat: -33.366, lng: -70.729 },
  { name: 'Recoleta', lat: -33.406, lng: -70.64 },
  { name: 'San Bernardo', lat: -33.5922, lng: -70.6996 },
  { name: 'San Joaquín', lat: -33.496, lng: -70.628 },
  { name: 'San Miguel', lat: -33.497, lng: -70.651 },
  { name: 'Vitacura', lat: -33.38, lng: -70.572 },
];

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Busca el lugar conocido que mejor coincide con un texto libre (sin distinguir tildes ni mayúsculas). */
export function findPlace(text: string): Place | null {
  const query = normalize(text);
  if (query.length < 3) return null;
  // Se prefieren los nombres más largos: «Campus San Joaquín» antes que «San Joaquín».
  const byLength = [...PLACES].sort((a, b) => b.name.length - a.name.length);
  return (
    byLength.find((p) => query.includes(normalize(p.name))) ??
    byLength.find((p) => normalize(p.name).includes(query)) ??
    null
  );
}

/** Distancia en línea recta (km) entre dos lugares, con la fórmula del haversine. */
export function distanceKm(a: Place, b: Place): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
