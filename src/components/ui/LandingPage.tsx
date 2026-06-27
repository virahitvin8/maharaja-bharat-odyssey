// Genshin Impact-style Landing Page — "Maharaja's Bharat Odyssey"
// Full immersive homepage with hero, character showcase, temples, features, news, footer
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { POWERFUL_TEMPLES } from '../../data/powerfulTemples'
import { getSuperpowerByTemple } from '../../data/superpowers'

// ===================== TYPEWRITER HOOK =====================
function useTypewriter(text: string, speed = 50) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplay('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplay(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return { display, done }
}

// ===================== PARTICLE BACKGROUND =====================
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = window.innerWidth
    let h = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[] = []
    const count = 80

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        hue: Math.random() < 0.33 ? 35 : Math.random() < 0.5 ? 220 : 0, // gold, blue, or white
      })
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w
      canvas!.height = h
    }
    window.addEventListener('resize', resize)
    canvas.width = w
    canvas.height = h

    const draw = () => {
      ctx!.clearRect(0, 0, w, h)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(255, 215, 0, ${(1 - dist / 150) * 0.15})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        const color = p.hue === 35 ? '#FFD700' : p.hue === 220 ? '#87CEEB' : '#ffffff'
        ctx!.fillStyle = `rgba(255, 215, 0, ${p.alpha})`
        ctx!.fill()

        // Glow
        if (p.alpha > 0.3) {
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(255, 215, 0, ${p.alpha * 0.1})`
          ctx!.fill()
        }

        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

// ===================== NAVIGATION =====================
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      // Detect active section
      const sections = ['hero', 'characters', 'temples', 'features', 'news']
      for (const s of sections.reverse()) {
        const el = document.getElementById(s)
        if (el && el.getBoundingClientRect().top < 300) {
          setActiveSection(s)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'characters', label: 'Characters' },
    { id: 'temples', label: 'Temples' },
    { id: 'features', label: 'Features' },
    { id: 'news', label: 'News' },
  ]

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: scrolled ? '8px 40px' : '16px 40px',
      background: scrolled ? 'rgba(10, 10, 26, 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255, 215, 0, 0.1)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      fontFamily: "'Cinzel', serif",
    }}>
      {/* Logo */}
      <div
        onClick={() => scrollTo('hero')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF9933, #FFD700)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 0 20px rgba(255,215,0,0.3)',
        }}>👑</div>
        <span style={{
          fontSize: 16, fontWeight: 700, color: '#FFD700',
          letterSpacing: 1, display: scrolled ? 'block' : 'none',
        }}>Bharat Odyssey</span>
      </div>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => scrollTo(item.id)}
            style={{
              padding: '8px 16px', background: 'transparent', border: 'none',
              color: activeSection === item.id ? '#FFD700' : 'rgba(255,255,255,0.6)',
              fontSize: 13, fontWeight: activeSection === item.id ? 700 : 400,
              cursor: 'pointer', fontFamily: "'Cinzel', serif",
              letterSpacing: 1, transition: 'all 0.2s',
              borderBottom: activeSection === item.id ? '2px solid #FFD700' : '2px solid transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FFD700' }}
            onMouseLeave={e => { e.currentTarget.style.color = activeSection === item.id ? '#FFD700' : 'rgba(255,255,255,0.6)' }}
          >
            {item.label}
          </button>
        ))}

        {/* Download CTA */}
        <button onClick={() => scrollTo('download')}
          style={{
            marginLeft: 20, padding: '10px 24px',
            background: 'linear-gradient(135deg, #FF9933, #e07800)',
            border: 'none', borderRadius: 8, color: '#fff',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Cinzel', serif", letterSpacing: 0.5,
            boxShadow: '0 4px 15px rgba(255,153,51,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,153,51,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,153,51,0.3)' }}
        >
          Download
        </button>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none', background: 'transparent', border: 'none',
            color: '#FFD700', fontSize: 24, cursor: 'pointer',
            padding: '8px',
          }}
          className="mobile-nav-toggle"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(10, 10, 26, 0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,215,0,0.1)',
          padding: '16px', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              style={{
                padding: '12px 16px', background: 'transparent', border: 'none',
                color: activeSection === item.id ? '#FFD700' : '#fff',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                textAlign: 'left', fontFamily: "'Cinzel', serif",
                borderLeft: activeSection === item.id ? '3px solid #FFD700' : '3px solid transparent',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

// ===================== HERO SECTION =====================
function HeroSection() {
  const setPhase = useGameStore(s => s.setPhase)
  const { display: tagline, done } = useTypewriter("Explore the Sacred Temples of India", 60)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0003})`
        parallaxRef.current.style.opacity = `${Math.max(0, 1 - scrollY / 600)}`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="hero" style={{
      position: 'relative', width: '100%', height: '100vh',
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #050510 0%, #0a0a2a 30%, #1a0a30 60%, #0a0a1a 100%)',
    }}>
      {/* Animated background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(255,153,51,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(19,136,8,0.05) 0%, transparent 50%)
        `,
      }} />

      <ParticleBackground />

      {/* Decorative floating elements */}
      <div style={{
        position: 'absolute', fontSize: 120, opacity: 0.03,
        top: '10%', left: '5%', animation: 'float 6s ease-in-out infinite',
      }}>🪷</div>
      <div style={{
        position: 'absolute', fontSize: 80, opacity: 0.03,
        bottom: '15%', right: '8%', animation: 'float 8s ease-in-out infinite',
        animationDelay: '2s',
      }}>🪈</div>
      <div style={{
        position: 'absolute', fontSize: 60, opacity: 0.04,
        top: '30%', right: '15%', animation: 'spin-slow 12s linear infinite',
      }}>🕉️</div>

      {/* Main content */}
      <div ref={parallaxRef} style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        padding: '0 20px', maxWidth: 900,
      }}>
        {/* Crown icon */}
        <div style={{
          fontSize: 64, marginBottom: 16,
          animation: 'float 3s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.3))',
        }}>
          👑
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900,
          background: 'linear-gradient(135deg, #FF9933 0%, #FFD700 30%, #FFF8DC 50%, #FFD700 70%, #FF9933 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1, marginBottom: 8,
          filter: 'drop-shadow(0 4px 20px rgba(255,215,0,0.3))',
        }}>
          Maharaja's
        </h1>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontWeight: 700,
          background: 'linear-gradient(135deg, #FFD700, #FF9933, #FFD700)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 24,
          filter: 'drop-shadow(0 2px 10px rgba(255,215,0,0.2))',
        }}>
          Bharat Odyssey
        </h2>

        {/* Typewriter tagline */}
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.3rem)', color: 'rgba(255,215,0,0.7)',
          fontFamily: "'Inter', sans-serif", letterSpacing: 2,
          marginBottom: 16, minHeight: 40,
        }}>
          {tagline}<span style={{ opacity: done ? 0 : 1 }}>|</span>
        </p>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)', color: 'rgba(255,255,255,0.35)',
          fontFamily: "'Inter', sans-serif", letterSpacing: 1, marginBottom: 40,
          maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6,
        }}>
          An epic open-world adventure across 20 sacred Indian temples.
          Climb mountains, battle wild beasts, discover ancient powers,
          and seek the blessings of the divine.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setPhase('loading')}
            className="landing-cta"
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #FF9933, #e07800)',
              border: 'none', borderRadius: 12, color: '#fff',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Cinzel', serif", letterSpacing: 1,
              boxShadow: '0 8px 30px rgba(255,153,51,0.4)',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,153,51,0.6)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,153,51,0.4)' }}
          >
            <span style={{ fontSize: 20 }}>🚀</span> Start Your Journey
          </button>

          <button onClick={() => document.getElementById('characters')?.scrollIntoView({ behavior: 'smooth' })}
            className="landing-cta-secondary"
            style={{
              padding: '16px 36px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: 12, color: '#FFD700',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Cinzel', serif", letterSpacing: 1,
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.1)'; e.currentTarget.style.borderColor = '#FFD700' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)' }}
          >
            ▶ Watch Trailer
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: -120, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: 0.5,
        }}>
          <span style={{ color: '#FFD700', fontSize: 11, letterSpacing: 2, fontFamily: "'Inter', sans-serif" }}>SCROLL</span>
          <div className="scroll-arrow" />
        </div>
      </div>
    </section>
  )
}

// ===================== CHARACTER SHOWCASE =====================
function CharacterShowcase() {
  const characters = [
    {
      name: 'The Maharaja',
      title: 'Royal Protector of the Temples',
      emoji: '👑',
      description: 'A brave royal warrior on a sacred pilgrimage across India. Wields an ancient sword blessed by the gods, capable of cutting through any obstacle.',
      stats: { Attack: 85, 'Spiritual Power': 70, Speed: 75, Stamina: 90, Defense: 65 },
      color: '#FF9933',
      abilities: ['Triple Jump', 'Sword Strike', 'Ground Pound', 'Raft Building'],
    },
    {
      name: 'Blessed Maharaja',
      title: 'Temple-Powered Avatar',
      emoji: '✨',
      description: 'After receiving blessings from the 20 sacred temples, the Maharaja awakens divine powers — levitation, time slow, water walking, and more.',
      stats: { Attack: 95, 'Spiritual Power': 100, Speed: 90, Stamina: 100, Defense: 85 },
      color: '#FFD700',
      abilities: ['Levitation', 'Time Slow', 'Water Walk', 'Fire Sword', 'Quad Jump'],
    },
    {
      name: "Krishna's Flute",
      title: 'The Divine Enchantment',
      emoji: '🪈',
      description: 'The celestial flute of Lord Krishna echoes through Brindhavan, granting the Maharaja the power to charm animals and cross any river.',
      stats: { Attack: 60, 'Spiritual Power': 95, Speed: 70, Stamina: 80, Defense: 50 },
      color: '#3a7abd',
      abilities: ['Animal Charm', 'River Crossing', 'Healing Melody', 'Light Mastery'],
    },
  ]

  const [activeChar, setActiveChar] = useState(0)

  return (
    <section id="characters" style={{
      position: 'relative', padding: '120px 20px',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #0a0a2a 50%, #0a0a1a 100%)',
      overflow: 'hidden',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <p style={{
          color: '#FFD700', fontSize: 12, letterSpacing: 3, fontWeight: 600,
          fontFamily: "'Inter', sans-serif", marginBottom: 8,
        }}>
          YOUR JOURNEY
        </p>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff',
          fontFamily: "'Cinzel', serif", marginBottom: 12,
        }}>
          Choose Your <span style={{ color: '#FFD700' }}>Destiny</span>
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.4)', fontSize: 14, maxWidth: 500,
          margin: '0 auto', fontFamily: "'Inter', sans-serif", lineHeight: 1.6,
        }}>
          As you explore the sacred land and collect temple blessings, your power grows.
        </p>
      </div>

      {/* Character tabs */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 50,
        flexWrap: 'wrap',
      }}>
        {characters.map((char, i) => (
          <button key={i} onClick={() => setActiveChar(i)}
            style={{
              padding: '12px 24px',
              background: activeChar === i ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
              border: activeChar === i ? '1px solid rgba(255,215,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, color: activeChar === i ? '#FFD700' : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Cinzel', serif", transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { if (activeChar !== i) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' } }}
            onMouseLeave={e => { if (activeChar !== i) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' } }}
          >
            <span style={{ fontSize: 20 }}>{char.emoji}</span> {char.name}
          </button>
        ))}
      </div>

      {/* Active character card */}
      <div className="character-showcase-card" style={{
        maxWidth: 1000, margin: '0 auto',
        display: 'flex', gap: 40, alignItems: 'center',
        flexWrap: 'wrap', justifyContent: 'center',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,215,0,0.1)',
        borderRadius: 20, padding: '50px 40px',
        backdropFilter: 'blur(10px)',
        animation: 'fade-in 0.4s ease-out',
      }}>
        {/* Character visual */}
        <div style={{
          width: 200, height: 200, borderRadius: '50%',
          background: `linear-gradient(135deg, ${characters[activeChar].color}22, ${characters[activeChar].color}44)`,
          border: `2px solid ${characters[activeChar].color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 80, flexShrink: 0,
          boxShadow: `0 0 60px ${characters[activeChar].color}22`,
          animation: 'float 4s ease-in-out infinite',
        }}>
          {characters[activeChar].emoji}
        </div>

        {/* Character info */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3 style={{
            fontSize: 28, fontWeight: 900, color: characters[activeChar].color,
            fontFamily: "'Cinzel', serif", marginBottom: 4,
          }}>
            {characters[activeChar].name}
          </h3>
          <p style={{
            color: 'rgba(255,215,0,0.6)', fontSize: 13, letterSpacing: 1,
            marginBottom: 16, fontFamily: "'Inter', sans-serif",
          }}>
            {characters[activeChar].title}
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7,
            marginBottom: 24, fontFamily: "'Inter', sans-serif",
          }}>
            {characters[activeChar].description}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {Object.entries(characters[activeChar].stats).map(([stat, value]) => (
              <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  color: 'rgba(255,255,255,0.5)', fontSize: 11, width: 100,
                  fontFamily: "'Inter', sans-serif", textAlign: 'right',
                }}>{stat}</span>
                <div style={{
                  flex: 1, height: 6, background: 'rgba(255,255,255,0.05)',
                  borderRadius: 3, overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${value}%`, height: '100%',
                    background: `linear-gradient(90deg, ${characters[activeChar].color}, #FFD700)`,
                    borderRadius: 3,
                    boxShadow: `0 0 10px ${characters[activeChar].color}44`,
                    transition: 'width 0.5s ease-out',
                  }} />
                </div>
                <span style={{
                  color: '#FFD700', fontSize: 11, width: 30,
                  fontFamily: "'Inter', sans-serif", fontWeight: 700,
                }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Abilities */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {characters[activeChar].abilities.map((a, i) => (
              <span key={i} style={{
                padding: '4px 12px', background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.15)', borderRadius: 20,
                color: '#FFD700', fontSize: 11, fontFamily: "'Inter', sans-serif",
              }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ===================== TEMPLE SHOWCASE =====================
function TempleShowcase() {
  const [hoveredTemple, setHoveredTemple] = useState<number | null>(null)
  const [selectedEra, setSelectedEra] = useState<string>('all')
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
        setScrollProgress(progress)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const eras = [
    { id: 'all', label: 'All Temples' },
    { id: 'ancient', label: 'Ancient (Pre-6th C)' },
    { id: 'medieval', label: 'Early Medieval' },
    { id: 'golden', label: 'Golden Age' },
  ]

  const filteredTemples = selectedEra === 'all'
    ? POWERFUL_TEMPLES
    : POWERFUL_TEMPLES.filter(t => t.era === selectedEra)

  return (
    <section id="temples" ref={sectionRef} style={{
      position: 'relative', padding: '120px 20px',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #050510 50%, #0a0a1a 100%)',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'radial-gradient(circle at 20% 50%, #FFD700 0%, transparent 50%), radial-gradient(circle at 80% 50%, #FF9933 0%, transparent 50%)',
      }} />

      {/* Section header */}
      <div style={{
        textAlign: 'center', marginBottom: 40,
        opacity: scrollProgress, transform: `translateY(${20 * (1 - scrollProgress)}px)`,
        transition: 'all 0.3s',
      }}>
        <p style={{
          color: '#FFD700', fontSize: 12, letterSpacing: 3, fontWeight: 600,
          fontFamily: "'Inter', sans-serif", marginBottom: 8,
        }}>
          SACRED LAND
        </p>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff',
          fontFamily: "'Cinzel', serif", marginBottom: 12,
        }}>
          20 Powerful <span style={{ color: '#FFD700' }}>Temples</span>
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.4)', fontSize: 14, maxWidth: 500,
          margin: '0 auto', fontFamily: "'Inter', sans-serif", lineHeight: 1.6,
        }}>
          Each temple holds a unique superpower. Seek the deity's blessing to unlock ancient strength.
        </p>
      </div>

      {/* Era filter tabs */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40,
        flexWrap: 'wrap',
      }}>
        {eras.map(era => (
          <button key={era.id} onClick={() => setSelectedEra(era.id)}
            style={{
              padding: '8px 18px',
              background: selectedEra === era.id ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
              border: selectedEra === era.id ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 20, color: selectedEra === era.id ? '#FFD700' : 'rgba(255,255,255,0.4)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", transition: 'all 0.3s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (selectedEra !== era.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' } }}
            onMouseLeave={e => { if (selectedEra !== era.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' } }}
          >
            {era.label}
          </button>
        ))}
      </div>

      {/* Temple grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20, maxWidth: 1200, margin: '0 auto',
      }}>
        {filteredTemples.map((temple, i) => {
          const superpower = getSuperpowerByTemple(temple.id)
          const isHovered = hoveredTemple === i
          return (
            <div key={temple.id}
              onMouseEnter={() => setHoveredTemple(i)}
              onMouseLeave={() => setHoveredTemple(null)}
              style={{
                position: 'relative',
                padding: '24px 20px',
                background: isHovered ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)',
                border: isHovered ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 20px 60px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.2)',
                overflow: 'hidden',
              }}
            >
              {/* Temple number */}
              <div style={{
                position: 'absolute', top: 12, right: 16,
                fontSize: 32, fontWeight: 900,
                color: 'rgba(255,215,0,0.06)',
                fontFamily: "'Cinzel', serif",
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Era badge */}
              <div style={{
                display: 'inline-block', padding: '3px 10px',
                background: 'rgba(255,215,0,0.1)', borderRadius: 12,
                color: '#FFD700', fontSize: 10, fontWeight: 600,
                fontFamily: "'Inter', sans-serif", marginBottom: 10,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {temple.era}
              </div>

              {/* Temple icon */}
              <div style={{
                fontSize: 36, marginBottom: 10,
                transition: 'transform 0.3s',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}>
                🏛️
              </div>

              {/* Temple name */}
              <h3 style={{
                fontSize: 16, fontWeight: 700, color: isHovered ? '#FFD700' : '#fff',
                fontFamily: "'Cinzel', serif", marginBottom: 4,
                transition: 'color 0.3s',
              }}>
                {temple.name}
              </h3>

              {/* Location */}
              <p style={{
                color: 'rgba(255,255,255,0.3)', fontSize: 11,
                fontFamily: "'Inter', sans-serif", marginBottom: 8,
              }}>
                {temple.location} · {temple.century}
              </p>

              {/* Description */}
              <p style={{
                color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.5,
                fontFamily: "'Inter', sans-serif", marginBottom: 12,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {temple.highlight}
              </p>

              {/* Superpower badge */}
              {superpower && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 10px',
                  background: isHovered ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)',
                  borderRadius: 8, marginTop: 'auto',
                  transition: 'all 0.3s',
                }}>
                  <span style={{ fontSize: 16 }}>{superpower.icon || '✨'}</span>
                  <span style={{
                    color: '#FFD700', fontSize: 11, fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {superpower.name}
                  </span>
                </div>
              )}

              {/* Hover detail overlay */}
              {isHovered && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '12px 20px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                  fontSize: 11, color: 'rgba(255,215,0,0.6)',
                  fontFamily: "'Inter', sans-serif",
                  fontStyle: 'italic',
                }}>
                  Click to explore this sacred site
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Scroll hint */}
      <div style={{
        textAlign: 'center', marginTop: 50,
        color: 'rgba(255,255,255,0.2)', fontSize: 12,
        fontFamily: "'Inter', sans-serif",
      }}>
        {filteredTemples.length} temples await your pilgrimage
      </div>
    </section>
  )
}

// ===================== FEATURES SECTION =====================
function FeaturesSection() {
  const features = [
    { icon: '🗺️', title: 'Open World India', desc: 'Explore 6 distinct biomes from the snowy Himalayas to the lush Kerala backwaters. Every corner of India is rendered in 3D.' },
    { icon: '🏛️', title: '20 Sacred Temples', desc: 'Visit 20 historically accurate temples. Each has a unique 3D architectural style and a deity to seek blessings from.' },
    { icon: '⚔️', title: 'Sword Combat', desc: 'Cut down trees, fight wild boars and tigers, and defend the sacred land with your royal blade.' },
    { icon: '🪵', title: 'Crafting & Building', desc: 'Gather wood and stone to build rafts for crossing rivers, treehouses for resting, and more.' },
    { icon: '✨', title: 'Temple Blessings', desc: 'Each temple grants a unique superpower — levitation, time slow, water walk, fire sword, and 16 more.' },
    { icon: '🧗', title: 'Parkour Movement', desc: 'Triple jump, wall climb, ground pound, and sprint across the landscape — Temple Run 2 style.' },
    { icon: '💎', title: 'Collectible Ornaments', desc: 'Discover 28 rare ornaments hidden across the world. Each piece of jewelry tells a story from Indian lore.' },
    { icon: '🪈', title: 'Krishna Theme', desc: 'The divine flute of Lord Krishna echoes through Brindhavan groves. Dwaraka\'s golden gates await.' },
  ]

  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <section id="features" style={{
      position: 'relative', padding: '120px 20px',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #050510 50%, #0a0a1a 100%)',
      overflow: 'hidden',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <p style={{
          color: '#FFD700', fontSize: 12, letterSpacing: 3, fontWeight: 600,
          fontFamily: "'Inter', sans-serif", marginBottom: 8,
        }}>
          GAMEPLAY
        </p>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff',
          fontFamily: "'Cinzel', serif", marginBottom: 12,
        }}>
          An Epic <span style={{ color: '#FFD700' }}>Adventure</span>
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.4)', fontSize: 14, maxWidth: 500,
          margin: '0 auto', fontFamily: "'Inter', sans-serif", lineHeight: 1.6,
        }}>
          Explore, fight, craft, pray, and discover — your sacred journey awaits.
        </p>
      </div>

      {/* Features grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 24, maxWidth: 1100, margin: '0 auto',
      }}>
        {features.map((f, i) => (
          <div key={i}
            onMouseEnter={() => setHoveredFeature(i)}
            onMouseLeave={() => setHoveredFeature(null)}
            style={{
              padding: '28px 24px',
              background: hoveredFeature === i ? 'rgba(255,215,0,0.04)' : 'rgba(255,255,255,0.02)',
              border: hoveredFeature === i ? '1px solid rgba(255,215,0,0.2)' : '1px solid rgba(255,255,255,0.05)',
              borderRadius: 16, cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: hoveredFeature === i ? 'translateY(-4px)' : 'translateY(0)',
            }}
          >
            <div style={{
              fontSize: 36, marginBottom: 16,
              transition: 'transform 0.3s',
              transform: hoveredFeature === i ? 'scale(1.1)' : 'scale(1)',
            }}>
              {f.icon}
            </div>
            <h3 style={{
              fontSize: 15, fontWeight: 700, color: hoveredFeature === i ? '#FFD700' : '#fff',
              fontFamily: "'Cinzel', serif", marginBottom: 8,
              transition: 'color 0.3s',
            }}>
              {f.title}
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif",
            }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ===================== NEWS / DOWNLOAD SECTION =====================
function NewsSection() {
  const news = [
    {
      date: 'Coming Soon',
      title: 'Version 1.0 Launch',
      excerpt: 'The full Bharat Odyssey experience with all 20 temples, complete crafting system, and endless exploration.',
      tag: 'Update',
      color: '#FFD700',
    },
    {
      date: 'Coming Soon',
      title: 'Multiplayer Pilgrimage',
      excerpt: 'Travel with friends across India in co-op mode. Visit temples together and share blessings.',
      tag: 'Feature',
      color: '#87CEEB',
    },
    {
      date: 'Coming Soon',
      title: 'Temple of the Month',
      excerpt: 'Each month we spotlight a different sacred temple with new lore, missions, and exclusive rewards.',
      tag: 'Event',
      color: '#97d163',
    },
  ]

  const [expandedNews, setExpandedNews] = useState<number | null>(null)

  return (
    <section id="news" style={{
      position: 'relative', padding: '120px 20px',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #050510 50%, #0a0a1a 100%)',
      overflow: 'hidden',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <p style={{
          color: '#FFD700', fontSize: 12, letterSpacing: 3, fontWeight: 600,
          fontFamily: "'Inter', sans-serif", marginBottom: 8,
        }}>
          LATEST NEWS
        </p>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff',
          fontFamily: "'Cinzel', serif", marginBottom: 12,
        }}>
          Journey <span style={{ color: '#FFD700' }}>Updates</span>
        </h2>
      </div>

      <div style={{
        maxWidth: 800, margin: '0 auto',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {news.map((item, i) => (
          <div key={i}
            onClick={() => setExpandedNews(expandedNews === i ? null : i)}
            style={{
              padding: '24px 28px',
              background: expandedNews === i ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.background = 'rgba(255,215,0,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = expandedNews === i ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <span style={{
                  display: 'inline-block', padding: '2px 10px',
                  background: `${item.color}22`, borderRadius: 10,
                  color: item.color, fontSize: 10, fontWeight: 700,
                  fontFamily: "'Inter', sans-serif", textTransform: 'uppercase',
                  letterSpacing: 1, marginBottom: 8,
                }}>
                  {item.tag}
                </span>
                <h3 style={{
                  fontSize: 18, fontWeight: 700, color: '#fff',
                  fontFamily: "'Cinzel', serif", marginBottom: 4,
                }}>
                  {item.title}
                </h3>
              </div>
              <span style={{
                color: 'rgba(255,255,255,0.3)', fontSize: 11,
                fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap', marginLeft: 12,
              }}>
                {item.date}
              </span>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif",
              display: expandedNews === i ? 'block' : '-webkit-box',
              WebkitLineClamp: expandedNews === i ? undefined : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {item.excerpt}
            </p>
          </div>
        ))}
      </div>

      {/* Download CTA */}
      <div id="download" style={{
        textAlign: 'center', marginTop: 80, padding: '60px 20px',
        background: 'linear-gradient(135deg, rgba(255,153,51,0.05), rgba(255,215,0,0.05))',
        border: '1px solid rgba(255,215,0,0.1)',
        borderRadius: 24, maxWidth: 700, margin: '80px auto 0',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>👑</div>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#FFD700',
          fontFamily: "'Cinzel', serif", marginBottom: 12,
        }}>
          Begin Your Sacred Journey
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 30,
          fontFamily: "'Inter', sans-serif", lineHeight: 1.6, maxWidth: 450,
          margin: '0 auto 30px',
        }}>
          Step into the world of Maharaja's Bharat Odyssey. Explore 20 sacred temples, unlock divine powers, and discover the spiritual heritage of India.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="landing-cta"
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #FF9933, #e07800)',
              border: 'none', borderRadius: 12, color: '#fff',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              boxShadow: '0 8px 30px rgba(255,153,51,0.4)',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,153,51,0.6)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,153,51,0.4)' }}
            onClick={() => {
              const s = useGameStore.getState()
              if (!s.profile) s.setPhase('profile')
              else s.setPhase('loading')
            }}
          >
            🚀 Play Now
          </button>
          <button
            style={{
              padding: '16px 36px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: 12, color: '#FFD700',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.1)'; e.currentTarget.style.borderColor = '#FFD700' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)' }}
          >
            📱 Download for Android
          </button>
        </div>
      </div>
    </section>
  )
}

// ===================== FOOTER =====================
function FooterSection() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      padding: '60px 20px 30px',
      background: '#050510',
      borderTop: '1px solid rgba(255,215,0,0.05)',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 40, marginBottom: 40,
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 24 }}>👑</span>
            <span style={{
              fontSize: 14, fontWeight: 700, color: '#FFD700',
              fontFamily: "'Cinzel', serif",
            }}>
              Bharat Odyssey
            </span>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.3)', fontSize: 12, lineHeight: 1.6,
          }}>
            An epic open-world Indian-themed 3D adventure. Explore all of India as the regal Maharaja.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 style={{ color: '#FFD700', fontSize: 12, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>GAME</h4>
          {['Home', 'Characters', 'Temples', 'Features', 'News'].map(link => (
            <div key={link} style={{
              color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 8,
              cursor: 'pointer', transition: 'color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FFD700' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
              onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
            >
              {link}
            </div>
          ))}
        </div>

        {/* Resources */}
        <div>
          <h4 style={{ color: '#FFD700', fontSize: 12, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>RESOURCES</h4>
          {['Documentation', 'Help Center', 'Privacy Policy', 'Terms of Service'].map(link => (
            <div key={link} style={{
              color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 8,
              cursor: 'pointer', transition: 'color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FFD700' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
            >
              {link}
            </div>
          ))}
        </div>

        {/* Social */}
        <div>
          <h4 style={{ color: '#FFD700', fontSize: 12, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>FOLLOW US</h4>
          <div style={{ display: 'flex', gap: 12 }}>
            {['𝕏', '▶', '📷', '💬'].map((icon, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, cursor: 'pointer',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.15)'; e.currentTarget.style.borderColor = '#FFD700' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
          © {year} Maharaja's Bharat Odyssey. All rights reserved.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>
          Made with ❤️ for the spiritual heritage of India
        </p>
      </div>
    </footer>
  )
}

// ===================== MAIN LANDING PAGE =====================
export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{
      width: '100%', minHeight: '100vh', overflow: 'visible',
      background: '#050510', position: 'relative',
    }}>
      <NavBar />
      <HeroSection />
      <CharacterShowcase />
      <TempleShowcase />
      <FeaturesSection />
      <NewsSection />
      <FooterSection />
    </div>
  )
}
