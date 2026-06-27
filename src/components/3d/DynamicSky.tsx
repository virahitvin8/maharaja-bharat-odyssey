// Dynamic sky — day/night cycle, sun, moon, stars, clouds
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

// Reusable fog instance to avoid 60 allocs/sec
const reusableFog = new THREE.FogExp2('#c8d8e8', 0.004)

// Sky colors per hour
function getSkyColor(hour: number): THREE.Color {
  const palette = [
    { h: 0,  c: new THREE.Color(0x080820) },  // midnight
    { h: 4,  c: new THREE.Color(0x0d1a3a) },  // pre-dawn
    { h: 6,  c: new THREE.Color(0xff6030) },  // sunrise
    { h: 8,  c: new THREE.Color(0x87ceeb) },  // morning
    { h: 12, c: new THREE.Color(0x5bb8f5) },  // noon
    { h: 16, c: new THREE.Color(0x87ceeb) },  // afternoon
    { h: 18, c: new THREE.Color(0xff8030) },  // sunset
    { h: 20, c: new THREE.Color(0x1a0a35) },  // dusk
    { h: 24, c: new THREE.Color(0x080820) },  // midnight again
  ]
  for (let i = 0; i < palette.length - 1; i++) {
    if (hour >= palette[i].h && hour < palette[i + 1].h) {
      const t = (hour - palette[i].h) / (palette[i + 1].h - palette[i].h)
      return palette[i].c.clone().lerp(palette[i + 1].c, t)
    }
  }
  return new THREE.Color(0x080820)
}

function getFogColor(hour: number): THREE.Color {
  if (hour < 6)  return new THREE.Color(0x0d1a3a)
  if (hour < 8)  return new THREE.Color(0xff9060)
  if (hour < 18) return new THREE.Color(0xc8d8e8)
  if (hour < 20) return new THREE.Color(0xff7040)
  return new THREE.Color(0x0d1535)
}

function Stars({ count = 500 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 800
    positions[i * 3 + 1] = Math.random() * 300 + 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 800
  }
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.8} sizeAttenuation transparent opacity={0.9} />
    </points>
  )
}

function Cloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  const speed = 0.3 + Math.random() * 0.2
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += speed * delta
      if (ref.current.position.x > 300) ref.current.position.x = -300
    }
  })
  return (
    <group ref={ref} position={position}>
      {[0, 2, -2, 1.5, -1.5].map((x, i) => (
        <mesh key={i} position={[x, i < 2 ? 0 : Math.random() - 0.5, 0]}>
          <sphereGeometry args={[3 + Math.random() * 2, 6, 5]} />
          <meshStandardMaterial color="#f0f0f0" roughness={1} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

export function DynamicSky() {
  const weather = useGameStore(s => s.weather)
  const bgRef = useRef<THREE.Color>(new THREE.Color())
  const sunRef = useRef<THREE.Mesh>(null)
  const moonRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const ambRef = useRef<THREE.AmbientLight>(null)
  const timeRef = useRef(10) // local time, not in React state
  const syncTimer = useRef(0)

  useFrame((state, delta) => {
    // Advance time locally — no React setState, no re-render
    timeRef.current = (timeRef.current + delta * 0.5) % 24
    const h = timeRef.current

    // Push to store only every 2 seconds (for HUD/biome use)
    syncTimer.current += delta
    if (syncTimer.current > 2) {
      syncTimer.current = 0
      useGameStore.getState().setTimeOfDay(h)
    }

    const sky = getSkyColor(h)
    state.scene.background = sky
    reusableFog.color.copy(getFogColor(h))
    state.scene.fog = reusableFog

    // Sun orbit
    const sunAngle = (h / 24) * Math.PI * 2 - Math.PI / 2
    if (sunRef.current) {
      sunRef.current.position.set(Math.cos(sunAngle) * 200, Math.sin(sunAngle) * 200, -50)
      sunRef.current.visible = h > 5.5 && h < 20
    }
    if (moonRef.current) {
      moonRef.current.position.set(-Math.cos(sunAngle) * 200, -Math.sin(sunAngle) * 200, -50)
      moonRef.current.visible = h < 6 || h > 19.5
    }

    // Directional light
    if (lightRef.current) {
      const intensity = h > 6 && h < 18
        ? Math.sin(((h - 6) / 12) * Math.PI) * 3
        : 0.1
      lightRef.current.intensity = intensity
      lightRef.current.position.set(Math.cos(sunAngle) * 100, Math.sin(sunAngle) * 100, 50)
      if (h < 8 || h > 17) {
        lightRef.current.color.set(0xff9944)
      } else {
        lightRef.current.color.set(0xfff5e0)
      }
    }

    // Ambient light
    if (ambRef.current) {
      ambRef.current.intensity = h > 6 && h < 20 ? 0.6 : 0.15
    }
  })

  return (
    <>
      {/* Lights */}
      <ambientLight ref={ambRef} intensity={0.6} color="#fffde7" />
      <directionalLight
        ref={lightRef}
        position={[100, 100, 50]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={300}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        color="#fff5e0"
      />
      <hemisphereLight args={['#87ceeb', '#4a3a1a', 0.5]} />

      {/* Sun */}
      <mesh ref={sunRef} position={[0, 200, -50]}>
        <sphereGeometry args={[8, 12, 12]} />
        <meshStandardMaterial color="#FFD700" emissive="#FF8800" emissiveIntensity={2} />
      </mesh>
      <pointLight ref={null} color="#FFA500" intensity={3} distance={300} position={[0, 200, -50]} />

      {/* Moon */}
      <mesh ref={moonRef} position={[0, -200, -50]}>
        <sphereGeometry args={[5, 10, 10]} />
        <meshStandardMaterial color="#eeeeee" emissive="#aaaaaa" emissiveIntensity={0.5} />
      </mesh>

      {/* Stars (visible at night) */}
      {(timeRef.current < 6.5 || timeRef.current > 19) && <Stars />}

      {/* Clouds */}
      {weather !== 'sandstorm' && Array.from({ length: 10 }).map((_, i) => (
        <Cloud key={i} position={[
          (Math.random() - 0.5) * 300,
          60 + Math.random() * 20,
          (Math.random() - 0.5) * 300,
        ]} />
      ))}

      {/* Weather: Rain particles */}
      {weather === 'rain' && <RainEffect />}
      {weather === 'snow' && <SnowEffect />}
      {weather === 'sandstorm' && <SandstormEffect />}
    </>
  )
}

function RainEffect() {
  const count = 3000
  const positions = new Float32Array(count * 3)
  const ref = useRef<THREE.Points>(null)
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = Math.random() * 60
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200
  }
  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= 30 * delta
      if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 60
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aaccff" size={0.15} sizeAttenuation transparent opacity={0.6} />
    </points>
  )
}

function SnowEffect() {
  const count = 2000
  const positions = new Float32Array(count * 3)
  const ref = useRef<THREE.Points>(null)
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = Math.random() * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200
  }
  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= 2 * delta
      pos[i * 3] += Math.sin(Date.now() * 0.001 + i) * delta
      if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 50
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.4} sizeAttenuation transparent opacity={0.7} />
    </points>
  )
}

function SandstormEffect() {
  const count = 4000
  const positions = new Float32Array(count * 3)
  const ref = useRef<THREE.Points>(null)
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 150
    positions[i * 3 + 1] = Math.random() * 30
    positions[i * 3 + 2] = (Math.random() - 0.5) * 150
  }
  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3] += 15 * delta
      if (pos[i * 3] > 75) pos[i * 3] = -75
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c8a050" size={0.3} sizeAttenuation transparent opacity={0.45} />
    </points>
  )
}
