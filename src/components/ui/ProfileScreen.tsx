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
      background: 'url(./logo.png) no-repeat center center / cover',
      backgroundColor: '#f5f7fa',
      color: '#333', fontFamily: "'Noto Serif', serif",
      overflow: 'hidden',
    }}>
      {/* Soft ethereal overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, rgba(200,210,230,0.9) 100%)',
        backdropFilter: 'blur(10px)'
      }} />

      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700,
        color: '#4a5568', letterSpacing: 2,
        textAlign: 'center', marginBottom: 10, zIndex: 2,
        textShadow: '0 2px 4px rgba(255,255,255,0.8)'
      }}>
        MAHARAJA'S BHARAT ODYSSEY
      </h1>
      
      <p style={{
        fontSize: 14, color: '#718096', marginBottom: 40,
        fontFamily: "'Inter', sans-serif", zIndex: 2, textAlign: 'center', letterSpacing: 1
      }}>
        A JOURNEY THROUGH ANCIENT INDIA
      </p>

      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 360, zIndex: 2,
        background: 'rgba(255,255,255,0.8)', padding: 40, borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05), inset 0 0 20px rgba(255,255,255,0.5)',
        alignItems: 'center'
      }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
            required
            style={{
              padding: '16px 20px', borderRadius: 30, border: '1px solid #cbd5e0',
              background: '#fff', color: '#4a5568', fontSize: 16, textAlign: 'center',
              fontFamily: "'Inter', sans-serif", outline: 'none', transition: 'all 0.2s',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#ecc94b'}
            onBlur={e => e.currentTarget.style.borderColor = '#cbd5e0'}
          />
        </div>
        
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input 
            type="number" 
            value={age} 
            onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Enter your age"
            min={4}
            max={100}
            required
            style={{
              padding: '16px 20px', borderRadius: 30, border: '1px solid #cbd5e0',
              background: '#fff', color: '#4a5568', fontSize: 16, textAlign: 'center',
              fontFamily: "'Inter', sans-serif", outline: 'none', transition: 'all 0.2s',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#ecc94b'}
            onBlur={e => e.currentTarget.style.borderColor = '#cbd5e0'}
          />
        </div>

        <button 
          type="submit"
          style={{
            padding: '16px 40px', fontSize: 16, fontWeight: 700,
            background: '#ecc94b', color: '#fff',
            border: 'none', borderRadius: 30, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", letterSpacing: 1, marginTop: 10,
            boxShadow: '0 4px 14px rgba(236,201,75,0.4)',
            transition: 'all 0.2s', width: '100%'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(236,201,75,0.6)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(236,201,75,0.4)' }}
        >
          ENTER
        </button>
      </form>
    </div>
  )
}
