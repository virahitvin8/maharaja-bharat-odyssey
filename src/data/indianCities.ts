// Major Indian cities and regions with GPS coordinates for the all-India game
export interface IndianLocation {
  id: string
  name: string
  state: string
  lat: number
  lon: number
  description: string
  emoji: string
  highlights: string[]
}

export const INDIAN_CITIES: IndianLocation[] = [
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    lat: 25.3176,
    lon: 82.9739,
    description: 'The Eternal City — holiest city in Hinduism, on the Ganges',
    emoji: '🛕',
    highlights: ['Kashi Vishwanath Temple', 'Ganges Ghats', 'Sarnath', 'Ancient alleyways'],
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lon: 77.2090,
    description: 'The heart of India — millennia of history, from Mughals to modern',
    emoji: '🏛️',
    highlights: ['Red Fort', 'India Gate', 'Qutub Minar', 'Lotus Temple', 'Jama Masjid'],
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lon: 75.7873,
    description: 'The Pink City — Rajasthan\'s royal gem of Rajput architecture',
    emoji: '🏜️',
    highlights: ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar'],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lon: 72.8777,
    description: 'The City of Dreams — India\'s financial and entertainment capital',
    emoji: '🌊',
    highlights: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Siddhivinayak Temple'],
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lon: 80.2707,
    description: 'Gateway to South India — Dravidian culture and Marina Beach',
    emoji: '🏖️',
    highlights: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St. George', 'San Thome Cathedral'],
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lon: 88.3639,
    description: 'The City of Joy — colonial heritage and Bengali culture',
    emoji: '🎭',
    highlights: ['Howrah Bridge', 'Victoria Memorial', 'Dakshineswar Kali Temple', 'Indian Museum'],
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lon: 78.4867,
    description: 'The City of Pearls — Nizam\'s legacy meets modern tech',
    emoji: '💎',
    highlights: ['Charminar', 'Golconda Fort', 'Hussain Sagar Lake', 'Ramoji Film City'],
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lon: 77.5946,
    description: 'The Silicon Valley of India — gardens, tech, and vibrant culture',
    emoji: '🌿',
    highlights: ['Lalbagh Garden', 'Vidhana Soudha', 'Bannerghatta National Park', 'ISKCON Temple'],
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.1767,
    lon: 78.0081,
    description: 'Home of the Taj Mahal — Mughal architectural masterpiece',
    emoji: '🕌',
    highlights: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh'],
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    lat: 15.4909,
    lon: 73.8278,
    description: 'India\'s beach paradise — Portuguese heritage and golden sands',
    emoji: '🏝️',
    highlights: ['Baga Beach', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Fort Aguada'],
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    lat: 30.0869,
    lon: 78.2676,
    description: 'Yoga capital of the world — gateway to the Himalayas',
    emoji: '⛰️',
    highlights: ['Laxman Jhula', 'Triveni Ghat', 'Rajaji National Park', 'Neer Garh Waterfall'],
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    lat: 31.6340,
    lon: 74.8723,
    description: 'Home of the Golden Temple — spiritual heart of Sikhism',
    emoji: '✨',
    highlights: ['Golden Temple', 'Wagah Border', 'Jallianwala Bagh', 'Partition Museum'],
  },
  {
    id: 'hampi',
    name: 'Hampi',
    state: 'Karnataka',
    lat: 15.3350,
    lon: 76.4600,
    description: 'Ancient Vijayanagara Empire ruins — a UNESCO wonder',
    emoji: '🏚️',
    highlights: ['Virupaksha Temple', 'Stone Chariot', 'Vittala Temple', 'Elephant Stables'],
  },
  {
    id: 'khajuraho',
    name: 'Khajuraho',
    state: 'Madhya Pradesh',
    lat: 24.8318,
    lon: 79.9198,
    description: 'Famous for its stunning temples with intricate sculptures',
    emoji: '🗿',
    highlights: ['Kandariya Mahadeva Temple', 'Lakshmana Temple', 'Chausath Yogini Temple'],
  },
  {
    id: 'mysore',
    name: 'Mysore',
    state: 'Karnataka',
    lat: 12.2958,
    lon: 76.6394,
    description: 'City of palaces and the famous Mysore Dasara',
    emoji: '👑',
    highlights: ['Mysore Palace', 'Chamundi Hills', 'Brindavan Gardens', 'Mysore Zoo'],
  },
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    lat: 26.1445,
    lon: 91.7362,
    description: 'Gateway to Northeast India — on the banks of the Brahmaputra',
    emoji: '🌺',
    highlights: ['Kamakhya Temple', 'Brahmaputra River', 'Assam State Museum', 'Umananda Island'],
  },
  {
    id: 'leh',
    name: 'Leh',
    state: 'Ladakh',
    lat: 34.1526,
    lon: 77.5771,
    description: 'High-altitude desert in the Himalayas — breathtaking landscape',
    emoji: '🏔️',
    highlights: ['Pangong Lake', 'Leh Palace', 'Shanti Stupa', 'Nubra Valley', 'Magnetic Hill'],
  },
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    lat: 9.9252,
    lon: 78.1198,
    description: 'The Athens of the East — ancient Tamil culture and Meenakshi Temple',
    emoji: '🛕',
    highlights: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Palace', 'Vaigai River'],
  },
  {
    id: 'purii',
    name: 'Puri',
    state: 'Odisha',
    lat: 19.8135,
    lon: 85.8312,
    description: 'Home of the Jagannath Temple and famous Rath Yatra',
    emoji: '🐚',
    highlights: ['Jagannath Temple', 'Puri Beach', 'Konark Sun Temple', 'Chilika Lake'],
  },
  {
    id: 'vrindavan',
    name: 'Vrindavan',
    state: 'Uttar Pradesh',
    lat: 27.5796,
    lon: 77.6987,
    description: 'The sacred city of Lord Krishna\'s childhood, filled with divine flute melodies.',
    emoji: '🪈',
    highlights: ['Banke Bihari Temple', 'Prem Mandir', 'Radha Raman Temple', 'Yamuna River'],
  },
  {
    id: 'dwarka',
    name: 'Dwarka',
    state: 'Gujarat',
    lat: 22.2442,
    lon: 68.9685,
    description: 'The legendary golden city of Lord Krishna, submerged and eternal.',
    emoji: '🌊',
    highlights: ['Dwarkadhish Temple', 'Gomti Ghat', 'Bet Dwarka', 'Rukmini Devi Temple'],
  },
]

// Northern, Central, Southern, Eastern, Western regions for map grouping
export const INDIA_REGIONS = [
  { name: 'North India', cities: ['delhi', 'jaipur', 'amritsar', 'rishikesh', 'leh', 'agra'] },
  { name: 'South India', cities: ['chennai', 'bengaluru', 'hyderabad', 'mysore', 'madurai', 'hampi'] },
  { name: 'East India', cities: ['kolkata', 'purii', 'guwahati'] },
  { name: 'West India', cities: ['mumbai', 'goa', 'khajuraho', 'dwarka'] },
  { name: 'Holy Cities', cities: ['varanasi', 'rishikesh', 'amritsar', 'madurai', 'khajuraho', 'vrindavan'] },
]

// Get city by ID
export function getCity(id: string): IndianLocation | undefined {
  return INDIAN_CITIES.find(c => c.id === id)
}

// Get cities by region
export function getCitiesByRegion(regionName: string): IndianLocation[] {
  const region = INDIA_REGIONS.find(r => r.name === regionName)
  if (!region) return []
  return region.cities.map(id => getCity(id)).filter(Boolean) as IndianLocation[]
}
