// Powerful Temple 3D — unique structure per architectural era
// Each temple style gets distinct geometry reflecting its period
import { useMemo } from 'react'
import * as THREE from 'three'
import { type PowerfulTemple, getTempleStyle } from '../../data/powerfulTemples'

// ----- Gupta Style (4th-6th Century) — Simple square sanctum, flat roof, emerging shikhara -----
function GuptaTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Square sanctum base */}
      <mesh position={[0, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[6, 3, 6]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.7} />
      </mesh>
      {/* Pillared portico */}
      <mesh position={[3.5, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1, 3, 4]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      {/* Flat roof */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[6, 0.3, 6]} />
        <meshStandardMaterial color="#b8a888" roughness={0.6} />
      </mesh>
      {/* Small emerging shikhara */}
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[2, 3, 4]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      {/* Pillars */}
      {[[-2.5, 1.5, -2.5], [2.5, 1.5, -2.5], [-2.5, 1.5, 2.5], [2.5, 1.5, 2.5]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.2, 0.25, 3, 6]} />
          <meshStandardMaterial color="#b8a888" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ----- Chalukya Style (6th-8th Century) — Fusion, pillared halls, stepped vimana -----
function ChalukyaTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Base platform */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 1, 8]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      {/* Main sanctum */}
      <mesh position={[0, 2.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[5, 3, 5]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.7} />
      </mesh>
      {/* Stepped pyramidal vimana */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      {/* Pillared hall (mandapa) */}
      <mesh position={[0, 2.5, -4]} receiveShadow castShadow>
        <boxGeometry args={[5, 3, 2]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.7} />
      </mesh>
      {/* Pillars around mandapa */}
      {[[-2, 1.5, -5.5], [2, 1.5, -5.5], [-2, 1.5, -3.5], [2, 1.5, -3.5]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 3, 5]} />
          <meshStandardMaterial color="#b8a888" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ----- Pallava Style (7th-8th Century) — Rock-cut rathas, monolithic -----
function PallavaTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Granite base — rock-cut feel */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[6, 1, 6]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Main shrine */}
      <mesh position={[0, 2.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#9a8a7a" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Pyramidal vimana */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[3.5, 1, 3.5]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[2.5, 1, 2.5]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.8} />
      </mesh>
      {/* Dome cap (shikhara) */}
      <mesh position={[0, 9, 0]} castShadow>
        <sphereGeometry args={[1, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.8} />
      </mesh>
      {/* Pillars at entrance */}
      {[[-1.5, 1.5, 2.1], [1.5, 1.5, 2.1]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 3, 5]} />
          <meshStandardMaterial color="#8a7a6a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// ----- Chola Style (9th-13th Century) — Massive vimana, towering gopuram -----
function CholaTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Large base */}
      <mesh position={[0, 0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[10, 1.5, 10]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.7} />
      </mesh>
      {/* Main vimana (tower) — progressively stepping up */}
      <mesh position={[0, 3, 0]} receiveShadow castShadow>
        <boxGeometry args={[7, 3, 7]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[6, 2, 6]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <boxGeometry args={[5, 2, 5]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 9.5, 0]} castShadow>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 11.5, 0]} castShadow>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      {/* Dome cap (shikhara vimana top) */}
      <mesh position={[0, 13.5, 0]} castShadow>
        <sphereGeometry args={[1.8, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#DAA520" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Gopuram entrance tower */}
      <mesh position={[0, 3, 5.5]} castShadow>
        <boxGeometry args={[4, 6, 1.5]} />
        <meshStandardMaterial color="#b8a888" roughness={0.7} />
      </mesh>
      <mesh position={[0, 7, 5.5]} castShadow>
        <boxGeometry args={[3, 2, 1.5]} />
        <meshStandardMaterial color="#b8a888" roughness={0.7} />
      </mesh>
      <mesh position={[0, 9.5, 5.5]} castShadow>
        <boxGeometry args={[2, 1, 1.5]} />
        <meshStandardMaterial color="#DAA520" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Pillars */}
      {[[-3, 3, -3], [3, 3, -3], [-3, 3, 3], [3, 3, 3]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 6, 6]} />
          <meshStandardMaterial color="#c8b898" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ----- Hoysala Style (12th Century) — Star-shaped platform, soapstone filigree -----
function HoysalaTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Star-shaped platform — using a 8-pointed geometry approximation */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4, 4.5, 1, 16]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.6} />
      </mesh>
      {/* Central shrine */}
      <mesh position={[0, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[5, 3, 5]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      {/* Star-like multiple shikharas */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#b8a888" roughness={0.6} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color="#b8a888" roughness={0.6} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#b8a888" roughness={0.6} />
      </mesh>
      {/* Decorative small pillars (soapstone feel) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 2.8, 2, Math.sin(angle) * 2.8]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 3, 4]} />
            <meshStandardMaterial color="#c8b898" roughness={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

// ----- Chandela Style (11th Century) — Multiple shikharas, sandstone -----
function ChandelaTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* High base platform */}
      <mesh position={[0, 0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[7, 1.5, 7]} />
        <meshStandardMaterial color="#c8b098" roughness={0.7} />
      </mesh>
      {/* Central spire (main shikhara) */}
      <mesh position={[0, 3, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#d4c0a8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#c8b098" roughness={0.7} />
      </mesh>
      <mesh position={[0, 9, 0]} castShadow>
        <boxGeometry args={[2, 3, 2]} />
        <meshStandardMaterial color="#c8b098" roughness={0.7} />
      </mesh>
      <mesh position={[0, 12, 0]} castShadow>
        <boxGeometry args={[1.2, 2, 1.2]} />
        <meshStandardMaterial color="#c8b098" roughness={0.7} />
      </mesh>
      {/* Small surrounding shikharas (urdhva-shikharas) */}
      {[[-2.5, 3, -2.5], [2.5, 3, -2.5], [-2.5, 3, 2.5], [2.5, 3, 2.5]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <coneGeometry args={[0.6, 2, 4]} />
          <meshStandardMaterial color="#c8b098" roughness={0.7} />
        </mesh>
      ))}
      {/* Entrance porch */}
      <mesh position={[0, 1.5, 3.5]} castShadow>
        <boxGeometry args={[2.5, 1.5, 1]} />
        <meshStandardMaterial color="#d4c0a8" roughness={0.7} />
      </mesh>
      {/* Sculpture niches */}
      {[[-1.5, 2, -2.1], [1.5, 2, -2.1], [-1.5, 2, 2.1], [1.5, 2, 2.1]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.5, 0.8, 0.1]} />
          <meshStandardMaterial color="#DAA520" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// ----- Ganga / Kalinga Style (12th-13th Century) — Curvilinear deul, chariot -----
function GangaTemple({ scale = 1, isKonark = false }: { scale?: number; isKonark?: boolean }) {
  return (
    <group scale={scale}>
      {/* Kalinga deul (curvilinear tower) */}
      <mesh position={[0, 4, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2, 4, 8, 6]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      {/* Jagamohana (assembly hall) */}
      <mesh position={[0, 2, 5]} receiveShadow castShadow>
        <boxGeometry args={[4, 4, 3]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      <mesh position={[0, 5, 5]} castShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#b8a888" roughness={0.7} />
      </mesh>
      {/* Kalasha on top */}
      <mesh position={[0, 9, 0]} castShadow>
        <sphereGeometry args={[0.5, 6, 6]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Konark-specific: chariot wheels */}
      {isKonark && Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 4, 1, Math.sin(angle) * 4]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.8, 0.08, 6, 12]} />
            <meshStandardMaterial color="#8a7a5a" roughness={0.8} />
          </mesh>
        )
      })}
    </group>
  )
}

// ----- Rashtrakuta Style — Monolithic rock-cut -----
function RashtrakutaTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Monolithic rock appearance */}
      <mesh position={[0, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[8, 4, 8]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Carved out central section */}
      <mesh position={[0, 2, 0]} receiveShadow>
        <boxGeometry args={[4, 3.5, 4]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>
      {/* Pillars carved from rock */}
      {[[-2, 2.5, -2], [2, 2.5, -2], [-2, 2.5, 2], [2, 2.5, 2]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 3.5, 6]} />
          <meshStandardMaterial color="#8a7a6a" roughness={0.95} />
        </mesh>
      ))}
      {/* Top ornament */}
      <mesh position={[0, 5, 0]} castShadow>
        <boxGeometry args={[5, 0.5, 5]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ----- Solanki Style — Stepwell, solar alignment, intricate pillars -----
function SolankiTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Main shrine */}
      <mesh position={[0, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[5, 4, 5]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
      </mesh>
      {/* Stepped shikhara */}
      <mesh position={[0, 5, 0]} castShadow>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 6.5, 0]} castShadow>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 8, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 9.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#DAA520" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Stepwell (Surya Kund) */}
      <mesh position={[4, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 1, 6]} />
        <meshStandardMaterial color="#b8a888" roughness={0.7} />
      </mesh>
      {/* Steps going down */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[4, -0.2 - i * 0.3, 2.5 - i * 0.3]} receiveShadow>
          <boxGeometry args={[2.5, 0.2, 0.8]} />
          <meshStandardMaterial color="#a89878" roughness={0.8} />
        </mesh>
      ))}
      {/* Pillars around main shrine */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 3.2, 2, Math.sin(angle) * 3.2]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 4, 5]} />
            <meshStandardMaterial color="#c8b898" roughness={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

// ----- Kakatiya Style — Floating bricks, lightweight -----
function KakatiyaTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1, 0]} receiveShadow castShadow>
        <boxGeometry args={[6, 2, 6]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.7} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      <mesh position={[0, 8.5, 0]} castShadow>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      {/* Nandi (bull) mandapa */}
      <mesh position={[3, 1, 0]} receiveShadow castShadow>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial color="#b8a888" roughness={0.8} />
      </mesh>
    </group>
  )
}

// ----- Shaka/Kushan Style — Ancient simple rock-cut -----
function ShakaTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1, 0]} receiveShadow castShadow>
        <boxGeometry args={[5, 2, 5]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[4, 1, 4]} />
        <meshStandardMaterial color="#7a6a4a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color="#7a6a4a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <cylinderGeometry args={[1, 1.5, 1, 6]} />
        <meshStandardMaterial color="#6a5a3a" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ----- Vijayanagara Style — Towering gopurams, pillared halls -----
function VijayanagaraTemple({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[7, 1.5, 7]} />
        <meshStandardMaterial color="#d4c4a0" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3, 0]} receiveShadow castShadow>
        <boxGeometry args={[5, 3, 5]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      {/* Gopuram entrance */}
      <mesh position={[0, 4, 4]} castShadow>
        <boxGeometry args={[4, 6, 1]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      <mesh position={[0, 8, 4]} castShadow>
        <boxGeometry args={[2, 2, 0.8]} />
        <meshStandardMaterial color="#DAA520" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 5.5, 0]} castShadow>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 8, 0]} castShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#c8b898" roughness={0.6} />
      </mesh>
      <mesh position={[0, 10.5, 0]} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#DAA520" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Thousand-pillar hall representation */}
      {Array.from({ length: 16 }).map((_, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        return (
          <mesh key={i} position={[-1.5 + col * 1, 1, -3 + row * 2]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 2, 4]} />
            <meshStandardMaterial color="#b8a888" roughness={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

// ========== MAIN POWERFUL TEMPLE COMPONENT ==========
interface PowerfulTempleProps {
  temple: PowerfulTemple
  scale?: number
}

export function PowerfulTempleModel({ temple, scale = 1 }: PowerfulTempleProps) {
  const Renderer = useMemo(() => {
    switch (temple.style) {
      case 'gupta': return <GuptaTemple scale={scale} />
      case 'chalukya': return <ChalukyaTemple scale={scale} />
      case 'pallava': return <PallavaTemple scale={scale} />
      case 'rashtrakuta': return <RashtrakutaTemple scale={scale} />
      case 'chola': return <CholaTemple scale={scale} />
      case 'somavamsi': return <GangaTemple scale={scale} />
      case 'chandela': return <ChandelaTemple scale={scale} />
      case 'solanki': return <SolankiTemple scale={scale} />
      case 'ganga': return <GangaTemple scale={scale} isKonark={temple.id === 'konark_sun'} />
      case 'hoysala': return <HoysalaTemple scale={scale} />
      case 'kakatiya': return <KakatiyaTemple scale={scale} />
      case 'shaka': return <ShakaTemple scale={scale} />
      case 'vijayanagara': return <VijayanagaraTemple scale={scale} />
      default: return <GuptaTemple scale={scale} />
    }
  }, [temple.style, scale])

  return (
    <group>
      {/* Base platform */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[5 * scale, 5.5 * scale, 0.3, 16]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>
      {Renderer}
      {/* Sacred glow — stronger for older temples */}
      <pointLight
        color="#FFD700"
        intensity={2}
        distance={12 * scale}
        position={[0, 5 * scale, 0]}
      />
    </group>
  )
}
