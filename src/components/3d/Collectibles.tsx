// All collectible items — coins, gems, lotus, diya — with animations and glow
import { useRef } from 'react'
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
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.28, 0.28, 0.06, 16]} />
      <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.5} />
    </mesh>
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
      <pointLight color={emit} intensity={3} distance={4} />
      <mesh ref={ref} castShadow>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={color} emissive={emit} emissiveIntensity={0.7} metalness={0.6} roughness={0.1} />
      </mesh>
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
      <pointLight color="#ff88cc" intensity={4} distance={5} />
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
