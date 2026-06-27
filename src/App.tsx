// Main App — wires together game flow with all-India map selection
import React, { useEffect, useState } from 'react'
import { useGameStore } from './store/gameStore'
import { LoadingScreen, StartScreen, PauseMenu, GameOverScreen } from './components/ui/Screens'
import { IndiaMapScreen } from './components/ui/IndiaMapScreen'
import { GameCanvas } from './pages/GameCanvas'
import type { IndianLocation } from './data/indianCities'
import { INDIAN_CITIES } from './data/indianCities'

export default function App() {
  const phase = useGameStore(s => s.phase)
  const setLoadingProgress = useGameStore(s => s.setLoadingProgress)
  const setPhase = useGameStore(s => s.setPhase)
  
  // Track the selected city for exploration
  const [selectedCity, setSelectedCity] = useState<IndianLocation>(INDIAN_CITIES[0])

  // Simulate loading progress
  useEffect(() => {
    if (phase !== 'loading') return
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 8 + 3
      const clamped = Math.min(p, 100)
      setLoadingProgress(clamped)
      if (p >= 100) {
        clearInterval(interval)
        setTimeout(() => setPhase('start'), 600)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [phase])

  // Handle city selection from India Map
  const handleCitySelect = (city: IndianLocation) => {
    setSelectedCity(city)
    setPhase('playing')
  }

  // Pause on Escape — also show India Map from playing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const s = useGameStore.getState()
        if (s.phase === 'playing') s.setPhase('paused')
        else if (s.phase === 'paused') s.setPhase('playing')
      }
      // M key opens India Map
      if (e.key === 'm' || e.key === 'M') {
        const s = useGameStore.getState()
        if (s.phase === 'playing') s.setPhase('map')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const showCanvas = (phase === 'playing' || phase === 'paused') && selectedCity !== null

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#050510' }}>
      {/* Overlays */}
      {/* Overlays */}
      {phase === 'loading'  && <LoadingScreen />}
      {phase === 'start'    && <StartScreen onExplore={() => {}} />}
      {phase === 'gameover' && <GameOverScreen />}
      {phase === 'gameover' && <GameOverScreen />}

      {/* India Map — shown when player is choosing a city */}
      {phase === 'map' && (
        <IndiaMapScreen
          onSelectCity={handleCitySelect}
          currentCity={selectedCity?.id}
        />
      )}

      {/* 3D Canvas — mount when playing, paused, or starting */}
      {(phase === 'start' || ((phase === 'playing' || phase === 'paused') && selectedCity)) && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <GameCanvas city={selectedCity!} />
        </div>
      )}

      {/* Pause menu on top of canvas */}
      {phase === 'paused' && selectedCity && <PauseMenu />}
    </div>
  )
}
