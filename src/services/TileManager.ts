// Tile Manager — streams all of India by dynamically loading OSM tiles around the character
// Maintains a cache of loaded tiles and merges them into a unified scene
import { fetchLocalData } from './osmData'
import type { OSMData, OSMFeature } from './osmData'
import { setMapOrigin } from '../utils/projection'

export interface Tile {
  key: string
  lat: number
  lon: number
  data: OSMData
  loadedAt: number
  lastAccessAt: number
}

// Tile cache — stores all fetched tiles
const tileCache = new Map<string, Tile>()

// Track character's last known position for tile preloading
let lastCharLat = 0
let lastCharLon = 0
let currentOriginLat = 25.3176 // default Varanasi
let currentOriginLon = 82.9739

// Tile grid size in degrees (~1.1km at equator, ~0.7km at Indian latitudes)
const TILE_GRID_SIZE = 0.01 // degrees (~1km)

// Radius in grid cells to fetch around the player
const FETCH_RADIUS_CELLS = 2 // will fetch a 5x5 grid of tiles

// Max distance in KM before unloading a tile
const UNLOAD_DISTANCE_KM = 3

// Callbacks for scene updates
type TileUpdateCallback = (tiles: Tile[]) => void
let onTilesChanged: TileUpdateCallback | null = null

export function setTileCallback(cb: TileUpdateCallback) {
  onTilesChanged = cb
}

// Convert a lat/lon to a tile grid key
function getTileKey(lat: number, lon: number): string {
  const gx = Math.round(lat / TILE_GRID_SIZE)
  const gy = Math.round(lon / TILE_GRID_SIZE)
  return `${gx},${gy}`
}

// Get all tiles that should be loaded for a given position
function getRequiredTileKeys(lat: number, lon: number): string[] {
  const gx = Math.round(lat / TILE_GRID_SIZE)
  const gy = Math.round(lon / TILE_GRID_SIZE)
  const keys: string[] = []
  
  for (let dx = -FETCH_RADIUS_CELLS; dx <= FETCH_RADIUS_CELLS; dx++) {
    for (let dy = -FETCH_RADIUS_CELLS; dy <= FETCH_RADIUS_CELLS; dy++) {
      keys.push(`${gx + dx},${gy + dy}`)
    }
  }
  return keys
}

// Get center lat/lon for a tile key
function tileKeyToLatLon(key: string): [number, number] {
  const [gx, gy] = key.split(',').map(Number)
  return [gx * TILE_GRID_SIZE, gy * TILE_GRID_SIZE]
}

// Haversine distance in km
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Merge multiple OSMData into one (deduplicating by ID)
function mergeOSMData(tiles: Tile[]): OSMData {
  const seenIds = new Set<string>()
  
  function mergeCategory(items: OSMFeature[]): OSMFeature[] {
    const merged: OSMFeature[] = []
    for (const item of items) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id)
        merged.push(item)
      }
    }
    return merged
  }

  return {
    buildings: mergeCategory(tiles.flatMap(t => t.data.buildings)),
    roads: mergeCategory(tiles.flatMap(t => t.data.roads)),
    temples: mergeCategory(tiles.flatMap(t => t.data.temples)),
    waterBodies: mergeCategory(tiles.flatMap(t => t.data.waterBodies)),
    waterways: mergeCategory(tiles.flatMap(t => t.data.waterways)),
    landuse: mergeCategory(tiles.flatMap(t => t.data.landuse)),
    natural: mergeCategory(tiles.flatMap(t => t.data.natural)),
  }
}

// Main fetch queue to avoid flooding the Overpass API
const fetchQueue: Array<{ key: string; lat: number; lon: number }> = []
let isFetching = false

async function processFetchQueue() {
  if (isFetching || fetchQueue.length === 0) return
  isFetching = true
  
  const job = fetchQueue.shift()!
  try {
    const data = await fetchLocalData(job.lat, job.lon, 800)
    
    // Check if this tile was already loaded while we were fetching
    if (!tileCache.has(job.key)) {
      const tile: Tile = {
        key: job.key,
        lat: job.lat,
        lon: job.lon,
        data,
        loadedAt: Date.now(),
        lastAccessAt: Date.now(),
      }
      tileCache.set(job.key, tile)
      console.log(`[TileManager] Loaded tile ${job.key}: ${data.buildings.length}b ${data.roads.length}r`)
      
      // Notify scene to update
      if (onTilesChanged) {
        onTilesChanged(Array.from(tileCache.values()))
      }
    }
  } catch (err) {
    console.warn(`[TileManager] Failed to fetch tile ${job.key}:`, err)
  }
  
  isFetching = false
  // Process next in queue
  setTimeout(processFetchQueue, 100) // 100ms between fetches to avoid rate limiting
}

// Queue a tile fetch
function queueTileFetch(key: string, lat: number, lon: number) {
  // Don't queue if already cached
  if (tileCache.has(key)) return
  // Don't queue if already in queue
  if (fetchQueue.some(j => j.key === key)) return
  
  fetchQueue.push({ key, lat, lon })
  
  // Start processing if not already running
  if (!isFetching) {
    processFetchQueue()
  }
}

// Set the origin for this session
export function initializeTileManager(lat: number, lon: number) {
  currentOriginLat = lat
  currentOriginLon = lon
  setMapOrigin(lat, lon)
  lastCharLat = lat
  lastCharLon = lon
  
  // Clear existing cache
  tileCache.clear()
  fetchQueue.length = 0
  
  console.log(`[TileManager] Initialized at ${lat.toFixed(4)}, ${lon.toFixed(4)}`)
  
  // Fetch initial tiles
  updatePosition(lat, lon)
}

// Update character position — called every frame
export function updatePosition(lat: number, lon: number) {
  // Only check if moved more than 50m
  if (haversineKm(lastCharLat, lastCharLon, lat, lon) < 0.05) return
  
  lastCharLat = lat
  lastCharLon = lon
  
  const requiredKeys = getRequiredTileKeys(lat, lon)
  
  // Fetch missing tiles
  for (const key of requiredKeys) {
    const [tileLat, tileLon] = tileKeyToLatLon(key)
    queueTileFetch(key, tileLat, tileLon)
  }
  
  // Unload distant tiles
  const keysToDelete: string[] = []
  for (const [key, tile] of tileCache) {
    const dist = haversineKm(lat, lon, tile.lat, tile.lon)
    if (dist > UNLOAD_DISTANCE_KM) {
      keysToDelete.push(key)
    }
  }
  
  for (const key of keysToDelete) {
    tileCache.delete(key)
    console.log(`[TileManager] Unloaded tile ${key}`)
  }
  
  // Notify scene if tiles changed
  if (keysToDelete.length > 0 && onTilesChanged) {
    onTilesChanged(Array.from(tileCache.values()))
  }
}

// Get all currently loaded tiles merged into a single OSMData
export function getMergedTileData(): OSMData | null {
  if (tileCache.size === 0) return null
  
  const tiles = Array.from(tileCache.values())
  return mergeOSMData(tiles)
}

// Get the current character's GPS position (for scene use)
export function getCharacterGPS(): [number, number] {
  return [lastCharLat, lastCharLon]
}

// Check if loading is complete for current area
export function isAreaLoaded(lat: number, lon: number): boolean {
  const requiredKeys = getRequiredTileKeys(lat, lon)
  return requiredKeys.every(key => tileCache.has(key))
}

// Get loading progress (0-100)
export function getLoadProgress(lat: number, lon: number): number {
  const requiredKeys = getRequiredTileKeys(lat, lon)
  if (requiredKeys.length === 0) return 100
  const loaded = requiredKeys.filter(key => tileCache.has(key)).length
  return Math.round((loaded / requiredKeys.length) * 100)
}
