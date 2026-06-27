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
export function StartScreen({ onExplore }: { onExplore: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
      color: '#fff', fontFamily: "'Cinzel', serif",
      paddingTop: '10vh'
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900,
        background: 'linear-gradient(135deg, #FF9933, #FFD700, #FF9933)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        textAlign: 'center', lineHeight: 1.2, padding: '0 20px', marginBottom: 6,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))'
      }}>
        Maharaja's
      </h1>
      <h2 style={{
        fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontWeight: 700,
        background: 'linear-gradient(135deg, #FFD700, #FF9933)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        textAlign: 'center', marginBottom: 8,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))'
      }}>
        Bharat Odyssey
      </h2>
      <div style={{
        marginTop: 'auto', marginBottom: '15vh',
        background: 'rgba(0,0,0,0.6)', padding: '16px 32px', borderRadius: 30,
        border: '1px solid rgba(255,215,0,0.3)',
        animation: 'float 3s ease-in-out infinite',
      }}>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#FFD700',
          margin: 0, fontFamily: "'Inter', sans-serif", letterSpacing: 1,
        }}>
          🏃 Walk up and jump into the painting to begin!
        </p>
      </div>
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
          <p>WASD / Arrows — Walk through streets</p>
          <p>Space — Jump (triple jump!)</p>
          <p>Shift — Run through the streets</p>
          <p>M — Open India Map</p>
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
          <button onClick={() => { setPhase('map') }}
            style={{
              padding: '10px 0', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 8,
              background: 'rgba(255,153,51,0.05)', color: '#FFD700', fontSize: 13,
              cursor: 'pointer', fontFamily: "'Cinzel', serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.05)' }}>
            🗺️ India Map
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
  const profile = useGameStore(s => s.profile)
  const playerName = profile?.name || 'Maharaja'
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
        <h2 style={{ fontSize: 24, color: '#e63946', marginBottom: 8, fontWeight: 700 }}>
          {playerName}'s Journey Ends
        </h2>
        <p style={{ color: 'rgba(255,215,0,0.5)', fontSize: 11, marginBottom: 16, fontStyle: 'italic', fontFamily: "'Inter', sans-serif" }}>
          The temples will await your return...
        </p>
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
export function GameHUD({ currentCity }: { currentCity?: string }) {
  // Individual selectors to prevent full re-renders
  const score = useGameStore(s => s.score)
  const coins = useGameStore(s => s.coins)
  const lives = useGameStore(s => s.lives)
  const stamina = useGameStore(s => s.stamina)
  const maxStamina = useGameStore(s => s.maxStamina)
  const health = useGameStore(s => s.health)
  const maxHealth = useGameStore(s => s.maxHealth)
  const inventory = useGameStore(s => s.inventory)
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
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, fontFamily: "'Inter', sans-serif" }}>
      
      {/* GENSHIN STYLE MINIMAP (Top Left) */}
      <div style={{
        position: 'absolute', top: 20, left: 20,
        display: 'flex', gap: 15, alignItems: 'flex-start'
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(20, 25, 35, 0.6)', backdropFilter: 'blur(12px)',
          border: '2px solid rgba(255, 215, 0, 0.4)',
          boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,215,0,0.1)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff', pointerEvents: 'auto', cursor: 'pointer'
        }}
        onClick={() => setPhase('map')}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.8)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)' }}
        >
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 }}>{timeStr}</div>
          <div style={{ fontSize: 14, fontWeight: 'bold', color: '#FFD700', marginTop: 4, textAlign: 'center', padding: '0 10px' }}>
            {currentCity?.replace('_', ' ').toUpperCase() || 'MAP'}
          </div>
        </div>
      </div>

      {/* GENSHIN STYLE PROFILE & CURRENCY (Top Right) */}
      <div style={{
        position: 'absolute', top: 20, right: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10
      }}>
        {/* Profile Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(20, 25, 35, 0.7)', backdropFilter: 'blur(12px)',
          padding: '6px 16px 6px 6px', borderRadius: 30,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)', pointerEvents: 'auto'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: '#FFD700',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, border: '2px solid #fff'
          }}>👑</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{useGameStore.getState().profile?.name || 'Traveler'}</span>
            <span style={{ color: '#FFD700', fontSize: 11 }}>Adventure Rank {Math.floor(score / 1000) + 1}</span>
          </div>
        </div>

        {/* Currencies (Coins & Gems) */}
        <div style={{
          display: 'flex', gap: 15, background: 'rgba(20, 25, 35, 0.6)',
          backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e2d5a3', fontSize: 13, fontWeight: 600 }}>
            <span style={{ fontSize: 16 }}>🪙</span> {coins}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e2d5a3', fontSize: 13, fontWeight: 600 }}>
            <span style={{ fontSize: 16 }}>💎</span> {gems.diamond + gems.ruby + gems.emerald + gems.sapphire}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e2d5a3', fontSize: 13, fontWeight: 600 }}>
            <span style={{ fontSize: 16 }}>✨</span> {useGameStore.getState().inventory.ornaments || 0}
          </div>
        </div>
      </div>

      {/* GENSHIN STYLE HEALTH & STAMINA (Bottom Center) */}
      <div style={{
        position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        width: '30%', minWidth: 250, maxWidth: 400
      }}>
        {/* Health */}
        <div style={{ width: '100%', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -20, left: 0, color: '#97d163', fontSize: 12, fontWeight: 700, textShadow: '0 1px 2px #000' }}>
            HP {Math.round(health)} / {maxHealth}
          </div>
          <div style={{
            width: '100%', height: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden'
          }}>
            <div style={{
              width: `${(health / maxHealth) * 100}%`, height: '100%',
              background: 'linear-gradient(90deg, #6cbf3d, #97d163)',
              boxShadow: '0 0 10px #97d163', transition: 'width 0.2s'
            }} />
          </div>
        </div>

        {/* Stamina */}
        <div style={{ width: '80%', position: 'relative' }}>
          <div style={{
            width: '100%', height: 4, background: 'rgba(0,0,0,0.5)', borderRadius: 2,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(stamina / maxStamina) * 100}%`, height: '100%',
              background: 'linear-gradient(90deg, #d4a017, #ffd700)',
              boxShadow: '0 0 10px #ffd700', transition: 'width 0.1s'
            }} />
          </div>
        </div>
      </div>

      {/* INVENTORY / BACKPACK ICON (Right Edge Middle) */}
      <div style={{
        position: 'absolute', top: '50%', right: 20, transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 15, pointerEvents: 'auto'
      }}>
        <div 
          onClick={() => setShowMenu(!showMenu)}
          style={{
            width: 45, height: 45, borderRadius: '50%', background: 'rgba(20,25,35,0.6)',
            backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', color: '#fff'
          }}
        >
          🎒
        </div>
        
        {showMenu && (
          <div style={{
            position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(20,25,35,0.8)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,215,0,0.2)', borderRadius: 12, padding: 15,
            display: 'flex', flexDirection: 'column', gap: 10, width: 140,
            boxShadow: '0 5px 20px rgba(0,0,0,0.5)', color: '#fff', fontSize: 13
          }}>
            <div style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Inventory</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🪵 Wood</span> <span>{inventory.wood}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🪨 Stone</span> <span>{inventory.stone}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🍎 Food</span> <span>{inventory.food}</span></div>
          </div>
        )}
      </div>

      {/* TIME / LOCATION */}
      <div style={{
        position: 'absolute', bottom: 90, right: 12,
        padding: '6px 12px', background: 'rgba(10,10,30,0.7)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,153,51,0.2)', borderRadius: 8, pointerEvents: 'auto',
        fontSize: 11, textAlign: 'right',
      }}>
        <span style={{ color: isNight ? '#aaccff' : '#FFD700', fontWeight: 600, fontFamily: "'Cinzel', serif" }}>
          🏛️ {currentCity || 'India'}
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
