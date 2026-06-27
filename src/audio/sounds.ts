// Procedural audio engine using Web Audio API (no external assets needed)
import { useRef, useEffect, useCallback } from 'react'
import type { BiomeType } from '../store/gameStore'

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return audioCtx
}

// Generate a simple tone
function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = freq
    osc.type = type
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

// Coin collect sound — bright ascending chime (Indian bell-like)
export function playCoinSound() {
  playTone(880, 0.08, 'sine', 0.4)
  setTimeout(() => playTone(1320, 0.12, 'sine', 0.3), 60)
  setTimeout(() => playTone(1760, 0.15, 'sine', 0.2), 120)
}

// Gem collect — deeper resonant shimmer
export function playGemSound() {
  playTone(440, 0.1, 'sine', 0.35)
  setTimeout(() => playTone(660, 0.15, 'triangle', 0.3), 80)
  setTimeout(() => playTone(880, 0.25, 'sine', 0.2), 160)
  setTimeout(() => playTone(1100, 0.3, 'sine', 0.15), 240)
}

// Lotus collect — ethereal shimmer
export function playLotusSound() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => playTone(440 + i * 220, 0.4, 'sine', 0.15), i * 60)
  }
}

// Jump sound — ascending
export function playJumpSound() {
  playTone(300, 0.05, 'square', 0.15)
  setTimeout(() => playTone(600, 0.08, 'square', 0.12), 50)
}

// Land sound
export function playLandSound() {
  playTone(120, 0.15, 'triangle', 0.2)
}

// Attack sound — sword slash
export function playAttackSound() {
  playTone(200, 0.05, 'sawtooth', 0.25)
  setTimeout(() => playTone(100, 0.1, 'sawtooth', 0.15), 50)
}

// Life up — happy ascending chime
export function playLifeSound() {
  const notes = [523, 659, 784, 1047]
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.25, 'sine', 0.3), i * 100))
}

// Running footsteps — gentle rhythmic taps
export function playFootstepSound() {
  playTone(80, 0.05, 'triangle', 0.08)
}

// Celebration — triumphant fanfare for kids!
export function playCelebrationSound() {
  const notes = [523, 659, 784, 1047, 1319]
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.3, 'sine', 0.25), i * 80))
  setTimeout(() => playTone(1319, 0.6, 'triangle', 0.2), 400)
}

// Power-up sound — exciting boost
export function playPowerUpSound() {
  playTone(440, 0.08, 'square', 0.15)
  setTimeout(() => playTone(660, 0.08, 'square', 0.12), 60)
  setTimeout(() => playTone(880, 0.08, 'square', 0.1), 120)
  setTimeout(() => playTone(1100, 0.15, 'sine', 0.15), 180)
}

// Tutorial ding prompt
export function playTutorialSound() {
  playTone(880, 0.15, 'sine', 0.2)
  setTimeout(() => playTone(1100, 0.2, 'sine', 0.15), 150)
}

// Collect sparkle sound
export function playSparkleSound() {
  playTone(1200, 0.05, 'sine', 0.15)
  setTimeout(() => playTone(1600, 0.08, 'sine', 0.1), 40)
}

// Game over
export function playGameOverSound() {
  const notes = [440, 349, 294, 220]
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.4, 'triangle', 0.3), i * 150))
}

// Welcome jingle — play when game starts
export function playWelcomeSound() {
  const notes = [523, 659, 784, 1047, 784, 1047, 1319]
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.25, 'sine', 0.3), i * 120))
}

// Genshin-style Ambient Music Generator
type TimerId = ReturnType<typeof setInterval>

const biomeAmbientNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; interval?: TimerId } | null = null

export function useBiomeAmbient() {
  const ambientRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; interval?: TimerId } | null>(null)

  const setBiomeAmbient = useCallback((biome: BiomeType) => {
    try {
      const ctx = getCtx()
      
      // Stop previous
      if (ambientRef.current) {
        ambientRef.current.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2)
        const currentRef = ambientRef.current
        setTimeout(() => {
          try {
            currentRef.osc1.stop()
            currentRef.osc2.stop()
            if (currentRef.interval) clearInterval(currentRef.interval)
          } catch {}
        }, 2100)
        ambientRef.current = null
      }

      // Emotional chord root frequencies (A, C, D, E, G pentatonic inspired)
      const roots: Record<BiomeType, number> = {
        rajasthan: 146.83,   // D3 - Desert mysterious
        himalaya: 220.00,    // A3 - High altitude ethereal
        kerala: 164.81,      // E3 - Lush nature
        deccan: 130.81,      // C3 - Ancient stone
        gangetic: 196.00,    // G3 - Spiritual flowing
        coastal: 261.63,     // C4 - Bright ocean
      }
      
      const root = roots[biome]
      // Minor pentatonic intervals: 1, b3, 4, 5, b7
      const pentatonicRatios = [1, 1.1892, 1.3348, 1.4983, 1.7818, 2]

      const gain = ctx.createGain()
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3) // Lush pad volume

      // Pad Oscillators
      const osc1 = ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.value = root
      osc1.connect(gain)
      osc1.start()

      const osc2 = ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.value = root * 1.4983 // Perfect fifth
      osc2.connect(gain)
      osc2.start()

      // Procedural Bansuri (Flute) Melody
      const playMelodyNote = () => {
        if (!ambientRef.current) return
        
        // Random pentatonic note
        const ratio = pentatonicRatios[Math.floor(Math.random() * pentatonicRatios.length)]
        const octave = Math.random() > 0.5 ? 2 : 1 // Play in higher octaves
        const freq = root * ratio * octave
        
        const melodyGain = ctx.createGain()
        melodyGain.connect(ctx.destination)
        
        const melodyOsc = ctx.createOscillator()
        melodyOsc.type = 'sine' // Flute-like
        melodyOsc.frequency.value = freq
        melodyOsc.connect(melodyGain)
        
        // Expressive ADSR envelope (Genshin style slow attack, long release)
        const attack = 0.5 + Math.random() * 0.5
        const release = 2.0 + Math.random() * 2.0
        
        melodyGain.gain.setValueAtTime(0.001, ctx.currentTime)
        melodyGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + attack)
        melodyGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + attack + release)
        
        melodyOsc.start(ctx.currentTime)
        melodyOsc.stop(ctx.currentTime + attack + release + 0.1)
      }

      // Play notes intermittently to create sparse, beautiful texture
      const interval = setInterval(() => {
        if (Math.random() > 0.4) playMelodyNote()
      }, 3000)

      ambientRef.current = { osc1, osc2, gain, interval }
    } catch {}
  }, [])

  useEffect(() => {
    return () => {
      if (ambientRef.current) {
        try { 
          ambientRef.current.osc1.stop()
          ambientRef.current.osc2.stop()
          if (ambientRef.current.interval) clearInterval(ambientRef.current.interval)
        } catch {}
      }
    }
  }, [])

  return { setBiomeAmbient }
}
