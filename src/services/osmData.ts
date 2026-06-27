// OSM Data Service — fetches real Varanasi geographic data from Overpass API
// Uses the free public Overpass API (no key required)

export interface OSMFeature {
  id: string
  type: 'node' | 'way' | 'relation'
  lat?: number
  lon?: number
  tags: Record<string, string>
  // For ways/relations with geometry
  geometry?: { lat: number; lon: number }[]
  // For polygons
  polygon?: { lat: number; lon: number }[][]
}

export interface OSMData {
  buildings: OSMFeature[]
  roads: OSMFeature[]
  temples: OSMFeature[]
  waterBodies: OSMFeature[]
  waterways: OSMFeature[]
  landuse: OSMFeature[]
  natural: OSMFeature[]
}

// Overpass API endpoint (public, no key needed)
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// Compute bbox string for a given lat, lon, and radius (in meters)
function getBBoxStr(lat: number, lon: number, radius = 500): string {
  const latOffset = radius / 111320
  const lonOffset = radius / (111320 * Math.cos(lat * Math.PI / 180))
  const south = lat - latOffset
  const west = lon - lonOffset
  const north = lat + latOffset
  const east = lon + lonOffset
  return `${south},${west},${north},${east}`
}

// Construct the Overpass QL query
function buildQuery(bbox: string): string {
  return `
    [out:json][bbox:${bbox}][timeout:30];
    (
      // Buildings
      nwr["building"];
      // Roads (major)
      nwr["highway"~"primary|secondary|tertiary|residential|unclassified"];
      // Temples
      nwr["amenity"="place_of_worship"]["religion"="hindu"];
      // Water bodies
      nwr["natural"="water"];
      // Waterways (Ganges!)
      nwr["waterway"="river"];
      nwr["waterway"="stream"];
      // Landuse
      nwr["landuse"~"forest|grass|meadow|recreation_ground|park|garden"];
      // Natural features
      nwr["natural"~"tree|grassland|scrub|wood|peak|cliff"];
    );
    out geom;
  `.replace(/\n\s*/g, ' ')
}

// Parse Overpass response into our data structure
function parseResponse(json: any): OSMData {
  const data: OSMData = {
    buildings: [],
    roads: [],
    temples: [],
    waterBodies: [],
    waterways: [],
    landuse: [],
    natural: [],
  }

  if (!json.elements) return data

  for (const el of json.elements) {
    const feature: OSMFeature = {
      id: el.type + '/' + el.id,
      type: el.type,
      tags: el.tags || {},
    }

    // Get geometry
    if (el.type === 'node') {
      feature.lat = el.lat
      feature.lon = el.lon
    } else if (el.geometry) {
      feature.geometry = el.geometry.map((g: any) => ({ lat: g.lat, lon: g.lon }))
    }

    // Categorize
    if (feature.tags.building) {
      data.buildings.push(feature)
    }
    if (feature.tags.highway) {
      data.roads.push(feature)
    }
    if (feature.tags.amenity === 'place_of_worship' && feature.tags.religion === 'hindu') {
      data.temples.push(feature)
    }
    if (feature.tags.natural === 'water') {
      data.waterBodies.push(feature)
    }
    if (feature.tags.waterway) {
      data.waterways.push(feature)
    }
    if (feature.tags.landuse) {
      data.landuse.push(feature)
    }
    if (feature.tags.natural && !feature.tags.natural.match(/^(water)$/)) {
      data.natural.push(feature)
    }
  }

  return data
}

// Fetch offline pre-packaged city data (Solves API limits and Android capacity)
export async function fetchOfflineCity(cityName: string): Promise<OSMData> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/${cityName}.json`)
    if (!response.ok) throw new Error(`Failed to load ${cityName}.json`)
    const json = await response.json()
    const parsed = parseResponse(json)
    
    console.log(`[OSM] Loaded offline city ${cityName}:`, {
      buildings: parsed.buildings.length,
      roads: parsed.roads.length,
      temples: parsed.temples.length,
      waterBodies: parsed.waterBodies.length,
    })
    
    return parsed
  } catch (err) {
    console.error(`[OSM] Error loading offline city ${cityName}:`, err)
    throw err
  }
}

// Fetch OSM data for a specific area from the public Overpass API (fallback)
export async function fetchLocalData(lat: number, lon: number, radius = 500): Promise<OSMData> {
  const bbox = getBBoxStr(lat, lon, radius)
  const query = buildQuery(bbox)
  const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'MaharajaBharatOdyssey/1.0 (educational project)',
    },
  })

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  const parsed = parseResponse(json)
  
  console.log(`[OSM] Fetched data for ${lat.toFixed(4)},${lon.toFixed(4)}:`, {
    buildings: parsed.buildings.length,
    roads: parsed.roads.length,
    temples: parsed.temples.length,
    waterBodies: parsed.waterBodies.length,
    waterways: parsed.waterways.length,
    landuse: parsed.landuse.length,
    natural: parsed.natural.length,
  })

  return parsed
}

// Example: Fetch specific Indian monument data from OSM
export async function fetchMonumentData(bbox: string): Promise<OSMFeature[]> {
  const query = `
    [out:json][bbox:${bbox}][timeout:25];
    (
      nwr["historic"="monument"];
      nwr["historic"="temple"];
      nwr["historic"="fort"];
      nwr["historic"="ruins"];
    );
    out geom;
  `.replace(/\n\s*/g, ' ')

  const url = `${OVERPASS_URL}?data=${encodeURIComponent(query)}`
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'MaharajaBharatOdyssey/1.0 (educational project)',
    },
  })

  const json = await response.json()
  const features: OSMFeature[] = (json.elements || []).map((el: any) => ({
    id: el.type + '/' + el.id,
    type: el.type,
    lat: el.lat,
    lon: el.lon,
    tags: el.tags || {},
    geometry: el.geometry?.map((g: any) => ({ lat: g.lat, lon: g.lon })),
  }))

  return features
}

// Cache for OSM data tiles to avoid re-fetching
const tileCache: Map<string, OSMData> = new Map()

export async function getMapData(cityName: string, lat: number, lon: number, radius = 500): Promise<OSMData> {
  // Try to load offline pre-packaged city first
  if (cityName && cityName !== 'dynamic') {
    if (tileCache.has(cityName)) return tileCache.get(cityName)!
    try {
      const data = await fetchOfflineCity(cityName)
      tileCache.set(cityName, data)
      return data
    } catch (err) {
      console.warn(`Falling back to live API for ${cityName}`)
    }
  }

  // Simple spatial caching key (approximate grid)
  const gridX = Math.round(lat * 100) // ~1km grid
  const gridY = Math.round(lon * 100)
  const cacheKey = `${gridX},${gridY}`

  if (tileCache.has(cacheKey)) {
    return tileCache.get(cacheKey)!
  }
  
  try {
    const data = await fetchLocalData(lat, lon, radius)
    tileCache.set(cacheKey, data)
    return data
  } catch (err) {
    console.error(`[OSM] Failed to fetch data for ${lat},${lon}:`, err)
    // Return empty data on failure
    return {
      buildings: [],
      roads: [],
      temples: [],
      waterBodies: [],
      waterways: [],
      landuse: [],
      natural: [],
    }
  }
}
