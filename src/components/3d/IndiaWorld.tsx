// Complete India terrain — all 6 biomes, trees, water, terrain
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

// ---- Utility: noise-like height variation ----
function pseudoNoise(x: number, z: number, scale = 0.05, amp = 1): number {
  return (Math.sin(x * scale) * Math.cos(z * scale * 0.7) +
    Math.cos(x * scale * 1.3) * Math.sin(z * scale)) * amp
}

// ---- Banyan Tree ----
function BanyanTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.45, 0.6, 5, 8]} />
        <meshStandardMaterial color="#4a2e0a" roughness={0.9} />
      </mesh>
      {/* Main canopy */}
      <mesh castShadow position={[0, 7, 0]}>
        <sphereGeometry args={[4, 8, 6]} />
        <meshStandardMaterial color="#1a6b1a" roughness={0.8} />
      </mesh>
      {/* Secondary canopies */}
      {[[-2.5, 5.5, -2], [2.5, 5, 2], [-2, 5, 2.5], [2, 6, -2]].map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <sphereGeometry args={[2.5, 6, 5]} />
          <meshStandardMaterial color="#145214" roughness={0.8} />
        </mesh>
      ))}
      {/* Aerial roots */}
      {[[-2, 0, 1], [2, 0, -1], [0, 0, 2.5]].map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, 2, z]}>
          <cylinderGeometry args={[0.08, 0.12, 4, 4]} />
          <meshStandardMaterial color="#3a2008" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// ---- Coconut Palm ----
function CoconutPalm({ position }: { position: [number, number, number] }) {
  const trunkRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (trunkRef.current) {
      trunkRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.03
    }
  })
  return (
    <group position={position}>
      <mesh ref={trunkRef} castShadow receiveShadow position={[0, 4, 0]}
        rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.2, 0.35, 8, 6]} />
        <meshStandardMaterial color="#6b4c1a" roughness={0.9} />
      </mesh>
      {/* Palm fronds */}
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = (i / 7) * Math.PI * 2
        return (
          <mesh key={i} castShadow
            position={[Math.sin(angle) * 1.5, 8.5, Math.cos(angle) * 1.5]}
            rotation={[0.5, angle, 0.3]}>
            <boxGeometry args={[0.1, 0.06, 3.5]} />
            <meshStandardMaterial color="#2d7a1a" roughness={0.7} />
          </mesh>
        )
      })}
      {/* Coconuts */}
      {[0, 1.2, -1.0].map((a, i) => (
        <mesh key={i} castShadow position={[Math.sin(a) * 0.5, 7.8, Math.cos(a) * 0.5]}>
          <sphereGeometry args={[0.22, 6, 6]} />
          <meshStandardMaterial color="#4a3020" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// ---- Mango Tree ----
function MangoTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 3, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 6, 7]} />
        <meshStandardMaterial color="#3d2008" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 7.5, 0]}>
        <sphereGeometry args={[3.5, 8, 6]} />
        <meshStandardMaterial color="#1a5c1a" roughness={0.7} />
      </mesh>
      {/* Mangoes hanging */}
      {[[-1.5, 6, 1], [1.2, 5.8, -1], [0, 6.2, 1.8], [-1, 5.5, -1.5]].map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <sphereGeometry args={[0.2, 6, 6]} />
          <meshStandardMaterial color="#FF8C00" emissive="#cc5500" emissiveIntensity={0.2} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

// ---- Desert Cactus ----
function Cactus({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 3, 6]} />
        <meshStandardMaterial color="#4a8a2a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.8, 2, 0]} rotation={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.15, 0.18, 1.5, 5]} />
        <meshStandardMaterial color="#4a8a2a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.8, 2.3, 0]} rotation={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.15, 0.18, 1.5, 5]} />
        <meshStandardMaterial color="#4a8a2a" roughness={0.7} />
      </mesh>
    </group>
  )
}

// ---- Himalayan Pine ----
function HimalayanPine({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 4, 5]} />
        <meshStandardMaterial color="#3d2808" roughness={0.9} />
      </mesh>
      {[0, 1.2, 2.4].map((y, i) => (
        <mesh key={i} castShadow position={[0, 4 + y, 0]}>
          <coneGeometry args={[2 - i * 0.45, 2.2, 7]} />
          <meshStandardMaterial color="#0a4a1a" roughness={0.7} />
        </mesh>
      ))}
      {/* Snow on top */}
      <mesh castShadow position={[0, 7.2, 0]}>
        <coneGeometry args={[0.6, 0.8, 6]} />
        <meshStandardMaterial color="#f0f8ff" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ---- Animated Water ----
function Water({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05
    }
  })
  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[...size, 16, 16]} />
      <meshStandardMaterial color="#1a6aaa" transparent opacity={0.78} roughness={0.1} metalness={0.3} emissive="#0a3055" emissiveIntensity={0.2} />
    </mesh>
  )
}

// ---- Sand Dune ----
function SandDune({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} scale={scale} receiveShadow castShadow>
      <sphereGeometry args={[1, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#c8a050" roughness={0.95} metalness={0} />
    </mesh>
  )
}

// ---- Village Hut ----
function VillageHut({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[4, 3, 4]} />
          <meshStandardMaterial color="#d4aa7a" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 3.7, 0]}>
          <coneGeometry args={[3, 2.5, 4]} />
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </mesh>
        {/* Door */}
        <mesh position={[0, 1, 2.05]}>
          <boxGeometry args={[1, 2, 0.1]} />
          <meshStandardMaterial color="#4a2e0a" roughness={0.9} />
        </mesh>
        {/* Window */}
        <mesh position={[1.5, 1.8, 2.05]}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial color="#88bbdd" roughness={0.2} transparent opacity={0.7} />
        </mesh>
      </RigidBody>
    </group>
  )
}

// ---- Stepwell (Baoli) ----
function Stepwell({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Outer walls */}
        <mesh receiveShadow position={[0, 1, 0]}>
          <boxGeometry args={[12, 2, 12]} />
          <meshStandardMaterial color="#c8a870" roughness={0.8} />
        </mesh>
        {/* Inner water */}
        <Water position={[0, 0.2, 0]} size={[8, 8]} />
        {/* Steps */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} receiveShadow position={[0, 0.8 - i * 0.25, 4 - i * 0.8]}>
            <boxGeometry args={[10, 0.3, 1.5]} />
            <meshStandardMaterial color="#b89060" roughness={0.8} />
          </mesh>
        ))}
      </RigidBody>
    </group>
  )
}

// ---- Main World Terrain & Biomes ----
export function IndiaWorld() {
  // Main ground — flat with slight texture via many segments
  const groundGeo = useMemo(() => new THREE.PlaneGeometry(600, 600, 50, 50), [])

  return (
    <>
      {/* ---- MAIN GROUND ---- */}
      <RigidBody type="fixed" colliders="trimesh" friction={0.8} restitution={0.1}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <primitive object={groundGeo} />
          <meshStandardMaterial color="#7a9a5a" roughness={0.9} metalness={0} />
        </mesh>
      </RigidBody>

      {/* ---- RAJASTHAN DESERT (z: -60 to -180) ---- */}
      <group position={[0, 0, -120]}>
        {/* Sand overlay */}
        <RigidBody type="fixed" colliders="trimesh">
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[140, 120, 20, 20]} />
            <meshStandardMaterial color="#d4a840" roughness={0.95} metalness={0} />
          </mesh>
        </RigidBody>
        {/* Dunes */}
        <SandDune position={[-30, 3, -20]} scale={[12, 5, 10]} />
        <SandDune position={[25, 2.5, 15]} scale={[10, 4, 8]} />
        <SandDune position={[0, 3.5, -30]} scale={[15, 6, 12]} />
        <SandDune position={[-15, 2, 25]} scale={[8, 3.5, 7]} />
        {/* Cacti */}
        <Cactus position={[-20, 0, -10]} />
        <Cactus position={[18, 0, 5]} />
        <Cactus position={[-5, 0, 20]} />
        <Cactus position={[30, 0, -15]} />
        {/* Desert palms */}
        <CoconutPalm position={[10, 0, 0]} />
        <CoconutPalm position={[-8, 0, 10]} />
        {/* Orange sky ambient */}
        <pointLight color="#ff8844" intensity={2} distance={100} position={[0, 20, 0]} />
      </group>

      {/* ---- GANGETIC PLAINS (z: -60 to 30, center) ---- */}
      <group position={[0, 0, 0]}>
        <MangoTree position={[8, 0, -10]} />
        <MangoTree position={[-10, 0, 5]} />
        <MangoTree position={[20, 0, 15]} />
        <BanyanTree position={[-5, 0, -20]} />
        <BanyanTree position={[25, 0, -5]} />
        <BanyanTree position={[-22, 0, 10]} />
        {/* Ponds */}
        <Water position={[-15, 0.05, -35]} size={[12, 10]} />
        <Water position={[20, 0.05, -40]} size={[8, 8]} />
        {/* Village */}
        <VillageHut position={[-30, 0, 5]} />
        <VillageHut position={[-36, 0, 12]} />
        <VillageHut position={[-42, 0, 5]} />
        <Stepwell position={[-36, 0, -5]} />
        {/* River Ganga path */}
        <Water position={[0, 0.05, -50]} size={[15, 50]} />
      </group>

      {/* ---- DECCAN PLATEAU (x: -60, z: 0 to 60) ---- */}
      <group position={[-45, 0, 30]}>
        <RigidBody type="fixed" colliders="trimesh">
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[80, 60, 10, 10]} />
            <meshStandardMaterial color="#8a6a3a" roughness={0.9} />
          </mesh>
        </RigidBody>
        {/* Rocky outcrops */}
        {[[-10, 0, -10], [15, 0, 5], [-5, 0, 15], [20, 0, -20]].map(([x, y, z], i) => (
          <mesh key={i} castShadow receiveShadow position={[x, 2, z]}>
            <dodecahedronGeometry args={[2.5, 0]} />
            <meshStandardMaterial color="#7a5a35" roughness={0.9} />
          </mesh>
        ))}
        <BanyanTree position={[-8, 0, 5]} />
        <BanyanTree position={[10, 0, -5]} />
      </group>

      {/* ---- HIMALAYA FOOTHILLS (z: 60 to 130) ---- */}
      <group position={[0, 0, 85]}>
        <RigidBody type="fixed" colliders="trimesh">
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[120, 80, 15, 15]} />
            <meshStandardMaterial color="#6a8a5a" roughness={0.8} />
          </mesh>
        </RigidBody>
        {/* Pine forest */}
        {Array.from({ length: 20 }).map((_, i) => (
          <HimalayanPine key={i} position={[
            Math.sin(i * 1.7) * 40,
            0,
            Math.cos(i * 1.3) * 25 - 5,
          ]} />
        ))}
        {/* Snow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 8, 15]}>
          <planeGeometry args={[80, 30]} />
          <meshStandardMaterial color="#ddeeff" roughness={0.95} />
        </mesh>
        {/* Mountain river */}
        <Water position={[0, 0.1, -20]} size={[8, 60]} />
        <pointLight color="#88ccff" intensity={2} distance={80} position={[0, 20, 0]} />
      </group>

      {/* ---- KERALA BACKWATERS (z: 130 to 200) ---- */}
      <group position={[0, 0, 165]}>
        <RigidBody type="fixed" colliders="trimesh">
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[80, 60, 12, 12]} />
            <meshStandardMaterial color="#2a6a3a" roughness={0.8} />
          </mesh>
        </RigidBody>
        {/* Wide backwater lake */}
        <Water position={[0, 0.15, 0]} size={[40, 40]} />
        {/* Lush vegetation */}
        {Array.from({ length: 15 }).map((_, i) => (
          <CoconutPalm key={i} position={[
            Math.sin(i * 2.1) * 28 + (i % 2 === 0 ? 5 : -5),
            0,
            Math.cos(i * 1.8) * 20,
          ]} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <MangoTree key={i} position={[
            Math.sin(i * 2.8 + 1) * 22,
            0,
            Math.cos(i * 2.2) * 15,
          ]} />
        ))}
        {/* Houseboat */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow receiveShadow position={[5, 0.6, 0]}>
            <boxGeometry args={[6, 1.2, 2.5]} />
            <meshStandardMaterial color="#8b6030" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[5, 1.8, 0]}>
            <boxGeometry args={[5, 1.5, 2.2]} />
            <meshStandardMaterial color="#f5e0b0" roughness={0.6} />
          </mesh>
        </RigidBody>
        <pointLight color="#44ff88" intensity={2} distance={60} position={[0, 15, 0]} />
      </group>

      {/* ---- COASTAL INDIA (x: 50+) ---- */}
      <group position={[60, 0, 30]}>
        <RigidBody type="fixed" colliders="trimesh">
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[60, 80, 10, 10]} />
            <meshStandardMaterial color="#f0d88a" roughness={0.9} />
          </mesh>
        </RigidBody>
        {/* Ocean */}
        <Water position={[20, 0.1, 0]} size={[40, 100]} />
        {/* Coastal palms */}
        {Array.from({ length: 10 }).map((_, i) => (
          <CoconutPalm key={i} position={[i * 4 - 20, 0, Math.sin(i) * 5]} />
        ))}
        <pointLight color="#ffcc44" intensity={3} distance={60} position={[0, 15, 0]} />
      </group>
    </>
  )
}
