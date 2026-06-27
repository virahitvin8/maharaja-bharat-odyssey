// Exploration Mechanics — climbing, tree cutting, crafting, stone throwing, swimming
// Temple Run 2-style parkour movement with interactive world elements
import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

// ========== CLIMBABLE WALL ==========
// Any vertical surface the player can climb by pressing Space while facing it
export function ClimbableWall({ 
  position, size, rotation = 0, wallId 
}: { 
  position: [number, number, number]; size: [number, number, number]
  rotation?: number; wallId: string 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isActiveWall] = useState(false)
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Climbable surface with hand-hold indicators */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={isActiveWall ? '#8a7a5a' : '#7a6a4a'} 
          roughness={0.95} 
          metalness={0.05}
        />
      </mesh>
      {/* Handhold dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[
          (i % 3 - 1) * size[0] * 0.25, 
          (Math.floor(i / 3) * 2 + 1) * size[1] * 0.2, 
          size[2] / 2 + 0.05
        ]}>
          <sphereGeometry args={[0.08, 4, 4]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
        </mesh>
      ))}
      {/* Climbing vines (if wall is tall enough) */}
      {size[1] > 3 && Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[size[0] * 0.3 * (i - 1), 0, size[2] / 2 + 0.1]}
          rotation={[0, 0, (i - 1) * 0.2]}>
          <cylinderGeometry args={[0.03, 0.05, size[1], 4]} />
          <meshStandardMaterial color="#2a6a2a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// ========== CUTTABLE TREE ==========
// Trees that can be chopped for wood resources
export function CuttableTree({ 
  position, scale = 1, treeId 
}: { 
  position: [number, number, number]; scale?: number; treeId: string 
}) {
  const [isCut, setIsCut] = useState(false)
  const [fallProgress, setFallProgress] = useState(0)
  const groupRef = useRef<THREE.Group>(null)
  const addItem = useGameStore(s => s.addItem)
  const showNotification = useGameStore(s => s.showNotification)
  const isAttacking = useGameStore(s => s.isAttacking)
  const playerPos = useGameStore(s => s.playerPos)
  
  // Check distance for sword interaction
  useFrame((_, delta) => {
    if (isCut && fallProgress < 1) {
      setFallProgress(p => Math.min(p + delta * 0.8, 1))
      if (groupRef.current) {
        groupRef.current.rotation.z -= delta * 0.5
        groupRef.current.rotation.x -= delta * 0.3
        groupRef.current.position.y -= delta * 0.2
      }
    }
  })

  // Detect sword swing nearby
  const lastCheck = useRef(0)
  useFrame(() => {
    if (isCut) return
    const now = Date.now()
    if (now - lastCheck.current < 500) return
    lastCheck.current = now
    
    if (isAttacking) {
      const dist = Math.sqrt(
        (playerPos[0] - position[0]) ** 2 + 
        (playerPos[2] - position[2]) ** 2
      )
      if (dist < 3) {
        setIsCut(true)
        addItem('wood', 2 + Math.floor(Math.random() * 3))
        showNotification('🌳 Tree felled! +Wood', 'collect')
      }
    }
  })

  if (isCut && fallProgress >= 1) return null

  return (
    <group ref={groupRef} position={[position[0], 0, position[2]]} scale={scale}>
      {/* Trunk */}
      <mesh castShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 4, 6]} />
        <meshStandardMaterial color={isCut ? '#5a3a1a' : '#4a2a0a'} roughness={0.9} />
      </mesh>
      {/* Canopy */}
      <mesh castShadow position={[0, 4.5, 0]}>
        <sphereGeometry args={[isCut ? 1.2 : 1.5, 6, 5]} />
        <meshStandardMaterial color={isCut ? '#3a6a3a' : '#2a7a2a'} roughness={0.85} />
      </mesh>
      {/* Chop marks (when damaged) */}
      {isCut && Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[0.2 * (i - 1), 1.5 + i * 0.4, 0.1]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#8a6a4a" />
        </mesh>
      ))}
    </group>
  )
}

// ========== THROWABLE STONE ==========
// Stones that can be picked up and thrown at animals or targets
export function PickupStone({ 
  position, stoneId, onCollect 
}: { 
  position: [number, number, number]; stoneId: string
  onCollect?: () => void 
}) {
  const [collected, setCollected] = useState(false)
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    if (!ref.current || collected) return
    t.current += delta
    ref.current.position.y = position[1] + Math.sin(t.current) * 0.1
    ref.current.rotation.x += delta * 0.5
    ref.current.rotation.z += delta * 0.3
  })

  if (collected) return null

  return (
    <mesh ref={ref} position={position} castShadow
      onClick={() => {
        setCollected(true)
        useGameStore.getState().addItem('stone', 1)
        useGameStore.getState().showNotification('🪨 Stone collected!', 'collect')
        onCollect?.()
      }}>
      <dodecahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial color="#7a7a7a" roughness={0.95} />
    </mesh>
  )
}

// ========== RAFT (craftable water crossing) ==========
// Build a raft to cross rivers — requires 8 wood
export function RaftCrafting({ 
  position, onRaftReady 
}: { 
  position: [number, number, number]
  onRaftReady?: () => void 
}) {
  const [raftReady, setRaftReady] = useState(false)
  const [building, setBuilding] = useState(false)
  const showNotification = useGameStore(s => s.showNotification)
  const removeItem = useGameStore(s => s.removeItem)

  const handleBuild = () => {
    if (raftReady) {
      onRaftReady?.()
      return
    }
    if (!building) {
      if (useGameStore.getState().inventory.wood < 8) {
        showNotification('Need 8 wood to build a raft! Cut trees nearby', 'collect')
        return
      }
      setBuilding(true)
    }
  }

  // Building progresses over time
  useEffect(() => {
    if (!building) return
    const timer = setTimeout(() => {
      setRaftReady(true)
      showNotification('🛶 Raft built! Use it to cross water', 'collect')
      onRaftReady?.()
    }, 3000)
    return () => clearTimeout(timer)
  }, [building])

  return (
    <group position={position}>
      {/* Raft platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[3, 0.2, 2]} />
        <meshStandardMaterial color="#6b4a2a" roughness={0.9} />
      </mesh>
      {/* Logs */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[i * 0.6 - 1.2, 0.25, 0]} rotation={[0, 0, 0.1 * i]}>
          <cylinderGeometry args={[0.08, 0.1, 2.5, 5]} />
          <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
        </mesh>
      ))}
      {/* Rope */}
      <mesh position={[0, 0.3, 1]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.02, 0.015, 4, 8]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.8} />
      </mesh>
      {/* Build button area */}
      <mesh position={[0, 1, 0]} onClick={handleBuild} visible={false}>
        <boxGeometry args={[4, 2, 3]} />
      </mesh>
      {/* Build prompt */}
      {!raftReady && !building && (
        <sprite position={[0, 1.5, 0]} scale={[2, 0.3, 1]}>
          <spriteMaterial 
            color="#FFFFFF" 
            transparent opacity={0.8}
          />
        </sprite>
      )}
    </group>
  )
}

// ========== TREE HOUSE ==========
// Buildable shelter — requires 20 wood, 10 stone
export function TreeHouse({ 
  position, treeHouseId 
}: { 
  position: [number, number, number]; treeHouseId: string 
}) {
  const [isBuilt, setIsBuilt] = useState(false)
  const showNotification = useGameStore(s => s.showNotification)

  const handleBuild = () => {
    const s = useGameStore.getState()
    if (isBuilt) {
      showNotification('🏠 Resting... ❤️', 'life')
      s.heal(30)
      return
    }
    if (s.inventory.wood < 20 || s.inventory.stone < 10) {
      showNotification('Need 20 wood + 10 stone to build a treehouse', 'collect')
      return
    }
    s.removeItem('wood', 20)
    s.removeItem('stone', 10)
    setIsBuilt(true)
    showNotification('🏠 Treehouse built! Rest here to heal ❤️', 'life')
  }

  return (
    <group position={position}>
      {/* Platform */}
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
      </mesh>
      {/* Walls */}
      <mesh position={[0, 5, 0]} castShadow>
        <boxGeometry args={[2.8, 2, 2.8]} />
        <meshStandardMaterial color={isBuilt ? '#6b4a2a' : 'rgba(107,74,42,0.5)'} roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <coneGeometry args={[2, 1.5, 4]} />
        <meshStandardMaterial color="#3a6a2a" roughness={0.8} />
      </mesh>
      {/* Ladder */}
      <mesh position={[0.8, 2, 0]} castShadow>
        <boxGeometry args={[0.05, 4, 0.6]} />
        <meshStandardMaterial color="#4a2a0a" roughness={0.9} />
      </mesh>
      {/* Ladder rungs */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0.8, 0.4 + i * 0.8, 0]} castShadow>
          <boxGeometry args={[0.4, 0.05, 0.05]} />
          <meshStandardMaterial color="#4a2a0a" roughness={0.9} />
        </mesh>
      ))}
      {/* Trunk */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 4, 6]} />
        <meshStandardMaterial color="#3a2008" roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 7.5, 0]} castShadow>
        <sphereGeometry args={[1.8, 6, 5]} />
        <meshStandardMaterial color="#2a6a2a" roughness={0.85} />
      </mesh>
    </group>
  )
}

// ========== ANIMAL (friendly/neutral) ==========
// Deer, peacock, cow — can be scared or fed
export function Wildlife({ 
  position, animalId, type = 'deer' 
}: { 
  position: [number, number, number]; animalId: string
  type?: 'deer' | 'peacock' | 'cow' | 'monkey' 
}) {
  const groupRef = useRef<THREE.Group>(null)
  const t = useRef(Math.random() * 100)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    t.current += delta
    // Gentle idle animation
    groupRef.current.position.y = Math.sin(t.current * 2) * 0.05
  })

  const color = type === 'deer' ? '#c8956c' : type === 'peacock' ? '#2d6a4f' : type === 'cow' ? '#f5f0e0' : '#5a4a3a'

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh castShadow><boxGeometry args={[0.5, 0.3, 0.8]} /><meshStandardMaterial color={color} roughness={0.8} /></mesh>
      {/* Head */}
      <mesh position={[0, 0.15, 0.4]} castShadow><sphereGeometry args={[0.15, 6, 6]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
      {/* Legs */}
      {[[-0.2, -0.15, -0.2], [0.2, -0.15, -0.2], [-0.2, -0.15, 0.2], [0.2, -0.15, 0.2]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow><cylinderGeometry args={[0.04, 0.06, 0.3, 4]} /><meshStandardMaterial color="#4a3a2a" roughness={0.9} /></mesh>
      ))}
      {/* Peacock tail */}
      {type === 'peacock' && Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0.2 * (i - 2), 0.2, 0]} rotation={[0.3, 0, i * 0.3]} castShadow>
          <coneGeometry args={[0.08, 0.5, 4]} />
          <meshStandardMaterial color="#1a6a4a" roughness={0.7} />
        </mesh>
      ))}
      {/* Cow horns */}
      {type === 'cow' && [[-0.12, 0.2, 0.35], [0.12, 0.2, 0.35]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, i === 0 ? 0.3 : -0.3]}><coneGeometry args={[0.02, 0.15, 4]} /><meshStandardMaterial color="#3a2a1a" /></mesh>
      ))}
    </group>
  )
}

// ========== HOSTILE ANIMAL (wild boar, snake, tiger) ==========
export function HostileAnimal({ 
  position, animalId, type = 'boar', onDefeated 
}: { 
  position: [number, number, number]; animalId: string
  type?: 'boar' | 'snake' | 'tiger'
  onDefeated?: () => void 
}) {
  const [health, setHealth] = useState(3)
  const [isDead, setIsDead] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const isAttacking = useGameStore(s => s.isAttacking)
  const playerPos = useGameStore(s => s.playerPos)
  const takeDamage = useGameStore(s => s.takeDamage)
  const lastAttackTime = useRef(0)

  useFrame((_, delta) => {
    if (isDead || !groupRef.current) return
    
    // Move toward player if close
    const dist = Math.sqrt(
      (playerPos[0] - groupRef.current.position.x) ** 2 +
      (playerPos[2] - groupRef.current.position.z) ** 2
    )
    
    if (dist < 10) {
      const dir = new THREE.Vector3(
        playerPos[0] - groupRef.current.position.x,
        0,
        playerPos[2] - groupRef.current.position.z
      ).normalize()
      groupRef.current.position.x += dir.x * delta * (type === 'tiger' ? 3 : type === 'boar' ? 2 : 1.5)
      groupRef.current.position.z += dir.z * delta * (type === 'tiger' ? 3 : type === 'boar' ? 2 : 1.5)
      groupRef.current.lookAt(playerPos[0], groupRef.current.position.y, playerPos[2])

      // Attack player if very close
      if (dist < 1.5 && Date.now() - lastAttackTime.current > 2000) {
        lastAttackTime.current = Date.now()
        takeDamage(type === 'tiger' ? 25 : type === 'boar' ? 15 : 10)
      }
    }

    // Check if player is attacking nearby
    if (isAttacking && dist < 3 && Date.now() - lastAttackTime.current > 500) {
      lastAttackTime.current = Date.now()
      setHealth(h => {
        const nh = h - 1
        if (nh <= 0) {
          setIsDead(true)
          useGameStore.getState().addItem('food', type === 'boar' ? 3 : 1)
          useGameStore.getState().showNotification(`🐗 ${type} defeated! +Food`, 'collect')
          onDefeated?.()
        }
        return nh
      })
    }
  })

  if (isDead) return null

  const color = type === 'tiger' ? '#e8a020' : type === 'boar' ? '#4a3a2a' : '#2a6a2a'

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow><boxGeometry args={[0.4, 0.25, 0.7]} /><meshStandardMaterial color={color} roughness={0.8} /></mesh>
      <mesh position={[0, 0.1, 0.35]} castShadow><sphereGeometry args={[0.12, 5, 5]} /><meshStandardMaterial color={color} roughness={0.7} /></mesh>
    </group>
  )
}

// ========== WATER PATCH (swimmable) ==========
export function SwimmableWater({ 
  position, size 
}: { 
  position: [number, number, number]; size: [number, number] 
}) {
  const waterRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }
  })

  return (
    <mesh ref={waterRef} position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#1a6aaa" transparent opacity={0.75} roughness={0.1} metalness={0.2} />
    </mesh>
  )
}

// ========== CLIMBABLE ROPE (for mountain climbing like Tirumala) ==========
export function ClimbRope({ 
  position, length = 5, ropeId 
}: { 
  position: [number, number, number]; length?: number; ropeId: string 
}) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.04, length, 4]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.9} />
      </mesh>
      {/* Knots every meter */}
      {Array.from({ length: Math.floor(length) }).map((_, i) => (
        <mesh key={i} position={[0, -0.5 - i, 0]}>
          <sphereGeometry args={[0.06, 4, 4]} />
          <meshStandardMaterial color="#7a6a4a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// ========== FRUIT TREE (climbable for energy) ==========
export function FruitTree({ 
  position, fruitType = 'mango', treeId 
}: { 
  position: [number, number, number]; fruitType?: 'mango' | 'coconut' | 'banana'; treeId: string 
}) {
  const fruits = useMemo(() => 
    Array.from({ length: 4 }, (_, i) => ({
      pos: [Math.sin(i * 1.5) * 1.2, 3 + i * 0.3, Math.cos(i * 1.5) * 1.2] as [number, number, number],
      collected: false,
    })), []
  )

  const handlePickFruit = (index: number) => {
    const s = useGameStore.getState()
    s.restoreStamina(20)
    s.addItem('food', 1)
    s.showNotification(`🍎 ${fruitType} collected! +Energy`, 'collect')
  }

  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 4, 5]} />
        <meshStandardMaterial color="#4a2a0a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <sphereGeometry args={[1.8, 6, 5]} />
        <meshStandardMaterial color="#2a7a2a" roughness={0.85} />
      </mesh>
      {fruits.map((fruit, i) => (
        !fruit.collected && (
          <mesh key={i} position={fruit.pos}
            onClick={() => handlePickFruit(i)}
            castShadow>
            <sphereGeometry args={[0.15, 6, 6]} />
            <meshStandardMaterial color={fruitType === 'mango' ? '#FF8C00' : fruitType === 'coconut' ? '#4a3728' : '#FFE135'} roughness={0.5} />
          </mesh>
        )
      ))}
    </group>
  )
}
