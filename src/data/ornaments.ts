// Ornament Collection System — findable treasures across all temples and regions
// Each ornament is unique, persistent to user account, and displayed on the character

export interface Ornament {
  id: string
  name: string
  emoji: string
  description: string
  templeId?: string // Which temple rewards this (optional — some are hidden in the world)
  region?: string // Which region to find it in
  type: 'crown' | 'necklace' | 'ring' | 'anklet' | 'armlet' | 'earring' | 'waistband' | 'tiara' | 'amulet' | 'brooch'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  // Visual effect on character
  color: string
  glowColor: string
  // Stat bonus when equipped
  statBonus: {
    health?: number
    stamina?: number
    speed?: number
    jump?: number
    defense?: number
    coinMultiplier?: number
  }
  lore: string // Historical/cultural context
}

// All ornaments in the game
export const ORNAMENTS: Ornament[] = [
  // ===== TEMPLE REWARDS (Legendary/Epic) =====
  {
    id: 'ornament_tirumala_crown',
    name: 'Venkateswara\'s Crown',
    emoji: '👑',
    description: 'A golden crown blessed by Lord Venkateswara himself',
    templeId: 'tirumala_venkateswara',
    type: 'crown',
    rarity: 'legendary',
    color: '#FFD700',
    glowColor: '#FFD700',
    statBonus: { coinMultiplier: 2.0, health: 20 },
    lore: 'In Tirumala, the crown of Venkateswara is said to contain the wealth of all seven hills. Wearing it attracts prosperity.',
  },
  {
    id: 'ornament_mundeshwari_shield',
    name: 'Shakti Shield Amulet',
    emoji: '🛡️',
    description: 'An ancient amulet from the oldest functional temple in the world',
    templeId: 'mundeshwari_devi',
    type: 'amulet',
    rarity: 'legendary',
    color: '#8B0000',
    glowColor: '#FF4444',
    statBonus: { defense: 0.3, health: 30 },
    lore: 'The Mundeshwari Devi temple has protected devotees since 108 CE. This amulet channels that ancient protective energy.',
  },
  {
    id: 'ornament_kailasa_trishul',
    name: 'Trishul of Kailasa',
    emoji: '⚡',
    description: 'Lord Shiva\'s trident from the monolithic Kailasa temple',
    templeId: 'kailasa_ellora',
    type: 'brooch',
    rarity: 'legendary',
    color: '#00BFFF',
    glowColor: '#0088FF',
    statBonus: { speed: 0.15, jump: 1 },
    lore: 'Carved from the same rock as the Kailasa temple, this trident channels the power of Mount Kailash itself.',
  },
  {
    id: 'ornament_brihadeeswarar_crown',
    name: 'Chola Crown',
    emoji: '👑',
    description: 'Raja Raja Chola\'s ceremonial crown from the Brihadeeswarar temple',
    templeId: 'brihadeeswarar_thanjavur',
    type: 'crown',
    rarity: 'legendary',
    color: '#FF6600',
    glowColor: '#FF4400',
    statBonus: { stamina: 30, defense: 0.1 },
    lore: 'Raja Raja Chola wore this crown when consecrating the greatest temple of the Chola empire in 1010 CE.',
  },
  {
    id: 'ornament_konark_wheel',
    name: 'Sun Wheel of Konark',
    emoji: '☀️',
    description: 'A miniature of the 12 stone wheels that make Konark a chariot of the Sun God',
    templeId: 'konark_sun',
    type: 'brooch',
    rarity: 'legendary',
    color: '#FF8C00',
    glowColor: '#FF6600',
    statBonus: { speed: 0.25, jump: 0.5 },
    lore: 'The 12 wheels of Konark represent the 12 months of the year. This miniature captures the eternal movement of the sun.',
  },
  {
    id: 'ornament_hoysala_star',
    name: 'Star of Halebidu',
    emoji: '⭐',
    description: 'A 16-pointed star from the Hoysaleswara temple platform',
    templeId: 'hoysaleswara_halebidu',
    type: 'brooch',
    rarity: 'epic',
    color: '#FFD700',
    glowColor: '#FFAA00',
    statBonus: { stamina: 15, defense: 0.05 },
    lore: 'The star-shaped platform of Halebidu represents the cosmos. This star carries the geometry of the universe.',
  },
  {
    id: 'ornament_jagannath_chakra',
    name: 'Sudarshana Chakra',
    emoji: '🌀',
    description: 'The divine discus of Lord Vishnu from the Jagannath Temple',
    templeId: 'jagannath_puri',
    type: 'armlet',
    rarity: 'legendary',
    color: '#00FF7F',
    glowColor: '#00FF44',
    statBonus: { defense: 0.2, coinMultiplier: 1.5 },
    lore: 'The Sudarshana Chakra sits atop the Jagannath Temple. This replica carries the protective energy of Lord Vishnu.',
  },
  {
    id: 'ornament_khajuraho_spire',
    name: 'Spire of 84 Peaks',
    emoji: '🗼',
    description: 'A miniature of the 84 spires of Kandariya Mahadev',
    templeId: 'kandariya_khajuraho',
    type: 'tiara',
    rarity: 'epic',
    color: '#DEB887',
    glowColor: '#DAA520',
    statBonus: { jump: 2, stamina: 10 },
    lore: 'Each of the 84 spires at Khajuraho represents one of the 84 asanas of yoga. This carries their ascendant energy.',
  },
  {
    id: 'ornament_mahabalipuram_conch',
    name: 'Panchajanya Conch',
    emoji: '🐚',
    description: 'A conch from the shores of Mahabalipuram, blessed by the ocean',
    templeId: 'shore_mahabalipuram',
    type: 'necklace',
    rarity: 'epic',
    color: '#FFF8DC',
    glowColor: '#FFD700',
    statBonus: { health: 15, stamina: 10 },
    lore: 'The conch shell from Mahabalipuram\'s shore carries the sound of the ocean and the blessings of the Shore Temple.',
  },
  {
    id: 'ornament_ellora_trishul',
    name: 'Kailasa Trishul',
    emoji: '⚡',
    description: 'A miniature of the largest rock-cut sculpture in the world',
    templeId: 'kailasa_ellora',
    type: 'armlet',
    rarity: 'epic',
    color: '#4A90D9',
    glowColor: '#0066CC',
    statBonus: { stamina: 20, speed: 0.1 },
    lore: 'Carved from the same basalt as the Kailasa temple, this trishul carries 8th-century Rashtrakuta energy.',
  },
  {
    id: 'ornament_lingaraja_kalasha',
    name: 'Golden Kalasha',
    emoji: '🏺',
    description: 'The sacred pot from the top of Lingaraja\'s 183-foot tower',
    templeId: 'lingaraja_bhubaneswar',
    type: 'waistband',
    rarity: 'epic',
    color: '#FFD700',
    glowColor: '#FFD700',
    statBonus: { health: 25 },
    lore: 'The kalasha atop Lingaraja\'s deul channels cosmic energy into the temple. This miniature belt carries that power.',
  },
  {
    id: 'ornament_deogarh_sudarshana',
    name: 'Sudarshana Star',
    emoji: '💫',
    description: 'Vishnu\'s cosmic discus from the Dashavatara panels',
    templeId: 'dashavatara_deogarh',
    type: 'ring',
    rarity: 'epic',
    color: '#9370DB',
    glowColor: '#8A2BE2',
    statBonus: { stamina: 15, defense: 0.08 },
    lore: 'From the exquisite Dashavatara panels of Deogarh, this star captures Vishnu\'s cosmic aspect.',
  },
  {
    id: 'ornament_badami_staff',
    name: 'Chalukya Staff',
    emoji: '🏏',
    description: 'A carved stone staff from the Badami cave temples',
    templeId: 'badami_caves',
    type: 'armlet',
    rarity: 'rare',
    color: '#8B4513',
    glowColor: '#CD853F',
    statBonus: { speed: 0.1, stamina: 10 },
    lore: 'The Chalukya kings used ceremonial staffs in their cave temples. This one carries 6th-century royal energy.',
  },
  {
    id: 'ornament_kumbeswarar_pot',
    name: 'Kumbha Nectar Pot',
    emoji: '🏺',
    description: 'A tiny pot of celestial nectar from the Mahamaham tank',
    templeId: 'adi_kumbeswarar',
    type: 'amulet',
    rarity: 'rare',
    color: '#20B2AA',
    glowColor: '#00FFFF',
    statBonus: { health: 20 },
    lore: 'When the gods churned the cosmic ocean, nectar fell into the Mahamaham tank at Kumbakonam.',
  },
  {
    id: 'ornament_airavatesvara_flute',
    name: 'Musical Pillar Flute',
    emoji: '🎵',
    description: 'A flute that plays the exact note of Airavatesvara\'s musical pillars',
    templeId: 'airavatesvara_darasuram',
    type: 'necklace',
    rarity: 'rare',
    color: '#DAA520',
    glowColor: '#FFD700',
    statBonus: { stamina: 8, coinMultiplier: 1.2 },
    lore: 'The musical pillars of Airavatesvara produce five distinct notes. This flute captures their harmony.',
  },
  {
    id: 'ornament_ramappa_brick',
    name: 'Floating Brick Pendant',
    emoji: '🪶',
    description: 'A piece of the legendary floating bricks of Ramappa temple',
    templeId: 'ramappa_palampet',
    type: 'necklace',
    rarity: 'rare',
    color: '#D2B48C',
    glowColor: '#F5DEB3',
    statBonus: { jump: 0.5, defense: 0.05 },
    lore: 'The floating bricks of Ramappa — so light they float on water, yet strong enough to build a 40-foot gopuram.',
  },
  {
    id: 'ornament_bhitargaon_brick',
    name: 'Terracotta Brick Ring',
    emoji: '🧱',
    description: 'A ring made from a fragment of India\'s oldest surviving brick shikhara',
    templeId: 'bhitargaon_temple',
    type: 'ring',
    rarity: 'uncommon',
    color: '#CD853F',
    glowColor: '#DEB887',
    statBonus: { stamina: 5 },
    lore: 'The 5th-century brick temple of Bhitargaon inspired all later Nagara architecture. This brick carries that lineage.',
  },
  {
    id: 'ornament_modhera_stepwell',
    name: 'Surya Kund Ring',
    emoji: '💍',
    description: 'A ring shaped like the 108 steps of Modhera\'s stepwell',
    templeId: 'sun_modhera',
    type: 'ring',
    rarity: 'uncommon',
    color: '#B8860B',
    glowColor: '#FFD700',
    statBonus: { stamina: 8 },
    lore: 'The 108 steps of Surya Kund represent the 108 names of the Sun. This ring captures one step\'s blessing.',
  },
  {
    id: 'ornament_pattadakal',
    name: 'Queen\'s Victory Tiara',
    emoji: '👑',
    description: 'A tiara celebrating Queen Lokamahadevi\'s victory',
    templeId: 'virupaksha_pattadakal',
    type: 'tiara',
    rarity: 'rare',
    color: '#FF6347',
    glowColor: '#FF4500',
    statBonus: { speed: 0.08, health: 10 },
    lore: 'Queen Lokamahadevi built the Virupaksha temple to celebrate her husband\'s victory. This tiara carries her royal resolve.',
  },
  {
    id: 'ornament_aihole_bracelet',
    name: 'Aihole Experiment Bracelet',
    emoji: '📿',
    description: 'A bracelet representing the experimental architectural styles of Aihole',
    templeId: 'durga_aihole',
    type: 'armlet',
    rarity: 'uncommon',
    color: '#8FBC8F',
    glowColor: '#98FB98',
    statBonus: { stamina: 5, speed: 0.05 },
    lore: 'Aihole is the cradle of Indian temple architecture — 125 temples in one village. This bracelet celebrates architectural experimentation.',
  },
  {
    id: 'ornament_sanchi_stupa',
    name: 'Sanchi Torana Earring',
    emoji: '⭕',
    description: 'Earrings shaped like the torana gateways of Sanchi',
    templeId: 'sanchi_temple_17',
    type: 'earring',
    rarity: 'uncommon',
    color: '#8B4513',
    glowColor: '#D2691E',
    statBonus: { coinMultiplier: 1.1 },
    lore: 'The torana gateways of Sanchi represent enlightenment. These earrings carry the wisdom of the Gupta golden age.',
  },

  // ===== WORLD HIDDEN ORNAMENTS (found by exploring, not temple rewards) =====
  {
    id: 'ornament_ganges_lotus',
    name: 'Ganges Lotus Pendant',
    emoji: '🪷',
    description: 'A pearl formed inside a lotus from the holy Ganges',
    region: 'gangetic',
    type: 'necklace',
    rarity: 'rare',
    color: '#FFB6C1',
    glowColor: '#FF69B4',
    statBonus: { health: 15 },
    lore: 'Sacred lotuses in the Ganges absorb its purifying energy. This pendant carries the river\'s blessing.',
  },
  {
    id: 'ornament_desert_sapphire',
    name: 'Rajasthan Desert Sapphire',
    emoji: '💎',
    description: 'A blue sapphire found in the Thar Desert — blue as the sky above Jodhpur',
    region: 'rajasthan',
    type: 'ring',
    rarity: 'epic',
    color: '#4169E1',
    glowColor: '#1E90FF',
    statBonus: { stamina: 20, jump: 0.5 },
    lore: 'Rajasthan\'s desert holds treasures hidden for millennia. This sapphire was once worn by Rajput queens.',
  },
  {
    id: 'ornament_himalayan_crystal',
    name: 'Himalayan Crystal Amulet',
    emoji: '🔮',
    description: 'A pure quartz crystal from the Himalayan peaks',
    region: 'himalaya',
    type: 'amulet',
    rarity: 'epic',
    color: '#E6E6FA',
    glowColor: '#FFFFFF',
    statBonus: { health: 20, stamina: 20 },
    lore: 'Himalayan crystals are formed over millions of years in the highest peaks. This one carries the stillness of the mountains.',
  },
  {
    id: 'ornament_kerala_pearl',
    name: 'Kerala Pearl Anklet',
    emoji: '🦶',
    description: 'Pearly anklet from the Kerala backwaters',
    region: 'kerala',
    type: 'anklet',
    rarity: 'rare',
    color: '#FFE4B5',
    glowColor: '#FFDEAD',
    statBonus: { speed: 0.12 },
    lore: 'Kerala backwater pearls are formed in the convergence of fresh and salt water — a symbol of harmony.',
  },
  {
    id: 'ornament_coastal_coral',
    name: 'Coral Armlet of the Coast',
    emoji: '🪸',
    description: 'Deep red coral from the Indian Ocean coast',
    region: 'coastal',
    type: 'armlet',
    rarity: 'uncommon',
    color: '#FF4040',
    glowColor: '#FF6347',
    statBonus: { stamina: 8 },
    lore: 'Indian Ocean coral has been used in jewelry for 5000 years. This piece comes from ancient trading ports.',
  },
  {
    id: 'ornament_deccan_ruby',
    name: 'Deccan Ruby Brooch',
    emoji: '🔴',
    description: 'A pigeon-blood ruby from the Deccan plateau mines',
    region: 'deccan',
    type: 'brooch',
    rarity: 'epic',
    color: '#DC143C',
    glowColor: '#FF0000',
    statBonus: { coinMultiplier: 1.5, health: 10 },
    lore: 'Deccan rubies have been mined since the Satavahana Empire. This one was owned by a Vijayanagara emperor.',
  },
]

// Get ornament by ID
export function getOrnament(id: string): Ornament | undefined {
  return ORNAMENTS.find(o => o.id === id)
}

// Get ornaments by temple
export function getOrnamentsForTemple(templeId: string): Ornament[] {
  return ORNAMENTS.filter(o => o.templeId === templeId)
}

// Get ornaments by region
export function getOrnamentsForRegion(region: string): Ornament[] {
  return ORNAMENTS.filter(o => o.region === region)
}

// User's ornament inventory
export interface OrnamentInventory {
  collected: string[] // ornament IDs
  equipped: string[] // ornament IDs currently equipped (max 3)
}
