// Complete Maharaja Character — procedural geometry, full Mario 64 physics
import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import * as THREE from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import type { InputState } from '../../hooks/useInput'
import { useGameStore, getCharacterHeightFromAge } from '../../store/gameStore'
import { playJumpSound, playLandSound, playAttackSound } from '../../audio/sounds'

interface MaharajaProps {
  input: React.MutableRefObject<InputState>
}

const MOVE_SPEED = 8
const RUN_SPEED  = 14
const JUMP_FORCE = 12
const DOUBLE_JUMP_FORCE = 13
const TRIPLE_JUMP_FORCE = 16
const GROUND_POUND_FORCE = -25
const STAMINA_DRAIN_RUN  = 12  // per second
const STAMINA_DRAIN_JUMP = 8
const STAMINA_REGEN      = 18  // per second when idle

// Procedural Maharaja mesh built from THREE primitives
function MaharajaMesh({ isMoving, isAttacking, isJumping }: { isMoving: boolean, isAttacking: boolean, isJumping: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const swordRef = useRef<THREE.Mesh>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    t.current += delta

    // Idle bob
    if (!isMoving && !isJumping) {
      groupRef.current.position.y = Math.sin(t.current * 2) * 0.04
    }
    // Walk bob
    if (isMoving) {
      groupRef.current.position.y = Math.abs(Math.sin(t.current * 8)) * 0.06
      groupRef.current.rotation.z = Math.sin(t.current * 8) * 0.04
    } else {
      groupRef.current.rotation.z = 0
    }
    // Sword attack swing
    if (swordRef.current) {
      if (isAttacking) {
        swordRef.current.rotation.z = Math.sin(t.current * 20) * 0.8 - 0.4
      } else {
        swordRef.current.rotation.z = THREE.MathUtils.lerp(swordRef.current.rotation.z, -0.2, 0.1)
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Legs */}
      <mesh position={[-0.18, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.5, 8]} />
        <meshStandardMaterial color="#1a3a6e" roughness={0.7} />
      </mesh>
      <mesh position={[0.18, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.5, 8]} />
        <meshStandardMaterial color="#1a3a6e" roughness={0.7} />
      </mesh>
      {/* Sherwani body — saffron gold */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.7, 12]} />
        <meshStandardMaterial color="#FF9933" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Gold belt */}
      <mesh position={[0, -0.38, 0]} castShadow>
        <cylinderGeometry args={[0.295, 0.295, 0.08, 12]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Decorative buttons */}
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[0, 0.12 - i * 0.14, 0.29]} castShadow>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Arms */}
      <mesh position={[-0.38, 0.05, 0]} rotation={[0, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.45, 8]} />
        <meshStandardMaterial color="#FF9933" roughness={0.5} />
      </mesh>
      {/* Right arm — holds sword */}
      <mesh position={[0.38, 0.05, 0]} rotation={[0, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.45, 8]} />
        <meshStandardMaterial color="#FF9933" roughness={0.5} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.12, 8]} />
        <meshStandardMaterial color="#c8956c" roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.56, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#c8956c" roughness={0.6} />
      </mesh>
      {/* Mustache */}
      <mesh position={[0, 0.49, 0.2]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.025, 6, 10, Math.PI]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.8} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 0.58, 0.19]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.08, 0.58, 0.19]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Turban base */}
      <mesh position={[0, 0.73, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.22, 0.15, 10]} />
        <meshStandardMaterial color="#003366" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Turban top coil */}
      <mesh position={[0, 0.83, 0]} castShadow>
        <torusGeometry args={[0.16, 0.06, 6, 12]} />
        <meshStandardMaterial color="#003366" roughness={0.5} />
      </mesh>
      {/* Turban jewel */}
      <mesh position={[0, 0.83, 0.2]} castShadow>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshStandardMaterial color="#e63946" emissive="#e63946" emissiveIntensity={0.8} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Feather in turban */}
      <mesh position={[0, 1.0, 0.1]} rotation={[0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.005, 0.35, 5]} />
        <meshStandardMaterial color="#138808" roughness={0.8} />
      </mesh>
      {/* Crown band */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <cylinderGeometry args={[0.245, 0.245, 0.06, 12]} />
        <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.2} />
      </mesh>
      {/* SWORD in right hand */}
      <group ref={swordRef} position={[0.55, -0.08, 0]} rotation={[0, 0, -0.2]}>
        {/* Handle */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 6]} />
          <meshStandardMaterial color="#4a2c0a" roughness={0.8} />
        </mesh>
        {/* Guard */}
        <mesh position={[0, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.18, 6]} />
          <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Blade */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.03, 0.55, 0.008]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.05} emissive="#aaaaff" emissiveIntensity={0.1} />
        </mesh>
        {/* Blade tip */}
        <mesh position={[0, 0.575, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.015, 0.06, 4]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>
    </group>
  )
}

export function MaharajaCharacter({ input }: MaharajaProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const meshGroupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  const isMoving  = useRef(false)
  const isJumping = useRef(false)
  const isAttacking = useRef(false)
  const jumpCount = useRef(0)     // 0 = grounded, 1 = single, 2 = double, 3 = triple
  const wasOnGround = useRef(true)
  const attackTimer = useRef(0)
  const prevJump = useRef(false)
  const prevAttack = useRef(false)

  // Use getState() in useFrame for actions that don't need reactivity
  const storeRef = useGameStore
  
  // Character scale based on age profile (matches AccountScreen preview)
  const profile = useGameStore(s => s.profile)
  const scale = profile ? getCharacterHeightFromAge(profile.age) : 1

  const lastBiomeRef = useRef<string>('gangetic')

  // Camera offset
  const cameraOffset = new THREE.Vector3(0, 4, 8)
  const cameraTarget = new THREE.Vector3()
  const lerpedCam    = useRef(new THREE.Vector3(0, 4, 8))

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !meshGroupRef.current) return

    const store = storeRef.getState()
    const { forward, backward, left, right, jump, run, attack, groundPound } = input.current
    const vel = rigidBodyRef.current.linvel()
    const pos = rigidBodyRef.current.translation()

    // Ground detection
    const onGround = Math.abs(vel.y) < 0.5 && pos.y < 1.5
    if (onGround && !wasOnGround.current) {
      playLandSound()
      jumpCount.current = 0
      isJumping.current = false
    }
    wasOnGround.current = onGround

    // Movement
    const speed = run ? RUN_SPEED : MOVE_SPEED
    const moveVec = new THREE.Vector3()
    if (forward)  moveVec.z -= 1
    if (backward) moveVec.z += 1
    if (left)     moveVec.x -= 1
    if (right)    moveVec.x += 1

    const camDir = new THREE.Vector3()
    camera.getWorldDirection(camDir)
    camDir.y = 0
    camDir.normalize()
    const camRight = new THREE.Vector3()
    camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize()

    const worldMove = new THREE.Vector3()
    worldMove.addScaledVector(camDir,   -moveVec.z)
    worldMove.addScaledVector(camRight,  moveVec.x)

    const moving = worldMove.lengthSq() > 0
    isMoving.current = moving

    if (moving) {
      worldMove.normalize()
      rigidBodyRef.current.setLinvel({ x: worldMove.x * speed, y: vel.y, z: worldMove.z * speed }, true)
      const angle = Math.atan2(worldMove.x, worldMove.z)
      meshGroupRef.current.rotation.y = THREE.MathUtils.lerp(meshGroupRef.current.rotation.y, angle, 0.18)
      if (run) store.setStamina(s => s - STAMINA_DRAIN_RUN * delta)
    } else {
      rigidBodyRef.current.setLinvel({ x: vel.x * 0.85, y: vel.y, z: vel.z * 0.85 }, true)
      store.setStamina(s => s + STAMINA_REGEN * delta)
    }

    // Triple jump
    if (jump && !prevJump.current) {
      if (onGround && jumpCount.current === 0) {
        rigidBodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE, z: vel.z }, true)
        jumpCount.current = 1; isJumping.current = true
        playJumpSound()
        store.setStamina(s => s - STAMINA_DRAIN_JUMP)
      } else if (!onGround && jumpCount.current === 1) {
        rigidBodyRef.current.setLinvel({ x: vel.x, y: DOUBLE_JUMP_FORCE, z: vel.z }, true)
        jumpCount.current = 2; playJumpSound()
      } else if (!onGround && jumpCount.current === 2) {
        rigidBodyRef.current.setLinvel({ x: vel.x, y: TRIPLE_JUMP_FORCE, z: vel.z }, true)
        jumpCount.current = 3; playJumpSound()
      }
    }
    prevJump.current = jump

    // Ground pound
    if (groundPound && !onGround) {
      rigidBodyRef.current.setLinvel({ x: 0, y: GROUND_POUND_FORCE, z: 0 }, true)
      store.setStamina(s => s - 15)
    }

    // Sword attack
    if (attack && !prevAttack.current) {
      isAttacking.current = true
      store.setIsAttacking(true)
      attackTimer.current = 0.4
      playAttackSound()
      store.consumeStamina(8)
    }
    prevAttack.current = attack
    if (attackTimer.current > 0) {
      attackTimer.current -= delta
      if (attackTimer.current <= 0) {
        isAttacking.current = false
        store.setIsAttacking(false)
      }
    }

    // Sync player position for interactions
    store.setPlayerPos([pos.x, pos.y, pos.z])

    // Clamp stamina
    store.setStamina(s => Math.max(0, s))

    // Biome detection (only when changed)
    let newBiome = 'gangetic'
    if (pos.z < -130 && pos.z > -200)                                  newBiome = 'rajasthan'
    else if (pos.z > 60 && pos.z < 130 && pos.y > 3)                   newBiome = 'himalaya'
    else if (pos.z > 130)                                               newBiome = 'kerala'
    else if (pos.x < -50 || (pos.x > -50 && pos.z > 0 && pos.z < 60)) newBiome = 'deccan'
    else if (pos.x > 50)                                                newBiome = 'coastal'
    if (newBiome !== lastBiomeRef.current) {
      lastBiomeRef.current = newBiome
      store.setBiome(newBiome as any)
    }

    // Collectibles proximity
    const posVec = new THREE.Vector3(pos.x, pos.y, pos.z)
    store.collectibles.filter(c => !c.collected).forEach(c => {
      const cPos = new THREE.Vector3(...c.position)
      if (posVec.distanceTo(cPos) < 2.2) {
        store.collectItem(c.id)
        const charName = store.profile?.name || 'Maharaja'
        if (c.type === 'coin')         { store.addCoins(1);           store.showNotification(`🪙 ${charName} found a coin!`, 'collect') }
        if (c.type === 'gem_ruby')     { store.addGem('ruby');        store.showNotification(`💎 ${charName} found a Ruby!`, 'collect') }
        if (c.type === 'gem_diamond')  { store.addGem('diamond');     store.showNotification(`💎 ${charName} found a Diamond!`, 'collect') }
        if (c.type === 'gem_emerald')  { store.addGem('emerald');     store.showNotification(`💎 ${charName} found an Emerald!`, 'collect') }
        if (c.type === 'gem_sapphire') { store.addGem('sapphire');    store.showNotification(`💎 ${charName} found a Sapphire!`, 'collect') }
        if (c.type === 'lotus')        { store.addLotus();            store.showNotification(`🪷 ${charName} found a Sacred Lotus!`, 'collect') }
        if (c.type === 'diya')         { store.addCoins(5);           store.showNotification(`🪔 ${charName} received Diya Blessing! +5`, 'collect') }
        if (c.type === 'mango' || c.type === 'coconut') { store.addLife(); store.showNotification(`❤️ ${charName}'s vitality restored!`, 'life') }
      }
    })

    // Camera follow (third-person)
    const charPos = new THREE.Vector3(pos.x, pos.y, pos.z)
    const targetCamPos = charPos.clone().add(
      cameraOffset.clone().applyEuler(new THREE.Euler(0, meshGroupRef.current.rotation.y, 0))
    )
    lerpedCam.current.lerp(targetCamPos, delta * 4)
    camera.position.copy(lerpedCam.current)
    cameraTarget.copy(charPos).add(new THREE.Vector3(0, 1, 0))
    camera.lookAt(cameraTarget)
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
      angularDamping={1}
      colliders={false}
    >
      <CapsuleCollider args={[0.45 * scale, 0.3 * scale]} />
      <group ref={meshGroupRef} scale={scale}>
        <MaharajaMesh
          isMoving={isMoving.current}
          isAttacking={isAttacking.current}
          isJumping={isJumping.current}
        />
      </group>
    </RigidBody>
  )
}
