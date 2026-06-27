// Mission System — per-temple quests with rewards, progression, and story
// Each temple has a unique mission that teaches game mechanics and unlocks blessings

export interface Mission {
  id: string
  templeId: string
  name: string
  emoji: string
  description: string
  steps: MissionStep[]
  rewards: MissionReward
  isComplete: boolean
}

export interface MissionStep {
  id: string
  instruction: string
  hint: string
  goal: string
  type: 'walk_to' | 'climb' | 'collect' | 'defeat' | 'craft' | 'reach_altar' | 'pray' | 'find' | 'build'
  targetParams?: Record<string, any>
}

export interface MissionReward {
  coins: number
  superpowerXP: number
  ornamentId?: string // Special ornament rewarded on completion
  healthBoost?: number
  staminaBoost?: number
}

// All 20 temple missions
export const MISSIONS: Mission[] = [
  {
    id: 'mission_tirumala',
    templeId: 'tirumala_venkateswara',
    name: 'The Seven Hills Pilgrimage',
    emoji: '⛰️',
    description: 'Climb the seven sacred hills of Tirumala to reach Lord Venkateswara. Collect energy fruits along the way — you\'ll need them!',
    steps: [
      { id: 'tirumala_1', instruction: 'Climb the first hill — find the mango tree for energy', hint: 'Look for golden fruit on the hillside', goal: 'Reach waypoint 1', type: 'climb', targetParams: { waypoint: 1, min_height: 5 } },
      { id: 'tirumala_2', instruction: 'Cross the stone bridge over the waterfall', hint: 'Use your jump to reach the far side', goal: 'Cross the waterfall', type: 'walk_to', targetParams: { x: 20, z: -10 } },
      { id: 'tirumala_3', instruction: 'Collect 3 sacred lotuses for the deity', hint: 'Lotuses glow pink near water', goal: 'Collect 3 lotuses', type: 'collect', targetParams: { item: 'lotus', count: 3 } },
      { id: 'tirumala_4', instruction: 'Reach the seventh peak and enter the temple', hint: 'Follow the golden path upward', goal: 'Enter Tirumala temple', type: 'reach_altar', targetParams: { templeId: 'tirumala_venkateswara' } },
      { id: 'tirumala_5', instruction: 'Pray at the sanctum for Venkateswara\'s blessing', hint: 'Stand before the golden deity and press E', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 500, superpowerXP: 100, ornamentId: 'ornament_tirumala_crown' },
    isComplete: false,
  },
  {
    id: 'mission_mundeshwari',
    templeId: 'mundeshwari_devi',
    name: 'The Ancient Shakti',
    emoji: '🌀',
    description: 'Find the oldest functional temple in India. Defeat the guardian spirits to reach the Shakti Peetha.',
    steps: [
      { id: 'mundeshwari_1', instruction: 'Navigate the Kaimur forest', hint: 'Follow the ancient stone markers', goal: 'Find the hidden path', type: 'walk_to', targetParams: { x: -30, z: 5 } },
      { id: 'mundeshwari_2', instruction: 'Find the ancient rock-cut cave entrance', hint: 'Look for torch-lit openings', goal: 'Enter the cave', type: 'find', targetParams: { templeId: 'mundeshwari_devi' } },
      { id: 'mundeshwari_3', instruction: 'Light 5 diyas along the cave walls', hint: 'Collect oil from glowing pots', goal: 'Light all 5 diyas', type: 'collect', targetParams: { item: 'diya', count: 5 } },
      { id: 'mundeshwari_4', instruction: 'Pray at the Shakti Peetha', hint: 'The energy radiates from the center', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 350, superpowerXP: 80, ornamentId: 'ornament_mundeshwari_shield' },
    isComplete: false,
  },
  {
    id: 'mission_sanchi',
    templeId: 'sanchi_temple_17',
    name: 'Gupta Genesis',
    emoji: '🏗️',
    description: 'Explore the Sanchi complex and witness the birth of Nagara temple architecture.',
    steps: [
      { id: 'sanchi_1', instruction: 'Find the Great Stupa of Sanchi', hint: 'It towers above all else', goal: 'Reach the stupa', type: 'walk_to', targetParams: { x: 0, z: 0 } },
      { id: 'sanchi_2', instruction: 'Walk through the torana gateways', hint: 'Look for the ornate arches', goal: 'Pass through 4 toranas', type: 'walk_to', targetParams: { count: 4 } },
      { id: 'sanchi_3', instruction: 'Enter Temple 17 — the first Nagara temple', hint: 'The small flat-roofed structure', goal: 'Enter Temple 17', type: 'reach_altar', targetParams: { templeId: 'sanchi_temple_17' } },
      { id: 'sanchi_4', instruction: 'Meditate on the birth of Indian temple architecture', hint: 'Sit in silence before the sanctum', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 300, superpowerXP: 70 },
    isComplete: false,
  },
  {
    id: 'mission_bhitargaon',
    templeId: 'bhitargaon_temple',
    name: 'The Brick That Built India',
    emoji: '🧱',
    description: 'Discover the oldest surviving brick shikhara. Learn to build with the strength of ancient bricks.',
    steps: [
      { id: 'bhitargaon_1', instruction: 'Collect 10 bricks from the ruins', hint: 'Broken bricks glow near fallen walls', goal: 'Collect 10 bricks', type: 'collect', targetParams: { item: 'brick', count: 10 } },
      { id: 'bhitargaon_2', instruction: 'Find the ancient kiln', hint: 'Follow the trail of terracotta', goal: 'Reach the kiln', type: 'walk_to', targetParams: { x: 15, z: -5 } },
      { id: 'bhitargaon_3', instruction: 'Build a small shrine to honor the Gupta masons', hint: 'Place 5 bricks on the foundation', goal: 'Build the shrine', type: 'build', targetParams: { item: 'brick', count: 5 } },
      { id: 'bhitargaon_4', instruction: 'Pray at the Brick of Eternity altar', hint: 'The tallest brick tower awaits', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 280, superpowerXP: 65, ornamentId: 'ornament_bhitargaon_brick' },
    isComplete: false,
  },
  {
    id: 'mission_deogarh',
    templeId: 'dashavatara_deogarh',
    name: 'Vishnu\'s Ten Avatars',
    emoji: '🎭',
    description: 'Witness the Dashavatara panels and prove your worth across all ten of Vishnu\'s forms.',
    steps: [
      { id: 'deogarh_1', instruction: 'Find the Matsya (fish) panel', hint: 'Look near the water', goal: 'Find Matsya panel', type: 'find', targetParams: {} },
      { id: 'deogarh_2', instruction: 'Climb the Kurma (tortoise) mound', hint: 'The stone tortoise is south', goal: 'Climb the mound', type: 'climb', targetParams: { min_height: 3 } },
      { id: 'deogarh_3', instruction: 'Defeat the Hiranyakashipu demon (Varaha form)', hint: 'He guards the Narasimha panel', goal: 'Defeat the demon', type: 'defeat', targetParams: { enemy: 'demon', count: 1 } },
      { id: 'deogarh_4', instruction: 'Navigate through Vamana\'s three steps', hint: 'Step on three platforms in sequence', goal: 'Cross the three steps', type: 'climb', targetParams: { count: 3 } },
      { id: 'deogarh_5', instruction: 'Pray at the Anantashayana — Vishnu resting on the serpent', hint: 'The most exquisite panel awaits', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 400, superpowerXP: 95, ornamentId: 'ornament_deogarh_ Sudarshana' },
    isComplete: false,
  },
  {
    id: 'mission_badami',
    templeId: 'badami_caves',
    name: 'The Cave Temple Pilgrimage',
    emoji: '⛰️',
    description: 'Explore all four Badami cave temples carved into the red cliffs.',
    steps: [
      { id: 'badami_1', instruction: 'Climb to Cave 1 — the Shiva cave', hint: 'Follow the red stone path', goal: 'Enter Cave 1', type: 'climb', targetParams: { min_height: 3 } },
      { id: 'badami_2', instruction: 'Cross the ravine to Cave 2 — Vishnu\'s cave', hint: 'A narrow bridge connects them', goal: 'Enter Cave 2', type: 'walk_to', targetParams: { x: -10, z: 8 } },
      { id: 'badami_3', instruction: 'Climb higher to Cave 3 — the largest cave', hint: 'Look for the grandest facade', goal: 'Enter Cave 3', type: 'climb', targetParams: { min_height: 6 } },
      { id: 'badami_4', instruction: 'Find the hidden Jain cave (Cave 4)', hint: 'It\'s concealed behind a waterfall', goal: 'Enter Cave 4', type: 'find', targetParams: {} },
      { id: 'badami_5', instruction: 'Meditate where all three faiths meet', hint: 'The energy is strongest at the center', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 450, superpowerXP: 90, ornamentId: 'ornament_badami_staff' },
    isComplete: false,
  },
  {
    id: 'mission_aihole',
    templeId: 'durga_aihole',
    name: 'Cradle of Architecture',
    emoji: '🏛️',
    description: 'Aihole — where Indian temple architecture was born. Explore the experimental styles.',
    steps: [
      { id: 'aihole_1', instruction: 'Count the 4 different architectural styles in Aihole', hint: 'Look at each temple\'s roof shape', goal: 'Find 4 styles', type: 'find', targetParams: { count: 4 } },
      { id: 'aihole_2', instruction: 'Find the apsidal Durga Temple (shaped like a Buddhist chaitya)', hint: 'The curved back is unmistakable', goal: 'Reach Durga Temple', type: 'walk_to', targetParams: { x: 5, z: -3 } },
      { id: 'aihole_3', instruction: 'Glide from the tallest pillar at sunrise', hint: 'Face east and jump off', goal: 'Glide successfully', type: 'craft', targetParams: { action: 'glide' } },
      { id: 'aihole_4', instruction: 'Pray at the experimental sanctum', hint: 'Offer your observations to the divine architect', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 320, superpowerXP: 75 },
    isComplete: false,
  },
  {
    id: 'mission_mahabalipuram',
    templeId: 'shore_mahabalipuram',
    name: 'Temples of the Ocean',
    emoji: '🌊',
    description: 'Walk the shores of Mahabalipuram and discover the five rathas and the Shore Temple.',
    steps: [
      { id: 'mahabalipuram_1', instruction: 'Find the Five Rathas — monolithic chariots', hint: 'They stand in a line along the beach', goal: 'Find all 5 rathas', type: 'find', targetParams: { count: 5 } },
      { id: 'mahabalipuram_2', instruction: 'Cross the ocean to reach the Shore Temple', hint: 'You\'ll need to walk on water or build a raft!', goal: 'Reach Shore Temple', type: 'walk_to', targetParams: { x: 0, z: -15 } },
      { id: 'mahabalipuram_3', instruction: 'Find Arjuna\'s Penance — the giant rock carving', hint: 'The largest bas-relief in the world', goal: 'Find the carving', type: 'find', targetParams: {} },
      { id: 'mahabalipuram_4', instruction: 'Pray as the sun rises over the Bay of Bengal', hint: 'Face east at dawn in the Shore Temple', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 500, superpowerXP: 100, ornamentId: 'ornament_mahabalipuram_conch' },
    isComplete: false,
  },
  {
    id: 'mission_ellora',
    templeId: 'kailasa_ellora',
    name: 'Mountain of the Gods',
    emoji: '🗿',
    description: 'Marvel at Kailasa — the largest monolithic structure in the world, carved top-down from a single rock.',
    steps: [
      { id: 'ellora_1', instruction: 'Enter the Kailasa temple courtyard', hint: 'Follow the path between the rock walls', goal: 'Enter the courtyard', type: 'walk_to', targetParams: { x: 0, z: 10 } },
      { id: 'ellora_2', instruction: 'Climb to the top of the temple (remember, it was carved TOP-DOWN!)', hint: 'Use the Chalukya climbing technique', goal: 'Reach the top', type: 'climb', targetParams: { min_height: 8 } },
      { id: 'ellora_3', instruction: 'Find the Nandi bull shrine', hint: 'The massive stone bull faces the sanctum', goal: 'Find Nandi', type: 'find', targetParams: {} },
      { id: 'ellora_4', instruction: 'Meditate inside the mountain — feel the 750-year-old vibration', hint: 'The center of the sanctum', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 600, superpowerXP: 120, ornamentId: 'ornament_ellora_trishul' },
    isComplete: false,
  },
  {
    id: 'mission_pattadakal',
    templeId: 'virupaksha_pattadakal',
    name: 'Queen\'s Victory',
    emoji: '👑',
    description: 'Celebrate Queen Lokamahadevi\'s victory by completing the grand temple she built.',
    steps: [
      { id: 'pattadakal_1', instruction: 'Collect 8 pillars for the Virupaksha hall', hint: 'Pillars glow near collapsed structures', goal: 'Collect 8 pillars', type: 'collect', targetParams: { item: 'pillar', count: 8 } },
      { id: 'pattadakal_2', instruction: 'Place the pillars to restore the mandapa', hint: 'Follow the foundation markers', goal: 'Restore the hall', type: 'build', targetParams: { item: 'pillar', count: 8 } },
      { id: 'pattadakal_3', instruction: 'Defeat 3 rival warriors to prove your worth', hint: 'They guard the inner sanctum', goal: 'Defeat 3 warriors', type: 'defeat', targetParams: { enemy: 'warrior', count: 3 } },
      { id: 'pattadakal_4', instruction: 'Pray at the victory sanctum', hint: 'The queen\'s throne awaits', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 450, superpowerXP: 100 },
    isComplete: false,
  },
  {
    id: 'mission_kumbeswarar',
    templeId: 'adi_kumbeswarar',
    name: 'The Celestial Pot',
    emoji: '🪔',
    description: 'Find the Kumbha (pot) of nectar in the Mahamaham tank and unlock its healing waters.',
    steps: [
      { id: 'kumbeswarar_1', instruction: 'Enter the Mahamaham tank', hint: 'The sacred tank is surrounded by mandapas', goal: 'Reach the tank', type: 'walk_to', targetParams: { x: 5, z: 5 } },
      { id: 'kumbeswarar_2', instruction: 'Collect nectar from 3 sacred wells around the tank', hint: 'Each well has a distinct color', goal: 'Collect 3 nectars', type: 'collect', targetParams: { item: 'nectar', count: 3 } },
      { id: 'kumbeswarar_3', instruction: 'Pour the nectar into the Kumbha', hint: 'The celestial pot is at the center', goal: 'Fill the pot', type: 'craft', targetParams: { action: 'fill_pot' } },
      { id: 'kumbeswarar_4', instruction: 'Drink from the Kumbha and receive rebirth', hint: 'Bathe in the golden light', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 350, superpowerXP: 75, ornamentId: 'ornament_kumbeswarar_pot' },
    isComplete: false,
  },
  {
    id: 'mission_lingaraja',
    templeId: 'lingaraja_bhubaneswar',
    name: 'The Temple City',
    emoji: '🗼',
    description: 'Find your way through hundreds of shrines to reach the 183-foot tower of Lingaraja.',
    steps: [
      { id: 'lingaraja_1', instruction: 'Pass through the Lion\'s Gate', hint: 'Two stone lions guard the eastern entrance', goal: 'Enter through Lion Gate', type: 'walk_to', targetParams: { x: 0, z: 15 } },
      { id: 'lingaraja_2', instruction: 'Navigate the labyrinth of 64 subsidiary shrines', hint: 'Follow the tallest spire — it\'s always visible', goal: 'Find the main temple', type: 'find', targetParams: {} },
      { id: 'lingaraja_3', instruction: 'Climb to the top of the 183-foot deul', hint: 'Use ledges on the outer wall', goal: 'Reach the top', type: 'climb', targetParams: { min_height: 10 } },
      { id: 'lingaraja_4', instruction: 'Look out over the Temple City from the peak', hint: 'Touch the golden kalasha', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 400, superpowerXP: 85, ornamentId: 'ornament_lingaraja_kalasha' },
    isComplete: false,
  },
  {
    id: 'mission_brihadeeswarar',
    templeId: 'brihadeeswarar_thanjavur',
    name: 'The Grand Vimana',
    emoji: '🏛️',
    description: 'Witness the engineering marvel of the 216-foot Chola vimana. Push the 80-ton cupola!',
    steps: [
      { id: 'brihadeeswarar_1', instruction: 'Walk the shadow path — the vimana never casts a shadow at noon', hint: 'Follow the vimana\'s shadow at midday', goal: 'Master the shadow', type: 'walk_to', targetParams: { x: 5, z: 0 } },
      { id: 'brihadeeswarar_2', instruction: 'Read the Tamil inscriptions on the base', hint: 'Raja Raja Chola\'s words', goal: 'Read inscriptions', type: 'find', targetParams: {} },
      { id: 'brihadeeswarar_3', instruction: 'Climb the 216-foot vimana (the world\'s first granite tower!)', hint: 'Use the climbing technique from Badami', goal: 'Reach the top', type: 'climb', targetParams: { min_height: 15 } },
      { id: 'brihadeeswarar_4', instruction: 'Push the 80-ton cupola? No — pray at the top and feel its weight', hint: 'The golden kalasha glows at the peak', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 650, superpowerXP: 130, ornamentId: 'ornament_brihadeeswarar_crown' },
    isComplete: false,
  },
  {
    id: 'mission_khajuraho',
    templeId: 'kandariya_khajuraho',
    name: '84 Spires of Desire',
    emoji: '🗼',
    description: 'Navigate the intricate carvings of Khajuraho. Each spire represents a path to liberation.',
    steps: [
      { id: 'khajuraho_1', instruction: 'Find the main spire — it rises 117 feet', hint: 'The tallest of the 84 spires', goal: 'Reach the main spire', type: 'walk_to', targetParams: { x: 0, z: 0 } },
      { id: 'khajuraho_2', instruction: 'Count the bands of sculptures — each tells a story', hint: 'There are 3 main bands', goal: 'Find 3 bands', type: 'find', targetParams: { count: 3 } },
      { id: 'khajuraho_3', instruction: 'Jump from spire to spire without touching the ground', hint: 'Use the QUAD jump blessing', goal: 'Touch 8 spires', type: 'climb', targetParams: { count: 8 } },
      { id: 'khajuraho_4', instruction: 'Meditate on the unity of all paths', hint: 'The eastern sanctum faces the sunrise', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 550, superpowerXP: 110, ornamentId: 'ornament_khajuraho_spire' },
    isComplete: false,
  },
  {
    id: 'mission_modhera',
    templeId: 'sun_modhera',
    name: 'Temple of the Sun',
    emoji: '☀️',
    description: 'Time your visit perfectly — the sun\'s rays illuminate the sanctum only during equinox.',
    steps: [
      { id: 'modhera_1', instruction: 'Descend the 108 steps of Surya Kund (the stepwell)', hint: 'Each step brings you closer to the sun', goal: 'Reach the bottom', type: 'walk_to', targetParams: { x: -3, z: -5 } },
      { id: 'modhera_2', instruction: 'Align the mirrors to reflect sunlight into the sanctum', hint: 'Rotate each mirror to catch the beam', goal: 'Align 3 mirrors', type: 'craft', targetParams: { action: 'align_mirror', count: 3 } },
      { id: 'modhera_3', instruction: 'Stand in the sanctum when the sun illuminates the deity', hint: 'The beam comes through the eastern window', goal: 'Experience the light', type: 'pray', targetParams: {} },
      { id: 'modhera_4', instruction: 'Receive Surya\'s radiance', hint: 'Face the sun with open arms', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 380, superpowerXP: 80 },
    isComplete: false,
  },
  {
    id: 'mission_jagannath',
    templeId: 'jagannath_puri',
    name: 'The Chariot Festival',
    emoji: '🚩',
    description: 'Build the massive Rath Yatra chariot and pull Lord Jagannath through the streets.',
    steps: [
      { id: 'jagannath_1', instruction: 'Collect 20 logs of wood for the chariot', hint: 'Cut trees with your sword near the temple', goal: 'Collect 20 wood', type: 'collect', targetParams: { item: 'wood', count: 20 } },
      { id: 'jagannath_2', instruction: 'Build the 45-foot chariot (the Ratha)', hint: 'Use logs + ropes at the workshop', goal: 'Build the chariot', type: 'build', targetParams: { item: 'wood', count: 20 } },
      { id: 'jagannath_3', instruction: 'Pull the chariot 1km through the streets', hint: 'Hold R to run while pulling', goal: 'Complete the route', type: 'walk_to', targetParams: { x: 30, z: 0 } },
      { id: 'jagannath_4', instruction: 'Place Lord Jagannath on the chariot', hint: 'The wooden deity awaits', goal: 'Complete Ratha Yatra', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 700, superpowerXP: 150, ornamentId: 'ornament_jagannath_chakra' },
    isComplete: false,
  },
  {
    id: 'mission_airavatesvara',
    templeId: 'airavatesvara_darasuram',
    name: 'The Music of Stone',
    emoji: '🎵',
    description: 'Discover why the pillars of Airavatesvara sing when struck — and compose your own raga.',
    steps: [
      { id: 'airavatesvara_1', instruction: 'Find the stone chariot at the entrance', hint: 'It\'s pulled by invisible horses', goal: 'Find the chariot', type: 'find', targetParams: {} },
      { id: 'airavatesvara_2', instruction: 'Strike each of the 5 musical pillars', hint: 'Each pillar produces a different svara (note)', goal: 'Strike 5 pillars', type: 'collect', targetParams: { item: 'note', count: 5 } },
      { id: 'airavatesvara_3', instruction: 'Play the 5 notes in ascending order — Sa Re Ga Ma Pa', hint: 'Strike from shortest to tallest', goal: 'Play the raga', type: 'craft', targetParams: { action: 'play_raga' } },
      { id: 'airavatesvara_4', instruction: 'Dance to the divine music', hint: 'Let the raga guide your feet', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 420, superpowerXP: 85, ornamentId: 'ornament_airavatesvara_flute' },
    isComplete: false,
  },
  {
    id: 'mission_halebidu',
    templeId: 'hoysaleswara_halebidu',
    name: 'The Star Temple',
    emoji: '🌟',
    description: 'Explore the star-shaped Hoysaleswara temple with thousands of divine carvings.',
    steps: [
      { id: 'halebidu_1', instruction: 'Walk the star-shaped perimeter — it has 16 points!', hint: 'Each point is a different deity', goal: 'Walk full perimeter', type: 'walk_to', targetParams: { count: 16 } },
      { id: 'halebidu_2', instruction: 'Find your zodiac deity among 2000+ carvings', hint: 'The deities cover every inch of soapstone', goal: 'Find 1 carving', type: 'find', targetParams: {} },
      { id: 'halebidu_3', instruction: 'Climb to the top of the star platform', hint: 'Use the 8 main entrance stairs', goal: 'Reach the platform', type: 'climb', targetParams: { min_height: 3 } },
      { id: 'halebidu_4', instruction: 'Pray where all 2000 deities watch over you', hint: 'The central sanctum under the star', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 500, superpowerXP: 100, ornamentId: 'ornament_hoysala_star' },
    isComplete: false,
  },
  {
    id: 'mission_konark',
    templeId: 'konark_sun',
    name: 'The Chariot of the Sun',
    emoji: '🔆',
    description: 'Explore the colossal stone chariot of Konark — 12 wheels, 7 horses, 100 feet high.',
    steps: [
      { id: 'konark_1', instruction: 'Walk around the 12 pairs of stone wheels', hint: 'Each wheel is 10 feet in diameter', goal: 'Visit all 12 wheels', type: 'walk_to', targetParams: { x: 12, z: 0 } },
      { id: 'konark_2', instruction: 'Climb the 7 stone horses', hint: 'Ride the horses from tail to mane', goal: 'Climb all 7 horses', type: 'climb', targetParams: { count: 7 } },
      { id: 'konark_3', instruction: 'Reach the 100-foot summit of the temple', hint: 'Use the Konark fire sword to cut through overgrowth', goal: 'Reach the top', type: 'climb', targetParams: { min_height: 12 } },
      { id: 'konark_4', instruction: 'Face the sunrise from the chariot — feel the Sun\'s power', hint: 'The Sun God blesses those who greet the dawn', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 800, superpowerXP: 160, ornamentId: 'ornament_konark_wheel' },
    isComplete: false,
  },
  {
    id: 'mission_ramappa',
    templeId: 'ramappa_palampet',
    name: 'The Temple That Floats',
    emoji: '🪶',
    description: 'Discover the secret of the floating bricks — lightweight bricks that make the gopuram float.',
    steps: [
      { id: 'ramappa_1', instruction: 'Find the ancient kiln where floating bricks were made', hint: 'Follow the trail of light, porous stones', goal: 'Find the kiln', type: 'find', targetParams: {} },
      { id: 'ramappa_2', instruction: 'Collect 5 floating bricks (they\'re lighter than they look!)', hint: 'They glow faintly — visible in sunlight', goal: 'Collect 5 bricks', type: 'collect', targetParams: { item: 'floating_brick', count: 5 } },
      { id: 'ramappa_3', instruction: 'Cross the river using floating bricks as stepping stones', hint: 'Place them one by one — they float on water', goal: 'Cross the river', type: 'craft', targetParams: { action: 'cross_river' } },
      { id: 'ramappa_4', instruction: 'Pray at the Rudreshwara sanctum', hint: 'The deity who floats between worlds', goal: 'Receive blessing', type: 'pray', targetParams: {} },
    ],
    rewards: { coins: 480, superpowerXP: 95, ornamentId: 'ornament_ramappa_brick' },
    isComplete: false,
  },
]

// Get missions for a specific temple
export function getMissionsForTemple(templeId: string): Mission[] {
  return MISSIONS.filter(m => m.templeId === templeId)
}

// Get a specific mission
export function getMission(id: string): Mission | undefined {
  return MISSIONS.find(m => m.id === id)
}

// Active mission tracking — keeps current step index for each player
export interface MissionProgress {
  missionId: string
  currentStepIndex: number
  completedSteps: string[]
  completed: boolean
}

export function createMissionProgress(missionId: string): MissionProgress {
  return {
    missionId,
    currentStepIndex: 0,
    completedSteps: [],
    completed: false,
  }
}
