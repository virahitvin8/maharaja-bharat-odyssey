import React from 'react'

interface LandingPageProps {
  onPlay: () => void
}

export function LandingPage({ onPlay }: LandingPageProps) {
  return (
    <div style={{
      width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden',
      background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif"
    }}>
      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 70,
        background: 'rgba(10, 10, 15, 0.7)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', zIndex: 1000, borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
            MAHARAJA'S BHARAT ODYSSEY
          </span>
        </div>
        <div style={{ display: 'flex', gap: 40, fontSize: 14, fontWeight: 500 }}>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFD700'} onMouseLeave={e => e.currentTarget.style.color = '#fff'}>HOME</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFD700'} onMouseLeave={e => e.currentTarget.style.color = '#fff'}>NEWS</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFD700'} onMouseLeave={e => e.currentTarget.style.color = '#fff'}>CHARACTERS</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFD700'} onMouseLeave={e => e.currentTarget.style.color = '#fff'}>EXPLORE</a>
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <button style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px',
            color: '#fff', borderRadius: 20, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
          }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
            LOG IN
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        position: 'relative', width: '100%', height: '100vh',
        background: 'url(/hero_bg.png) no-repeat center center / cover',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Dark gradient overlay for text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #0a0a0a 0%, transparent 40%, rgba(0,0,0,0.3) 100%)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900,
            textShadow: '0 4px 20px rgba(0,0,0,0.8)', textAlign: 'center', lineHeight: 1.1,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #E2D5A3 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 20
          }}>
            STEP INTO<br/>THE MYTH
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', fontWeight: 400, color: '#e2e8f0',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)', maxWidth: 600, textAlign: 'center', marginBottom: 50
          }}>
            Explore a vast, breathtaking open world inspired by the ancient epics of India. Master the elements, uncover temple secrets, and forge your own destiny.
          </p>

          <div style={{ display: 'flex', gap: 20 }}>
            {/* Play Button */}
            <button 
              onClick={onPlay}
              style={{
                background: '#FFD700', color: '#000', padding: '16px 40px',
                borderRadius: 30, fontSize: 18, fontWeight: 700, border: 'none',
                cursor: 'pointer', boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.4)' }}
            >
              PC DOWNLOAD / PLAY WEB
            </button>
            {/* APK Download Button */}
            <a href="https://github.com/virahitvin8/maharaja-bharat-odyssey/releases/latest" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <button 
                style={{
                  background: 'rgba(20,25,35,0.7)', backdropFilter: 'blur(10px)', color: '#fff',
                  padding: '16px 40px', borderRadius: 30, fontSize: 18, fontWeight: 700, 
                  border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(20,25,35,0.7)' }}
              >
                ANDROID APK
              </button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          animation: 'bounce 2s infinite', opacity: 0.6
        }}>
          <span style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))' }} />
        </div>
      </section>

      {/* LATEST NEWS SECTION */}
      <section style={{ padding: '100px 40px', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 36, marginBottom: 50, color: '#e2d5a3' }}>LATEST NEWS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30, width: '100%', maxWidth: 1200 }}>
          {/* News Card 1 */}
          <div style={{ background: '#111', borderRadius: 12, overflow: 'hidden', border: '1px solid #222', cursor: 'pointer', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ height: 180, background: '#222' }} />
            <div style={{ padding: 24 }}>
              <div style={{ color: '#FFD700', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>UPDATE</div>
              <h3 style={{ fontSize: 18, marginBottom: 10 }}>Version 2.0: The Golden City of Dwarka</h3>
              <p style={{ color: '#888', fontSize: 14 }}>Dive into the submerged ruins and discover the legendary blessings of the ocean...</p>
            </div>
          </div>
          {/* News Card 2 */}
          <div style={{ background: '#111', borderRadius: 12, overflow: 'hidden', border: '1px solid #222', cursor: 'pointer', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ height: 180, background: '#222' }} />
            <div style={{ padding: 24 }}>
              <div style={{ color: '#FFD700', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>EVENT</div>
              <h3 style={{ fontSize: 18, marginBottom: 10 }}>Flute of Vrindavan limited time event</h3>
              <p style={{ color: '#888', fontSize: 14 }}>Participate in the festival of colors to earn exclusive ornaments and superpowers.</p>
            </div>
          </div>
          {/* News Card 3 */}
          <div style={{ background: '#111', borderRadius: 12, overflow: 'hidden', border: '1px solid #222', cursor: 'pointer', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ height: 180, background: '#222' }} />
            <div style={{ padding: 24 }}>
              <div style={{ color: '#FFD700', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>NOTICE</div>
              <h3 style={{ fontSize: 18, marginBottom: 10 }}>Android APK Official Release</h3>
              <p style={{ color: '#888', fontSize: 14 }}>The game is now fully playable on Android devices via our GitHub Releases page.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#050505', padding: '60px 40px', borderTop: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ width: 60, height: 60, borderRadius: '50%', marginBottom: 20, filter: 'grayscale(100%) opacity(0.5)' }} />
        <p style={{ color: '#666', fontSize: 12, maxWidth: 600, lineHeight: 1.6 }}>
          "Maharaja's Bharat Odyssey" is a fictional action-RPG. Any resemblance to real events or locales is purely for entertainment.<br/>
          © 2026 Akshit Vinay. All Rights Reserved.
        </p>
      </footer>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
            40% { transform: translateY(-15px) translateX(-50%); }
            60% { transform: translateY(-7px) translateX(-50%); }
          }
        `}
      </style>
    </div>
  )
}
