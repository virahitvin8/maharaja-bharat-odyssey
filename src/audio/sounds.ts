// Procedural audio engine using Web Audio API (no external assets needed)
import { useRef, useEffect, useCallback } from 'react'
import type { BiomeType } from '../store/gameStore'
import { useGameStore } from '../store/gameStore'

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return audioCtx
}

// Generate a simple tone
function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3) {
  if (useGameStore.getState().isMuted) return;
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

// ---- Emotional Sarod / Violin Ambient Music Generator ----
// Slow, heart-touching instrumental music using soft sine waves with vibrato
// Inspired by Indian classical raga and slow violin

type TimerId = ReturnType<typeof setInterval>

// Indian Raga-based scale (Bhairav - solemn, meditative)
const RAGA_BHAIRAV = [1, 1.067, 1.125, 1.2, 1.25, 1.333, 1.5, 1.6, 1.667, 1.8, 1.889, 2]

export function useBiomeAmbient() {
  const ambientRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; interval?: TimerId; lfo1?: OscillatorNode; lfo2?: OscillatorNode } | null>(null)

  const setBiomeAmbient = useCallback((biome: BiomeType) => {
    if (useGameStore.getState().isMuted) {
      if (ambientRef.current) {
        try {
          ambientRef.current.osc1.stop()
          ambientRef.current.osc2.stop()
          if (ambientRef.current.lfo1) ambientRef.current.lfo1.stop()
          if (ambientRef.current.lfo2) ambientRef.current.lfo2.stop()
          if (ambientRef.current.interval) clearInterval(ambientRef.current.interval)
        } catch {}
        ambientRef.current = null
      }
      return
    }
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
            if (currentRef.lfo1) currentRef.lfo1.stop()
            if (currentRef.lfo2) currentRef.lfo2.stop()
            if (currentRef.interval) clearInterval(currentRef.interval)
          } catch {}
        }, 2100)
        ambientRef.current = null
      }

      // Emotional root frequencies for different biomes (slower, deeper)
      const roots: Record<BiomeType, number> = {
        rajasthan: 110.00,   // A2 - Deep desert meditation
        himalaya: 98.00,     // G2 - Sacred mountain drone
        kerala: 130.81,      // C3 - Lush, warm nature
        deccan: 110.00,      // A2 - Ancient stone whispers
        gangetic: 146.83,    // D3 - Flowing river
        coastal: 98.00,      // G2 - Ocean waves
      }
      
      const root = roots[biome]

      // Main drone gain
      const gain = ctx.createGain()
      gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 4) // Very soft, like a distant sarod

      // Drone 1 - Deep root note (like tanpura)
      const osc1 = ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.value = root
      
      // Add slow vibrato (violin-like warmth)
      const lfo1 = ctx.createOscillator()
      lfo1.type = 'sine'
      lfo1.frequency.value = 4.5 // Slow vibrato rate
      const lfoGain1 = ctx.createGain()
      lfoGain1.gain.value = 0.3 // Frequency modulation depth
      lfo1.connect(lfoGain1)
      lfoGain1.connect(osc1.frequency)
      lfo1.start()
      
      osc1.connect(gain)
      osc1.start()

      // Drone 2 - Fifth above with slight detune for warmth
      const osc2 = ctx.createOscillator()
      osc2.type = 'sine'
      osc2.frequency.value = root * 1.5 // Perfect fifth
      
      const lfo2 = ctx.createOscillator()
      lfo2.type = 'sine'
      lfo2.frequency.value = 3.8
      const lfoGain2 = ctx.createGain()
      lfoGain2.gain.value = 0.2
      lfo2.connect(lfoGain2)
      lfoGain2.connect(osc2.frequency)
      lfo2.start()
      
      osc2.connect(gain)
      osc2.start()

      // Slow emotional Sarod-style melody
      // Notes are very sparse, slow, and expressive - like a heart-touching instrumental
      const playEmotionalNote = () => {
        if (!ambientRef.current) return
        
        // Choose random note from Raga Bhairav
        const ratio = RAGA_BHAIRAV[Math.floor(Math.random() * RAGA_BHAIRAV.length)]
        // Play in lower octave for warmth
        const octave = 1
        const freq = root * ratio * octave
        
        const melodyGain = ctx.createGain()
        melodyGain.connect(ctx.destination)
        
        const melodyOsc = ctx.createOscillator()
        melodyOsc.type = 'sine' // Pure tone like a violin
        melodyOsc.frequency.value = freq
        melodyOsc.connect(melodyGain)
        
        // Slow, emotional envelope (violin bow)
        const attack = 1.0 + Math.random() * 1.5  // Slow attack - like a violin bow starting
        const sustain = 2.0 + Math.random() * 2.0 // Long sustain
        const release = 3.0 + Math.random() * 2.0 // Slow fade out
        
        // Gentle volume
        const vol = 0.03 + Math.random() * 0.03
        
        melodyGain.gain.setValueAtTime(0.001, ctx.currentTime)
        melodyGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack)
        melodyGain.gain.setValueAtTime(vol, ctx.currentTime + attack + sustain)
        melodyGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + attack + sustain + release)
        
        // Slow vibrato on melody (violin-like)
        const melodyLfo = ctx.createOscillator()
        melodyLfo.type = 'sine'
        melodyLfo.frequency.value = 5.0 + Math.random() * 1.0
        const melodyLfoGain = ctx.createGain()
        melodyLfoGain.gain.value = 0.2
        melodyLfo.connect(melodyLfoGain)
        melodyLfoGain.connect(melodyOsc.frequency)
        melodyLfo.start()
        
        melodyOsc.start(ctx.currentTime)
        melodyOsc.stop(ctx.currentTime + attack + sustain + release + 0.1)
        
        // Stop LFO after note
        setTimeout(() => {
          try { melodyLfo.stop() } catch {}
        }, (attack + sustain + release + 0.2) * 1000)
      }

      // Play notes more slowly - every 5-8 seconds for a meditative feel
      const melodyInterval = setInterval(() => {
        if (Math.random() > 0.35) playEmotionalNote()
      }, 5000 + Math.random() * 3000)

      // Also play occasional double-stop (two notes together) for richness
      const doubleStopInterval = setInterval(() => {
        if (Math.random() > 0.6) {
          playEmotionalNote()
          setTimeout(() => {
            if (Math.random() > 0.5) playEmotionalNote()
          }, 300 + Math.random() * 500)
        }
      }, 12000)

      ambientRef.current = { osc1, osc2, gain, lfo1, lfo2, interval: melodyInterval }
      
      // Store doublestop interval separately
      (ambientRef as any).__doubleStop = doubleStopInterval
    } catch {}
  }, [])

  useEffect(() => {
    return () => {
      if (ambientRef.current) {
        try { 
          ambientRef.current.osc1.stop()
          ambientRef.current.osc2.stop()
          if (ambientRef.current.lfo1) ambientRef.current.lfo1.stop()
          if (ambientRef.current.lfo2) ambientRef.current.lfo2.stop()
          if (ambientRef.current.interval) clearInterval(ambientRef.current.interval)
          if ((ambientRef as any).__doubleStop) clearInterval((ambientRef as any).__doubleStop)
        } catch {}
      }
    }
  }, [])

  return { setBiomeAmbient }
}
