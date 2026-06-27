import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export function ProfileScreen() {
  const [name, setName] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const setProfile = useGameStore(s => s.setProfile)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && age !== '') {
      setProfile({ name: name.trim(), age: Number(age) })
    }
  }

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

      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900,
        background: 'linear-gradient(135deg, #FF9933, #FFD700, #FF9933)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        textAlign: 'center', marginBottom: 20, zIndex: 2
      }}>
        Create Your Account
      </h1>
      
      <p style={{
        fontSize: 16, color: '#FFD700', opacity: 0.8, marginBottom: 40,
        fontFamily: "'Inter', sans-serif", zIndex: 2, textAlign: 'center'
      }}>
        Welcome to Maharaja's Bharat Odyssey.<br />
        Enter your details to begin your journey.
      </p>

      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 320, zIndex: 2,
        background: 'rgba(0,0,0,0.6)', padding: 30, borderRadius: 20,
        border: '1px solid rgba(255,153,51,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 14, color: '#FF9933', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Your Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Rahul, Priya..."
            required
            style={{
              padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 16,
              fontFamily: "'Inter', sans-serif", outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 14, color: '#FF9933', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Your Age</label>
          <input 
            type="number" 
            value={age} 
            onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 12, 25..."
            min={4}
            max={100}
            required
            style={{
              padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 16,
              fontFamily: "'Inter', sans-serif", outline: 'none'
            }}
          />
        </div>

        <button 
          type="submit"
          style={{
            padding: '14px 20px', fontSize: 16, fontWeight: 700,
            background: 'linear-gradient(135deg, #FF9933, #e07800)',
            border: 'none', borderRadius: 8, cursor: 'pointer', color: '#fff',
            fontFamily: "'Cinzel', serif", letterSpacing: 1, marginTop: 10,
            boxShadow: '0 4px 15px rgba(255,153,51,0.4)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          Begin Journey 👑
        </button>
      </form>
    </div>
  )
}
