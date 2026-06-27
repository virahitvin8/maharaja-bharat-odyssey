import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  MountainIcon, TempleIcon, LightningIcon, ClimberIcon, WoodIcon, LotusIcon,
  CoinIcon, GemIcon, StarIcon, CrownIcon, CompassIcon, PlayIcon, ArrowRightIcon,
  MapIcon, SwordIcon, HeartIcon
} from './Icons'
import './landing.css'

const BASE = import.meta.env.BASE_URL

interface LandingPageProps {
  onPlay?: () => void
}

const NAV_ITEMS = ['HOME', 'NEWS', 'FEATURES', 'DOWNLOAD']

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 1.5)
}

export default function LandingPage({ onPlay }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15], { ease: easeOut })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0], { ease: easeOut })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100], { ease: easeOut })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [newsVisible, setNewsVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [screenshotsVisible, setScreenshotsVisible] = useState(false)
  const [downloadVisible, setDownloadVisible] = useState(false)
  const newsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const screenshotsRef = useRef<HTMLDivElement>(null)
  const downloadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === newsRef.current && entry.isIntersecting) setNewsVisible(true)
          if (entry.target === featuresRef.current && entry.isIntersecting) setFeaturesVisible(true)
          if (entry.target === screenshotsRef.current && entry.isIntersecting) setScreenshotsVisible(true)
          if (entry.target === downloadRef.current && entry.isIntersecting) setDownloadVisible(true)
        })
      },
      { threshold: 0.1 }
    )
    if (newsRef.current) observer.observe(newsRef.current)
    if (featuresRef.current) observer.observe(featuresRef.current)
    if (screenshotsRef.current) observer.observe(screenshotsRef.current)
    if (downloadRef.current) observer.observe(downloadRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }, [])

  const apkUrl = `${BASE}MaharajasBharatOdyssey-v1.0.apk`

  return (
    <div className="lp-wrapper">
      {/* ─── NAVBAR ─── */}
      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <img src={`${BASE}logo.png`} alt="Bharat Odyssey" className="lp-nav-logo" />
          <span>BHARAT ODYSSEY</span>
        </div>
        <div className="lp-nav-links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className="lp-nav-link"
              onClick={() => scrollTo(item.toLowerCase())}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="lp-nav-actions">
          <button className="lp-btn lp-btn-primary" onClick={onPlay}>
            PLAY
          </button>
          <button className="lp-mobile-toggle" onClick={() => setMobileOpen(v => !v)} style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, color: '#fff', fontSize: 20, lineHeight: 1,
          }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0,
          background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(16px)',
          padding: 16, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 4,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }} className="lp-mobile-menu">
          {NAV_ITEMS.map((item) => (
            <button key={item} className="lp-nav-link" onClick={() => scrollTo(item.toLowerCase())}
              style={{ padding: '12px 0', fontSize: 13 }}
            >
              {item}
            </button>
          ))}
          <button className="lp-btn lp-btn-primary" onClick={onPlay} style={{ marginTop: 8 }}>
            PLAY
          </button>
        </div>
      )}

      {/* ─── HERO (Genshin-style full-screen cinematic) ─── */}
      <section id="home" ref={heroRef} className="lp-hero">
        <motion.div
          className="lp-hero-bg"
          style={{
            backgroundImage: `url(${BASE}hero_bg.png)`,
            scale: heroScale,
          }}
        />
        <div className="lp-hero-overlay" />
        <motion.div
          className="lp-hero-content"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.p
            className="lp-hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            NOW AVAILABLE ON WEB & ANDROID
          </motion.p>
          <motion.h1
            className="lp-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Step Into<br />the Myth
          </motion.h1>
          <motion.p
            className="lp-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            An open-world action-RPG set across the temples, forests, and mountains of ancient India.
            Master parkour, collect divine blessings, and forge your own path.
          </motion.p>
          <motion.div
            className="lp-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button className="lp-btn lp-btn-gold lp-btn-large" onClick={onPlay}>
              <PlayIcon size={18} color="#000" />
              Play Now — Free
            </button>
            <a href={apkUrl} download style={{ textDecoration: 'none' }}>
              <button className="lp-btn lp-btn-outline lp-btn-large">
                <ArrowRightIcon size={16} color="rgba(255,255,255,0.7)" />
                Download APK
              </button>
            </a>
          </motion.div>
        </motion.div>
        <div className="lp-scroll">
          <span className="lp-scroll-label">Scroll</span>
          <div className="lp-scroll-line" />
        </div>
      </section>

      {/* ─── NEWS (Genshin-style cards with images) ─── */}
      <section id="news" className="lp-section" ref={newsRef}>
        <motion.div
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={newsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="lp-section-eyebrow">Updates</p>
          <h2 className="lp-section-title">Latest News</h2>
        </motion.div>
        <div className="lp-news-grid">
          {[
            {
              tag: 'Update',
              title: 'Version 2.0 — The Golden City of Dwarka',
              excerpt: 'Dive into the submerged ruins of Dwarka. New underwater temples, Krishna-themed blessings, and a boss encounter.',
              img: `${BASE}images/hero_temple.png`,
            },
            {
              tag: 'Event',
              title: 'Flute of Vrindavan — Limited Time Event',
              excerpt: 'A month-long festival event. Earn the Flute Charm ornament, unlock Krishna-themed superpowers, and explore Brindhavan groves.',
              img: `${BASE}images/hampi_ruins.png`,
            },
            {
              tag: 'Release',
              title: 'Android APK Now Available',
              excerpt: 'The full game runs on Android via Capacitor. Download the APK and install on any device running Android 6+.',
              img: `${BASE}hero_bg.png`,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="lp-news-card"
              initial={{ opacity: 0, y: 20 }}
              animate={newsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <div className="lp-news-card-image-wrap">
                <img src={item.img} alt={item.title} className="lp-news-card-image" />
              </div>
              <div className="lp-news-card-body">
                <span className="lp-news-card-tag">{item.tag}</span>
                <h3 className="lp-news-card-title">{item.title}</h3>
                <p className="lp-news-card-excerpt">{item.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES (Genshin-style with SVG icons) ─── */}
      <section id="features" className="lp-section" ref={featuresRef}>
        <motion.div
          className="lp-section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={featuresVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="lp-section-eyebrow">What's Inside</p>
          <h2 className="lp-section-title">Features</h2>
          <p className="lp-section-desc">
            A spiritual action-adventure built from the ground up with Three.js, Rapier physics, and React.
          </p>
        </motion.div>
        <div className="lp-features-grid">
          {[
            { icon: <MountainIcon size={22} color="#e2d5a3" />, title: 'Open World', desc: 'Six biomes spanning India — from the snowy Himalayas to the Kerala backwaters. Every region has unique architecture, wildlife, and secrets.' },
            { icon: <TempleIcon size={22} color="#e2d5a3" />, title: '20 Temples', desc: 'Each temple is a hand-crafted 3D model with a unique deity, superpower blessing, and ornament reward. Seek all 20.' },
            { icon: <LightningIcon size={22} color="#e2d5a3" />, title: 'Blessings & Superpowers', desc: 'Every temple grants a permanent blessing — time slow, water walk, fire sword, levitation, quad jump, and more.' },
            { icon: <ClimberIcon size={22} color="#e2d5a3" />, title: 'Parkour Movement', desc: 'Triple jump, wall climb, ground pound, sprint, and swing your sword. Fluid movement inspired by 3D platformers.' },
            { icon: <WoodIcon size={22} color="#e2d5a3" />, title: 'Crafting & Survival', desc: 'Cut trees for wood, gather stone, build rafts to cross rivers, construct treehouses to heal. Manage stamina and health.' },
            { icon: <LotusIcon size={22} color="#e2d5a3" />, title: 'Krishna & Brindhavan', desc: 'The flute of Krishna echoes through sacred groves. Discover Dwaraka gates, lotus ponds, and hidden lore.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="lp-feature-card"
              initial={{ opacity: 0, y: 16 }}
              animate={featuresVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 * i }}
            >
              <div className="lp-feature-icon">{f.icon}</div>
              <h3 className="lp-feature-title">{f.title}</h3>
              <p className="lp-feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SCREENSHOTS GALLERY ─── */}
      <section className="lp-screenshots" ref={screenshotsRef}>
        <motion.div
          className="lp-screenshots-header"
          initial={{ opacity: 0, y: 30 }}
          animate={screenshotsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="lp-section-eyebrow">Gallery</p>
          <h2 className="lp-section-title">Game Screenshots</h2>
        </motion.div>
        <div className="lp-screenshots-grid">
          {[
            { src: `${BASE}hero_bg.png`, label: 'Explore Ancient India' },
            { src: `${BASE}images/hero_temple.png`, label: 'Temple Sanctums' },
            { src: `${BASE}images/hampi_ruins.png`, label: 'Historical Ruins' },
            { src: `${BASE}hero_bg.png`, label: 'Open World Biomes' },
            { src: `${BASE}images/hero_temple.png`, label: 'Divine Blessings' },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="lp-screenshot-card"
              initial={{ opacity: 0, y: 20 }}
              animate={screenshotsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
            >
              <img src={s.src} alt={s.label} />
              <div className="lp-screenshot-overlay">
                <span className="lp-screenshot-label">{s.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── DOWNLOAD ─── */}
      <section id="download" className="lp-download-section" ref={downloadRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={downloadVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="lp-download-title">Ready to Explore?</h2>
          <p className="lp-download-desc">
            The full game runs in your browser — no download required for desktop.
            Android users can install the native APK for the best experience.
          </p>
          <div className="lp-download-actions">
            <button className="lp-btn lp-btn-gold lp-btn-large" onClick={onPlay}>
              <PlayIcon size={18} color="#000" />
              Play in Browser
            </button>
            <a href={apkUrl} download style={{ textDecoration: 'none' }}>
              <button className="lp-btn lp-btn-outline lp-btn-large">
                <ArrowRightIcon size={16} color="rgba(255,255,255,0.7)" />
                Download APK
              </button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="lp-footer">
        <div className="lp-footer-links">
          <a href="https://github.com/virahitvin8/maharaja-bharat-odyssey" target="_blank" rel="noreferrer" className="lp-footer-link">GitHub</a>
          <a href="#" className="lp-footer-link">Privacy</a>
          <a href="#" className="lp-footer-link">Terms</a>
          <a href="#" className="lp-footer-link">Contact</a>
        </div>
        <img src={`${BASE}logo.png`} alt="Bharat Odyssey" className="lp-footer-logo" />
        <p className="lp-footer-text">
          Maharaja's Bharat Odyssey is a passion project. All game content is fictional.
          © 2026 Akshit Vinay. Built with Three.js, React, and Capacitor.
        </p>
      </footer>
    </div>
  )
}
