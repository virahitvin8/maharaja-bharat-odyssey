// Main App — wires together game flow
import React, { useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import { LoadingScreen, StartScreen, PauseMenu, GameOverScreen } from './components/ui/Screens'
import { GameCanvas } from './pages/GameCanvas'

export default function App() {
  const phase = useGameStore(s => s.phase)
  const setLoadingProgress = useGameStore(s => s.setLoadingProgress)
  const setPhase = useGameStore(s => s.setPhase)

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

  // Pause on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const s = useGameStore.getState()
        if (s.phase === 'playing') s.setPhase('paused')
        else if (s.phase === 'paused') s.setPhase('playing')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const showCanvas = phase === 'playing' || phase === 'paused'

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#050510' }}>
      {/* Overlays */}
      {phase === 'loading'  && <LoadingScreen />}
      {phase === 'start'    && <StartScreen />}
      {phase === 'gameover' && <GameOverScreen />}

      {/* 3D Canvas — only mount when actually playing */}
      {showCanvas && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <GameCanvas />
        </div>
      )}

      {/* Pause menu on top of canvas */}
      {phase === 'paused' && <PauseMenu />}
    </div>
  )
}
