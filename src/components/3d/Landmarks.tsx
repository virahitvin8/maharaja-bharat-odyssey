// Landmarks: Taj Mahal, Mehrangarh Fort, India Gate, Konark, Himalayan Peaks
// All built from THREE procedural geometry — no external assets
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const WHITE_MARBLE = { color: '#f5f0e8', roughness: 0.3, metalness: 0.1 }
const SANDSTONE   = { color: '#c8a06a', roughness: 0.8, metalness: 0.05 }
const RED_SANDSTONE = { color: '#8b3a2a', roughness: 0.7, metalness: 0.05 }
const SNOW_MAT    = { color: '#f0f8ff', roughness: 0.9, metalness: 0 }

// Taj Mahal — iconic white dome + 4 minarets
function TajMahal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="trimesh">
        {/* Main platform */}
        <mesh receiveShadow castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[20, 1, 20]} />
          <meshStandardMaterial {...WHITE_MARBLE} />
        </mesh>
        {/* Main building */}
        <mesh receiveShadow castShadow position={[0, 4.5, 0]}>
          <boxGeometry args={[10, 8, 10]} />
          <meshStandardMaterial {...WHITE_MARBLE} />
        </mesh>
        {/* Main dome */}
        <mesh receiveShadow castShadow position={[0, 10, 0]}>
          <sphereGeometry args={[4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...WHITE_MARBLE} />
        </mesh>
        {/* Dome finial */}
        <mesh castShadow position={[0, 14.5, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.5, 8]} />
          <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* 4 Minarets */}
        {[[-7, 0, -7], [7, 0, -7], [-7, 0, 7], [7, 0, 7]].map(([x, , z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh castShadow receiveShadow position={[0, 5, 0]}>
              <cylinderGeometry args={[0.8, 0.9, 10, 10]} />
              <meshStandardMaterial {...WHITE_MARBLE} />
            </mesh>
            <mesh castShadow position={[0, 11, 0]}>
              <sphereGeometry args={[0.9, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial {...WHITE_MARBLE} />
            </mesh>
            <mesh castShadow position={[0, 12.5, 0]}>
              <coneGeometry args={[0.4, 1.5, 8]} />
              <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
        {/* Arch entrances */}
        {[[0, 5, 5.1], [0, 5, -5.1], [5.1, 5, 0], [-5.1, 5, 0]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <torusGeometry args={[1.8, 0.2, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#e8e0d0" roughness={0.4} />
          </mesh>
        ))}
      </RigidBody>
      {/* Discovery light */}
      <pointLight color="#fffde7" intensity={8} distance={30} position={[0, 15, 0]} />
    </group>
  )
}

// Mehrangarh Fort — massive Rajasthani fort on a hill
function MehrangarhFort({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Rock base hill */}
        <mesh receiveShadow castShadow position={[0, -2, 0]}>
          <cylinderGeometry args={[16, 20, 8, 12]} />
          <meshStandardMaterial color="#9e6b2f" roughness={0.9} />
        </mesh>
        {/* Main fort walls */}
        {[[-10, 6, 0], [10, 6, 0], [0, 6, -10], [0, 6, 10]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow receiveShadow
            rotation={[0, i < 2 ? 0 : Math.PI / 2, 0]}>
            <boxGeometry args={[2, 10, 20]} />
            <meshStandardMaterial {...SANDSTONE} />
          </mesh>
        ))}
        {/* Towers at corners */}
        {[[-10, 8, -10], [10, 8, -10], [-10, 8, 10], [10, 8, 10]].map(([x, y, z], i) => (
          <group key={i} position={[x, y, z]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[2.5, 2.8, 14, 8]} />
              <meshStandardMaterial {...SANDSTONE} />
            </mesh>
            <mesh castShadow position={[0, 8, 0]}>
              <coneGeometry args={[2.5, 4, 8]} />
              <meshStandardMaterial color="#8b4513" roughness={0.6} />
            </mesh>
          </group>
        ))}
        {/* Palace interior blocks */}
        <mesh castShadow receiveShadow position={[0, 8, 0]}>
          <boxGeometry args={[14, 8, 14]} />
          <meshStandardMaterial {...SANDSTONE} />
        </mesh>
        {/* Battlements */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.sin(angle) * 11, 12, Math.cos(angle) * 11]} castShadow>
              <boxGeometry args={[1.5, 1.5, 1.5]} />
              <meshStandardMaterial {...SANDSTONE} />
            </mesh>
          )
        })}
        {/* Gate arch */}
        <mesh position={[0, 5, 10.5]} castShadow>
          <torusGeometry args={[2.5, 0.4, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#a07840" roughness={0.7} />
        </mesh>
      </RigidBody>
      <pointLight color="#ff8844" intensity={6} distance={40} position={[0, 20, 0]} />
    </group>
  )
}

// India Gate — Delhi war memorial arch
function IndiaGate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Left pillar */}
        <mesh castShadow receiveShadow position={[-3, 5, 0]}>
          <boxGeometry args={[2.5, 10, 2]} />
          <meshStandardMaterial {...SANDSTONE} />
        </mesh>
        {/* Right pillar */}
        <mesh castShadow receiveShadow position={[3, 5, 0]}>
          <boxGeometry args={[2.5, 10, 2]} />
          <meshStandardMaterial {...SANDSTONE} />
        </mesh>
        {/* Top arch beam */}
        <mesh castShadow receiveShadow position={[0, 10.5, 0]}>
          <boxGeometry args={[10, 2, 2]} />
          <meshStandardMaterial {...SANDSTONE} />
        </mesh>
        {/* Arch curve */}
        <mesh castShadow position={[0, 9, 0]}>
          <torusGeometry args={[3, 0.5, 8, 16, Math.PI]} />
          <meshStandardMaterial {...SANDSTONE} />
        </mesh>
        {/* Decorative crown */}
        <mesh castShadow position={[0, 12, 0]}>
          <boxGeometry args={[11, 1.5, 2.5]} />
          <meshStandardMaterial color="#b89050" roughness={0.6} />
        </mesh>
        {/* Base platform */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[14, 0.6, 6]} />
          <meshStandardMaterial {...SANDSTONE} />
        </mesh>
      </RigidBody>
      {/* Eternal flame */}
      <pointLight color="#ff6600" intensity={10} distance={20} position={[0, 1, 2]} />
      <mesh position={[0, 1.5, 2]}>
        <coneGeometry args={[0.2, 0.6, 6]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={2} transparent opacity={0.85} />
      </mesh>
    </group>
  )
}

// Konark Sun Temple — massive stone chariot wheel temple
function KonarkTemple({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Base platform */}
        <mesh receiveShadow castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[18, 1, 14]} />
          <meshStandardMaterial color="#9e7040" roughness={0.8} />
        </mesh>
        {/* Main temple tower */}
        <mesh castShadow receiveShadow position={[0, 7, -2]}>
          <boxGeometry args={[10, 12, 10]} />
          <meshStandardMaterial color="#9e7040" roughness={0.7} />
        </mesh>
        {/* Pyramid top */}
        <mesh castShadow position={[0, 16, -2]}>
          <coneGeometry args={[5, 5, 4]} />
          <meshStandardMaterial color="#7a5025" roughness={0.8} />
        </mesh>
        {/* Mandapa hall */}
        <mesh castShadow receiveShadow position={[0, 4, 5]}>
          <boxGeometry args={[8, 6, 6]} />
          <meshStandardMaterial color="#b08040" roughness={0.7} />
        </mesh>
        {/* Chariot wheels — iconic Konark wheels */}
        {[-5, 5].map((x, i) => (
          <group key={i} position={[x, 2, 7]}>
            <mesh castShadow position={[0, 0, 0]}>
              <torusGeometry args={[2.2, 0.3, 8, 20]} />
              <meshStandardMaterial color="#7a5025" roughness={0.8} />
            </mesh>
            {/* Spokes */}
            {Array.from({ length: 8 }).map((_, j) => {
              const a = (j / 8) * Math.PI * 2
              return (
                <mesh key={j} position={[Math.sin(a) * 1.1, Math.cos(a) * 1.1, 0]}
                  rotation={[0, 0, a]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 2.2, 4]} />
                  <meshStandardMaterial color="#8b6030" roughness={0.8} />
                </mesh>
              )
            })}
            {/* Hub */}
            <mesh castShadow rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.5, 8]} />
              <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </RigidBody>
      <pointLight color="#ff9944" intensity={5} distance={30} position={[0, 20, 0]} />
    </group>
  )
}

// Himalayan peaks — snow-capped mountains
function HimalayanPeaks({ position }: { position: [number, number, number] }) {
  const peaks = [
    { pos: [0, 0, 0] as [number, number, number], h: 35, r: 16 },
    { pos: [-28, 0, 5] as [number, number, number], h: 28, r: 13 },
    { pos: [30, 0, -3] as [number, number, number], h: 30, r: 14 },
    { pos: [-15, 0, -10] as [number, number, number], h: 22, r: 11 },
    { pos: [18, 0, 8] as [number, number, number], h: 25, r: 12 },
  ]
  return (
    <group position={position}>
      {peaks.map((p, i) => (
        <group key={i} position={p.pos}>
          <RigidBody type="fixed" colliders="trimesh">
            {/* Rock base */}
            <mesh castShadow receiveShadow>
              <coneGeometry args={[p.r, p.h, 8]} />
              <meshStandardMaterial color="#6e7580" roughness={0.9} />
            </mesh>
            {/* Snow cap */}
            <mesh castShadow position={[0, p.h * 0.28, 0]}>
              <coneGeometry args={[p.r * 0.45, p.h * 0.45, 8]} />
              <meshStandardMaterial {...SNOW_MAT} />
            </mesh>
          </RigidBody>
        </group>
      ))}
      {/* Ambient blue-white light */}
      <pointLight color="#c8e8ff" intensity={4} distance={80} position={[0, 40, 0]} />
    </group>
  )
}

// Hampi ruins — stone pillars
function HampiRuins({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={i} position={[i * 4 - 10, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 3, 0]}>
              <cylinderGeometry args={[0.6, 0.8, 6, 8]} />
              <meshStandardMaterial color="#9e7855" roughness={0.9} />
            </mesh>
            {i < 4 && (
              <mesh castShadow receiveShadow position={[0, 6.5, 0]}>
                <boxGeometry args={[1.5, 1, 1.5]} />
                <meshStandardMaterial color="#8a6040" roughness={0.8} />
              </mesh>
            )}
          </group>
        ))}
        {/* Temple base */}
        <mesh receiveShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[28, 0.6, 10]} />
          <meshStandardMaterial color="#b8946a" roughness={0.8} />
        </mesh>
      </RigidBody>
      <pointLight color="#ffaa44" intensity={3} distance={25} position={[0, 10, 0]} />
    </group>
  )
}

// Ajanta Caves — rock-cut cave entrance
function AjantaCaves({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Cliff face */}
        <mesh castShadow receiveShadow position={[0, 5, 0]}>
          <boxGeometry args={[25, 12, 4]} />
          <meshStandardMaterial color="#8a7055" roughness={0.9} />
        </mesh>
        {/* Cave openings */}
        {[-8, -2, 4, 10].map((x, i) => (
          <group key={i} position={[x, 3, 2.1]}>
            <mesh castShadow>
              <torusGeometry args={[1.6, 0.25, 6, 12, Math.PI]} />
              <meshStandardMaterial color="#6a5040" roughness={0.8} />
            </mesh>
            <pointLight color="#ffcc66" intensity={2} distance={8} position={[0, -1, 1]} />
          </group>
        ))}
        {/* Base ledge */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[28, 0.8, 6]} />
          <meshStandardMaterial color="#9e8060" roughness={0.9} />
        </mesh>
      </RigidBody>
    </group>
  )
}

// Red Fort — Delhi's Mughal fortress
function RedFort({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Outer walls */}
        {[[-14, 5, 0], [14, 5, 0], [0, 5, -10], [0, 5, 10]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow receiveShadow
            rotation={[0, i < 2 ? 0 : Math.PI / 2, 0]}>
            <boxGeometry args={[3, 10, 24]} />
            <meshStandardMaterial {...RED_SANDSTONE} />
          </mesh>
        ))}
        {/* Main gate */}
        <mesh castShadow position={[0, 5, 10.5]}>
          <boxGeometry args={[8, 10, 2]} />
          <meshStandardMaterial {...RED_SANDSTONE} />
        </mesh>
        <mesh castShadow position={[0, 9, 10.5]}>
          <torusGeometry args={[2.5, 0.5, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#6a2a1a" roughness={0.7} />
        </mesh>
        {/* Corner towers */}
        {[[-14, 8, -10], [14, 8, -10], [-14, 8, 10], [14, 8, 10]].map(([x, y, z], i) => (
          <group key={i} position={[x, y, z]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[3, 3.5, 12, 8]} />
              <meshStandardMaterial {...RED_SANDSTONE} />
            </mesh>
            <mesh castShadow position={[0, 7.5, 0]}>
              <sphereGeometry args={[3, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#c8a040" metalness={0.3} />
            </mesh>
          </group>
        ))}
      </RigidBody>
      <pointLight color="#ff4422" intensity={6} distance={35} position={[0, 20, 0]} />
    </group>
  )
}

export function Landmarks() {
  return (
    <>
      <TajMahal      position={[0, 0, -70]} />
      <MehrangarhFort position={[-20, 10, -100]} />
      <IndiaGate     position={[15, 0, -65]} />
      <KonarkTemple  position={[35, 0, 50]} />
      <HimalayanPeaks position={[0, 0, 100]} />
      <HampiRuins    position={[-30, 0, 30]} />
      <AjantaCaves   position={[-25, 0, 10]} />
      <RedFort       position={[20, 0, -60]} />
    </>
  )
}
