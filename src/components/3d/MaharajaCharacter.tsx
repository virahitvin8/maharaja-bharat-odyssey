// Complete Maharaja Character — procedural geometry, full Mario 64 physics
import { useRef, useEffect, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import * as THREE from 'three'
import type { RapierRigidBody } from '@react-three/rapier'
import type { InputState } from '../../hooks/useInput'
import { useGameStore, getCharacterHeightFromAge } from '../../store/gameStore'
import { playJumpSound, playLandSound, playAttackSound, playSparkleSound, playCelebrationSound, playPowerUpSound } from '../../audio/sounds'

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

// ---- Rainbow Trail Effect (detects running by position change between frames) ----
function RainbowTrail() {
  const trailRef = useRef<THREE.Points>(null)
  const prevPos = useRef<[number, number, number]>([0, 0, 0])
  const particles = useMemo(() => {
    const count = 40
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i*3] = 0; pos[i*3+1] = -100; pos[i*3+2] = 0 // hidden initially
      const hue = (i / count) * 360
      const c = new THREE.Color(`hsl(${hue}, 100%, 60%)`)
      cols[i*3] = c.r; cols[i*3+1] = c.g; cols[i*3+2] = c.b
    }
    return { pos, cols }
  }, [])
  const index = useRef(0)
  const timer = useRef(0)

  useFrame((_, delta) => {
    if (!trailRef.current) return
    timer.current += delta
    if (timer.current < 0.05) return // throttle to ~20fps trail
    timer.current = 0

    const store = useGameStore.getState()
    const pp = store.playerPos
    
    // Detect running by checking speed (position change per frame)
    const dx = pp[0] - prevPos.current[0]
    const dz = pp[2] - prevPos.current[2]
    const speed = Math.sqrt(dx * dx + dz * dz) / Math.max(delta, 0.016)
    const isMovingFast = speed > 10 // running speed threshold
    prevPos.current = pp

    const array = trailRef.current.geometry.attributes.position.array as Float32Array
    
    if (isMovingFast) {
      // Add new rainbow particle at player position
      index.current = (index.current + 1) % 40
      array[index.current * 3] = pp[0] + (Math.random() - 0.5) * 0.3
      array[index.current * 3 + 1] = pp[1] - 0.3 + Math.random() * 0.2
      array[index.current * 3 + 2] = pp[2] + (Math.random() - 0.5) * 0.3
    } else {
      // Slowly fade particles downward
      for (let i = 0; i < 40; i++) {
        array[i * 3 + 1] -= delta * 0.5
      }
    }
    trailRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[particles.cols, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  )
}

import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

function MaharajaMesh({ isMoving, isAttacking, isJumping, expressionType }: { isMoving: boolean, isAttacking: boolean, isJumping: boolean; expressionType: string }) {
  const group = useRef<THREE.Group>(null)
  
  // Use absolute URL to the models folder in public
  const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}models/character.glb`)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    // Basic animation state machine
    let currentActionName = names[0] // fallback to first animation
    
    // Attempt to find standard action names
    const hasRun = names.includes('Run')
    const hasWalk = names.includes('Walk')
    const hasIdle = names.includes('Idle')
    
    if (isJumping && names.includes('Jump')) {
      currentActionName = 'Jump'
    } else if (isMoving) {
      currentActionName = hasRun ? 'Run' : (hasWalk ? 'Walk' : names[1] || names[0])
    } else {
      currentActionName = hasIdle ? 'Idle' : names[0]
    }

    const action = actions[currentActionName]
    if (action) {
      action.reset().fadeIn(0.2).play()
      return () => { action.fadeOut(0.2) }
    }
  }, [isMoving, isJumping, actions, names])

  return (
    <group ref={group} dispose={null} position={[0, -0.6, 0]}>
      {/* Dynamic scale for the soldier model to match original size */}
      <primitive object={clone} scale={1.2} />
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

  // Expression tracking for child-friendly animations
  const expressionType = useRef<'idle' | 'happy' | 'jump' | 'attack' | 'collect'>('idle')
  const expressionTimer = useRef(0)

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

    // Expression timer
    expressionTimer.current -= delta
    if (expressionTimer.current <= 0) {
      expressionType.current = 'idle'
    }

    // Triple jump
    if (jump && !prevJump.current) {
      expressionType.current = 'jump'
      expressionTimer.current = 0.8
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
      expressionType.current = 'attack'
      expressionTimer.current = 0.5
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
        // Show happy expression on collect
        expressionType.current = 'collect'
        expressionTimer.current = 0.6
        const charName = store.profile?.name || 'Maharaja'
        if (c.type === 'coin')         { store.addCoins(1);           store.showNotification(`🪙 ${charName} found a coin! 😊`, 'collect'); playSparkleSound() }
        if (c.type === 'gem_ruby')     { store.addGem('ruby');        store.showNotification(`💎 ${charName} found a Ruby! 🤩`, 'collect'); playCelebrationSound() }
        if (c.type === 'gem_diamond')  { store.addGem('diamond');     store.showNotification(`💎 ${charName} found a Diamond! 🤩`, 'collect'); playCelebrationSound() }
        if (c.type === 'gem_emerald')  { store.addGem('emerald');     store.showNotification(`💎 ${charName} found an Emerald! 🤩`, 'collect'); playCelebrationSound() }
        if (c.type === 'gem_sapphire') { store.addGem('sapphire');    store.showNotification(`💎 ${charName} found a Sapphire! 🤩`, 'collect'); playCelebrationSound() }
        if (c.type === 'lotus')        { store.addLotus();            store.showNotification(`🪷 ${charName} found a Sacred Lotus! 😇`, 'collect'); playCelebrationSound() }
        if (c.type === 'diya')         { store.addCoins(5);           store.showNotification(`🪔 ${charName} received Diya Blessing! +5 ✨`, 'collect'); playPowerUpSound() }
        if (c.type === 'mango' || c.type === 'coconut') { store.addLife(); store.showNotification(`❤️ ${charName}'s vitality restored! 🎉`, 'life'); playPowerUpSound() }
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
    <>
      <RainbowTrail />
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
            expressionType={expressionType.current}
          />
        </group>
      </RigidBody>
    </>
  )
}
