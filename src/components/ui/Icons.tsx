// SVG Icon components — replacing emojis for consistent cross-platform rendering

interface IconProps {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

// ── Mountain / Open World ──
export function MountainIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M2 20L8.5 8L12 13L15.5 8L22 20H2Z" fill={color} opacity={0.2} />
      <path d="M2 20L8.5 8L12 13L15.5 8L22 20H2Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M6 16L8.5 12" stroke={color} strokeWidth={1} opacity={0.5} />
      <path d="M18 16L15.5 12" stroke={color} strokeWidth={1} opacity={0.5} />
      <circle cx="18" cy="5" r="2" fill={color} opacity={0.6} />
    </svg>
  )
}

// ── Temple / Architecture ──
export function TempleIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M4 20H20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M6 20V14H18V20" stroke={color} strokeWidth={1.5} />
      <path d="M8 14V10" stroke={color} strokeWidth={1.5} />
      <path d="M16 14V10" stroke={color} strokeWidth={1.5} />
      <path d="M12 10V7" stroke={color} strokeWidth={1.5} />
      <path d="M10 7L12 4L14 7" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M4 14H20" stroke={color} strokeWidth={1.5} />
      <rect x="10" y="14" width="4" height="6" rx="1" fill={color} opacity={0.3} />
    </svg>
  )
}

// ── Lightning / Blessings ──
export function LightningIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M13 2L4 14H11L10 22L20 10H13L13 2Z" fill={color} opacity={0.2} />
      <path d="M13 2L4 14H11L10 22L20 10H13L13 2Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}

// ── Climber / Parkour ──
export function ClimberIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="14" cy="4" r="2" fill={color} />
      <path d="M10 8L14 6L18 9L16 14L18 20" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6L8 10L10 14" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L7 20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M6 6L8 10L6 14" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
    </svg>
  )
}

// ── Wood / Crafting ──
export function WoodIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <rect x="4" y="8" width="16" height="4" rx="2" fill={color} opacity={0.2} />
      <rect x="4" y="8" width="16" height="4" rx="2" stroke={color} strokeWidth={1.5} />
      <rect x="4" y="14" width="16" height="4" rx="2" fill={color} opacity={0.15} />
      <rect x="4" y="14" width="16" height="4" rx="2" stroke={color} strokeWidth={1.5} />
      <line x1="8" y1="8" x2="8" y2="12" stroke={color} strokeWidth={0.8} opacity={0.3} />
      <line x1="14" y1="8" x2="14" y2="12" stroke={color} strokeWidth={0.8} opacity={0.3} />
      <line x1="10" y1="14" x2="10" y2="18" stroke={color} strokeWidth={0.8} opacity={0.3} />
    </svg>
  )
}

// ── Lotus / Krishna ──
export function LotusIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 20C12 20 8 16 8 12C8 10 9 8 12 6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 20C12 20 16 16 16 12C16 10 15 8 12 6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 6C12 6 6 8 5 13C4.5 15 6 17 12 20" fill={color} opacity={0.15} />
      <path d="M12 6C12 6 18 8 19 13C19.5 15 18 17 12 20" fill={color} opacity={0.15} />
      <path d="M12 4L12 6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <circle cx="12" cy="4" r="1" fill={color} />
    </svg>
  )
}

// ── Crown ──
export function CrownIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M3 18H21L19 8L15 12L12 6L9 12L5 8L3 18Z" fill={color} opacity={0.2} />
      <path d="M3 18H21L19 8L15 12L12 6L9 12L5 8L3 18Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M3 18H21" stroke={color} strokeWidth={2} />
    </svg>
  )
}

// ── Shield ──
export function ShieldIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" fill={color} opacity={0.15} />
      <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M12 6L9 10H15L12 6Z" stroke={color} strokeWidth={1} opacity={0.5} />
    </svg>
  )
}

// ── Coin ──
export function CoinIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="12" cy="12" r="9" fill={color} opacity={0.2} />
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth={1} opacity={0.4} />
      <text x="12" y="16" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">₹</text>
    </svg>
  )
}

// ── Gem / Diamond ──
export function GemIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M6 9L12 3L18 9L12 21L6 9Z" fill={color} opacity={0.15} />
      <path d="M6 9L12 3L18 9L12 21L6 9Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M6 9H18" stroke={color} strokeWidth={1} opacity={0.5} />
      <path d="M9 9L12 3L15 9" stroke={color} strokeWidth={1} opacity={0.5} />
      <path d="M9 9L12 21" stroke={color} strokeWidth={1} opacity={0.3} />
      <path d="M15 9L12 21" stroke={color} strokeWidth={1} opacity={0.3} />
    </svg>
  )
}

// ── Flute / Music ──
export function FluteIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M4 20L18 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx="8" cy="16" r="1" fill={color} />
      <circle cx="10" cy="14" r="1" fill={color} />
      <circle cx="12" cy="12" r="1" fill={color} />
      <circle cx="14" cy="10" r="1" fill={color} />
      <circle cx="16" cy="8" r="1" fill={color} />
      <path d="M18 6C20 4 22 6 20 8L18 6Z" fill={color} opacity={0.3} />
    </svg>
  )
}

// ── Map ──
export function MapIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M3 6L9 4L15 6L21 4V20L15 22L9 20L3 22V6Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M9 4V20" stroke={color} strokeWidth={1} opacity={0.4} />
      <path d="M15 6V22" stroke={color} strokeWidth={1} opacity={0.4} />
    </svg>
  )
}

// ── Sword / Attack ──
export function SwordIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M5 19L15 9L19 5L21 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M15 9L19 5" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <path d="M9 15L5 19" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <rect x="3" y="17" width="4" height="2" rx="1" transform="rotate(-45 3 17)" fill={color} opacity={0.3} />
      <circle cx="21" cy="3" r="1" fill={color} />
    </svg>
  )
}

// ── Heart / Life ──
export function HeartIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 21C12 21 3 15 3 9C3 6 5.5 3.5 8 3.5C9.5 3.5 11 4.5 12 6C13 4.5 14.5 3.5 16 3.5C18.5 3.5 21 6 21 9C21 15 12 21 12 21Z" fill={color} opacity={0.2} />
      <path d="M12 21C12 21 3 15 3 9C3 6 5.5 3.5 8 3.5C9.5 3.5 11 4.5 12 6C13 4.5 14.5 3.5 16 3.5C18.5 3.5 21 6 21 9C21 15 12 21 12 21Z" stroke={color} strokeWidth={1.5} />
    </svg>
  )
}

// ── Backpack / Inventory ──
export function BackpackIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <rect x="6" y="8" width="12" height="13" rx="2" fill={color} opacity={0.15} />
      <rect x="6" y="8" width="12" height="13" rx="2" stroke={color} strokeWidth={1.5} />
      <path d="M9 8V6C9 4.3 10.3 3 12 3C13.7 3 15 4.3 15 6V8" stroke={color} strokeWidth={1.5} />
      <rect x="10" y="12" width="4" height="3" rx="1" stroke={color} strokeWidth={1} />
    </svg>
  )
}

// ── Star / Score ──
export function StarIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} opacity={0.2} />
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}

// ── Moon ──
export function MoonIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill={color} opacity={0.2} />
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke={color} strokeWidth={1.5} />
    </svg>
  )
}

// ── Sun ──
export function SunIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="12" cy="12" r="4" fill={color} opacity={0.3} />
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.5} />
      <path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M4.93 19.07L7.05 16.95M16.95 7.05L19.07 4.93" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}

// ── Pause ──
export function PauseIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <rect x="6" y="4" width="4" height="16" rx="1" fill={color} />
      <rect x="14" y="4" width="4" height="16" rx="1" fill={color} />
    </svg>
  )
}

// ── Gear / Settings ──
export function GearIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.5} />
      <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}

// ── Skull / Game Over ──
export function SkullIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 2C7.58 2 4 5.58 4 10C4 13 5.5 15.5 8 17V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V17C18.5 15.5 20 13 20 10C20 5.58 16.42 2 12 2Z" fill={color} opacity={0.15} />
      <path d="M12 2C7.58 2 4 5.58 4 10C4 13 5.5 15.5 8 17V20C8 21.1 8.9 22 10 22H14C15.1 22 16 21.1 16 20V17C18.5 15.5 20 13 20 10C20 5.58 16.42 2 12 2Z" stroke={color} strokeWidth={1.5} />
      <circle cx="9" cy="10" r="1.5" fill={color} />
      <circle cx="15" cy="10" r="1.5" fill={color} />
      <path d="M10 14L11 15L13 15L14 14" stroke={color} strokeWidth={1} strokeLinecap="round" />
    </svg>
  )
}

// ── Village / Settlement ──
export function VillageIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M3 21H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M5 21V11L12 5L19 11V21" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <rect x="9" y="14" width="6" height="7" rx="1" stroke={color} strokeWidth={1.5} />
      <path d="M9 17H15" stroke={color} strokeWidth={1} opacity={0.5} />
    </svg>
  )
}

// ── Ruins ──
export function RuinsIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M3 21H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M5 21V12M5 12L8 8V12M12 21V9M12 9L15 5V9M19 21V10M19 10L22 6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12H12M15 9H19" stroke={color} strokeWidth={1} opacity={0.3} />
    </svg>
  )
}

// ── Idol / Statue ──
export function IdolIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="12" cy="6" r="3" fill={color} opacity={0.15} />
      <circle cx="12" cy="6" r="3" stroke={color} strokeWidth={1.5} />
      <path d="M8 11L12 9L16 11V16L12 18L8 16V11Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M8 16V20L12 22L16 20V16" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}

// ── Flag / Rally ──
export function FlagIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M5 3V21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M5 3H17L14 8L17 13H5" fill={color} opacity={0.15} />
      <path d="M5 3H17L14 8L17 13H5" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}

// ── Compass / Explore ──
export function CompassIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
      <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" fill={color} opacity={0.3} />
      <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}

// ── Arrow Right ──
export function ArrowRightIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Play / Resume ──
export function PlayIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M7 4L19 12L7 20V4Z" fill={color} opacity={0.3} />
      <path d="M7 4L19 12L7 20V4Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}

// ── Trophy / Score ──
export function TrophyIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M8 21H16M12 17V21M6 3H18V8C18 11.31 15.31 14 12 14C8.69 14 6 11.31 6 8V3Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M6 5H3V8C3 9.66 4.34 11 6 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 5H21V8C21 9.66 19.66 11 18 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Wave / Water ──
export function WaveIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M2 12C4 9 6 9 8 12C10 15 12 15 14 12C16 9 18 9 20 12C22 15 24 15 24 12" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M2 17C4 14 6 14 8 17C10 20 12 20 14 17C16 14 18 14 20 17C22 20 24 20 24 17" stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
    </svg>
  )
}

// ── Cactus / Desert ──
export function DesertIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 22V8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 14C12 14 8 12 8 9C8 7 10 6 12 8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 11C12 11 16 9 16 6C16 4 14 3 12 5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M6 22H18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}

// ── Palm Tree / Tropical ──
export function PalmIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M12 22V10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 10C12 10 6 6 3 8C6 5 10 5 12 10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 10C12 10 18 6 21 8C18 5 14 5 12 10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M12 10C12 10 9 4 12 2C15 4 12 10 12 10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <ellipse cx="12" cy="22" rx="3" ry="1" fill={color} opacity={0.2} />
    </svg>
  )
}

// ── Mountain Peak / Snow ──
export function SnowMountainIcon({ size = 24, color = 'currentColor', style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M2 20L8 6L11 12L14 6L22 20H2Z" fill={color} opacity={0.15} />
      <path d="M2 20L8 6L11 12L14 6L22 20H2Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M8 6L10 10L12 6L14 10L14 6" stroke={color} strokeWidth={1} opacity={0.4} strokeLinejoin="round" />
      <circle cx="18" cy="5" r="2" stroke={color} strokeWidth={1} opacity={0.5} />
    </svg>
  )
}
