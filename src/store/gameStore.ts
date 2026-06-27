// Zustand game state store — complete game state with accounts, superpowers, ornaments
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Superpower } from '../data/superpowers'
import type { Ornament } from '../data/ornaments'
import type { Mission, MissionProgress } from '../data/missions'

export type BiomeType = 'rajasthan' | 'himalaya' | 'kerala' | 'deccan' | 'gangetic' | 'coastal'

export interface Collectible {
  id: string
  type: 'coin' | 'gem_ruby' | 'gem_diamond' | 'gem_emerald' | 'gem_sapphire' | 'lotus' | 'diya' | 'mango' | 'coconut'
  position: [number, number, number]
  collected: boolean
}

export interface Landmark {
  id: string
  name: string
  description: string
  position: [number, number, number]
  biome: BiomeType
  discovered: boolean
}

export interface Inventory {
  wood: number
  stone: number
  food: number
  ornaments: number
}

export interface PlayerProfile {
  name: string
  age: number
}

export interface GameState {
  // Core game flow
  phase: 'profile' | 'loading' | 'start' | 'map' | 'playing' | 'paused' | 'gameover'
  loadingProgress: number

  // Player Profile & Progress
  profile: PlayerProfile | null
  blessings: string[]
  
  // Survival Mechanics
  health: number
  maxHealth: number
  stamina: number
  maxStamina: number
  inventory: Inventory
  equippedWeapon: string | null

  // World Interaction
  playerPos: [number, number, number]
  isAttacking: boolean

  // Player stats
  lives: number
  coins: number
  gems: { ruby: number; diamond: number; emerald: number; sapphire: number }
  lotus: number
  score: number

  // World state
  currentBiome: BiomeType
  discoveredBiomes: BiomeType[]
  currentCity: string
  landmarks: Landmark[]
  collectibles: Collectible[]
  timeOfDay: number // 0–24
  weather: 'clear' | 'rain' | 'sandstorm' | 'snow' | 'fog'

  // Notifications
  notification: { message: string; type: 'collect' | 'landmark' | 'life' | 'region' | 'blessing' | 'mission' | 'ornament' | 'superpower' } | null

  // Actions
  setPhase: (phase: GameState['phase']) => void
  setLoadingProgress: (p: number) => void
  setCity: (cityId: string) => void
  
  // Survival Actions
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  consumeStamina: (amount: number) => boolean
  restoreStamina: (amount: number) => void
  addItem: (item: keyof Inventory, amount: number) => void
  removeItem: (item: keyof Inventory, amount: number) => boolean
  equipWeapon: (weapon: string | null) => void
  
  setPlayerPos: (pos: [number, number, number]) => void
  setIsAttacking: (attacking: boolean) => void

  setProfile: (profile: PlayerProfile) => void
  addBlessing: (blessing: string) => void

  setStamina: (s: number | ((prev: number) => number)) => void
  addLife: () => void
  loseLife: () => void
  addCoins: (n: number) => void
  addGem: (type: keyof GameState['gems']) => void
  addLotus: () => void
  collectItem: (id: string) => void
  setBiome: (biome: BiomeType) => void
  discoverLandmark: (id: string) => void
  setTimeOfDay: (t: number) => void
  setWeather: (w: GameState['weather']) => void
  showNotification: (msg: string, type: GameState['notification']['type']) => void
  clearNotification: () => void
  addScore: (n: number) => void
}

const INITIAL_COLLECTIBLES: Collectible[] = [
  // Rajasthan coins
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `coin_raj_${i}`,
    type: 'coin' as const,
    position: [Math.sin(i * 0.8) * 18, 1, Math.cos(i * 0.8) * 18 - 80] as [number, number, number],
    collected: false,
  })),
  // Gems
  { id: 'diamond_1', type: 'gem_diamond', position: [5, 2, -60], collected: false },
  { id: 'ruby_1',    type: 'gem_ruby',    position: [-8, 2, -55], collected: false },
  { id: 'emerald_1', type: 'gem_emerald', position: [12, 2, -90], collected: false },
  { id: 'sapphire_1',type: 'gem_sapphire',position: [-5, 2, -100], collected: false },
  // Himalaya coins
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `coin_him_${i}`,
    type: 'coin' as const,
    position: [Math.sin(i * 1.1) * 15, 8 + i * 0.5, Math.cos(i * 1.1) * 10 + 80] as [number, number, number],
    collected: false,
  })),
  { id: 'sapphire_2', type: 'gem_sapphire', position: [0, 15, 95], collected: false },
  // Kerala lotus
  { id: 'lotus_1', type: 'lotus', position: [20, 0.3, 150], collected: false },
  { id: 'lotus_2', type: 'lotus', position: [-15, 0.3, 160], collected: false },
  { id: 'lotus_3', type: 'lotus', position: [5, 0.3, 170], collected: false },
  // Coins coastal
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `coin_coast_${i}`,
    type: 'coin' as const,
    position: [30 + i * 3, 1, i * 5] as [number, number, number],
    collected: false,
  })),
  // Diyas
  { id: 'diya_1', type: 'diya', position: [0, 1, 0], collected: false },
  { id: 'diya_2', type: 'diya', position: [3, 1, 2], collected: false },
  // Mangoes on trees
  { id: 'mango_1', type: 'mango', position: [15, 5, 25], collected: false },
  { id: 'mango_2', type: 'mango', position: [18, 6, 20], collected: false },
  // Coconuts
  { id: 'coconut_1', type: 'coconut', position: [40, 7, 30], collected: false },
  { id: 'coconut_2', type: 'coconut', position: [44, 8, 28], collected: false },
  // Deccan gems
  { id: 'diamond_2', type: 'gem_diamond', position: [-10, 2, 40], collected: false },
  { id: 'ruby_2',    type: 'gem_ruby',    position: [8,  2, 45],  collected: false },
]

const INITIAL_LANDMARKS: Landmark[] = [
  { id: 'taj_mahal',     name: 'Taj Mahal',          description: 'A white marble mausoleum built by Emperor Shah Jahan.',   position: [0, 0, -70],   biome: 'gangetic',  discovered: false },
  { id: 'mehrangarh',   name: 'Mehrangarh Fort',     description: 'Majestic fort overlooking the Blue City of Jodhpur.',      position: [-20, 10, -85], biome: 'rajasthan', discovered: false },
  { id: 'red_fort',     name: 'Red Fort',             description: 'Historic Mughal fortification in Delhi.',                  position: [15, 0, -60],  biome: 'gangetic',  discovered: false },
  { id: 'konark',       name: 'Konark Sun Temple',    description: 'Magnificent 13th-century temple shaped like a chariot.',   position: [35, 0, 50],   biome: 'coastal',   discovered: false },
  { id: 'himalaya_peak',name: 'Himalayan Peaks',      description: 'The majestic roof of the world, home to the snow gods.',   position: [0, 25, 100],  biome: 'himalaya',  discovered: false },
  { id: 'backwaters',   name: 'Kerala Backwaters',    description: 'Serene network of lagoons, lakes, and canals.',            position: [10, 0, 155],  biome: 'kerala',    discovered: false },
  { id: 'hampi',        name: 'Hampi Ruins',          description: 'Ancient ruins of the Vijayanagara Empire.',               position: [-30, 0, 30],  biome: 'deccan',    discovered: false },
  { id: 'india_gate',   name: 'India Gate',           description: 'War memorial archway at the heart of New Delhi.',          position: [5, 0, -65],   biome: 'gangetic',  discovered: false },
  { id: 'ajanta',       name: 'Ajanta Caves',         description: 'Ancient Buddhist rock-cut cave monuments.',               position: [-15, 5, 20],  biome: 'deccan',    discovered: false },
]

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'loading',
      loadingProgress: 0,
      
      profile: null,
      blessings: [],
      
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      inventory: { wood: 0, stone: 0, food: 0, ornaments: 0 },
      equippedWeapon: null,
      playerPos: [0, 0, 0],
      isAttacking: false,
      lives: 3,
  coins: 0,
  gems: { ruby: 0, diamond: 0, emerald: 0, sapphire: 0 },
  lotus: 0,
  score: 0,
  currentBiome: 'gangetic',
  discoveredBiomes: ['gangetic'],
  currentCity: 'kashi',
  landmarks: INITIAL_LANDMARKS,
  collectibles: INITIAL_COLLECTIBLES,
  timeOfDay: 10,
  weather: 'clear',
  notification: null,

  setPhase: (phase) => set({ phase }),
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  setCity: (currentCity) => set({ currentCity }),

  // Survival Implementations
  takeDamage: (amount) => set(s => ({ health: Math.max(0, s.health - amount) })),
  heal: (amount) => set(s => ({ health: Math.min(s.maxHealth, s.health + amount) })),
  consumeStamina: (amount) => {
    const s = get()
    if (s.stamina >= amount) {
      set({ stamina: s.stamina - amount })
      return true
    }
    return false
  },
  restoreStamina: (amount) => set(s => ({ stamina: Math.min(s.maxStamina, s.stamina + amount) })),
  addItem: (item, amount) => set(s => ({
    inventory: { ...s.inventory, [item]: s.inventory[item] + amount }
  })),
  removeItem: (item, amount) => {
    const s = get()
    if (s.inventory[item] >= amount) {
      set({ inventory: { ...s.inventory, [item]: s.inventory[item] - amount } })
      return true
    }
    return false
  },
  equipWeapon: (weapon) => set({ equippedWeapon: weapon }),
  setPlayerPos: (pos) => set({ playerPos: pos }),
  setIsAttacking: (attacking) => set({ isAttacking: attacking }),


  setStamina: (s) =>
    set((state) => ({
      stamina: typeof s === 'function' ? Math.max(0, Math.min(state.maxStamina, s(state.stamina))) : Math.max(0, Math.min(state.maxStamina, s)),
    })),

  addLife: () => set((s) => ({ lives: Math.min(s.lives + 1, 9) })),
  loseLife: () =>
    set((s) => {
      const lives = s.lives - 1
      return { lives, phase: lives <= 0 ? 'gameover' : s.phase }
    }),

  addCoins: (n) => set((s) => ({ coins: s.coins + n, score: s.score + n * 10 })),
  addGem: (type) =>
    set((s) => ({
      gems: { ...s.gems, [type]: s.gems[type] + 1 },
      score: s.score + 500,
    })),
  addLotus: () => set((s) => ({ lotus: s.lotus + 1, score: s.score + 1000 })),

  collectItem: (id) =>
    set((s) => ({
      collectibles: s.collectibles.map((c) => (c.id === id ? { ...c, collected: true } : c)),
    })),

  setBiome: (biome) =>
    set((s) => ({
      currentBiome: biome,
      discoveredBiomes: s.discoveredBiomes.includes(biome) ? s.discoveredBiomes : [...s.discoveredBiomes, biome],
    })),

  discoverLandmark: (id) =>
    set((s) => ({
      landmarks: s.landmarks.map((l) => (l.id === id ? { ...l, discovered: true } : l)),
      score: s.score + 2000,
    })),

  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  setWeather: (weather) => set({ weather }),
  showNotification: (msg, type) =>
    set({ notification: { message: msg, type } }),
  clearNotification: () => set({ notification: null }),
  addScore: (n) => set((s) => ({ score: s.score + n })),
  
  setProfile: (profile) => set({ profile, phase: 'start' }),
  addBlessing: (blessing) => set(s => ({
    blessings: s.blessings.includes(blessing) ? s.blessings : [...s.blessings, blessing]
  })),
    }),
    {
      name: 'maharaja-game-storage',
      partialize: (state) => ({ 
        profile: state.profile, 
        blessings: state.blessings, 
        inventory: state.inventory,
        gems: state.gems,
        coins: state.coins,
        score: state.score,
        health: state.health,
        maxHealth: state.maxHealth,
        stamina: state.stamina,
        maxStamina: state.maxStamina
      }),
    }
  )
)
