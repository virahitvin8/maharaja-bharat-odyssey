// India Map Screen — interactive map showing all explorable cities
import { useState } from 'react'
import { INDIAN_CITIES, INDIA_REGIONS, type IndianLocation } from '../../data/indianCities'
import { POWERFUL_TEMPLES, TEMPLE_ERAS, type PowerfulTemple } from '../../data/powerfulTemples'

// Map dimensions and city pin positions (approximate India-shaped layout)
// These are SVG coordinates mapped to a 500x580 viewBox of India
function getPinPosition(lat: number, lon: number): { x: number; y: number } {
  // India bounding box: 6°N to 37°N, 68°E to 97°E
  // Map to viewBox: x: 50-450 (400px), y: 20-560 (540px)
  const x = 50 + ((lon - 68) / 29) * 400
  const y = 20 + ((37 - lat) / 31) * 540
  return { x: Math.max(30, Math.min(470, x)), y: Math.max(10, Math.min(570, y)) }
}

// Merge cities and temples into one combined list for the map
interface MapDest {
  id: string; name: string; state: string; lat: number; lon: number;
  description: string; emoji: string; highlights: string[];
  type: 'city' | 'temple'; destinationId: string;
}
const ALL_DESTINATIONS: MapDest[] = [
  ...INDIAN_CITIES.map(c => ({ ...c, type: 'city' as const, destinationId: c.id })),
  ...POWERFUL_TEMPLES.map(t => ({ 
    id: t.id, name: t.name, state: t.state,
    lat: t.lat, lon: t.lon,
    description: `${t.century} · ${t.dynasty} · ${t.location}`,
    emoji: t.emoji, highlights: t.highlights,
    type: 'temple' as const, destinationId: t.id,
  })),
]

interface IndiaMapScreenProps {
  onSelectCity: (city: IndianLocation | PowerfulTemple) => void
  currentCity?: string
}

export function IndiaMapScreen({ onSelectCity, currentCity }: IndiaMapScreenProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [showTemples, setShowTemples] = useState(true)
  const [hoveredDest, setHoveredDest] = useState<string | null>(null)
  const [selectedEra, setSelectedEra] = useState<string | null>(null)

  // Filter destinations
  const visibleDestinations = ALL_DESTINATIONS.filter(d => {
    if (!showTemples && d.type === 'temple') return false
    if (selectedRegion) {
      const region = INDIA_REGIONS.find(r => r.name === selectedRegion)
      if (region && d.type === 'city' && !region.cities.includes(d.id)) return false
    }
    if (selectedEra && d.type === 'temple') {
      const era = TEMPLE_ERAS.find(e => e.name === selectedEra)
      if (era && !era.temples.includes(d.destinationId)) return false
    }
    return true
  })

  const hovered = ALL_DESTINATIONS.find(d => d.id === hoveredDest)
  const hoveredTemple = hovered?.type === 'temple' ? POWERFUL_TEMPLES.find(t => t.id === hovered?.destinationId) : null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a0a1a 100%)',
      color: '#fff', fontFamily: "'Cinzel', serif",
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px', textAlign: 'center',
        borderBottom: '1px solid rgba(255,153,51,0.15)',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700,
          background: 'linear-gradient(135deg, #FF9933, #FFD700)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 4,
        }}>
          🗺️ Explore India
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
          Select a city to explore its real streets from OpenStreetMap
        </p>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar — Regions + Temples */}
        <div style={{
          width: 150, padding: '12px 8px',
          borderRight: '1px solid rgba(255,153,51,0.1)',
          overflowY: 'auto', flexShrink: 0,
        }}>
          <button
            onClick={() => { setSelectedRegion(null); setSelectedEra(null) }}
            style={{
              display: 'block', width: '100%', padding: '8px 12px',
              marginBottom: 4, textAlign: 'left',
              border: 'none', borderRadius: 6, cursor: 'pointer',
              background: !selectedRegion && !selectedEra ? 'rgba(255,153,51,0.2)' : 'transparent',
              color: !selectedRegion && !selectedEra ? '#FFD700' : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontFamily: "'Cinzel', serif", fontWeight: 600,
            }}
          >
            🗺️ All India
          </button>

          {/* Regions */}
          <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, margin: '8px 12px 4px', letterSpacing: 1 }}>REGIONS</div>
          {INDIA_REGIONS.map(region => (
            <button key={region.name}
              onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
              style={{
                display: 'block', width: '100%', padding: '6px 12px', marginBottom: 2, textAlign: 'left',
                border: 'none', borderRadius: 6, cursor: 'pointer',
                background: selectedRegion === region.name ? 'rgba(255,153,51,0.2)' : 'transparent',
                color: selectedRegion === region.name ? '#FFD700' : 'rgba(255,255,255,0.5)',
                fontSize: 11, fontFamily: "'Inter', sans-serif",
              }}
            >{region.name}</button>
          ))}

          {/* Temple Eras */}
          <div style={{ color: 'rgba(255,215,0,0.2)', fontSize: 10, margin: '8px 12px 4px', letterSpacing: 1 }}>🏛️ TEMPLES</div>
          <button
            onClick={() => setShowTemples(!showTemples)}
            style={{
              display: 'block', width: '100%', padding: '4px 12px', marginBottom: 4,
              border: 'none', borderRadius: 4, cursor: 'pointer',
              background: 'transparent',
              color: showTemples ? '#FFD700' : 'rgba(255,255,255,0.2)',
              fontSize: 10, textAlign: 'left', fontFamily: "'Inter', sans-serif",
            }}
          >{showTemples ? '✦ Show on map' : '◌ Hidden'}</button>
          {showTemples && TEMPLE_ERAS.map(era => (
            <button key={era.name}
              onClick={() => setSelectedEra(selectedEra === era.name ? null : era.name)}
              style={{
                display: 'block', width: '100%', padding: '5px 12px', marginBottom: 2,
                border: 'none', borderRadius: 4, cursor: 'pointer',
                background: selectedEra === era.name ? 'rgba(255,215,0,0.15)' : 'transparent',
                color: selectedEra === era.name ? '#FFD700' : 'rgba(255,215,0,0.4)',
                fontSize: 9, textAlign: 'left', fontFamily: "'Inter', sans-serif",
              }}
            >{era.name}</button>
          ))}
        </div>

        {/* Map area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="0 0 520 600" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            {/* India silhouette base */}
            <defs>
              <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Simple India outline (approximate polygon) */}
            <polygon
              points="
                180,10 210,20 240,15 260,25 280,20 300,30 310,45 320,55
                330,70 335,90 340,110 345,130 340,150 335,170 325,190
                315,210 310,230 305,260 300,280 295,300 285,320 275,340
                265,360 255,380 240,400 225,410 210,420 195,430 180,435
                170,425 160,415 150,400 140,385 135,370 130,350 125,330
                120,310 115,290 110,270 108,250 105,230 100,210 95,190
                92,170 90,150 88,130 90,110 95,95 100,80 110,65
                120,55 130,45 140,35 150,28 160,22 170,15
              "
              fill="rgba(255,153,51,0.06)"
              stroke="rgba(255,153,51,0.2)"
              strokeWidth="1.5"
            />

            {/* Grid lines for regions */}
            <line x1="80" y1="200" x2="340" y2="200" stroke="rgba(255,153,51,0.05)" strokeWidth="1" />
            <line x1="80" y1="350" x2="300" y2="350" stroke="rgba(255,153,51,0.05)" strokeWidth="1" />
            <line x1="180" y1="10" x2="180" y2="435" stroke="rgba(255,153,51,0.05)" strokeWidth="1" />

            {/* All destination pins (cities + temples) */}
            {visibleDestinations.map(dest => {
              const pos = getPinPosition(dest.lat, dest.lon)
              const isHovered = hoveredDest === dest.id
              const isCurrent = currentCity === dest.destinationId
              const isTemple = dest.type === 'temple'

              return (
                <g
                  key={dest.id}
                  onClick={() => {
                    if (dest.type === 'city') {
                      const city = INDIAN_CITIES.find(c => c.id === dest.destinationId)
                      if (city) onSelectCity(city)
                    } else {
                      const temple = POWERFUL_TEMPLES.find(t => t.id === dest.destinationId)
                      if (temple) onSelectCity(temple)
                    }
                  }}
                  onMouseEnter={() => setHoveredDest(dest.id)}
                  onMouseLeave={() => setHoveredDest(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {(isHovered || isCurrent) && (
                    <circle cx={pos.x} cy={pos.y} r={22} fill="url(#cityGlow)" />
                  )}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={isHovered || isCurrent ? 7 : (isTemple ? 6 : 5)}
                    fill={isCurrent ? '#FFD700' : (isTemple ? '#FF6600' : '#FF9933')}
                    stroke={isCurrent ? '#fff' : (isHovered ? '#FFD700' : 'rgba(255,255,255,0.3)')}
                    strokeWidth={isCurrent ? 2 : 1}
                  />
                  <text
                    x={pos.x} y={pos.y - (isHovered || isCurrent ? 14 : 11)}
                    textAnchor="middle"
                    fill={isHovered || isCurrent ? '#FFD700' : (isTemple ? 'rgba(255,153,0,0.5)' : 'rgba(255,255,255,0.5)')}
                    fontSize={isHovered || isCurrent ? 8 : 6}
                    fontFamily="'Cinzel', serif"
                    fontWeight={isCurrent ? 700 : 400}
                  >{isTemple ? dest.name.split(' ').slice(0, 2).join(' ') : dest.name}</text>
                </g>
              )
            })}

            {/* Region labels */}
            <text x="100" y="180" fill="rgba(255,255,255,0.08)" fontSize="11" fontFamily="'Cinzel', serif" textAnchor="middle">⛰️ HIMALAYAS</text>
            <text x="280" y="120" fill="rgba(255,255,255,0.06)" fontSize="10" fontFamily="'Cinzel', serif" textAnchor="middle">NORTH</text>
            <text x="250" y="280" fill="rgba(255,255,255,0.06)" fontSize="10" fontFamily="'Cinzel', serif" textAnchor="middle">CENTRAL</text>
            <text x="200" y="390" fill="rgba(255,255,255,0.06)" fontSize="10" fontFamily="'Cinzel', serif" textAnchor="middle">SOUTH</text>
          </svg>

          {/* Destination info tooltip */}
          {hovered && (
            <div style={{
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(10,10,30,0.92)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,153,51,0.3)', borderRadius: 10,
              padding: '14px 22px', maxWidth: 420, width: '90%',
              textAlign: 'center',
              animation: 'slide-up 0.2s ease-out',
            }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{hovered.emoji}</div>
              <h3 style={{ color: '#FFD700', fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                {hovered.name} {hovered.type === 'temple' && `(${hoveredTemple?.century || ''})`}
              </h3>
              <p style={{ color: 'rgba(255,153,51,0.6)', fontSize: 10, marginBottom: 6, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                {hoveredTemple ? `${hoveredTemple.dynasty} · ${hoveredTemple.builder}` : hovered.state}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
                {hovered.description}
              </p>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {hovered.highlights.slice(0, 4).map(h => (
                  <span key={h} style={{
                    padding: '2px 8px', borderRadius: 4,
                    background: 'rgba(255,153,51,0.1)',
                    color: '#FF9933', fontSize: 9, fontFamily: "'Inter', sans-serif",
                  }}>
                    {h}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onSelectCity(hovered as any)}
                style={{
                  marginTop: 8, padding: '8px 28px',
                  background: hovered.type === 'temple' ? 'linear-gradient(135deg, #FF6600, #cc4400)' : 'linear-gradient(135deg, #FF9933, #e07800)',
                  border: 'none', borderRadius: 6, cursor: 'pointer',
                  color: '#fff', fontSize: 13, fontWeight: 600,
                  fontFamily: "'Cinzel', serif",
                  boxShadow: '0 3px 15px rgba(255,153,51,0.3)',
                }}
              >
                {hovered.type === 'temple' ? '🛕 Visit Temple' : '▶ Explore'} {hovered.name}
              </button>
              <p style={{ marginTop: 6, color: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: "'Inter', sans-serif" }}>
                {hovered.type === 'temple' ? 'Powered by OpenStreetMap · Free' : 'Loads real OSM data · Free'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
