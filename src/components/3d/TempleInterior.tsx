// Temple Interior — rendered when character enters a temple
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

interface TempleInteriorProps {
  position: [number, number, number]
  name: string
  onExit: () => void
}

// Animated diya flame component
function DiyaFlame({ position: pos, offset }: { position: [number, number, number]; offset: number }) {
  const flameRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (flameRef.current) {
      const flicker = 0.85 + Math.sin(state.clock.elapsedTime * 25 + offset) * 0.15
      flameRef.current.scale.setScalar(flicker)
    }
  })
  return (
    <group>
      <pointLight color="#ff8800" intensity={2} distance={5} position={[pos[0], pos[1], pos[2]]} />
      <mesh castShadow position={[pos[0], pos[1], pos[2]]}>
        <cylinderGeometry args={[0.08, 0.12, 0.1, 6]} />
        <meshStandardMaterial color="#c06020" roughness={0.8} />
      </mesh>
      <mesh ref={flameRef} position={[pos[0], pos[1] + 0.15, pos[2]]}>
        <coneGeometry args={[0.04, 0.12, 5]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={1.5} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

const DIYA_POSITIONS: [number, number, number][] = [
  [-4, 1, -4], [4, 1, -4], [-4, 1, 4], [4, 1, 4], [-4, 2, -4], [4, 2, -4]
]

export function TempleInterior({ position, name, onExit }: TempleInteriorProps) {
  // Interior floor
  const floorGeo = useMemo(() => new THREE.PlaneGeometry(10, 10), [])

  return (
    <group position={position}>
      {/* Walls */}
      {[[5, 0, 0], [-5, 0, 0], [0, 0, 5], [0, 0, -5]].map(([x, , z], i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid">
          <mesh castShadow receiveShadow position={[x, 3, z]}>
            <boxGeometry args={[0.3, 6, i < 2 ? 10 : 10]} />
            <meshStandardMaterial color="#e4d4b8" roughness={0.6} />
          </mesh>
        </RigidBody>
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.05, 0]}>
        <primitive object={floorGeo} />
        <meshStandardMaterial color="#c8b898" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Pillars */}
      {[[-3.5, 0, -3.5], [3.5, 0, -3.5], [-3.5, 0, 3.5], [3.5, 0, 3.5]].map(([x, , z], i) => (
        <mesh key={i} castShadow position={[x, 3, z]}>
          <cylinderGeometry args={[0.3, 0.35, 6, 8]} />
          <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
        </mesh>
      ))}

      {/* Sanctum Sanctorum (Garbhagriha) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, 1.5, -3]}>
          <boxGeometry args={[4, 3, 2]} />
          <meshStandardMaterial color="#f0e8d8" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Idol platform */}
        <mesh castShadow position={[0, 2.5, -2.1]}>
          <boxGeometry args={[2, 1, 0.5]} />
          <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} emissive="#FFD700" emissiveIntensity={0.3} />
        </mesh>
        {/* Golden idol glow */}
        <pointLight color="#FFD700" intensity={6} distance={8} position={[0, 3, -3]} />
        {/* Divine aura */}
        <mesh position={[0, 3, -2.5]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
      </RigidBody>

      {/* Diyas (lamps) along walls */}
      {DIYA_POSITIONS.map((pos, i) => (
        <DiyaFlame key={i} position={pos} offset={i * 3} />
      ))}

      {/* Bell hanging from ceiling */}
      <mesh castShadow position={[0, 5.5, 0]}>
        <torusGeometry args={[0.3, 0.08, 6, 10]} />
        <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Exit doorway (glowing arch) */}
      <mesh position={[0, 3, 5.1]}>
        <torusGeometry args={[1.8, 0.15, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      {/* Exit light */}
      <pointLight color="#FFD700" intensity={4} distance={10} position={[0, 2, 5]} />

      {/* Temple name */}
      <mesh position={[0, 5, -4.8]}>
        <planeGeometry args={[4, 0.8]} />
        <meshBasicMaterial color="#050510" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

// Trigger zone that loads the interior when character enters
interface TempleEntranceProps {
  position: [number, number, number]
  templeName: string
  onEnter: () => void
}

export function TempleEntrance({ position, templeName, onEnter }: TempleEntranceProps) {
  const triggerRef = useRef<THREE.Mesh>(null)
  
  return (
    <group position={position}>
      {/* Visible door arch */}
      <mesh castShadow position={[0, 2, 0]}>
        <torusGeometry args={[1.5, 0.2, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} emissive="#FFD700" emissiveIntensity={0.4} />
      </mesh>
      {/* Door opening */}
      <mesh position={[0, 1.5, 0]} visible={false}>
        <boxGeometry args={[2.5, 3.5, 0.3]} />
      </mesh>
      {/* Glow light */}
      <pointLight color="#FFD700" intensity={3} distance={6} position={[0, 2, 0.5]} />
    </group>
  )
}
