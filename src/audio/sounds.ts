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

// Life up
export function playLifeSound() {
  const notes = [523, 659, 784, 1047]
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.25, 'sine', 0.3), i * 100))
}

// Game over
export function playGameOverSound() {
  const notes = [440, 349, 294, 220]
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.4, 'triangle', 0.3), i * 150))
}

// Ambient drone per biome
const biomeAmbientNodes: { osc: OscillatorNode; gain: GainNode } | null = null

export function useBiomeAmbient() {
  const ambientRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null)

  const setBiomeAmbient = useCallback((biome: BiomeType) => {
    try {
      const ctx = getCtx()
      // Fade out old
      if (ambientRef.current) {
        ambientRef.current.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
        setTimeout(() => {
          if (ambientRef.current) {
            ambientRef.current.osc1.stop()
            ambientRef.current.osc2.stop()
          }
          ambientRef.current = null
        }, 1100)
      }

      // Biome frequencies
      const freqs: Record<BiomeType, [number, number]> = {
        rajasthan: [80, 120],   // warm deep drone
        himalaya: [55, 82],     // cold majestic
        kerala: [110, 165],     // lush gentle
        deccan: [65, 98],       // ancient stone
        gangetic: [73, 110],    // spiritual
        coastal: [96, 144],     // breezy bright
      }
      const [f1, f2] = freqs[biome]
      const gain = ctx.createGain()
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2)

      const osc1 = ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.value = f1
      osc1.connect(gain)
      osc1.start()

      const osc2 = ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.value = f2
      osc2.connect(gain)
      osc2.start()

      ambientRef.current = { osc1, osc2, gain }
    } catch {}
  }, [])

  useEffect(() => {
    return () => {
      if (ambientRef.current) {
        try { ambientRef.current.osc1.stop(); ambientRef.current.osc2.stop() } catch {}
      }
    }
  }, [])

  return { setBiomeAmbient }
}
