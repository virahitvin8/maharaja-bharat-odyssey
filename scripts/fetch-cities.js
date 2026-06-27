import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CITIES = {
  // Pataliputra (Patna)
  'pataliputra': { lat: 25.612, lon: 85.158, radius: 1000 },
  // Vijayanagara (Hampi)
  'vijayanagara': { lat: 15.335, lon: 76.460, radius: 1000 },
  // Kashi (Varanasi)
  'kashi': { lat: 25.3176, lon: 82.9739, radius: 1000 },
  // Agra
  'agra': { lat: 27.1751, lon: 78.0421, radius: 1000 },
  // Madurai
  'madurai': { lat: 9.9252, lon: 78.1198, radius: 1000 },
  // Delhi
  'delhi': { lat: 28.6139, lon: 77.2090, radius: 1000 }
}

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

function getBBoxStr(lat, lon, radius) {
  const latOffset = radius / 111320
  const lonOffset = radius / (111320 * Math.cos(lat * Math.PI / 180))
  return `${lat - latOffset},${lon - lonOffset},${lat + latOffset},${lon + lonOffset}`
}

function buildQuery(bbox) {
  return `
    [out:json][bbox:${bbox}][timeout:30];
    (
      nwr["building"];
      nwr["highway"~"primary|secondary|tertiary|residential|unclassified"];
      nwr["amenity"="place_of_worship"]["religion"="hindu"];
      nwr["historic"="monument"];
      nwr["natural"="water"];
      nwr["waterway"="river"];
      nwr["waterway"="stream"];
      nwr["landuse"~"forest|grass|meadow|recreation_ground|park|garden"];
      nwr["natural"~"tree|grassland|scrub|wood"];
    );
    out geom;
  `.replace(/\n\s*/g, ' ')
}

function fetchOsm(query) {
  return new Promise((resolve, reject) => {
    const data = encodeURIComponent(query)
    const req = https.request(`${OVERPASS_URL}?data=${data}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MaharajaBharatOdyssey/1.0 (Offline Cache Build)'
      }
    }, res => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        if (res.statusCode === 200) resolve(JSON.parse(body))
        else reject(new Error(`Status ${res.statusCode}: ${body}`))
      })
    })
    req.on('error', reject)
    req.end()
  })
}

async function run() {
  const dataDir = path.join(__dirname, '../public/data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

  for (const [name, config] of Object.entries(CITIES)) {
    console.log(`Fetching ${name}...`)
    try {
      const bbox = getBBoxStr(config.lat, config.lon, config.radius)
      const query = buildQuery(bbox)
      const data = await fetchOsm(query)
      
      const outPath = path.join(dataDir, `${name}.json`)
      fs.writeFileSync(outPath, JSON.stringify(data))
      
      console.log(`Saved ${name} (${data.elements?.length || 0} elements) to ${outPath}`)
      
      // Wait a bit to avoid hitting Overpass rate limits
      await new Promise(r => setTimeout(r, 2000))
    } catch (err) {
      console.error(`Failed to fetch ${name}:`, err)
    }
  }
}

run()
