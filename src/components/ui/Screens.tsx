// UI Screens — Loading, Start, Pause, GameOver, HUD, Touch Controls
import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'

// ============== LOADING SCREEN ==============
export function LoadingScreen() {
  const progress = useGameStore(s => s.loadingProgress)
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a30 50%, #0a0a1a 100%)',
      color: '#fff', fontFamily: "'Cinzel', serif",
    }}>
      <div style={{ fontSize: 60, marginBottom: 24, animation: 'float 3s ease-in-out infinite' }}>👑</div>
      <h1 style={{
        fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontWeight: 900,
        background: 'linear-gradient(135deg, #FF9933, #FFD700, #FF9933)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        textAlign: 'center', marginBottom: 8, padding: '0 16px',
      }}>
        Maharaja's Kashi
      </h1>
      <p style={{ color: '#FFD700', opacity: 0.7, marginBottom: 32, fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
        Loading the Holy City...
      </p>
      <div style={{
        width: 'clamp(200px, 50%, 350px)', height: 4,
        background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden',
      }}>
        <div className="loading-bar" style={{
          width: `${progress}%`, height: '100%', transition: 'width 0.3s ease-out',
          borderRadius: 2,
        }} />
      </div>
      <p style={{ marginTop: 12, color: '#FF9933', fontSize: 13 }}>
        {Math.round(progress)}%
      </p>
    </div>
  )
}

// ============== START SCREEN ==============
export function StartScreen() {
  const setPhase = useGameStore(s => s.setPhase)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a30 30%, #0a0015 70%, #0a0a1a 100%)',
      color: '#fff', fontFamily: "'Cinzel', serif",
      overflow: 'hidden',
    }}>
      {/* Starfield background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(1px 1px at 10% 20%, #FFD700, transparent), radial-gradient(1px 1px at 30% 50%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 50% 80%, #FF9933, transparent), radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 90% 60%, #FFD700, transparent), radial-gradient(1px 1px at 15% 70%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 60% 15%, #FFD700, transparent)',
        backgroundSize: '150px 150px',
        opacity: 0.4,
      }} />

      <div style={{
        fontSize: 70, marginBottom: 20,
        animation: 'float 3s ease-in-out infinite',
        filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.3))',
      }}>
        🛕
      </div>

      <h1 style={{
        fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900,
        background: 'linear-gradient(135deg, #FF9933, #FFD700, #FF9933)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        textAlign: 'center', lineHeight: 1.2, padding: '0 20px', marginBottom: 6,
      }}>
        Maharaja's Kashi
      </h1>
      <p style={{
        fontSize: 'clamp(0.8rem, 2vw, 1.1rem)', color: '#FFD700',
        opacity: 0.6, marginBottom: 36, fontFamily: "'Inter', sans-serif",
        letterSpacing: 1,
      }}>
        Varanasi — The Eternal City
      </p>

      <button onClick={() => setPhase('playing')}
        style={{
          padding: '16px 56px', fontSize: 16, fontWeight: 700,
          background: 'linear-gradient(135deg, #FF9933, #e07800)',
          border: 'none', borderRadius: 12, cursor: 'pointer', color: '#fff',
          fontFamily: "'Cinzel', serif", letterSpacing: 1,
          boxShadow: '0 4px 25px rgba(255,153,51,0.4)',
          transition: 'all 0.2s',
          marginBottom: 16,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 35px rgba(255,153,51,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 25px rgba(255,153,51,0.4)' }}
      >
        ▶ Explore Varanasi
      </button>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', maxWidth: 350, textAlign: 'center', lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
        Walk the real streets of Kashi · Enter temples · Discover the Ganges
      </p>

      <p style={{ position: 'absolute', bottom: 20, fontSize: 11, color: 'rgba(255,255,255,0.15)', fontFamily: "'Inter', sans-serif" }}>
        Created by Akshit · Powered by OpenStreetMap
      </p>
    </div>
  )
}

// ============== PAUSE MENU ==============
export function PauseMenu() {
  const setPhase = useGameStore(s => s.setPhase)
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      fontFamily: "'Cinzel', serif",
    }}>
      <div className="glass-panel" style={{
        padding: '36px 44px', textAlign: 'center', maxWidth: 380, width: '90%',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏸️</div>
        <h2 style={{ fontSize: 22, color: '#FF9933', marginBottom: 20, fontWeight: 700 }}>
          Paused
        </h2>
        <div style={{ marginBottom: 20, color: '#aaa', fontSize: 13, lineHeight: 1.8, fontFamily: "'Inter', sans-serif" }}>
          <p>WASD / Arrows — Walk through Kashi</p>
          <p>Space — Jump (triple jump!)</p>
          <p>Shift — Run through the streets</p>
          <p>Z / X — Sword flourish</p>
          <p>Escape — Pause</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => setPhase('playing')}
            style={{
              padding: '12px 0', border: '2px solid #FF9933', borderRadius: 8,
              background: 'rgba(255,153,51,0.1)', color: '#FFD700', fontSize: 15,
              cursor: 'pointer', fontWeight: 600, fontFamily: "'Cinzel', serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.1)' }}>
            ▶ Resume
          </button>
          <button onClick={() => { setPhase('start') }}
            style={{
              padding: '10px 0', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8, background: 'transparent', color: '#888',
              fontSize: 13, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e63946' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888' }}>
            Quit to Title
          </button>
        </div>
      </div>
    </div>
  )
}

// ============== GAME OVER SCREEN ==============
export function GameOverScreen() {
  const score = useGameStore(s => s.score)
  const coins = useGameStore(s => s.coins)
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      fontFamily: "'Cinzel', serif",
    }}>
      <div className="glass-panel" style={{
        padding: '36px 44px', textAlign: 'center', maxWidth: 380, width: '90%',
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>💀</div>
        <h2 style={{ fontSize: 24, color: '#e63946', marginBottom: 16, fontWeight: 700 }}>
          Journey Ends
        </h2>
        <div style={{ marginBottom: 20, color: '#FFD700', fontSize: 22 }}>
          ⭐ {score.toLocaleString()}
        </div>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 20, fontFamily: "'Inter', sans-serif" }}>
          Coins collected: {coins}
        </p>
        <button onClick={() => window.location.reload()}
          style={{
            padding: '14px 40px', border: '2px solid #FF9933', borderRadius: 8,
            background: 'rgba(255,153,51,0.15)', color: '#FFD700', fontSize: 15,
            cursor: 'pointer', fontWeight: 600, fontFamily: "'Cinzel', serif",
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.15)' }}>
          Explore Again
        </button>
      </div>
    </div>
  )
}

// ============== GAME HUD ==============
export function GameHUD() {
  // Individual selectors to prevent full re-renders
  const score = useGameStore(s => s.score)
  const coins = useGameStore(s => s.coins)
  const lives = useGameStore(s => s.lives)
  const stamina = useGameStore(s => s.stamina)
  const maxStamina = useGameStore(s => s.maxStamina)
  const timeOfDay = useGameStore(s => s.timeOfDay)
  const notification = useGameStore(s => s.notification)
  const clearNotification = useGameStore(s => s.clearNotification)
  const gems = useGameStore(s => s.gems)
  const lotus = useGameStore(s => s.lotus)
  const setPhase = useGameStore(s => s.setPhase)

  const [showMenu, setShowMenu] = useState(false)

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const t = setTimeout(clearNotification, 2500)
      return () => clearTimeout(t)
    }
  }, [notification, clearNotification])

  const hour = Math.floor(timeOfDay)
  const min = Math.floor((timeOfDay - hour) * 60)
  const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
  const isNight = timeOfDay < 6 || timeOfDay > 19

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {/* TOP BAR */}
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px',
        background: 'rgba(10,10,30,0.7)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,153,51,0.25)', borderRadius: 10,
        pointerEvents: 'auto', fontSize: 'clamp(10px, 1.3vw, 13px)',
      }}>
        <span style={{ color: '#FFD700', fontWeight: 700 }}>⭐ {score.toLocaleString()}</span>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span style={{ color: '#DAA520' }}>🪙 {coins}</span>
        <span style={{ color: '#e63946' }}>🔴 {gems.ruby}</span>
        <span style={{ color: '#a8dadc' }}>💎 {gems.diamond}</span>
        <span style={{ color: '#2d9a4f' }}>🟢 {gems.emerald}</span>
        <span style={{ color: '#3a7abd' }}>🔵 {gems.sapphire}</span>
        <span style={{ color: '#ff69b4' }}>🪷 {lotus}</span>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span style={{ color: '#e63946' }}>{'❤️'.repeat(lives)}</span>
      </div>

      {/* STAMINA BAR */}
      <div style={{
        position: 'absolute', bottom: 90, left: 12,
        padding: '6px 10px', background: 'rgba(10,10,30,0.7)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,153,51,0.2)', borderRadius: 8, pointerEvents: 'auto',
        minWidth: 120,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888', marginBottom: 3 }}>
          <span style={{ color: '#FF9933', fontWeight: 600 }}>⚡</span>
          <span>{Math.round(stamina)}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div className="stamina-fill" style={{
            width: `${(stamina / maxStamina) * 100}%`, height: '100%',
            borderRadius: 2, transition: 'width 0.15s ease-out',
          }} />
        </div>
      </div>

      {/* TIME / LOCATION */}
      <div style={{
        position: 'absolute', bottom: 90, right: 12,
        padding: '6px 12px', background: 'rgba(10,10,30,0.7)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,153,51,0.2)', borderRadius: 8, pointerEvents: 'auto',
        fontSize: 11, textAlign: 'right',
      }}>
        <span style={{ color: isNight ? '#aaccff' : '#FFD700', fontWeight: 600, fontFamily: "'Cinzel', serif" }}>
          🏛️ Varanasi
        </span>
        <span style={{ color: '#888', display: 'block', fontSize: 10, marginTop: 2 }}>
          {timeStr} {isNight ? '🌙' : '☀️'}
        </span>
      </div>

      {/* NOTIFICATION */}
      {notification && (
        <div className="collect-notif" style={{
          position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
          padding: '8px 20px', background: 'rgba(10,10,30,0.85)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,153,51,0.4)', borderRadius: 8, pointerEvents: 'auto',
          color: '#FFD700', fontWeight: 600, fontSize: 14, fontFamily: "'Cinzel', serif",
          boxShadow: '0 4px 20px rgba(255,153,51,0.2)',
        }}>
          {notification.message}
        </div>
      )}

      {/* MENU BUTTON */}
      <button onClick={() => setShowMenu(true)}
        style={{
          position: 'absolute', top: 12, left: 12, width: 36, height: 36,
          background: 'rgba(10,10,30,0.7)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,153,51,0.25)', borderRadius: 8,
          pointerEvents: 'auto', color: '#FF9933', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        ☰
      </button>

      {/* PAUSE OVERLAY */}
      {showMenu && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', pointerEvents: 'auto',
          fontFamily: "'Cinzel', serif",
        }}>
          <div className="glass-panel" style={{ padding: '32px 40px', textAlign: 'center', maxWidth: 360, width: '90%' }}>
            <h2 style={{ fontSize: 20, color: '#FF9933', marginBottom: 16, fontWeight: 700 }}>⚙️ Menu</h2>
            <button onClick={() => setShowMenu(false)}
              style={{
                display: 'block', width: '100%', padding: '10px 0', marginBottom: 8,
                border: '2px solid #FF9933', borderRadius: 8,
                background: 'rgba(255,153,51,0.1)', color: '#FFD700', fontSize: 14,
                cursor: 'pointer', fontWeight: 600, fontFamily: "'Cinzel', serif",
              }}>
              ▶ Resume
            </button>
            <button onClick={() => { setPhase('start'); setShowMenu(false) }}
              style={{
                display: 'block', width: '100%', padding: '8px 0',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                background: 'transparent', color: '#888', fontSize: 13, cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}>
              Quit to Title
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============== TOUCH CONTROLS (Android) ==============
interface TouchControlsProps {
  setForward: (v: boolean) => void
  setBackward: (v: boolean) => void
  setLeft: (v: boolean) => void
  setRight: (v: boolean) => void
  setJump: (v: boolean) => void
  setRun: (v: boolean) => void
  setAttack: (v: boolean) => void
}

export function TouchControls({
  setForward, setBackward, setLeft, setRight, setJump, setRun, setAttack
}: TouchControlsProps) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (!isMobile) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
      pointerEvents: 'none', height: 180,
    }}>
      {/* D-Pad */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        display: 'grid', gridTemplateColumns: 'repeat(3, 50px)',
        gridTemplateRows: 'repeat(3, 50px)', gap: 3, pointerEvents: 'auto',
      }}>
        <div />
        <button className="touch-btn" style={{ fontSize: 20 }}
          onTouchStart={e => { e.preventDefault(); setForward(true) }}
          onTouchEnd={e => { e.preventDefault(); setForward(false) }}>▲</button>
        <div />
        <button className="touch-btn" style={{ fontSize: 20 }}
          onTouchStart={e => { e.preventDefault(); setLeft(true) }}
          onTouchEnd={e => { e.preventDefault(); setLeft(false) }}>◀</button>
        <button className="touch-btn" style={{ fontSize: 16, color: '#FF6600', borderColor: '#FF6600' }}
          onTouchStart={e => { e.preventDefault(); setRun(true) }}
          onTouchEnd={e => { e.preventDefault(); setRun(false) }}>⚡</button>
        <button className="touch-btn" style={{ fontSize: 20 }}
          onTouchStart={e => { e.preventDefault(); setRight(true) }}
          onTouchEnd={e => { e.preventDefault(); setRight(false) }}>▶</button>
        <div />
        <button className="touch-btn" style={{ fontSize: 20 }}
          onTouchStart={e => { e.preventDefault(); setBackward(true) }}
          onTouchEnd={e => { e.preventDefault(); setBackward(false) }}>▼</button>
        <div />
      </div>

      {/* Action buttons */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        display: 'flex', gap: 10, pointerEvents: 'auto',
      }}>
        <button className="touch-btn" style={{
          width: 56, height: 56, fontSize: 22, borderRadius: 28,
          border: '2px solid rgba(255,255,100,0.5)', color: '#FFD700',
        }}
          onTouchStart={e => { e.preventDefault(); setJump(true) }}
          onTouchEnd={e => { e.preventDefault(); setJump(false) }}>
          ▲▲
        </button>
        <button className="touch-btn" style={{
          width: 48, height: 48, fontSize: 16, borderRadius: 24,
          border: '2px solid rgba(255,100,100,0.5)', color: '#e63946',
        }}
          onTouchStart={e => { e.preventDefault(); setAttack(true) }}
          onTouchEnd={e => { e.preventDefault(); setAttack(false) }}>
          ⚔️
        </button>
      </div>
    </div>
  )
}
