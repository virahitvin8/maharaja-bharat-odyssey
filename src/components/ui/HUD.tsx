// Complete HUD — stamina, coins, gems, lives, region, notifications, minimap
import React, { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

const BIOME_NAMES: Record<string, string> = {
  gangetic:  '🌾 Gangetic Plains',
  rajasthan: '🏜️ Rajasthan Desert',
  himalaya:  '🏔️ Himalayas',
  kerala:    '🌴 Kerala Backwaters',
  deccan:    '⛰️ Deccan Plateau',
  coastal:   '🌊 Coastal India',
}

const BIOME_COLORS: Record<string, string> = {
  gangetic:  '#7a9a5a',
  rajasthan: '#d4a840',
  himalaya:  '#6a8aaa',
  kerala:    '#2a6a3a',
  deccan:    '#8a6a3a',
  coastal:   '#3a8aaa',
}

// ---- Stamina Bar ----
export function StaminaBar() {
  const { stamina, maxStamina } = useGameStore()
  const pct = (stamina / maxStamina) * 100
  const color = pct > 60 ? '#138808' : pct > 30 ? '#FF9933' : '#e63946'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(10,10,30,0.8)',
      border: '1px solid rgba(255,153,51,0.4)',
      borderRadius: 8, padding: '6px 12px',
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{ color: '#FF9933', fontSize: 11, fontFamily: 'Press Start 2P', whiteSpace: 'nowrap' }}>⚡</span>
      <div style={{ width: 120, height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 5,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          transition: 'width 0.15s ease-out',
          boxShadow: `0 0 6px ${color}88`,
        }} />
      </div>
      <span style={{ color, fontSize: 10, fontFamily: 'Press Start 2P', minWidth: 30 }}>{Math.round(pct)}%</span>
    </div>
  )
}

// ---- Lives display ----
export function LivesDisplay() {
  const { lives } = useGameStore()
  return (
    <div style={{
      display: 'flex', gap: 4, alignItems: 'center',
      background: 'rgba(10,10,30,0.8)',
      border: '1px solid rgba(255,153,51,0.4)',
      borderRadius: 8, padding: '6px 10px',
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{ color: '#FF9933', fontSize: 10, fontFamily: 'Press Start 2P' }}>LIVES</span>
      {Array.from({ length: Math.max(lives, 0) }).map((_, i) => (
        <span key={i} style={{ fontSize: 14 }}>👑</span>
      ))}
      {lives === 0 && <span style={{ color: '#e63946', fontSize: 10 }}>DEAD</span>}
    </div>
  )
}

// ---- Coins & Gems Counter ----
export function Inventory() {
  const { coins, gems, lotus } = useGameStore()
  return (
    <div style={{
      background: 'rgba(10,10,30,0.85)',
      border: '1px solid rgba(255,153,51,0.4)',
      borderRadius: 10, padding: '8px 14px',
      backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: '#FFD700', fontSize: 13 }}>🪙</span>
        <span style={{ color: '#FFD700', fontFamily: 'Press Start 2P', fontSize: 10 }}>{coins}</span>
        <span style={{ color: '#ff69b4', fontSize: 13 }}>🪷</span>
        <span style={{ color: '#ff69b4', fontFamily: 'Press Start 2P', fontSize: 10 }}>{lotus}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {gems.ruby > 0     && <span title="Ruby" style={{ fontSize: 11, color: '#e63946' }}>💎{gems.ruby}</span>}
        {gems.diamond > 0  && <span title="Diamond" style={{ fontSize: 11, color: '#a8dadc' }}>💎{gems.diamond}</span>}
        {gems.emerald > 0  && <span title="Emerald" style={{ fontSize: 11, color: '#2d9a4f' }}>💎{gems.emerald}</span>}
        {gems.sapphire > 0 && <span title="Sapphire" style={{ fontSize: 11, color: '#3a7abd' }}>💎{gems.sapphire}</span>}
      </div>
    </div>
  )
}

// ---- Score display ----
export function ScoreDisplay() {
  const { score } = useGameStore()
  return (
    <div style={{
      background: 'rgba(10,10,30,0.8)',
      border: '1px solid rgba(218,165,32,0.4)',
      borderRadius: 8, padding: '6px 12px',
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{ color: '#DAA520', fontFamily: 'Press Start 2P', fontSize: 10 }}>
        SCORE: {score.toLocaleString()}
      </span>
    </div>
  )
}

// ---- Region name popup ----
export function RegionDisplay() {
  const { currentBiome } = useGameStore()
  const prevBiome = useRef(currentBiome)
  const [show, setShow] = React.useState(false)
  const [displayBiome, setDisplayBiome] = React.useState(currentBiome)

  useEffect(() => {
    if (currentBiome !== prevBiome.current) {
      setDisplayBiome(currentBiome)
      setShow(true)
      const t = setTimeout(() => setShow(false), 3000)
      prevBiome.current = currentBiome
      return () => clearTimeout(t)
    }
  }, [currentBiome])

  if (!show) return null

  return (
    <div style={{
      position: 'absolute',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(10,10,30,0.9)',
      border: `2px solid ${BIOME_COLORS[displayBiome]}`,
      borderRadius: 14,
      padding: '16px 30px',
      textAlign: 'center',
      animation: 'slide-up 0.5s ease-out',
      zIndex: 10,
      backdropFilter: 'blur(12px)',
      boxShadow: `0 0 30px ${BIOME_COLORS[displayBiome]}44`,
    }}>
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, color: '#FF9933', marginBottom: 4 }}>
        Entering
      </div>
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 26, color: '#FFD700', fontWeight: 700 }}>
        {BIOME_NAMES[displayBiome]}
      </div>
    </div>
  )
}

// ---- Notification toast ----
export function NotificationToast() {
  const { notification, clearNotification } = useGameStore()

  useEffect(() => {
    if (notification) {
      const t = setTimeout(clearNotification, 2500)
      return () => clearTimeout(t)
    }
  }, [notification, clearNotification])

  if (!notification) return null

  const colors: Record<string, string> = {
    collect:  '#FFD700',
    landmark: '#FF9933',
    life:     '#e63946',
    region:   '#138808',
  }

  return (
    <div style={{
      background: 'rgba(10,10,30,0.9)',
      border: `1px solid ${colors[notification.type]}`,
      borderRadius: 10,
      padding: '10px 20px',
      color: colors[notification.type],
      fontFamily: 'Press Start 2P',
      fontSize: 11,
      animation: 'slide-in-left 0.3s ease-out',
      boxShadow: `0 0 15px ${colors[notification.type]}44`,
      maxWidth: 280,
    }}>
      {notification.message}
    </div>
  )
}

// ---- Mini-map ----
export function Minimap() {
  const { collectibles, currentBiome } = useGameStore()
  const size = 120
  const worldScale = 600

  return (
    <div style={{
      width: size, height: size,
      background: 'rgba(10,10,30,0.85)',
      border: '1px solid rgba(255,153,51,0.5)',
      borderRadius: 8,
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(8px)',
    }}>
      {/* India-ish silhouette */}
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <ellipse cx={size/2} cy={size/2} rx={35} ry={50} fill="rgba(138,170,100,0.3)" stroke="#4a7a30" strokeWidth={1} />
        {/* Himalaya line */}
        <line x1={25} y1={25} x2={95} y2={25} stroke="#88aacc" strokeWidth={2} opacity={0.6} />
        {/* Coastline */}
        <path d="M 55 80 Q 65 100 70 110 Q 60 115 55 110" fill="none" stroke="#3a8aaa" strokeWidth={1.5} opacity={0.6} />
      </svg>

      {/* Collectible dots */}
      {collectibles.filter(c => !c.collected).slice(0, 30).map(c => {
        const x = ((c.position[0] + 300) / 600) * size
        const y = ((c.position[2] + 300) / 600) * size
        const isGem = c.type.startsWith('gem')
        return (
          <div key={c.id} style={{
            position: 'absolute',
            width: isGem ? 5 : 3, height: isGem ? 5 : 3,
            borderRadius: '50%',
            background: isGem ? '#ff88cc' : '#FFD700',
            left: x - 1.5, top: y - 1.5,
            boxShadow: isGem ? '0 0 3px #ff88cc' : undefined,
          }} />
        )
      })}

      {/* Player dot */}
      <div style={{
        position: 'absolute',
        width: 7, height: 7,
        borderRadius: '50%',
        background: '#FF9933',
        left: size / 2 - 3.5, top: size / 2 - 3.5,
        boxShadow: '0 0 6px #FF9933',
        border: '1px solid #FFD700',
      }} />

      <div style={{
        position: 'absolute', bottom: 3, left: 0, right: 0,
        textAlign: 'center',
        fontSize: 8, color: 'rgba(255,153,51,0.7)',
        fontFamily: 'Press Start 2P',
      }}>MAP</div>
    </div>
  )
}

// ---- Controls hint ----
export function ControlsHint() {
  const [visible, setVisible] = React.useState(true)
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 8000)
    return () => clearTimeout(t)
  }, [])
  if (!visible) return null
  return (
    <div style={{
      background: 'rgba(10,10,30,0.85)',
      border: '1px solid rgba(255,153,51,0.4)',
      borderRadius: 10, padding: '12px 18px',
      backdropFilter: 'blur(8px)',
      color: '#ccc',
      fontSize: 9,
      fontFamily: 'Press Start 2P',
      lineHeight: 2,
    }}>
      <div style={{ color: '#FF9933', marginBottom: 6, fontSize: 10 }}>CONTROLS</div>
      <div><span style={{ color: '#FFD700' }}>WASD / ↑↓←→</span> Move</div>
      <div><span style={{ color: '#FFD700' }}>SHIFT</span> Run</div>
      <div><span style={{ color: '#FFD700' }}>SPACE</span> Jump (×3)</div>
      <div><span style={{ color: '#FFD700' }}>Z / X</span> Sword Attack</div>
      <div><span style={{ color: '#FFD700' }}>C</span> Ground Pound</div>
      <div style={{ marginTop: 6, fontSize: 8, color: '#888' }}>Touch buttons on mobile</div>
    </div>
  )
}

// ---- Complete HUD ----
export function HUD() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
      zIndex: 5,
    }}>
      {/* Top-left: Lives + Stamina */}
      <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <LivesDisplay />
        <StaminaBar />
        <ScoreDisplay />
      </div>

      {/* Top-right: Inventory + Minimap */}
      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
        <Minimap />
        <Inventory />
      </div>

      {/* Bottom-left: Controls hint */}
      <div style={{ position: 'absolute', bottom: 140, left: 16 }}>
        <ControlsHint />
      </div>

      {/* Notification */}
      <div style={{ position: 'absolute', bottom: 180, left: 16 }}>
        <NotificationToast />
      </div>

      {/* Center: Region popup */}
      <RegionDisplay />
    </div>
  )
}
