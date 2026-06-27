// Krishna Elements — Flute theme, Brindhavan forest, Dwaraka palace
// Adds spiritual Krishna-themed elements throughout the world
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

// ========== KRISHNA FLUTE ==========
// Floating flute that plays ethereal notes — appears near temples
export function KrishnaFlute({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((state, delta) => {
    t.current += delta
    if (groupRef.current) {
      // Gentle float
      groupRef.current.position.y = position[1] + Math.sin(t.current * 1.5) * 0.15
      // Slow rotation
      groupRef.current.rotation.y += delta * 0.3
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t.current * 2) * 0.15
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Divine glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshBasicMaterial color="#4169E1" transparent opacity={0.15} />
      </mesh>
      {/* Flute body */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.5, 6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Flute holes */}
      {[0.1, 0.2, 0.3].map((x, i) => (
        <mesh key={i} position={[x - 0.15, 0.04, 0]}>
          <sphereGeometry args={[0.008, 4, 4]} />
          <meshStandardMaterial color="#2a1a0a" />
        </mesh>
      ))}
      {/* Golden ornament */}
      <mesh position={[0.2, 0, 0]}>
        <torusGeometry args={[0.04, 0.008, 4, 6]} />
        <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Audio particle notes */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[0.4 + i * 0.1, 0.1 + Math.sin(t.current * 2 + i) * 0.05, 0]}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial color="#87CEEB" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// ========== BRINDHAVAN FOREST ==========
// Lush forest with peacocks, Krishna-themed elements, flowers
export function BrindhavanGrove({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Flowering vines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={i} position={[i * 2 - 4, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.1, 3, 4]} />
            <meshStandardMaterial color="#2a5a2a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[0.6, 5, 4]} />
            <meshStandardMaterial color="#3a7a3a" roughness={0.85} />
          </mesh>
          {/* Flowers */}
          {Array.from({ length: 3 }).map((_, j) => {
            const colors = ['#FF69B4', '#FFD700', '#FF6347']
            return (
              <mesh key={j} position={[
                Math.sin(j * 2) * 0.8,
                2 + Math.random(),
                Math.cos(j * 2) * 0.8
              ]}>
                <sphereGeometry args={[0.06, 4, 4]} />
                <meshStandardMaterial color={colors[j]} roughness={0.5} />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

// ========== DWARAKA PALACE GATE ==========
// Underwater golden palace entrance — Krishna's kingdom
export function DwarakaGate({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Golden walls */}
      <mesh position={[0, 5, 0]} receiveShadow castShadow>
        <boxGeometry args={[12, 10, 3]} />
        <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} emissive="#FFD700" emissiveIntensity={0.1} />
      </mesh>
      {/* Central arch */}
      <mesh position={[0, 4, 0]} castShadow>
        <torusGeometry args={[2.5, 0.5, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      {/* Pillars */}
      {[[-4, 3, 0], [4, 3, 0]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh castShadow><cylinderGeometry args={[0.6, 0.8, 8, 8]} /><meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} /></mesh>
          <mesh position={[0, 5, 0]} castShadow><coneGeometry args={[0.8, 1.5, 8]} /><meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.3} /></mesh>
        </group>
      ))}
      {/* Dwaraka flag */}
      <mesh position={[0, 11, 0]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#FF9933" side={THREE.DoubleSide} />
      </mesh>
      {/* Water base effect */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[14, 0.3, 5]} />
        <meshStandardMaterial color="#1a6a8a" transparent opacity={0.5} roughness={0.1} metalness={0.5} />
      </mesh>
      {/* Peacock on top */}
      <mesh position={[2, 12, 0]}>
        <sphereGeometry args={[0.2, 5, 5]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.7} />
      </mesh>
      {/* Light rays from palace */}
      <pointLight color="#FFD700" intensity={4} distance={20} position={[0, 8, 0]} />
      <pointLight color="#4169E1" intensity={2} distance={15} position={[-3, 5, 2]} />
    </group>
  )
}

// ========== KRISHNA STATUE ==========
// Small Krishna statue with flute — placed in temple courtyards
export function KrishnaStatue({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.05
    }
  })

  return (
    <group ref={ref} position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.15, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 6]} />
        <meshStandardMaterial color="#4169E1" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.07, 6, 6]} />
        <meshStandardMaterial color="#c8956c" roughness={0.6} />
      </mesh>
      {/* Crown feather */}
      <mesh position={[0, 0.85, 0]}>
        <coneGeometry args={[0.02, 0.08, 4]} />
        <meshStandardMaterial color="#138808" roughness={0.7} />
      </mesh>
      {/* Flute */}
      <mesh position={[0.05, 0.45, 0.05]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.01, 0.012, 0.15, 4]} />
        <meshStandardMaterial color="#DAA520" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  )
}

// ========== POND (Brindhavan-style water body) ==========
export function LotusPond({ position, size = 5 }: { position: [number, number, number]; size?: number }) {
  const waterRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group position={position}>
      {/* Water */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <circleGeometry args={[size, 16]} />
        <meshStandardMaterial color="#1a7a9a" transparent opacity={0.7} roughness={0.1} metalness={0.3} />
      </mesh>
      {/* Lotuses */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const r = size * 0.4 + Math.random() * size * 0.3
        return (
          <group key={i} position={[Math.cos(angle) * r, 0.2, Math.sin(angle) * r]}>
            {/* Petals */}
            {Array.from({ length: 6 }).map((_, j) => {
              const a = (j / 6) * Math.PI * 2
              return (
                <mesh key={j} position={[Math.cos(a) * 0.1, 0.05, Math.sin(a) * 0.1]}
                  rotation={[0.5, a, 0]}>
                  <sphereGeometry args={[0.06, 4, 3]} />
                  <meshStandardMaterial color="#FF69B4" roughness={0.4} />
                </mesh>
              )
            })}
            {/* Center */}
            <mesh>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// ========== FLOATING FLUTE NOTES ==========
// Ambient music visual particles
export function FluteNotesParticles({ count = 20 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = Math.random() * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.003
      pos[i * 3] += Math.cos(state.clock.elapsedTime * 0.3 + i * 0.5) * 0.002
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#87CEEB" size={0.08} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </points>
  )
}
