import { useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'
import { playCoinSound } from '../../audio/sounds'

export function IntroRoom() {
  const setPhase = useGameStore(s => s.setPhase)
  const texture = useTexture(`${import.meta.env.BASE_URL}images/hampi_ruins.png`)
  
  // Floor and wall colors to match a grand palace
  const wallColor = '#d4c4a8'
  const floorColor = '#c8b898'

  const handleEnterPainting = () => {
    // Play a magical sound and transition to the map
    playCoinSound()
    
    // Slight delay for effect
    setTimeout(() => {
      setPhase('map')
    }, 200)
  }

  return (
    <group>
      {/* Intro Room Physics Bounds */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* Floor */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[30, 0.2, 30]} />
          <meshStandardMaterial color={floorColor} roughness={0.8} />
        </mesh>
        
        {/* Ceiling */}
        <mesh position={[0, 10, 0]} receiveShadow>
          <boxGeometry args={[30, 0.2, 30]} />
          <meshStandardMaterial color={wallColor} roughness={0.8} />
        </mesh>

        {/* Back Wall (with painting) */}
        <mesh position={[0, 5, -15]} receiveShadow>
          <boxGeometry args={[30, 10, 0.5]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>

        {/* Left Wall */}
        <mesh position={[-15, 5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 10, 30]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>

        {/* Right Wall */}
        <mesh position={[15, 5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 10, 30]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>

        {/* Front Wall */}
        <mesh position={[0, 5, 15]} receiveShadow>
          <boxGeometry args={[30, 10, 0.5]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>

        {/* Pillars for decoration */}
        {[-10, -5, 0, 5, 10].map(x => (
          <group key={x}>
            <mesh position={[x, 5, -14.5]} castShadow receiveShadow>
              <cylinderGeometry args={[0.5, 0.6, 10, 8]} />
              <meshStandardMaterial color="#e8dcc8" roughness={0.6} />
            </mesh>
            <mesh position={[x, 5, 14.5]} castShadow receiveShadow>
              <cylinderGeometry args={[0.5, 0.6, 10, 8]} />
              <meshStandardMaterial color="#e8dcc8" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </RigidBody>

      {/* The Magical Painting (Portal) */}
      <group position={[0, 4, -14.7]}>
        {/* Painting Frame */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[10.4, 6.4, 0.2]} />
          <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* The Canvas (Texture) */}
        <mesh position={[0, 0, 0.11]} receiveShadow>
          <planeGeometry args={[10, 6]} />
          <meshStandardMaterial 
            map={texture} 
            emissive={new THREE.Color(0.2, 0.2, 0.2)}
            roughness={0.4}
          />
        </mesh>

        {/* Ethereal portal glow */}
        <mesh position={[0, 0, 0.2]}>
          <planeGeometry args={[10, 6]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        
        <pointLight position={[0, 0, 2]} color="#FFD700" intensity={3} distance={15} />

        {/* Sensor trigger for jumping into the painting */}
        <RigidBody type="fixed" colliders={false} sensor onIntersectionEnter={handleEnterPainting}>
          <CuboidCollider args={[4.8, 2.8, 0.5]} position={[0, 0, 0.5]} />
        </RigidBody>
      </group>

      {/* Lighting for the room */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 8, 0]} intensity={4} distance={30} color="#ffeedd" castShadow />
    </group>
  )
}
