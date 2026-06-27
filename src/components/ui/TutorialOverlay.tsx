// Child-friendly Tutorial Overlay — 4 simple steps with big emojis
import { useState, useEffect } from 'react'

interface TutorialStep {
  emoji: string
  title: string
  desc: string
  color: string
}

const STEPS: TutorialStep[] = [
  { emoji: '👆', title: 'Move Around!', desc: 'Use buttons or keys to walk', color: '#FF9933' },
  { emoji: '🦘', title: 'Jump!', desc: 'Press jump to go higher! Triple jump!', color: '#FFD700' },
  { emoji: '⭐', title: 'Collect Stars!', desc: 'Pick up coins, gems & lotuses', color: '#ff69b4' },
  { emoji: '🗺️', title: 'Explore India!', desc: 'Find temples & discover biomes', color: '#138808' },
]

export function TutorialOverlay({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Auto-advance after 3.5 seconds
    if (step >= STEPS.length - 1) return
    const t = setTimeout(() => {
      setFadeIn(false)
      setTimeout(() => {
        setStep(s => s + 1)
        setFadeIn(true)
      }, 400)
    }, 3500)
    return () => clearTimeout(t)
  }, [step])

  // Auto-dismiss after showing all steps
  useEffect(() => {
    if (step >= STEPS.length - 1) {
      const t = setTimeout(() => {
        setFadeIn(false)
        setTimeout(() => {
          setShow(false)
          onDismiss()
        }, 400)
      }, 4000)
      return () => clearTimeout(t)
    }
  }, [step, onDismiss])

  if (!show) return null

  const s = STEPS[step]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      fontFamily: "'Nunito', 'Comic Sans MS', sans-serif",
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      {/* Progress dots */}
      <div style={{
        position: 'absolute', top: 40,
        display: 'flex', gap: 10,
      }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 10,
            height: 10, borderRadius: 5,
            background: i === step ? '#FFD700' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Card */}
      <div style={{
        background: 'rgba(20,25,40,0.9)',
        backdropFilter: 'blur(16px)',
        border: `2px solid ${s.color}`,
        borderRadius: 24,
        padding: '40px 36px',
        textAlign: 'center',
        maxWidth: 340,
        width: '85%',
        boxShadow: `0 0 40px ${s.color}33`,
        animation: 'slide-up 0.5s ease-out',
        transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
        transition: 'transform 0.4s ease',
      }}>
        {/* Big emoji */}
        <div style={{
          fontSize: 64, marginBottom: 16,
          animation: 'float 2s ease-in-out infinite',
        }}>
          {s.emoji}
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 26, fontWeight: 800, margin: '0 0 8px 0',
          color: s.color,
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {s.title}
        </h2>

        {/* Description */}
        <p style={{
          fontSize: 16, color: 'rgba(255,255,255,0.8)',
          margin: 0, lineHeight: 1.6,
          fontWeight: 500,
        }}>
          {s.desc}
        </p>
      </div>

      {/* Skip button */}
      <button
        onClick={() => {
          setFadeIn(false)
          setTimeout(() => {
            setShow(false)
            onDismiss()
          }, 300)
        }}
        style={{
          position: 'absolute', bottom: 60,
          padding: '10px 28px',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.1)',
          color: '#aaa',
          fontSize: 14,
          cursor: 'pointer',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 600,
          backdropFilter: 'blur(8px)',
        }}
      >
        Skip Tutorial ✨
      </button>

      {/* Step counter */}
      <div style={{
        position: 'absolute', bottom: 30,
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: 600,
      }}>
        {step + 1} / {STEPS.length}
      </div>
    </div>
  )
}
