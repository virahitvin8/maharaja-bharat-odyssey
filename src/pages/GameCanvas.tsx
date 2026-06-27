// Game Canvas — main 3D scene with real Varanasi data
import { useEffect, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { DynamicSky } from '../components/3d/DynamicSky'
import { DynamicWorld } from '../components/3d/DynamicWorld'
import { MaharajaCharacter } from '../components/3d/MaharajaCharacter'
import { Collectibles } from '../components/3d/Collectibles'
import { useInput } from '../hooks/useInput'
import { useGameStore } from '../store/gameStore'
import { getMapData } from '../services/osmData'
import type { OSMData } from '../services/osmData'
import { GameHUD, TouchControls } from '../components/ui/Screens'
import { MAP_ORIGIN } from '../utils/projection'

// Loading overlay inside the canvas area
function CanvasLoader({ progress, message }: { progress: number; message: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5,5,16,0.9)',
      fontFamily: "'Cinzel', serif",
    }}>
      <div style={{ fontSize: 40, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🛕</div>
      <p style={{ color: '#FFD700', fontSize: 14, marginBottom: 20 }}>{message}</p>
      <div style={{
        width: 250, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2,
        overflow: 'hidden'
      }}>
        <div className="loading-bar" style={{ width: `${progress}%`, height: '100%' }} />
      </div>
    </div>
  )
}

// Scene component — renders all 3D content
function GameScene({ inputRef, osmData }: {
  inputRef: React.MutableRefObject<any>
  osmData: OSMData | null
}) {
  if (!osmData) return null

  return (
    <>
      <DynamicSky />
      <Physics gravity={[0, -30, 0]} debug={false}>
        <DynamicWorld data={osmData} />
        <Collectibles />
        <MaharajaCharacter input={inputRef} />
      </Physics>
    </>
  )
}

export function GameCanvas() {
  const { input, setForward, setBackward, setLeft, setRight, setJump, setRun, setAttack } = useInput()
  const setPhase = useGameStore(s => s.setPhase)
  const [osmData, setOsmData] = useState<OSMData | null>(null)
  const [loadingState, setLoadingState] = useState<'fetching' | 'ready' | 'error'>('fetching')
  const [loadProgress, setLoadProgress] = useState(0)

  // Fetch OSM data on mount
  useEffect(() => {
    let cancelled = false
    let progressInterval: ReturnType<typeof setInterval> | null = null

    async function loadData() {
      try {
        // Show progress animation
        let p = 10
        progressInterval = setInterval(() => {
          p = Math.min(p + Math.random() * 5, 85)
          if (!cancelled) setLoadProgress(p)
        }, 200)

        const data = await getMapData(MAP_ORIGIN.lat, MAP_ORIGIN.lon, 1000)

        if (!cancelled) {
          setOsmData(data)
          setLoadProgress(100)
          setLoadingState('ready')
          
          // Brief delay then start playing
          setTimeout(() => {
            if (!cancelled) setPhase('playing')
          }, 500)
        }
      } catch (err) {
        console.error('[GameCanvas] Failed to load OSM data:', err)
        if (!cancelled) {
          setLoadingState('error')
        }
      } finally {
        if (progressInterval) clearInterval(progressInterval)
      }
    }

    loadData()

    return () => { cancelled = true; if (progressInterval) clearInterval(progressInterval) }
  }, [setPhase])

  // Error state — allow retry
  if (loadingState === 'error') {
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5,5,16,0.95)',
        fontFamily: "'Cinzel', serif",
      }}>
        <p style={{ color: '#e63946', fontSize: 18, marginBottom: 16 }}>Failed to load OSM Map Data</p>
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
  if (loadingState === 'fetching' || !osmData) {
    return <CanvasLoader progress={loadProgress} message="Fetching real map data from OpenStreetMap..." />
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 30, 40], fov: 65, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          toneMapping: 3,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a1a')
          gl.toneMapping = 3
          gl.toneMappingExposure = 1.2
        }}
      >
        <GameScene inputRef={input} osmData={osmData} />
      </Canvas>

      {/* HUD overlay */}
      <GameHUD />

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
