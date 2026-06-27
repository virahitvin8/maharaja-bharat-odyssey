// Game Canvas — main 3D scene with dynamic OSM tile streaming across India
import { useEffect, useState, useCallback } from 'react'
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
import type { IndianLocation } from '../data/indianCities'
import type { Tile } from '../services/TileManager'
import type { OSMData } from '../services/osmData'
import { IntroRoom } from '../components/3d/IntroRoom'
import { GameHUD, TouchControls } from '../components/ui/Screens'

// Loading overlay
function CanvasLoader({ progress, message }: { progress: number; message: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,5,16,0.9)',
      fontFamily: "'Cinzel', serif",
    }}>
      <div style={{ fontSize: 40, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🗺️</div>
      <p style={{ color: '#FFD700', fontSize: 14, marginBottom: 20 }}>{message}</p>
      <div style={{
        width: 250, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden'
      }}>
        <div className="loading-bar" style={{ width: `${progress}%`, height: '100%' }} />
      </div>
    </div>
  )
}

// Scene component — renders all 3D content with cinematic post-processing
function GameScene({ inputRef, osmData }: {
  inputRef: React.MutableRefObject<any>
  osmData: OSMData | null
}) {
  const phase = useGameStore(s => s.phase)

  return (
    <>
      <EffectComposer multisampling={4} autoClear={false}>
        {/* Screen Space Ambient Occlusion — realistic contact shadows */}
        <N8AO 
          aoRadius={1.5}
          intensity={2.5}
          distanceFalloff={0.8}
          screenSpaceRadius={true}
          color="rgba(0, 0, 0, 0.35)"
        />
        {/* Bloom — subtle glow on lights and emissive surfaces */}
        <Bloom 
          luminanceThreshold={0.6}
          luminanceSmoothing={0.08}
          intensity={0.8}
          mipmapBlur={true}
        />
        {/* Temporal Anti-Aliasing + Morphological Anti-Aliasing */}
        <SMAA />
        {/* Cinematic vignette */}
        <Vignette 
          offset={0.3}
          darkness={0.5}
          eskil={false}
        />
        {/* ACES Filmic Tone Mapping */}
        <ToneMapping adaptive={true} resolution={256} middleGrey={0.6} />
      </EffectComposer>

      <DynamicSky />
      <Physics gravity={[0, -30, 0]} debug={false}>
        {phase === 'start' ? (
          <IntroRoom />
        ) : (
          <>
            <DynamicWorld data={osmData} />
            <Collectibles />
          </>
        )}
        <MaharajaCharacter input={inputRef} />
      </Physics>
    </>
  )
}

interface GameCanvasProps {
  city: IndianLocation
}

export function GameCanvas({ city }: GameCanvasProps) {
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
        setPhase('playing')
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
  if (loadingState === 'fetching') {
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
        <GameScene inputRef={input} osmData={osmData} />
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

      {/* City Selector */}
      <div style={{
        position: 'absolute', top: 20, right: 20, zIndex: 20,
        background: 'rgba(10, 10, 20, 0.8)', padding: '10px',
        borderRadius: '8px', border: '1px solid #FF9933',
        fontFamily: "'Cinzel', serif"
      }}>
        <h3 style={{ color: '#FFD700', fontSize: 12, margin: '0 0 5px 0' }}>Travel 16th Century</h3>
        <select 
          value={currentCity}
          onChange={(e) => {
            setLoadingState('fetching')
            setOsmData(null)
            setCity(e.target.value)
          }}
          style={{
            background: '#111', color: '#fff', border: '1px solid #FF9933',
            padding: '5px', borderRadius: '4px', fontFamily: "'Cinzel', serif",
            cursor: 'pointer', outline: 'none'
          }}
        >
          <option value="kashi">Kashi (Varanasi)</option>
          <option value="vijayanagara">Vijayanagara (Hampi)</option>
          <option value="agra">Agra (Mughal Empire)</option>
          <option value="pataliputra">Pataliputra (Patna)</option>
          <option value="madurai">Madurai (Pandya)</option>
          <option value="delhi">Delhi</option>
        </select>
      </div>
    </div>
  )
}
