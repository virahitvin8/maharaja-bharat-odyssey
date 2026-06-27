// Main App — wires together game flow with all-India map selection
import React, { useEffect, useState } from 'react'
import { useGameStore } from './store/gameStore'
import { LoadingScreen, StartScreen, PauseMenu, GameOverScreen } from './components/ui/Screens'
import { AccountScreen } from './components/ui/AccountScreen'
import LandingPage from './components/ui/LandingPage'

import { IndiaMapScreen } from './components/ui/IndiaMapScreen'
import { GameCanvas } from './pages/GameCanvas'
import type { IndianLocation } from './data/indianCities'
import { INDIAN_CITIES } from './data/indianCities'
import { POWERFUL_TEMPLES } from './data/powerfulTemples'
import type { PowerfulTemple } from './data/powerfulTemples'

export default function App() {
  const phase = useGameStore(s => s.phase)
  const setLoadingProgress = useGameStore(s => s.setLoadingProgress)
  const setPhase = useGameStore(s => s.setPhase)
  const profile = useGameStore(s => s.profile)
  const hasAccount = profile !== null
  
  // Track the selected destination (city or temple)
  const [selectedCity, setSelectedCity] = useState<IndianLocation>(INDIAN_CITIES[0])
  const [selectedTemple, setSelectedTemple] = useState<PowerfulTemple | null>(null)

  // Simulate loading progress if phase is loading (bypass if coming from profile)
  useEffect(() => {
    if (phase !== 'loading') return
    // Also check if we're transitioning from landing — ensure scroll is reset
    window.scrollTo(0, 0)
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 8 + 3
      const clamped = Math.min(p, 100)
      setLoadingProgress(clamped)
      if (p >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          const s = useGameStore.getState()
          if (!s.profile) {
            setPhase('profile')
          } else {
            setPhase('start')
          }
        }, 600)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [phase])

  // Handle destination selection (city or temple)
  const handleCitySelect = (dest: IndianLocation | PowerfulTemple) => {
    if ('style' in dest) {
      // It's a temple
      setSelectedTemple(dest)
      // Find nearest city for OSM data
      const nearestCity = INDIAN_CITIES.reduce((best, city) => {
        const dist = Math.sqrt((city.lat - dest.lat) ** 2 + (city.lon - dest.lon) ** 2)
        return dist < best.dist ? { city, dist } : best
      }, { city: INDIAN_CITIES[0], dist: Infinity }).city
      setSelectedCity(nearestCity)
    } else {
      setSelectedCity(dest)
      setSelectedTemple(null)
    }
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
      {/* Landing Page — professional game website */}
      {phase === 'landing' && <LandingPage onPlay={() => {
        const s = useGameStore.getState()
        if (!s.profile) s.setPhase('profile')
        else s.setPhase('loading')
      }} />}
      
      {/* Overlays */}
      {phase === 'profile'  && <AccountScreen />}
      {phase === 'loading'  && <LoadingScreen />}
      {phase === 'start'    && <StartScreen onExplore={() => {}} />}
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
          <GameCanvas city={selectedCity!} temple={selectedTemple} />
        </div>
      )}

      {/* Pause menu on top of canvas */}
      {phase === 'paused' && selectedCity && <PauseMenu />}
    </div>
  )
}
