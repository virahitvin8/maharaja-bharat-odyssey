// Coordinate projection: OSM lat/lon (WGS84) to local Three.js space
// Uses Web Mercator projection via proj4
import proj4 from 'proj4'

// Define projections
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs')
proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs')

// Global reference center for the loaded world chunk
export const MAP_ORIGIN = {
  lat: 25.3176, // default to Varanasi
  lon: 82.9739,
}

// Convert lat/lon to Web Mercator meters
function latLonToMercator(lat: number, lon: number): [number, number] {
  return proj4('EPSG:4326', 'EPSG:3857', [lon, lat]) as [number, number]
}

let refMercator = latLonToMercator(MAP_ORIGIN.lat, MAP_ORIGIN.lon)

export function setMapOrigin(lat: number, lon: number) {
  MAP_ORIGIN.lat = lat
  MAP_ORIGIN.lon = lon
  refMercator = latLonToMercator(lat, lon)
}

// Convert lat/lon to local Three.js x/z coordinates (meters, centered on MAP_ORIGIN)
// Returns [x, z] where x = easting, z = northing (in Three.js coordinate system)
export function latLonToLocal(lat: number, lon: number): [number, number] {
  const [mx, my] = latLonToMercator(lat, lon)
  return [
    mx - refMercator[0], // x = east-west (Three.js X)
    my - refMercator[1], // z = north-south (Three.js Z, since Z goes "up" in math but "into screen" in Three.js)
  ]
  // Note: In Three.js, +Z is toward the viewer, -Z is into the screen.
  // For north to be "up" on screen, we need to negate Z or rotate the scene.
  // We'll handle this with a scene rotation in the parent component.
}

// Convert lat/lon to local coordinates with Z-up orientation
// Returns [x, z] where +z = north for Three.js (needs scene rotation -PI/2 on Y or camera positioning)
export function latLonToLocalWorld(lat: number, lon: number): [number, number] {
  const [mx, my] = latLonToMercator(lat, lon)
  return [
    mx - refMercator[0],  // east-west
    -(my - refMercator[1]), // north-south (negated so +Z = south on screen, can rotate camera instead)
  ]
}

// Get building height from OSM tags (returns meters)
export function getBuildingHeight(tags: Record<string, string>): number {
  if (tags.height) {
    const h = parseFloat(tags.height)
    if (!isNaN(h) && h > 0) return Math.min(h, 50)
  }
  if (tags['building:levels']) {
    const levels = parseInt(tags['building:levels'])
    if (!isNaN(levels) && levels > 0) return levels * 3.5 // ~3.5m per floor
  }
  return 6 // default height for buildings without height data
}

// Get building color based on OSM tags and feature id
export function getBuildingColor(tags: Record<string, string>, featureId?: string): string {
  if (tags.wall || tags.material) {
    const material = (tags.wall || tags.material).toLowerCase()
    if (material.includes('brick')) return '#b84a2a'
    if (material.includes('stone')) return '#9a8a7a'
    if (material.includes('wood')) return '#6b4a2a'
    if (material.includes('glass')) return '#88aacc'
    if (material.includes('concrete')) return '#b0b0b0'
    if (material.includes('plaster') || material.includes('render')) return '#e8dcc8'
  }
  if (tags['building:colour'] || tags['building:color']) return '#' + (tags['building:colour'] || tags['building:color']).replace('#', '')
  if (tags.roof?.toLowerCase() === 'tile') return '#c86040'
  if (tags.building === 'cathedral' || tags.building === 'church' || tags.building === 'temple')
    return '#e8dcc8'
  if (tags.building === 'school' || tags.building === 'university') return '#d4c4a8'
  if (tags.building === 'hospital') return '#e8c8c8'
  if (tags.building === 'government') return '#d4d4e8'
  if (tags.building === 'industrial' || tags.building === 'warehouse') return '#b0a090'
  if (tags.building === 'garage') return '#908070'
  
  // Deterministic color from feature ID
  const colors = ['#d4c8b0', '#c8b8a0', '#e0d4c0', '#b8a890', '#d0c0a8', '#e8dccc', '#c0b098', '#d8c8b0']
  let hash = 0
  const idStr = featureId || tags.name || tags.building || ''
  for (const c of idStr) hash = (hash * 31 + c.charCodeAt(0)) & 0xFFFF
  return colors[hash % colors.length]
}
