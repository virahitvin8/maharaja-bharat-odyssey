// Mobile touch controls — virtual joystick + action buttons
import React, { useCallback, useRef, useState, useEffect } from 'react'

interface TouchControlsProps {
  onForward: (v: boolean) => void
  onBackward: (v: boolean) => void
  onLeft: (v: boolean) => void
  onRight: (v: boolean) => void
  onJump: (v: boolean) => void
  onRun: (v: boolean) => void
  onAttack: (v: boolean) => void
}

const BTN_SIZE = 56
const JOYSTICK_SIZE = 110
const KNOB_SIZE = 44

export function MobileControls({
  onForward, onBackward, onLeft, onRight, onJump, onRun, onAttack
}: TouchControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null)
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const activeTouch = useRef<number | null>(null)
  const joyCenter = useRef({ x: 0, y: 0 })

  const resetJoystick = useCallback(() => {
    setKnobPos({ x: 0, y: 0 })
    onForward(false); onBackward(false); onLeft(false); onRight(false)
  }, [onForward, onBackward, onLeft, onRight])

  const handleJoyStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.changedTouches[0]
    activeTouch.current = touch.identifier
    const rect = joystickRef.current!.getBoundingClientRect()
    joyCenter.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }, [])

  const handleJoyMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouch.current)
    if (!touch) return
    const dx = touch.clientX - joyCenter.current.x
    const dy = touch.clientY - joyCenter.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const maxDist = JOYSTICK_SIZE / 2 - KNOB_SIZE / 2
    const clampedDist = Math.min(dist, maxDist)
    const angle = Math.atan2(dy, dx)
    const kx = Math.cos(angle) * clampedDist
    const ky = Math.sin(angle) * clampedDist
    setKnobPos({ x: kx, y: ky })

    const threshold = 0.3 * maxDist
    onForward(ky < -threshold)
    onBackward(ky > threshold)
    onLeft(kx < -threshold)
    onRight(kx > threshold)
  }, [onForward, onBackward, onLeft, onRight])

  const handleJoyEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    activeTouch.current = null
    resetJoystick()
  }, [resetJoystick])

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (!isMobile) return null

  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none',
      zIndex: 20,
      touchAction: 'none',
    }}>
      {/* Left: Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleJoyStart}
        onTouchMove={handleJoyMove}
        onTouchEnd={handleJoyEnd}
        onTouchCancel={handleJoyEnd}
        style={{
          position: 'absolute',
          bottom: 60, left: 30,
          width: JOYSTICK_SIZE, height: JOYSTICK_SIZE,
          borderRadius: '50%',
          background: 'rgba(255,153,51,0.12)',
          border: '2px solid rgba(255,153,51,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        {/* Knob */}
        <div style={{
          width: KNOB_SIZE, height: KNOB_SIZE,
          borderRadius: '50%',
          background: 'rgba(255,153,51,0.7)',
          border: '2px solid #FF9933',
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: knobPos.x === 0 && knobPos.y === 0 ? 'transform 0.15s' : 'none',
          boxShadow: '0 0 10px rgba(255,153,51,0.5)',
        }} />
      </div>

      {/* Right: Action Buttons */}
      <div style={{
        position: 'absolute',
        bottom: 60, right: 20,
        display: 'flex', flexDirection: 'column', gap: 10,
        alignItems: 'flex-end',
        pointerEvents: 'auto',
      }}>
        {/* Jump */}
        <ActionBtn
          label="▲" color="#FF9933"
          onPress={() => onJump(true)}
          onRelease={() => onJump(false)}
          size={BTN_SIZE}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Run */}
          <ActionBtn
            label="RUN" color="#DAA520"
            onPress={() => onRun(true)}
            onRelease={() => onRun(false)}
            size={BTN_SIZE - 8}
            fontSize={9}
          />
          {/* Attack */}
          <ActionBtn
            label="⚔️" color="#e63946"
            onPress={() => onAttack(true)}
            onRelease={() => onAttack(false)}
            size={BTN_SIZE}
          />
        </div>
      </div>
    </div>
  )
}

interface ActionBtnProps {
  label: string
  color: string
  onPress: () => void
  onRelease: () => void
  size?: number
  fontSize?: number
}

function ActionBtn({ label, color, onPress, onRelease, size = BTN_SIZE, fontSize = 18 }: ActionBtnProps) {
  const [pressed, setPressed] = useState(false)
  return (
    <div
      onTouchStart={(e) => { e.preventDefault(); setPressed(true); onPress() }}
      onTouchEnd={(e)   => { e.preventDefault(); setPressed(false); onRelease() }}
      onTouchCancel={(e)=> { e.preventDefault(); setPressed(false); onRelease() }}
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: pressed ? `${color}cc` : `${color}33`,
        border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        transform: pressed ? 'scale(0.9)' : 'scale(1)',
        transition: 'transform 0.08s, background 0.08s',
        fontSize,
        color,
        fontFamily: 'Press Start 2P',
        boxShadow: pressed ? `0 0 15px ${color}88` : `0 0 8px ${color}44`,
      }}
    >
      {label}
    </div>
  )
}
