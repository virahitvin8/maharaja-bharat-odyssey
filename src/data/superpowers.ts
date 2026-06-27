// Superpowers & Blessings — each temple grants a unique divine power
// These boost the Maharaja character's abilities

export interface Superpower {
  id: string
  name: string
  templeId: string
  emoji: string
  description: string
  flavor: string // Flavor text when blessing is received
  // Stat boosts
  effect: 'speed_boost' | 'jump_boost' | 'health_regen' | 'stamina_regen' | 'double_jump' | 'water_walk' | 'strength' | 'shield' | 'levitation' | 'fire_sword' | 'invisibility' | 'magnet' | 'glide' | 'teleport' | 'time_slow' | 'stone_skin' | 'light_mastery' | 'dash' | 'healing_aura' | 'wisdom'
  boostValue: number
  durationMs: number // 0 = permanent
  maxLevel: number
}

// All 20 temple blessings — one unique power per temple
export const SUPERPOWERS: Superpower[] = [
  {
    id: 'sp_tirumala',
    name: 'Venkateswara\'s Abundance',
    templeId: 'tirumala_venkateswara',
    emoji: '🪙',
    description: 'Coins appear around you — double coin magnet radius and value',
    flavor: '✨ Lord Venkateswara showers you with divine abundance! Your coins attract from afar...',
    effect: 'magnet',
    boostValue: 2.0,
    durationMs: 0, // permanent
    maxLevel: 5,
  },
  {
    id: 'sp_mundeshwari',
    name: 'Shakti\'s Ancient Shield',
    templeId: 'mundeshwari_devi',
    emoji: '🛡️',
    description: 'Ancient Shakti energy forms a protective barrier — reduces damage by 50%',
    flavor: '🌀 Devi Mundeshwari wraps you in her primordial energy. You feel invincible...',
    effect: 'shield',
    boostValue: 0.5,
    durationMs: 0,
    maxLevel: 3,
  },
  {
    id: 'sp_sanchi',
    name: 'Dharma\'s Gate',
    templeId: 'sanchi_temple_17',
    emoji: '🚪',
    description: 'Teleport to any visited temple instantly, 5-minute cooldown',
    flavor: '🌄 The Gupta gatekeepers grant you the power to step between sacred spaces...',
    effect: 'teleport',
    boostValue: 1.0,
    durationMs: 300_000, // 5 min cooldown
    maxLevel: 1,
  },
  {
    id: 'sp_bhitargaon',
    name: 'Brick of Eternity',
    templeId: 'bhitargaon_temple',
    emoji: '🧱',
    description: 'Stone skin — take no damage from falls, break through weak walls',
    flavor: '💎 The oldest brick temple grants you the durability of the earth itself...',
    effect: 'stone_skin',
    boostValue: 1.0,
    durationMs: 120_000, // 2 min
    maxLevel: 3,
  },
  {
    id: 'sp_deogarh',
    name: 'Vishnu\'s Cosmic Dash',
    templeId: 'dashavatara_deogarh',
    emoji: '💨',
    description: 'Dash through the air at 3x speed for 5 seconds. Recharge: 10 seconds',
    flavor: '🌌 Dashavatara awakens the cosmic wind within you! You become a streak of light...',
    effect: 'dash',
    boostValue: 3.0,
    durationMs: 5_000,
    maxLevel: 5,
  },
  {
    id: 'sp_badami',
    name: 'Chalukya\'s Stone Step',
    templeId: 'badami_caves',
    emoji: '⛰️',
    description: 'Wall-climb ability — walk up cliff faces for 30 seconds',
    flavor: '⛏️ The cave temples teach you to walk on stone itself. The cliffs bow to you...',
    effect: 'levitation',
    boostValue: 1.0,
    durationMs: 30_000,
    maxLevel: 3,
  },
  {
    id: 'sp_aihole',
    name: 'Apsara\'s Glide',
    templeId: 'durga_aihole',
    emoji: '🕊️',
    description: 'Slow fall glide from heights — hold Space to float down gracefully',
    flavor: '🪽 The celestial apsaras bless you with feathered flight. You drift like a petal...',
    effect: 'glide',
    boostValue: 0.3,
    durationMs: 0,
    maxLevel: 2,
  },
  {
    id: 'sp_mahabalipuram',
    name: 'Ocean\'s Blessing',
    templeId: 'shore_mahabalipuram',
    emoji: '🌊',
    description: 'Walk on water! Cross rivers and oceans freely for 60 seconds',
    flavor: '🌊 The Shore Temple connects you to the ocean. The waves support your feet...',
    effect: 'water_walk',
    boostValue: 1.0,
    durationMs: 60_000,
    maxLevel: 3,
  },
  {
    id: 'sp_kailasa',
    name: 'Kailasa\'s Levitation',
    templeId: 'kailasa_ellora',
    emoji: '🪷',
    description: 'Float and hover 10 feet above ground for 45 seconds — reach any height',
    flavor: '🪷 Mount Kailash itself lifts you. You float like the gods above the world...',
    effect: 'levitation',
    boostValue: 1.0,
    durationMs: 45_000,
    maxLevel: 4,
  },
  {
    id: 'sp_virupaksha',
    name: 'Queen\'s Vigor',
    templeId: 'virupaksha_pattadakal',
    emoji: '⚔️',
    description: 'Double stamina regeneration and attack damage for 2 minutes',
    flavor: '👑 Queen Lokamahadevi\'s royal vigor flows through you! You feel unstoppable...',
    effect: 'strength',
    boostValue: 2.0,
    durationMs: 120_000,
    maxLevel: 5,
  },
  {
    id: 'sp_kumbeswarar',
    name: 'Kumbha\'s Rebirth',
    templeId: 'adi_kumbeswarar',
    emoji: '💧',
    description: 'Full health + stamina heal instantly. Once per temple visit',
    flavor: '🫗 The celestial nectar of the Kumbha fills you. Your wounds vanish...',
    effect: 'healing_aura',
    boostValue: 1.0,
    durationMs: 0,
    maxLevel: 1,
  },
  {
    id: 'sp_lingaraja',
    name: 'Tower of Strength',
    templeId: 'lingaraja_bhubaneswar',
    emoji: '🗼',
    description: 'Permanent +50% health and +50% max health',
    flavor: '🏛️ The great deul of Lingaraja blesses you with its height. Your life force expands...',
    effect: 'health_regen',
    boostValue: 0.5,
    durationMs: 0,
    maxLevel: 5,
  },
  {
    id: 'sp_brihadeeswarar',
    name: 'Raja Raja\'s Colossus',
    templeId: 'brihadeeswarar_thanjavur',
    emoji: '🏛️',
    description: 'Grow 2x taller! Longer reach, faster movement, immune to stuns',
    flavor: '🏛️ Raja Raja Chola\'s vision towers within you. You command the skyline...',
    effect: 'strength',
    boostValue: 3.0,
    durationMs: 90_000,
    maxLevel: 3,
  },
  {
    id: 'sp_kandariya',
    name: '84 Spires of Agility',
    templeId: 'kandariya_khajuraho',
    emoji: '🗼',
    description: 'Triple jump becomes QUAD jump! Reach impossible heights',
    flavor: '🗼 The 84 spires of Khajuraho lift your spirit. You defy gravity itself...',
    effect: 'double_jump',
    boostValue: 2.0,
    durationMs: 0,
    maxLevel: 2,
  },
  {
    id: 'sp_modhera',
    name: 'Surya\'s Radiance',
    templeId: 'sun_modhera',
    emoji: '☀️',
    description: 'Blinding flash that stuns nearby animals and reveals hidden ornaments',
    flavor: '☀️ The Sun\'s rays pierce through darkness! Hidden treasures reveal themselves...',
    effect: 'light_mastery',
    boostValue: 1.0,
    durationMs: 30_000,
    maxLevel: 3,
  },
  {
    id: 'sp_jagannath',
    name: 'Rath Yatra Speed',
    templeId: 'jagannath_puri',
    emoji: '🚩',
    description: '4x movement speed, knock through obstacles, damage enemies on contact — 45 seconds',
    flavor: '🚩 The chariot of Jagannath carries you! Nothing can stand in your way...',
    effect: 'speed_boost',
    boostValue: 4.0,
    durationMs: 45_000,
    maxLevel: 5,
  },
  {
    id: 'sp_airavatesvara',
    name: 'Musical Harmony',
    templeId: 'airavatesvara_darasuram',
    emoji: '🎵',
    description: 'Slow time by 50% for 8 seconds — dodge everything, perfect jumps',
    flavor: '🎵 The musical pillars play a divine raga. The world slows to your rhythm...',
    effect: 'time_slow',
    boostValue: 0.5,
    durationMs: 8_000,
    maxLevel: 3,
  },
  {
    id: 'sp_hoysaleswara',
    name: 'Star of Halebidu',
    templeId: 'hoysaleswara_halebidu',
    emoji: '⭐',
    description: 'Become invisible and pass through enemies for 15 seconds',
    flavor: '🌟 The star platform of Halebidu shrouds you in celestial light. You fade from sight...',
    effect: 'invisibility',
    boostValue: 1.0,
    durationMs: 15_000,
    maxLevel: 2,
  },
  {
    id: 'sp_konark',
    name: 'Sun Chariot Fire',
    templeId: 'konark_sun',
    emoji: '🔆',
    description: 'Your sword burns with solar fire! 3x damage, fiery explosions on hit',
    flavor: '🔥 The Sun God\'s chariot ignites your blade! The fire of a thousand suns burns within!',
    effect: 'fire_sword',
    boostValue: 3.0,
    durationMs: 60_000,
    maxLevel: 5,
  },
  {
    id: 'sp_ramappa',
    name: 'Floating Step',
    templeId: 'ramappa_palampet',
    emoji: '🪶',
    description: 'Feather-light footsteps — run on leaves, no sound, leave no tracks for 30 seconds',
    flavor: '🪶 The floating bricks of Ramappa teach you lightness itself. You walk on air...',
    effect: 'glide',
    boostValue: 0.5,
    durationMs: 30_000,
    maxLevel: 3,
  },
]

// Get superpower by temple ID
export function getSuperpowerByTemple(templeId: string): Superpower | undefined {
  return SUPERPOWERS.find(sp => sp.templeId === templeId)
}

// Get superpower by ID
export function getSuperpower(id: string): Superpower | undefined {
  return SUPERPOWERS.find(sp => sp.id === id)
}

// Get temple-specific blessing flavor text for the darshan ceremony
export function getBlessingCeremony(superpower: Superpower): string {
  return `${superpower.flavor}`
}
