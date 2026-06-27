// Temple Sanctum — deity darshan ceremony with blessing animation
// Player enters → approaches deity → presses E to pray → receives superpower
import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import { getSuperpowerByTemple, type Superpower } from '../../data/superpowers'
import { getOrnamentsForTemple } from '../../data/ornaments'
import type { PowerfulTemple } from '../../data/powerfulTemples'

// ========== DEITY IDOL ==========
function DeityIdol({ temple, isBlessed }: { temple: PowerfulTemple; isBlessed: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((state, delta) => {
    t.current += delta
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t.current * 2) * 0.1 * (isBlessed ? 0.3 : 0.1)
      glowRef.current.scale.setScalar(pulse)
    }
  })

  // Choose a deity color and shape based on temple style
  const deityColor = temple.style === 'chola' ? '#DAA520' : 
    temple.style === 'gupta' ? '#f0e8d8' :
    temple.style === 'rashtrakuta' ? '#8a7a6a' : '#FFD700'

  return (
    <group>
      {/* Platform */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      {/* Divine glow aura */}
      <mesh ref={glowRef} position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshBasicMaterial color={isBlessed ? '#FFD700' : '#FFD700'} transparent opacity={isBlessed ? 0.3 : 0.15} />
      </mesh>
      {/* Deity body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 1.2, 8]} />
        <meshStandardMaterial color={deityColor} metalness={0.5} roughness={0.3} emissive={isBlessed ? '#FFD700' : undefined} emissiveIntensity={isBlessed ? 0.5 : 0} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color={deityColor} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Divine halo */}
      <mesh position={[0, 2.5, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.4, 0.04, 8, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={isBlessed ? 2 : 0.5} transparent opacity={isBlessed ? 0.9 : 0.4} />
      </mesh>
      {/* Golden crown */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 0.15, 6]} />
        <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={isBlessed ? 0.5 : 0} />
      </mesh>
      {/* Blessing particles */}
      {isBlessed && Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.6, 1.5 + Math.sin(t.current + i) * 0.1, Math.sin(angle) * 0.6]}>
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

// ========== BLESSING CEREMONY OVERLAY ==========
function BlessingCeremony({ 
  temple, superpower, onComplete 
}: { 
  temple: PowerfulTemple; superpower: Superpower
  onComplete: () => void 
}) {
  const progress = useRef(0)
  const [phase, setPhase] = useState<'intro' | 'blessing' | 'reveal'>('intro')
  const { name: playerName = 'Pilgrim' } = useGameStore(s => s.profile) ?? { name: 'Pilgrim' }

  // Animate ceremony sequence
  useFrame((_, delta) => {
    progress.current += delta
    if (phase === 'intro' && progress.current > 2) {
      setPhase('blessing')
      progress.current = 0
    }
    if (phase === 'blessing' && progress.current > 3) {
      setPhase('reveal')
      progress.current = 0
    }
    if (phase === 'reveal' && progress.current > 4) {
      onComplete()
    }
  })

  return (
    <group>
      {/* Sacred geometry circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.5, 2, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={phase === 'blessing' ? 0.3 : 0.1} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Light rays */}
      {phase === 'blessing' && Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.5, 0.5, Math.sin(angle) * 1.5]}
            rotation={[-Math.PI / 2, 0, angle]}>
            <planeGeometry args={[0.1, 2]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        )
      })}
    </group>
  )
}

// ========== MAIN TEMPLE SANCTUM ==========
interface TempleSanctumProps {
  position: [number, number, number]
  temple: PowerfulTemple
  onExit: () => void
}

export function TempleSanctum({ position, temple, onExit }: TempleSanctumProps) {
  const [hasDarshan, setHasDarshan] = useState(false)
  const [showCeremony, setShowCeremony] = useState(false)
  const [blessingRevealed, setBlessingRevealed] = useState(false)
  const playerPos = useGameStore(s => s.playerPos)
  const showNotification = useGameStore(s => s.showNotification)
  const addBlessing = useGameStore(s => s.addBlessing)

  const superpower = getSuperpowerByTemple(temple.id)
  const ornamentReward = getOrnamentsForTemple(temple.id)
  const ceremonyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Proximity triggers: prayer when close to deity, exit when walking away after darshan
  const prayTriggered = useRef(false)
  const exitCooldown = useRef(0)

  useFrame(() => {
    const dist = Math.sqrt(
      (playerPos[0] - position[0]) ** 2 +
      (playerPos[2] - position[2]) ** 2
    )

    // Auto-prayer: walk within 2 units of deity to trigger darshan ceremony
    if (!hasDarshan && !showCeremony && dist < 2 && !prayTriggered.current) {
      prayTriggered.current = true
      setShowCeremony(true)
      // Unlock blessing after ceremony completes (8s ceremony length)
      ceremonyTimeoutRef.current = setTimeout(() => {
        setHasDarshan(true)
        setBlessingRevealed(true)
        if (superpower) {
          addBlessing(superpower.id)
          const bName = useGameStore.getState().profile?.name || 'Pilgrim'
          showNotification(`✨ ${bName} received ${superpower.name}!`, 'blessing')
        }
        if (ornamentReward.length > 0) {
          const oName = useGameStore.getState().profile?.name || 'Pilgrim'
          showNotification(`💎 ${oName} obtained ${ornamentReward[0].name}!`, 'ornament')
        }
      }, 8000)
    }

    // Auto-exit: walk 3+ units away from deity after receiving blessing
    if (hasDarshan && blessingRevealed && dist > 3 && Date.now() - exitCooldown.current > 1000) {
      exitCooldown.current = Date.now()
      if (ceremonyTimeoutRef.current) clearTimeout(ceremonyTimeoutRef.current)
      onExit()
    }
  })

  return (
    <group position={position}>
      {/* Sanctum walls */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[8, 5, 6]} />
          <meshStandardMaterial color="#e4d4b8" roughness={0.6} />
        </mesh>
        {/* Inner walls */}
        {[[3.5, 2.5, 0], [-3.5, 2.5, 0]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}><boxGeometry args={[0.3, 5, 6]} /><meshStandardMaterial color="#d4c4a8" roughness={0.6} /></mesh>
        ))}
        {[[0, 2.5, 2.5], [0, 2.5, -2.5]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]}><boxGeometry args={[8, 5, 0.3]} /><meshStandardMaterial color="#d4c4a8" roughness={0.6} /></mesh>
        ))}
      </RigidBody>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#c8b898" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Deity idol at the back */}
      <DeityIdol temple={temple} isBlessed={hasDarshan} />

      {/* Pillars */}
      {[[-2.5, 2, -1.5], [2.5, 2, -1.5], [-2.5, 2, 1.5], [2.5, 2, 1.5]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.2, 0.25, 4, 6]} />
          <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
        </mesh>
      ))}

      {/* Diyas along walls */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <pointLight key={i} color="#ff8800" intensity={1.5} distance={4}
            position={[Math.cos(angle) * 3.2, 1, Math.sin(angle) * 2.2]} />
        )
      })}

      {/* Sacred garbhagriha (inner sanctum) */}
      <mesh position={[0, 0.8, -1.8]} receiveShadow>
        <boxGeometry args={[3, 1.5, 1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Exit doorway */}
      <mesh position={[0, 2.5, 2.6]}>
        <torusGeometry args={[1.5, 0.1, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#DAA520" emissive="#FFD700" emissiveIntensity={0.5} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Prayer glow — attracts player to approach the deity */}
      {!hasDarshan && !showCeremony && (
        <pointLight color="#FFD700" intensity={2} distance={6} position={[0, 1.5, -1.5]} />
      )}

      {/* Blessing ceremony */}
      {showCeremony && !blessingRevealed && superpower && (
        <BlessingCeremony temple={temple} superpower={superpower} onComplete={() => {}} />
      )}

      {/* Exit prompt after darshan - walk away from deity to leave */}
      {hasDarshan && blessingRevealed && (
        <mesh position={[0, 2, 2.5]}>
          <torusGeometry args={[1.2, 0.08, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#DAA520" emissive="#FFD700" emissiveIntensity={0.6} metalness={0.7} roughness={0.2} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}
