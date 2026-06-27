// Game Canvas — main 3D scene with dynamic OSM tile streaming across India
import { useEffect, useState, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { DynamicSky } from '../components/3d/DynamicSky'
import { DynamicWorld } from '../components/3d/DynamicWorld'
import { MaharajaCharacter } from '../components/3d/MaharajaCharacter'
import { Collectibles } from '../components/3d/Collectibles'
import { useInput } from '../hooks/useInput'
import { useGameStore } from '../store/gameStore'
import { initializeTileManager, getMergedTileData, getLoadProgress, setTileCallback } from '../services/TileManager'
import { getMapData } from '../services/osmData'
import { MAP_ORIGIN } from '../utils/projection'
import { EffectComposer, N8AO, Bloom, SMAA, Vignette, ToneMapping } from '@react-three/postprocessing'
import { Atmosphere, Sky as TakramSky, SunLight } from '@takram/three-atmosphere/r3f'
import type { IndianLocation } from '../data/indianCities'
import type { PowerfulTemple } from '../data/powerfulTemples'
import { PowerfulTempleModel } from '../components/3d/PowerfulTemple'
import { latLonToLocalWorld } from '../utils/projection'
import type { Tile } from '../services/TileManager'
import type { OSMData } from '../services/osmData'
import { IntroRoom } from '../components/3d/IntroRoom'
import { GameHUD, TouchControls } from '../components/ui/Screens'
import { TempleSanctum } from '../components/3d/TempleSanctum'
import { CuttableTree, FruitTree, Wildlife, HostileAnimal, PickupStone, RaftCrafting, TreeHouse, ClimbableWall, SwimmableWater } from '../components/3d/Exploration'
import { KrishnaFlute, BrindhavanGrove, DwarakaGate, KrishnaStatue, LotusPond, FluteNotesParticles } from '../components/3d/KrishnaElements'
import { GuideArrow } from '../components/3d/Collectibles'

// Loading overlay
function CanvasLoader({ progress, message }: { progress: number; message: string }) {
  const profile = useGameStore(s => s.profile)
  const playerName = profile?.name || 'Maharaja'
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,5,16,0.9)',
      fontFamily: "'Cinzel', serif",
    }}>
      <div style={{ fontSize: 40, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🗺️</div>
      <p style={{ color: '#FFD700', fontSize: 14, marginBottom: 8 }}>{message}</p>
      <p style={{ color: 'rgba(255,215,0,0.4)', fontSize: 11, marginBottom: 20, fontStyle: 'italic' }}>
        The sacred paths await you, {playerName}...
      </p>
      <div style={{
        width: 250, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden'
      }}>
        <div className="loading-bar" style={{ width: `${progress}%`, height: '100%' }} />
      </div>
    </div>
  )
}

// Scene component — renders all 3D content with cinematic post-processing
function GameScene({ inputRef, osmData, temple }: {
  inputRef: React.MutableRefObject<any>
  osmData: OSMData | null
  temple?: PowerfulTemple | null
}) {
  const phase = useGameStore(s => s.phase)
  const profile = useGameStore(s => s.profile)
  const playerName = profile?.name || 'Maharaja'
  const [showSanctum, setShowSanctum] = useState(false)
  const entryCooldown = useRef(0)
  const entryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Temple position for sanctum
  const templePosition = temple ? (() => {
    const [tx, tz] = latLonToLocalWorld(temple.lat, temple.lon)
    return [tx, 0, tz] as [number, number, number]
  })() : null

  // Proximity-based temple entry — polls player position every 300ms (avoids 60fps cleanup race)
  useEffect(() => {
    if (!templePosition || showSanctum) return
    const interval = setInterval(() => {
      const pos = useGameStore.getState().playerPos
      if (!pos) return
      const dx = pos[0] - templePosition[0]
      const dz = pos[2] - templePosition[2]
      if (dx * dx + dz * dz < 16 && Date.now() - entryCooldown.current > 2000) {
        entryCooldown.current = Date.now()
        entryTimeoutRef.current = setTimeout(() => setShowSanctum(true), 600)
      }
    }, 300)
    return () => {
      clearInterval(interval)
      if (entryTimeoutRef.current) clearTimeout(entryTimeoutRef.current)
    }
  }, [templePosition, showSanctum])

  return (
    <>
      <EffectComposer multisampling={4} autoClear={false}>
        <N8AO aoRadius={1.5} intensity={2.5} distanceFalloff={0.8} screenSpaceRadius={true} color="rgba(0, 0, 0, 0.35)" />
        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.08} intensity={0.8} mipmapBlur={true} />
        <SMAA />
        <Vignette offset={0.3} darkness={0.5} eskil={false} />
        <ToneMapping adaptive={true} resolution={256} middleGrey={0.6} />
      </EffectComposer>

      {/* @takram photorealistic atmosphere */}
      <Atmosphere date={Date.now()}>
        <TakramSky />
        <SunLight color="#fff5e0" />
      </Atmosphere>

      {/* DynamicSky — weather effects + time sync */}
      <DynamicSky />

      {/* Krishna flute ambient music particles */}
      <FluteNotesParticles count={30} />

      <Physics gravity={[0, -30, 0]} debug={false}>
        {phase === 'start' ? (
          <IntroRoom />
        ) : (
          <>
            <DynamicWorld data={osmData} />

            {/* Krishna Flute near temple */}
            {templePosition && (
              <KrishnaFlute position={[templePosition[0] + 3, 3, templePosition[2] + 3]} />
            )}

            {/* Brindhavan Grove near temple */}
            {templePosition && (
              <BrindhavanGrove position={[templePosition[0] - 4, 0, templePosition[2] - 4]} scale={0.8} />
            )}

            {/* Lotus Pond near temple */}
            {templePosition && (
              <LotusPond position={[templePosition[0] + 5, 0, templePosition[2] - 3]} size={4} />
            )}

            {/* Dwaraka Gate at key locations */}
            <DwarakaGate position={[-20, 0, -30]} scale={0.5} />

            {/* Krishna statue in temple courtyard */}
            {templePosition && (
              <KrishnaStatue position={[templePosition[0] + 2, 0, templePosition[2] + 2]} />
            )}

            {/* Cuttable trees for resource gathering */}
            <CuttableTree position={[5, 0, 5]} scale={1} treeId="tree_1" />
            <CuttableTree position={[-5, 0, 8]} scale={1.2} treeId="tree_2" />
            <CuttableTree position={[10, 0, -3]} scale={0.9} treeId="tree_3" />

            {/* Fruit trees for energy */}
            <FruitTree position={[8, 0, 10]} fruitType="mango" treeId="mango_tree_1" />
            <FruitTree position={[-8, 0, -5]} fruitType="coconut" treeId="coconut_tree_1" />

            {/* Wildlife */}
            <Wildlife position={[12, 0, 12]} animalId="deer_1" type="deer" />
            <Wildlife position={[-10, 0, 15]} animalId="peacock_1" type="peacock" />
            <Wildlife position={[15, 0, -10]} animalId="cow_1" type="cow" />

            {/* Hostile animals */}
            <HostileAnimal position={[20, 0, 20]} animalId="boar_1" type="boar" />
            <HostileAnimal position={[-20, 0, -15]} animalId="tiger_1" type="tiger" />

            {/* Pickup stones for crafting */}
            <PickupStone position={[3, 0.5, 3]} stoneId="stone_1" />
            <PickupStone position={[-3, 0.5, -4]} stoneId="stone_2" />
            <PickupStone position={[7, 0.5, -2]} stoneId="stone_3" />

            {/* Raft crafting zone */}
            <RaftCrafting position={[0, 0, 15]} onRaftReady={() => {}} />

            {/* Tree house */}
            <TreeHouse position={[6, 0, 6]} treeHouseId="main" />

            {/* Climbable walls for Tirumala-style mountain climbing */}
            <ClimbableWall position={[3, 0, -8]} size={[2, 6, 0.5]} wallId="wall_1" />
            <ClimbableWall position={[-3, 0, -10]} size={[2, 8, 0.5]} rotation={Math.PI / 4} wallId="wall_2" />

            {/* Swimmable water */}
            <SwimmableWater position={[0, 0, 0]} size={[8, 8]} />

            {/* Render powerful temple 3D model */}
            {temple && templePosition && (
              <group position={[templePosition[0], 0, templePosition[2]]}>
                <PowerfulTempleModel temple={temple} scale={1.5} />
              </group>
            )}

            <Collectibles />
            
            {/* Child-friendly guide arrow pointing to nearest collectible */}
            <GuideArrow />
          </>
        )}
        <MaharajaCharacter input={inputRef} />
      </Physics>

      {/* Temple Sanctum overlay (rendered in world space near temple) */}
      {showSanctum && temple && templePosition && (
        <TempleSanctum 
          position={[templePosition[0], 0, templePosition[2] + 5]} 
          temple={temple} 
          onExit={() => setShowSanctum(false)} 
        />
      )}
    </>
  )
}

interface GameCanvasProps {
  city: IndianLocation
  temple?: PowerfulTemple | null
}

export function GameCanvas({ city, temple }: GameCanvasProps) {
  const { input, setForward, setBackward, setLeft, setRight, setJump, setRun, setAttack } = useInput()
  const setPhase = useGameStore(s => s.setPhase)
  const currentCity = useGameStore(s => s.currentCity)
  const setCity = useGameStore(s => s.setCity)
  const [osmData, setOsmData] = useState<OSMData | null>(null)
  const [loadingState, setLoadingState] = useState<'fetching' | 'ready' | 'error'>('fetching')
  const [loadProgress, setLoadProgress] = useState(0)

  // Handle tile updates from the TileManager
  const handleTilesChanged = useCallback((tiles: Tile[]) => {
    const merged = getMergedTileData()
    if (merged) {
      setOsmData(merged)
      
      // Calculate overall progress
      const progress = getLoadProgress(city.lat, city.lon)
      setLoadProgress(progress)
      
      if (progress >= 80 && loadingState === 'fetching') {
        setLoadingState('ready')
        const currentPhase = useGameStore.getState().phase
        if (currentPhase !== 'start') {
          setPhase('playing')
        }
      }
    }
  }, [city.lat, city.lon, loadingState, setPhase])

  // Initialize TileManager and fetch initial tiles
  useEffect(() => {
    let cancelled = false
    
    setTileCallback((tiles) => {
      if (!cancelled) handleTilesChanged(tiles)
    })

    const loadData = async () => {
      try {
        const data = await getMapData(currentCity, MAP_ORIGIN.lat, MAP_ORIGIN.lon, 1000)
        if (!cancelled) {
          setOsmData(data)
          initializeTileManager(city.lat, city.lon)
        }
      } catch (e) {
        if (!cancelled) setLoadingState('error')
      }
    }
    
    // Show initial progress
    const progressInterval = setInterval(() => {
      if (!cancelled) {
        const p = getLoadProgress(city.lat, city.lon)
        setLoadProgress(p)
        
        const merged = getMergedTileData()
        if (merged && merged.buildings.length > 0) {
          setOsmData(merged)
        }

        if (p >= 80) {
          clearInterval(progressInterval)
          handleTilesChanged([])
        }
      }
    }, 500)

    loadData()

    return () => {
      cancelled = true
      clearInterval(progressInterval)
    }
  }, [setPhase, currentCity, city.lat, city.lon, handleTilesChanged])

  // Error state
  if (loadingState === 'error') {
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5,5,16,0.95)',
        fontFamily: "'Cinzel', serif",
      }}>
        <p style={{ color: '#e63946', fontSize: 18, marginBottom: 16 }}>Failed to load OSM data</p>
        <p style={{ color: '#888', fontSize: 12, marginBottom: 24 }}>Check your internet connection</p>
        <button onClick={() => window.location.reload()}
          style={{
            padding: '12px 32px', background: '#FF9933', border: 'none',
            borderRadius: 8, color: '#fff', fontSize: 14, cursor: 'pointer',
            fontFamily: "'Cinzel', serif",
          }}>
          Retry
        </button>
      </div>
    )
  }

  // Loading / fetching state
  const currentPhase = useGameStore.getState().phase
  if (loadingState === 'fetching' && currentPhase !== 'start') {
    return <CanvasLoader progress={loadProgress} message={`Loading ${city.name} from OpenStreetMap...`} />
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 30, 40], fov: 65, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          toneMapping: 3,
          toneMappingExposure: 1.0,
          outputColorSpace: 'srgb-linear',
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a1a')
          gl.toneMapping = 3
          gl.toneMappingExposure = 1.0
        }}
      >
        <GameScene inputRef={input} osmData={osmData} temple={temple} />
      </Canvas>

      {/* HUD overlay */}
      <GameHUD currentCity={city.name} />

      {/* Touch controls for mobile */}
      <TouchControls
        setForward={setForward}
        setBackward={setBackward}
        setLeft={setLeft}
        setRight={setRight}
        setJump={setJump}
        setRun={setRun}
        setAttack={setAttack}
      />

    </div>
  )
}
