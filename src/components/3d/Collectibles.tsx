// All collectible items — coins, gems, lotus, diya — with animations, glow, and sparkle attraction
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

const GEM_COLORS: Record<string, string> = {
  gem_ruby: '#e63946',
  gem_diamond: '#a8dadc',
  gem_emerald: '#2d9a4f',
  gem_sapphire: '#3a7abd',
}
const GEM_EMIT: Record<string, string> = {
  gem_ruby: '#ff4444',
  gem_diamond: '#88eeff',
  gem_emerald: '#44ff88',
  gem_sapphire: '#4488ff',
}

// ---- Sparkle particle effect around items ----
function Sparkles({ color = '#FFD700' }: { color?: string }) {
  const ref = useRef<THREE.Points>(null)
  const count = 8
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = 0.4 + Math.random() * 0.3
      pos[i*3] = Math.sin(phi) * Math.cos(theta) * r
      pos[i*3+1] = Math.sin(phi) * Math.sin(theta) * r
      pos[i*3+2] = Math.cos(phi) * r
    }
    return pos
  }, [])
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.02
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={color} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function Coin({ position, id }: { position: [number, number, number]; id: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(Math.random() * Math.PI * 2)
  useFrame((_, delta) => {
    if (!ref.current) return
    t.current += delta * 3
    ref.current.rotation.y = t.current
    ref.current.position.y = position[1] + Math.sin(t.current * 0.7) * 0.2 + 0.5
  })
  return (
    <group>
      <pointLight color="#FFD700" intensity={2} distance={3} />
      <mesh ref={ref} position={position} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 16]} />
        <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      <Sparkles color="#FFD700" />
    </group>
  )
}

function Gem({ position, id, type }: { position: [number, number, number]; id: string; type: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(Math.random() * Math.PI * 2)
  const color = GEM_COLORS[type] || '#ffffff'
  const emit  = GEM_EMIT[type] || '#ffffff'
  useFrame((_, delta) => {
    if (!ref.current) return
    t.current += delta * 2
    ref.current.rotation.y = t.current
    ref.current.rotation.x = Math.sin(t.current * 0.5) * 0.3
    ref.current.position.y = position[1] + Math.sin(t.current * 0.8) * 0.25 + 0.8
  })
  return (
    <group position={position}>
      <pointLight color={emit} intensity={5} distance={6} />
      <mesh ref={ref} castShadow>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={color} emissive={emit} emissiveIntensity={0.7} metalness={0.6} roughness={0.1} />
      </mesh>
      <Sparkles color={emit} />
    </group>
  )
}

function Lotus({ position, id }: { position: [number, number, number]; id: string }) {
  const ref = useRef<THREE.Group>(null)
  const t = useRef(Math.random() * Math.PI * 2)
  useFrame((_, delta) => {
    if (!ref.current) return
    t.current += delta
    ref.current.rotation.y = t.current * 0.5
    ref.current.position.y = position[1] + Math.sin(t.current) * 0.15 + 0.3
  })
  return (
    <group ref={ref} position={position}>
      <pointLight color="#ff88cc" intensity={6} distance={7} />
      {/* Petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.sin(angle) * 0.3, 0.05, Math.cos(angle) * 0.3]}
            rotation={[0.4, angle, 0]} castShadow>
            <sphereGeometry args={[0.18, 6, 4]} />
            <meshStandardMaterial color="#ff69b4" emissive="#ff3399" emissiveIntensity={0.5} roughness={0.4} />
          </mesh>
        )
      })}
      {/* Center */}
      <mesh castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFAA00" emissiveIntensity={0.8} metalness={0.3} />
      </mesh>
      <Sparkles color="#ff69b4" />
    </group>
  )
}

function Diya({ position, id }: { position: [number, number, number]; id: string }) {
  const t = useRef(0)
  const flameRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!flameRef.current) return
    t.current += delta
    const flicker = 0.9 + Math.sin(t.current * 30 + Math.random()) * 0.1
    flameRef.current.scale.setScalar(flicker)
  })
  return (
    <group position={[position[0], position[1], position[2]]}>
      <pointLight color="#ff8800" intensity={6} distance={6} />
      {/* Bowl */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.12, 0.1, 10]} />
        <meshStandardMaterial color="#c8732a" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.18, 0]} castShadow>
        <coneGeometry args={[0.07, 0.22, 6]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={1.5} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

function Fruit({ position, id, type }: { position: [number, number, number]; id: string; type: 'mango' | 'coconut' }) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(Math.random() * Math.PI * 2)
  useFrame((_, delta) => {
    if (!ref.current) return
    t.current += delta
    ref.current.position.y = position[1] + Math.sin(t.current * 1.5) * 0.1
  })
  const color = type === 'mango' ? '#FF8C00' : '#4a3728'
  const emissive = type === 'mango' ? '#FF6600' : '#2a1a08'
  return (
    <group>
      <pointLight color={type === 'mango' ? '#FF8C00' : '#aaaaaa'} intensity={2} distance={3} />
      <mesh ref={ref} position={position} castShadow>
        {type === 'mango'
          ? <sphereGeometry args={[0.22, 8, 8]} />
          : <sphereGeometry args={[0.2, 8, 8]} />
        }
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.4} roughness={0.6} />
      </mesh>
      {type === 'mango' && (
        <mesh position={[position[0], position[1] + 0.22, position[2]]}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 4]} />
          <meshStandardMaterial color="#3d7a1a" />
        </mesh>
      )}
    </group>
  )
}

export function Collectibles() {
  const collectibles = useGameStore(s => s.collectibles)
  const active = collectibles.filter(c => !c.collected)

  return (
    <>
      {active.map(c => {
        if (c.type === 'coin')        return <Coin key={c.id} id={c.id} position={c.position} />
        if (c.type.startsWith('gem')) return <Gem  key={c.id} id={c.id} position={c.position} type={c.type} />
        if (c.type === 'lotus')       return <Lotus key={c.id} id={c.id} position={c.position} />
        if (c.type === 'diya')        return <Diya  key={c.id} id={c.id} position={c.position} />
        if (c.type === 'mango' || c.type === 'coconut')
          return <Fruit key={c.id} id={c.id} position={c.position} type={c.type as 'mango' | 'coconut'} />
        return null
      })}
    </>
  )
}

// ---- GuideArrow: bouncing arrow pointing to nearest collectible ----
// Computes everything inside useFrame — no per-frame re-renders, optimal performance.
export function GuideArrow() {
  const ref = useRef<THREE.Group>(null)
  const t = useRef(0)
  const hasCollectibles = useGameStore(s => s.collectibles.some(c => !c.collected))

  useFrame((_, delta) => {
    if (!ref.current) return
    const pp = useGameStore.getState().playerPos
    const active = useGameStore.getState().collectibles.filter(c => !c.collected)
    
    if (active.length === 0 || !pp) {
      ref.current.visible = false
      return
    }
    ref.current.visible = true
    t.current += delta

    // Find nearest collectible
    let closest = active[0], minDist = Infinity
    for (const c of active) {
      const d = (c.position[0] - pp[0]) ** 2 + (c.position[2] - pp[2]) ** 2
      if (d < minDist) { minDist = d; closest = c }
    }

    const dx = closest.position[0] - pp[0]
    const dz = closest.position[2] - pp[2]
    ref.current.rotation.y = Math.atan2(dx, dz)
    ref.current.position.set(pp[0], pp[1] + 2.5 + Math.sin(t.current * 3) * 0.4, pp[2])
    ref.current.scale.setScalar(1 + Math.sin(t.current * 4) * 0.15)
  })

  if (!hasCollectibles) return null

  return (
    <group ref={ref}>
      <mesh position={[0, -0.4, 0]}>
        <coneGeometry args={[0.3, 0.6, 6]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.8} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.1, 0.35, 16]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[Math.cos(i / 4 * Math.PI * 2) * 0.5, 0, Math.sin(i / 4 * Math.PI * 2) * 0.5]}>
          <sphereGeometry args={[0.04, 4, 4]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// ---- Celebration Confetti Particles ----
export function CelebrationParticles({ position, color = '#FFD700', count = 30 }: { position: [number, number, number]; color?: string; count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const velocities = useRef<{ x: number; y: number; z: number }[]>([])
  const lifespan = useRef(2)
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    velocities.current = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 1 + Math.random() * 3
      pos[i*3] = position[0]
      pos[i*3+1] = position[1]
      pos[i*3+2] = position[2]
      velocities.current.push({
        x: Math.sin(theta) * Math.cos(phi) * speed,
        y: Math.abs(Math.sin(phi)) * speed + 2,
        z: Math.cos(theta) * speed
      })
    }
    return pos
  }, [])
  
  const vRef = useRef(velocities.current)
  const lifeRef = useRef(lifespan.current)
  
  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    lifeRef.current -= delta
    if (lifeRef.current <= 0) {
      ref.current.visible = false
      return
    }
    for (let i = 0; i < count; i++) {
      const v = vRef.current[i]
      pos[i*3] += v.x * delta
      pos[i*3+1] += v.y * delta
      pos[i*3+2] += v.z * delta
      v.y -= 3 * delta // gravity
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    
    // Fade out
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = lifeRef.current / lifespan.current
  })
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color={color} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}
