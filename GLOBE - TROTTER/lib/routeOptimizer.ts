// Haversine formula to compute great-circle distance between two points in km
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface LocatableItem {
  id?: string;
  name?: string;
  lat?: number;
  lng?: number;
  cities?: {
    name?: string;
    country?: string;
    lat?: number;
    lng?: number;
  };
  [key: string]: any;
}

// Nearest Neighbor Route Optimization
export function optimizeRouteNearestNeighbor<T extends LocatableItem>(
  items: T[]
): { optimized: T[]; totalDistanceKm: number } {
  if (items.length <= 2) {
    return { optimized: [...items], totalDistanceKm: calculateTotalDistance(items) };
  }

  const unvisited = [...items];
  const route: T[] = [];

  // Start with first element as starting point
  let current = unvisited.shift()!;
  route.push(current);

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    const curLat = current.lat ?? (current.cities?.lat ?? 48.8566);
    const curLng = current.lng ?? (current.cities?.lng ?? 2.3522);

    for (let i = 0; i < unvisited.length; i++) {
      const item = unvisited[i];
      const itemLat = item.lat ?? (item.cities?.lat ?? 48.8566);
      const itemLng = item.lng ?? (item.cities?.lng ?? 2.3522);

      const dist = haversineDistance(curLat, curLng, itemLat, itemLng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    current = unvisited.splice(nearestIdx, 1)[0];
    route.push(current);
  }

  return {
    optimized: route,
    totalDistanceKm: Math.round(calculateTotalDistance(route)),
  };
}

export function calculateTotalDistance<T extends LocatableItem>(items: T[]): number {
  if (items.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < items.length - 1; i++) {
    const a = items[i];
    const b = items[i + 1];
    const lat1 = a.lat ?? (a.cities?.lat ?? 48.8566);
    const lng1 = a.lng ?? (a.cities?.lng ?? 2.3522);
    const lat2 = b.lat ?? (b.cities?.lat ?? 48.8566);
    const lng2 = b.lng ?? (b.cities?.lng ?? 2.3522);
    total += haversineDistance(lat1, lng1, lat2, lng2);
  }
  return total;
}

// Generate multi-stop Google Maps directions URL
export function generateGoogleMapsDirectionsUrl(
  stops: Array<{ name?: string; country?: string; lat?: number; lng?: number; cities?: { name?: string; country?: string } }>
): string {
  if (stops.length === 0) return 'https://www.google.com/maps';

  const waypoints = stops.map((s) => {
    const cityName = s.cities?.name || s.name || 'Paris';
    const country = s.cities?.country || s.country || '';
    return encodeURIComponent(`${cityName}${country ? `, ${country}` : ''}`);
  });

  return `https://www.google.com/maps/dir/${waypoints.join('/')}`;
}
