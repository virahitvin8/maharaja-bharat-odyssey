// Account Screen — Create your Maharaja profile
// Name + age determines character height, personalized game messages, Krishna flute theme
import { useState } from 'react'
import { useGameStore, getCharacterHeightFromAge } from '../../store/gameStore'

export function AccountScreen() {
  const setProfile = useGameStore(s => s.setProfile)
  const [name, setName] = useState('')
  const [age, setAge] = useState<number>(16)
  const [step, setStep] = useState<'welcome' | 'name' | 'age'>('welcome')

  // Age-based height calculation using shared utility
  const characterHeight = getCharacterHeightFromAge(age)
  const heightLabel = characterHeight < 0.7 ? 'Young Explorer' : characterHeight < 0.85 ? 'Rising Warrior' : characterHeight < 0.95 ? 'Brave Youth' : characterHeight < 1.0 ? 'Seasoned Maharaja' : 'Wise Sage'

  const handleCreate = () => {
    if (!name.trim()) return
    setProfile({ name: name.trim(), age })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a30 50%, #0a0a1a 100%)',
      fontFamily: "'Cinzel', serif",
      overflow: 'hidden',
    }}>
      {/* Animated background particles */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.15,
        background: `radial-gradient(circle at 30% 40%, #FFD700 0%, transparent 30%),
                     radial-gradient(circle at 70% 60%, #FF9933 0%, transparent 30%),
                     radial-gradient(circle at 50% 80%, #138808 0%, transparent 30%)`,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 420, width: '90%', padding: '32px 28px',
        background: 'rgba(10,10,30,0.85)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,153,51,0.3)', borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        textAlign: 'center',
        animation: 'slide-up 0.5s ease-out',
      }}>
        {/* Krishna Flute Theme */}
        <div style={{
          fontSize: 48, marginBottom: 8,
          animation: 'float 3s ease-in-out infinite',
          filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))',
        }}>
          🪈
        </div>
        <h1 style={{
          fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 900,
          background: 'linear-gradient(135deg, #FF9933, #FFD700, #FF9933)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 4,
        }}>
          Begin Your Journey
        </h1>
        <p style={{
          color: 'rgba(255,215,0,0.6)', fontSize: 12, marginBottom: 24,
          fontFamily: "'Inter', sans-serif",
        }}>
          Every Maharaja has a name — yours shapes your destiny
        </p>

        {/* Welcome Step */}
        {step === 'welcome' && (
          <div style={{ animation: 'fade-in 0.3s ease-out' }}>
            <div style={{
              fontSize: 72, marginBottom: 16,
              background: 'linear-gradient(135deg, #FFD700, #FF9933)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>👑</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
              Welcome, brave soul. The sacred temples of India await your discovery.
              <br />Each temple holds ancient power — but first, we must know who you are.
            </p>
            <p style={{ color: 'rgba(255,215,0,0.5)', fontSize: 11, marginBottom: 24, fontStyle: 'italic' }}>
              "The flute of Krishna calls you to Brindhavan..."
            </p>
            <button onClick={() => setStep('name')}
              style={{
                padding: '12px 40px', border: '2px solid #FF9933', borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(255,153,51,0.2), rgba(255,215,0,0.2))',
                color: '#FFD700', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Cinzel', serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.2)' }}>
              🚪 Enter the Gateway
            </button>
          </div>
        )}

        {/* Name Step */}
        {step === 'name' && (
          <div style={{ animation: 'fade-in 0.3s ease-out' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🪷</div>
            <label style={{
              display: 'block', color: '#FFD700', fontSize: 13, marginBottom: 8,
              fontWeight: 600,
            }}>
              What is your name, young Maharaja?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={30}
              autoFocus
              style={{
                width: '100%', padding: '12px 16px', fontSize: 16,
                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,153,51,0.3)',
                borderRadius: 8, color: '#FFD700', outline: 'none',
                fontFamily: "'Cinzel', serif", textAlign: 'center',
                marginBottom: 12,
              }}
              onKeyDown={e => { if (e.key === 'Enter' && name.trim()) setStep('age') }}
            />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginBottom: 16 }}>
              This will be displayed in all game messages
            </p>
            <button onClick={() => { if (name.trim()) setStep('age') }}
              style={{
                width: '100%', padding: '12px', border: '1px solid rgba(255,153,51,0.5)',
                borderRadius: 8, background: name.trim() ? 'rgba(255,153,51,0.15)' : 'transparent',
                color: name.trim() ? '#FFD700' : 'rgba(255,255,255,0.2)',
                cursor: name.trim() ? 'pointer' : 'default',
                fontSize: 14, fontFamily: "'Cinzel', serif",
              }}>
              Next →
            </button>
          </div>
        )}

        {/* Age Step */}
        {step === 'age' && (
          <div style={{ animation: 'fade-in 0.3s ease-out' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📏</div>
            <label style={{
              display: 'block', color: '#FFD700', fontSize: 13, marginBottom: 16,
              fontWeight: 600,
            }}>
              How old are you, {name || 'Maharaja'}?
            </label>

            {/* Age Slider */}
            <div style={{ marginBottom: 20 }}>
              <input
                type="range"
                min={5}
                max={80}
                value={age}
                onChange={e => setAge(parseInt(e.target.value))}
                style={{
                  width: '100%', height: 6, borderRadius: 3,
                  background: 'rgba(255,153,51,0.2)',
                  WebkitAppearance: 'none', appearance: 'none',
                  outline: 'none', cursor: 'pointer',
                }}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 4,
              }}>
                <span>5</span>
                <span>25</span>
                <span>50</span>
                <span>80</span>
              </div>
            </div>

            <div style={{
              fontSize: 48, marginBottom: 8,
              transition: 'all 0.3s',
            }}>
              {age < 10 ? '🧒' : age < 18 ? '🧑' : age < 40 ? '👨' : '👴'}
            </div>
            <p style={{ color: '#FFD700', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {age} years — {heightLabel}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 20 }}>
              Character height: {Math.round(characterHeight * 100)}% of standard
            </p>

            {/* Preview */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 20,
            }}>
              <div style={{
                width: 12, height: Math.max(20, 50 * characterHeight),
                background: 'linear-gradient(to top, #FF9933, #FFD700)',
                borderRadius: '4px 4px 2px 2px',
                transition: 'height 0.3s',
              }} />
              <div style={{
                width: 12, height: 50,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px 4px 2px 2px',
              }} />
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>You vs. Standard</span>
            </div>

            <button onClick={handleCreate}
              disabled={!name.trim()}
              style={{
                width: '100%', padding: '14px 0',
                background: 'linear-gradient(135deg, #FF9933, #e07800)',
                border: 'none', borderRadius: 8,
                color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Cinzel', serif",
                boxShadow: '0 4px 20px rgba(255,153,51,0.3)',
                opacity: name.trim() ? 1 : 0.5,
              }}>
              🚀 Begin the Odyssey!
            </button>
          </div>
        )}

        {/* Skip link */}
        <p style={{
          marginTop: 16, color: 'rgba(255,255,255,0.15)', fontSize: 10, cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
        }}
          onClick={() => setProfile({ name: 'Maharaja', age: 25 })}>
          Skip — play as default Maharaja
        </p>
      </div>
    </div>
  )
}
