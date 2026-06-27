// Custom hook for keyboard + touch input
import { useEffect, useRef, useCallback } from 'react'

export interface InputState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
  run: boolean
  attack: boolean
  groundPound: boolean
}

const defaultInput: InputState = {
  forward: false, backward: false, left: false, right: false,
  jump: false, run: false, attack: false, groundPound: false,
}

export function useInput() {
  const input = useRef<InputState>({ ...defaultInput })

  const setKey = useCallback((key: string, value: boolean) => {
    switch (key) {
      case 'ArrowUp':    case 'KeyW': input.current.forward = value; break
      case 'ArrowDown':  case 'KeyS': input.current.backward = value; break
      case 'ArrowLeft':  case 'KeyA': input.current.left = value; break
      case 'ArrowRight': case 'KeyD': input.current.right = value; break
      case 'Space':      input.current.jump = value; break
      case 'ShiftLeft':  case 'ShiftRight': input.current.run = value; break
      case 'KeyZ':       case 'KeyX': input.current.attack = value; break
      case 'KeyC':       input.current.groundPound = value; break
    }
  }, [])

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { e.preventDefault(); setKey(e.code, true) }
    const onUp   = (e: KeyboardEvent) => { setKey(e.code, false) }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [setKey])

  // Expose imperative setters for touch controls
  const setForward   = useCallback((v: boolean) => { input.current.forward = v }, [])
  const setBackward  = useCallback((v: boolean) => { input.current.backward = v }, [])
  const setLeft      = useCallback((v: boolean) => { input.current.left = v }, [])
  const setRight     = useCallback((v: boolean) => { input.current.right = v }, [])
  const setJump      = useCallback((v: boolean) => { input.current.jump = v }, [])
  const setRun       = useCallback((v: boolean) => { input.current.run = v }, [])
  const setAttack    = useCallback((v: boolean) => { input.current.attack = v }, [])

  return { input, setForward, setBackward, setLeft, setRight, setJump, setRun, setAttack }
}
