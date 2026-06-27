import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---- Atmospheric Dust Particles ----
export function AtmosphereParticles({ count = 150, spread = 120, height = 15 }: { count?: number; spread?: number; height?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * spread
      temp[i * 3 + 1] = Math.random() * height
      temp[i * 3 + 2] = (Math.random() - 0.5) * spread
    }
    return temp
  }, [count, spread, height])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 2
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.3} color="#FFD700" transparent opacity={0.6} sizeAttenuation={true} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

// ---- Incense Smoke Particles ----
export function IncenseParticles({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 30
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 0.5
      temp[i * 3 + 1] = Math.random() * 2
      temp[i * 3 + 2] = (Math.random() - 0.5) * 0.5
    }
    return temp
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.02
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.01
        
        if (positions[i * 3 + 1] > 3) {
          positions[i * 3 + 1] = 0
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.4} color="#aaaaaa" transparent opacity={0.3} sizeAttenuation={true} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

// ---- Optimized Simple Tree ----
export function SimpleTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const s = scale * (0.8 + Math.random() * 0.4)
  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 1 * s, 0]}>
        <cylinderGeometry args={[0.2 * s, 0.3 * s, 2 * s, 4]} />
        <meshStandardMaterial color="#4a3020" roughness={0.9} />
      </mesh>
      {/* Canopy */}
      <mesh castShadow receiveShadow position={[0, 3 * s, 0]}>
        <sphereGeometry args={[2 * s, 5, 4]} />
        <meshStandardMaterial color="#2a7a2a" roughness={0.8} />
      </mesh>
    </group>
  )
}

// ---- Realistic Water Plane ----
export function RealisticWater({ position, size, color = '#1a6aaa' }: { position: [number, number, number]; size: [number, number]; color?: string }) {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial
      // Simulate waves by interpolating opacity and metalness
      mat.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 1.5 + position[0] * 0.1) * 0.1
    }
  })

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent opacity={0.8}
        roughness={0.0} metalness={0.8}
        emissive={color} emissiveIntensity={0.2}
      />
    </mesh>
  )
}
