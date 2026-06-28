// Main App — wires together game flow with all-India map selection
import React, { useEffect, useState } from 'react'
import { useGameStore } from './store/gameStore'
import { LoadingScreen, StartScreen, PauseMenu, GameOverScreen } from './components/ui/Screens'
import { AccountScreen } from './components/ui/AccountScreen'
import LandingPage from './components/ui/LandingPage'
import { TutorialOverlay } from './components/ui/TutorialOverlay'
import { playWelcomeSound } from './audio/sounds'

import { IndiaMapScreen } from './components/ui/IndiaMapScreen'
import { GameCanvas } from './pages/GameCanvas'
import type { IndianLocation } from './data/indianCities'
import { INDIAN_CITIES } from './data/indianCities'
import { POWERFUL_TEMPLES } from './data/powerfulTemples'
import type { PowerfulTemple } from './data/powerfulTemples'
import { Capacitor } from '@capacitor/core'

export default function App() {
  const phase = useGameStore(s => s.phase)
  const setLoadingProgress = useGameStore(s => s.setLoadingProgress)
  const setPhase = useGameStore(s => s.setPhase)
  const profile = useGameStore(s => s.profile)
  const hasAccount = profile !== null
  const isMuted = useGameStore(s => s.isMuted)
  const setIsMuted = useGameStore(s => s.setIsMuted)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  
  // Track the selected destination (city or temple)
  const [selectedCity, setSelectedCity] = useState<IndianLocation>(INDIAN_CITIES[0])
  const [selectedTemple, setSelectedTemple] = useState<PowerfulTemple | null>(null)

  // Force landing page on initial load (override persisted state)
  // If native mobile app, skip landing page entirely
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const s = useGameStore.getState()
      if (!s.profile) {
        setPhase('profile')
      } else {
        setPhase('start')
        // Play welcome sound when entering game
        playWelcomeSound()
      }
    } else {
      setPhase('landing')
    }
  }, [setPhase])

  // Attempt auto-play music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play prevented, user must interact first
        })
      }
    }
    
    // Play on first click anywhere if it was blocked
    const startAudio = () => {
      if (audioRef.current && audioRef.current.paused && !isMuted) {
        audioRef.current.play().catch(()=>{})
      }
    }
    window.addEventListener('pointerdown', startAudio, { once: true })
    return () => window.removeEventListener('pointerdown', startAudio)
  }, [isMuted])


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
            playWelcomeSound()
          }
        }, 600)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [phase])

  // Handle destination selection (city or temple)
  const handleCitySelect = (dest: IndianLocation | PowerfulTemple) => {
    const s = useGameStore.getState()
    if ('style' in dest) {
      // It's a temple
      setSelectedTemple(dest)
      const nearestCity = INDIAN_CITIES.reduce((best, city) => {
        const dist = Math.sqrt((city.lat - dest.lat) ** 2 + (city.lon - dest.lon) ** 2)
        return dist < best.dist ? { city, dist } : best
      }, { city: INDIAN_CITIES[0], dist: Infinity }).city
      setSelectedCity(nearestCity)
      s.setCity(nearestCity.id)
    } else {
      setSelectedCity(dest)
      setSelectedTemple(null)
      s.setCity(dest.id)
    }
    // Show loading screen while OSM data loads for the new city
    setPhase('loading')
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
  const [showTutorial, setShowTutorial] = useState(true)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: phase === 'landing' ? 'auto' : 'hidden', background: '#050510' }}>
      
      {/* Background Audio */}
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}bgm.mp3`} loop />
      
      {/* Audio Toggle Button */}
      {phase !== 'landing' && (
        <button
          onClick={() => {
            if (audioRef.current) {
              if (isMuted) {
                audioRef.current.play().catch(()=>{})
                setIsMuted(false)
              } else {
                audioRef.current.pause()
                setIsMuted(true)
              }
            }
          }}
          style={{
            position: 'absolute', top: 20, left: 20, zIndex: 1000,
            background: 'rgba(20,25,35,0.6)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%',
            width: 40, height: 40, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: '#FFD700', fontSize: 18
          }}
        >
          {isMuted ? '🔇' : '🎵'}
        </button>
      )}

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

      {/* Child-friendly tutorial overlay on first play */}
      {showTutorial && (phase === 'start' || phase === 'playing') && (
        <TutorialOverlay onDismiss={() => setShowTutorial(false)} />
      )}

      {/* Pause menu on top of canvas */}
      {phase === 'paused' && selectedCity && <PauseMenu />}
    </div>
  )
}
