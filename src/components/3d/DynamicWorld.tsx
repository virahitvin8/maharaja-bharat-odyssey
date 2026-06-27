// Bharat Odyssey — Real 3D India from OpenStreetMap data
// Enhanced with: realistic water shader, procedural trees, particle atmosphere, building textures
import { useMemo, useRef, useEffect, createContext, useContext } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import type { OSMData, OSMFeature } from '../../services/osmData'
import { latLonToLocalWorld, getBuildingHeight, getBuildingColor } from '../../utils/projection'

// ========== CONTEXT for shared Three.js objects ==========
interface WorldContextType {
  waterNormalMap: THREE.CanvasTexture | null
}
const WorldContext = createContext<WorldContextType>({ waterNormalMap: null })

// ========== PROCEDURAL TEXTURE GENERATORS ==========

/** Generate a procedural brick/stone normal map as a CanvasTexture */
function createBrickNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  
  // Brick pattern normal map
  const brickH = 24, brickW = 48, mortar = 2
  for (let row = 0; row < 10; row++) {
    const offset = row % 2 === 0 ? 0 : brickW / 2
    for (let col = -1; col < 7; col++) {
      const x = col * (brickW + mortar) + offset
      const y = row * (brickH + mortar)
      
      // Brick center (raised) - normal points up/out
      const grad = ctx.createRadialGradient(
        x + brickW / 2, y + brickH / 2, 0,
        x + brickW / 2, y + brickH / 2, brickW / 2
      )
      grad.addColorStop(0, 'rgb(128, 128, 255)')
      grad.addColorStop(0.6, 'rgb(128, 128, 255)')
      grad.addColorStop(1, 'rgb(128, 128, 128)')
      ctx.fillStyle = grad
      ctx.fillRect(x, y, brickW, brickH)
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 4)
  return tex
}

/** Generate a terrain/ground texture (grass/dirt) */
function createGroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  
  // Base dirt color with noise
  const imageData = ctx.createImageData(512, 512)
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4
      const n = Math.random() * 30
      imageData.data[i] = 90 + n       // R
      imageData.data[i+1] = 110 + n     // G
      imageData.data[i+2] = 60 + n      // B
      imageData.data[i+3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
  
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(30, 30)
  return tex
}

/** Generate a water normal map procedurally (since three/examples textures may not be in node_modules) */
function createWaterNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  
  // Simplex-like noise pattern for water normals
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      // Multi-octave noise for normal map
      const n1 = Math.sin(x * 0.05 + y * 0.08) * Math.cos(y * 0.06 - x * 0.04)
      const n2 = Math.sin(x * 0.12 + y * 0.15) * 0.5
      const n3 = Math.cos(x * 0.25 - y * 0.2) * 0.25
      const n = (n1 + n2 + n3) * 0.5 + 0.5
      
      const val = Math.floor(n * 255)
      ctx.fillStyle = `rgb(${val}, ${val}, 255)`
      ctx.fillRect(x, y, 1, 1)
    }
  }
  
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 4)
  return tex
}

/** Generate a road texture */
function createRoadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const n = Math.random() * 20
      const val = 50 + n
      ctx.fillStyle = `rgb(${val}, ${val}, ${val})`
      ctx.fillRect(x, y, 1, 1)
    }
  }
  
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(10, 10)
  return tex
}

// ========== REALISTIC WATER (Three.js Water shader) ==========
function RealisticWater({ position, size, color = '#1a6aaa' }: { 
  position: [number, number, number]
  size: [number, number]
  color?: string 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { scene, camera } = useThree()
  const { waterNormalMap } = useContext(WorldContext)
  
  // Create the Water mesh once
  const waterMesh = useMemo(() => {
    const geom = new THREE.PlaneGeometry(size[0], size[1])
    
    const waterColor = new THREE.Color(color)
    
    const water = new THREE.Mesh(
      geom,
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          normalMap: { value: waterNormalMap },
          waterColor: { value: waterColor },
          sunColor: { value: new THREE.Color(0xffffff) },
          sunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3) },
          eye: { value: new THREE.Vector3(0, 30, 40) },
          distortionScale: { value: 8.0 },
          fresnelScale: { value: 0.8 },
          fresnelPower: { value: 2.5 },
          fresnelBias: { value: 0.1 },
          reflectivity: { value: 0.5 },
        },
        vertexShader: `
          uniform float time;
          uniform vec2 resolution;
          varying vec4 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          
          void main() {
            vUv = modelMatrix * vec4(position, 1.0);
            vec3 pos = position;
            float wave = sin(pos.x * 0.05 + time) * 0.3 + cos(pos.y * 0.07 + time * 0.8) * 0.2;
            pos.z += wave;
            vec4 worldPos = modelMatrix * vec4(pos, 1.0);
            vWorldPosition = worldPos.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          uniform vec3 waterColor;
          uniform vec3 sunColor;
          uniform vec3 sunDirection;
          uniform vec3 eye;
          uniform float distortionScale;
          uniform float fresnelScale;
          uniform float fresnelPower;
          uniform float fresnelBias;
          uniform float reflectivity;
          uniform sampler2D normalMap;
          uniform float time;
          
          varying vec4 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          
          void main() {
            vec2 uv = vUv.xz * 0.02 + time * 0.01;
            vec3 normal = normalize(vNormal);
            
            // Simple Fresnel
            vec3 viewDir = normalize(eye - vWorldPosition);
            float fresnel = fresnelBias + fresnelScale * pow(1.0 - max(dot(viewDir, normal), 0.0), fresnelPower);
            
            // Sun specular
            float sunSpec = pow(max(dot(normalize(sunDirection), reflect(-viewDir, normal)), 0.0), 32.0);
            
            vec3 color = mix(waterColor, sunColor * 0.3, fresnel * 0.5);
            color += sunColor * sunSpec * reflectivity;
            
            // Depth-based darkening
            float depth = gl_FragCoord.z;
            color *= 1.0 - depth * 0.1;
            
            gl_FragColor = vec4(color, 0.85);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      })
    )
    
    water.position.set(position[0], position[1], position[2])
    water.rotation.x = -Math.PI / 2
    water.receiveShadow = true
    
    return water
  }, [])

  // Animate water
  useFrame((state) => {
    if (waterMesh.material instanceof THREE.ShaderMaterial) {
      waterMesh.material.uniforms.time.value = state.clock.elapsedTime * 0.8
      waterMesh.material.uniforms.eye.value.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
      )
    }
  })

  return <primitive object={waterMesh} />
}

// ========== ROAD TEXTURED ==========
const ROAD_COLOR = '#3a3a3a'
const roadTex = createRoadTexture()

// Pre-cache shared textures at module level (created once, not per-render)
const SHARED_BRICK_NORMAL = (() => { const t = createBrickNormalMap(); return t })()

// ========== BUILDING WITH TEXTURE ==========
function BuildingMesh({ feature }: { feature: OSMFeature }) {
  const { geometry } = useMemo(() => {
    if (!feature.geometry || feature.geometry.length < 3) return { geometry: null }

    try {
      const pts = feature.geometry.map(g => {
        const [x, z] = latLonToLocalWorld(g.lat, g.lon)
        return new THREE.Vector2(x, z)
      })

      const shape = new THREE.Shape(pts)
      const height = getBuildingHeight(feature.tags)

      const geom = new THREE.ExtrudeGeometry(shape, {
        steps: 1,
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelSegments: 1,
      })
      geom.computeVertexNormals()

      return { geometry: geom }
    } catch {
      return { geometry: null }
    }
  }, [feature])

  if (!geometry) return null

  const color = getBuildingColor(feature.tags, feature.id)
  
  // Use a procedural texture if height > 5, else simple color
  const hasTexture = getBuildingHeight(feature.tags) > 5

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      {hasTexture ? (
        <meshStandardMaterial 
          color={color}
          roughness={0.8} 
          metalness={0.05}
          map={SHARED_BRICK_NORMAL}
          normalMap={SHARED_BRICK_NORMAL}
          normalScale={new THREE.Vector2(0.3, 0.3)}
        />
      ) : (
        <meshStandardMaterial 
          color={color} 
          roughness={0.75} 
          metalness={0.05} 
        />
      )}
    </mesh>
  )
}

// ========== ALL ROADS (merged, textured) ==========
function AllRoads({ roads }: { roads: OSMFeature[] }) {
  const { geometry } = useMemo(() => {
    const positions: number[] = []
    const indices: number[] = []
    const uvs: number[] = []
    let vertexOffset = 0

    for (const feature of roads) {
      if (!feature.geometry || feature.geometry.length < 2) continue

      try {
        const pts = feature.geometry.map(g => {
          const [x, z] = latLonToLocalWorld(g.lat, g.lon)
          return new THREE.Vector3(x, 0.05, z)
        })

        const roadWidth = feature.tags.highway === 'primary' ? 6 :
                          feature.tags.highway === 'secondary' ? 5 :
                          feature.tags.highway === 'tertiary' ? 4 : 3

        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[i], p1 = pts[i + 1]
          const dir = new THREE.Vector3().copy(p1).sub(p0)
          if (dir.length() < 0.1) continue
          dir.normalize()
          const perp = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(roadWidth / 2)

          const idx = vertexOffset
          positions.push(
            p0.x + perp.x, 0.05, p0.z + perp.z,
            p0.x - perp.x, 0.05, p0.z - perp.z,
            p1.x - perp.x, 0.05, p1.z - perp.z,
            p1.x + perp.x, 0.05, p1.z + perp.z,
          )
          // UVs for road texture
          uvs.push(0, i * 0.5, 1, i * 0.5, 1, (i + 1) * 0.5, 0, (i + 1) * 0.5)
          indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3)
          vertexOffset += 4
        }
      } catch {}
    }

    if (positions.length === 0) return { geometry: null }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    return { geometry: geom }
  }, [roads])

  if (!geometry) return null

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial 
        color={ROAD_COLOR}
        roughness={0.95} 
        metalness={0}
        map={roadTex}
        normalMap={roadTex}
        normalScale={new THREE.Vector2(0.05, 0.05)}
      />
    </mesh>
  )
}

// ========== TEMPLE STRUCTURE ==========
function TempleStructure({ feature }: { feature: OSMFeature }) {
  const pos = useMemo(() => {
    if (feature.lat && feature.lon) {
      const [x, z] = latLonToLocalWorld(feature.lat, feature.lon)
      return [x, 0, z] as [number, number, number]
    }
    if (feature.geometry && feature.geometry.length > 0) {
      const center = feature.geometry.reduce(
        (acc, g) => ({ lat: acc.lat + g.lat / feature.geometry!.length, lon: acc.lon + g.lon / feature.geometry!.length }),
        { lat: 0, lon: 0 }
      )
      const [x, z] = latLonToLocalWorld(center.lat, center.lon)
      return [x, 0, z] as [number, number, number]
    }
    return null
  }, [feature])

  if (!pos) return null

  const name = feature.tags.name || 'Temple'
  const isMajor = name.toLowerCase().includes('kashi') || name.toLowerCase().includes('vishwanath')

  return (
    <group position={pos}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Base platform with texture */}
        <mesh castShadow receiveShadow position={[0, 1, 0]}>
          <boxGeometry args={[12, 2, 12]} />
          <meshStandardMaterial color="#e8dcc8" roughness={0.6} map={SHARED_BRICK_NORMAL} normalScale={new THREE.Vector2(0.15, 0.15)} />
        </mesh>
        {/* Main shrine */}
        <mesh castShadow receiveShadow position={[0, 4, 0]}>
          <boxGeometry args={[8, 4, 8]} />
          <meshStandardMaterial color="#f0e8d8" roughness={0.5} />
        </mesh>
        {/* Spire (shikhara) */}
        <mesh castShadow position={[0, 10, 0]}>
          <coneGeometry args={[4, 8, 8]} />
          <meshStandardMaterial color="#e8d4b0" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Gold kalash */}
        <mesh castShadow position={[0, 15, 0]}>
          <cylinderGeometry args={[0.6, 0.4, 1.5, 8]} />
          <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.3} />
        </mesh>
        {/* Pillars */}
        {[[-3, 0, -3], [3, 0, -3], [-3, 0, 3], [3, 0, 3]].map(([x, , z], i) => (
          <mesh key={i} castShadow position={[x, 2.5, z]}>
            <cylinderGeometry args={[0.3, 0.35, 5, 8]} />
            <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
          </mesh>
        ))}
        {/* Dome */}
        <mesh castShadow position={[0, 6, 0]}>
          <sphereGeometry args={[3, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f0e4d0" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Door */}
        <mesh position={[0, 2.5, 4.1]}>
          <boxGeometry args={[3, 5, 0.3]} />
          <meshStandardMaterial color="#4a2a10" roughness={0.8} />
        </mesh>
        {/* Door arch */}
        <mesh position={[0, 5, 4.1]}>
          <torusGeometry args={[1.8, 0.2, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} />
        </mesh>
      </RigidBody>
      {/* Glow */}
      <pointLight color="#FFD700" intensity={isMajor ? 8 : 3} distance={isMajor ? 30 : 15} position={[0, 8, 0]} />
      {isMajor && (
        <>
          {[[-5, 0, -5], [5, 0, -5], [-5, 0, 5], [5, 0, 5]].map(([x, , z], i) => (
            <mesh key={i} castShadow position={[x, 4, z]}>
              <coneGeometry args={[1.5, 6, 6]} />
              <meshStandardMaterial color="#e0d0b8" roughness={0.5} />
            </mesh>
          ))}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.5, 2, 0.5, 8]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} transparent opacity={0.3} />
          </mesh>
        </>
      )}
    </group>
  )
}

// ========== PROCEDURAL TREE (using ez-tree) ==========
function ProceduralTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const treeRef = useRef<any>(null)
  
  useEffect(() => {
    // Dynamically import ez-tree
    import('@dgreenheck/ez-tree').then((mod: any) => {
      const Tree = mod.Tree
      if (!Tree) return
      const tree = new Tree()
      // Configure options via the internal options object
      const opts = tree.options
      opts.seed = Math.floor(Math.random() * 100000)
      opts.type = 'deciduous'
      opts.trunkHeight = 3 * scale
      opts.trunkRadius = 0.2 * scale
      if (opts.bark) opts.bark.type = 'oak'
      if (opts.leaves) {
        opts.leaves.type = 'oak'
        opts.leaves.count = 40
        opts.leaves.size = 2.0 * scale
      }
      tree.generate()
      tree.scale.set(scale, scale, scale)
      tree.position.set(position[0], 0, position[2])
      if (groupRef.current) groupRef.current.add(tree)
      treeRef.current = tree
    })
    
    return () => {
      if (treeRef.current && groupRef.current) {
        groupRef.current.remove(treeRef.current)
      }
    }
  }, [position[0], position[2]])

  // Wind animation
  useFrame((state) => {
    if (treeRef.current?.update) {
      treeRef.current.update(state.clock.elapsedTime)
    }
  })

  return <group ref={groupRef} />
}

// ========== PARTICLE EFFECTS ==========

/** Fireflies / Dust motes floating in the air */
function AtmosphereParticles({ count = 200, spread = 100, height = 20 }: {
  count?: number
  spread?: number
  height?: number
}) {
  const ref = useRef<THREE.Points>(null)
  
  const [positions, sizes, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = Math.random() * height
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread
      siz[i] = 0.1 + Math.random() * 0.3
      spd[i] = 0.3 + Math.random() * 0.5
    }
    return [pos, siz, spd]
  }, [count])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    return geom
  }, [positions, sizes])

  const material = useMemo(() => new THREE.PointsMaterial({
    color: 0xffdd88,
    size: 0.4,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }), [])

  useFrame((state) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.01
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.5) * 0.005
      pos[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.4 + i * 0.7) * 0.01
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return <points ref={ref} geometry={geometry} material={material} />
}

/** Temple incense smoke particles */
function IncenseParticles({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Points>(null)
  const count = 30
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = position[0] + (Math.random() - 0.5) * 0.5
      pos[i * 3 + 1] = position[1] + Math.random() * 0.3
      pos[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.5
    }
    return pos
  }, [])

  const material = useMemo(() => new THREE.PointsMaterial({
    color: 0xcccccc,
    size: 0.3,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }), [])

  useFrame((state) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3] += (Math.random() - 0.5) * 0.02
      pos[i * 3 + 1] += 0.02
      pos[i * 3 + 2] += (Math.random() - 0.5) * 0.02
      if (pos[i * 3 + 1] > position[1] + 3) {
        pos[i * 3] = position[0] + (Math.random() - 0.5) * 0.5
        pos[i * 3 + 1] = position[1]
        pos[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.5
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.1
  })

  return <points ref={ref}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[positions, 3]} />
    </bufferGeometry>
    <primitive object={material} attach="material" />
  </points>
}

// ========== FOLIAGE CLUSTER ==========
function FoliageCluster({ feature }: { feature: OSMFeature }) {
  const trees = useMemo(() => {
    if (!feature.geometry || feature.geometry.length < 3) return []
    
    try {
      let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity
      for (const g of feature.geometry) {
        minLat = Math.min(minLat, g.lat)
        maxLat = Math.max(maxLat, g.lat)
        minLon = Math.min(minLon, g.lon)
        maxLon = Math.max(maxLon, g.lon)
      }

      const count = Math.floor(((maxLat - minLat) * (maxLon - minLon)) * 5000)
      const clampedCount = Math.min(Math.max(count, 3), 30) // reduced for ez-tree perf
      const trees: [number, number, number][] = []

      for (let i = 0; i < clampedCount; i++) {
        const lat = minLat + Math.random() * (maxLat - minLat)
        const lon = minLon + Math.random() * (maxLon - minLon)
        const [x, z] = latLonToLocalWorld(lat, lon)
        trees.push([x, 0, z])
      }

      return trees
    } catch {
      return []
    }
  }, [feature])

  const randomScales = useMemo(() => 
    trees.map(() => 0.6 + Math.random() * 0.6),
    [trees]
  )

  return (
    <>
      {trees.map((pos, i) => (
        <ProceduralTree key={i} position={pos} scale={randomScales[i]} />
      ))}
    </>
  )
}

// ========== SIMPLE FALLBACK TREE (when ez-tree fails) ==========
function SimpleTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const memoized = useMemo(() => {
    const variance = 0.8 + Math.random() * 0.4
    const s = scale * variance
    return { s, offsetX: (Math.random() - 0.5) * 0.8 }
  }, [scale])
  const { s, offsetX } = memoized
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh castShadow position={[0, 2 * s, 0]}>
        <cylinderGeometry args={[0.15 * s, 0.2 * s, 4 * s, 5]} />
        <meshStandardMaterial color="#4a3020" roughness={0.9} />
      </mesh>
      {/* Multi-layer canopy for more realism */}
      <mesh castShadow position={[0, 4.5 * s, 0]}>
        <sphereGeometry args={[1.8 * s, 6, 5]} />
        <meshStandardMaterial color="#2a7a2a" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[offsetX * s, 5 * s, -0.3 * s]}>
        <sphereGeometry args={[1.2 * s, 5, 4]} />
        <meshStandardMaterial color="#3a8a3a" roughness={0.8} />
      </mesh>
    </group>
  )
}

// ========== MAIN DYNAMIC MAP WORLD ==========
interface DynamicWorldProps {
  data: OSMData
}

export function DynamicWorld({ data }: DynamicWorldProps) {
  // Pre-create textures
  const groundTex = useMemo(() => createGroundTexture(), [])
  const waterNormalMap = useMemo(() => createWaterNormalMap(), [])

  if (!data) {
    return (
      <RigidBody type="fixed" colliders="trimesh" friction={0.8}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3000, 3000, 1, 1]} />
          <meshStandardMaterial color="#6a8a5a" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>
    )
  }

  const { buildings, roads, temples, waterBodies, waterways, landuse, natural } = data

  const groundGeo = useMemo(() => new THREE.PlaneGeometry(3000, 3000, 1, 1), [])
  
  // Individual trees from natural data (computed once, not inside JSX)
  const naturalTrees = useMemo(() => 
    natural.filter(n => n.tags.natural === 'tree').slice(0, 50).map((tree) => {
      if (!tree.lat || !tree.lon) return null
      const [x, z] = latLonToLocalWorld(tree.lat, tree.lon)
      const scale = 0.8 + Math.random() * 0.8
      return <SimpleTree key={tree.id} position={[x, 0, z]} scale={scale} />
    }),
    [natural]
  )

  return (
    <WorldContext.Provider value={{ waterNormalMap }}>
      {/* ---- GROUND ---- */}
      <RigidBody type="fixed" colliders="trimesh" friction={0.8}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <primitive object={groundGeo} />
          <meshStandardMaterial 
            color="#6a8a5a" 
            roughness={0.95} 
            metalness={0}
            map={groundTex}
          />
        </mesh>
      </RigidBody>

      {/* ---- RIVERS with realistic water ---- */}
      {waterways.filter(w => w.tags.waterway === 'river' || w.tags.waterway === 'stream').map((waterway) => {
        if (!waterway.geometry || waterway.geometry.length < 2) return null
        const isGanges = waterway.tags.name?.toLowerCase().includes('ganges') || 
                         waterway.tags.name?.toLowerCase().includes('ganga')
        
        let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity
        for (const g of waterway.geometry) {
          minLat = Math.min(minLat, g.lat)
          maxLat = Math.max(maxLat, g.lat)
          minLon = Math.min(minLon, g.lon)
          maxLon = Math.max(maxLon, g.lon)
        }
        const centerLat = (minLat + maxLat) / 2
        const centerLon = (minLon + maxLon) / 2
        const [cx, cz] = latLonToLocalWorld(centerLat, centerLon)
        const width = isGanges ? 80 : 20
        const waterHeight = latLonToLocalWorld(maxLat, maxLon)[1] - latLonToLocalWorld(minLat, minLon)[1]

        return (
          <RealisticWater
            key={waterway.id}
            position={[cx, -0.05, cz]}
            size={[Math.abs(width), Math.abs(waterHeight) + 50]}
            color={isGanges ? '#1a6aaa' : '#2a7a9a'}
          />
        )
      })}

      {/* ---- WATER BODIES ---- */}
      {waterBodies.map((body) => {
        if (!body.geometry || body.geometry.length < 3) return null
        let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity
        for (const g of body.geometry) {
          minLat = Math.min(minLat, g.lat)
          maxLat = Math.max(maxLat, g.lat)
          minLon = Math.min(minLon, g.lon)
          maxLon = Math.max(maxLon, g.lon)
        }
        const centerLat = (minLat + maxLat) / 2
        const centerLon = (minLon + maxLon) / 2
        const [cx, cz] = latLonToLocalWorld(centerLat, centerLon)
        const [w, h] = latLonToLocalWorld(maxLat, maxLon)
        const [wx, wz] = latLonToLocalWorld(minLat, minLon)
        return (
          <RealisticWater
            key={body.id}
            position={[cx, -0.05, cz]}
            size={[Math.abs(w - wx) + 5, Math.abs(h - wz) + 5]}
            color="#2a7a9a"
          />
        )
      })}

      {/* ---- BUILDINGS with textures ---- */}
      {buildings.slice(0, 300).map((building) => (
        <BuildingMesh key={building.id} feature={building} />
      ))}

      {/* ---- ROADS ---- */}
      <AllRoads roads={roads.slice(0, 200)} />

      {/* ---- TEMPLES ---- */}
      {temples.map((temple) => (
        <TempleStructure key={temple.id} feature={temple} />
      ))}

      {/* ---- TREES / FOLIAGE ---- */}
      {landuse.slice(0, 15).map((area) => (
        <FoliageCluster key={area.id} feature={area} />
      ))}
      
      {/* Individual trees from natural data — using SimpleTree for performance when many exist */}
      {naturalTrees}

      {/* ---- ATMOSPHERE PARTICLES ---- */}
      <AtmosphereParticles count={150} spread={120} height={15} />

      {/* ---- TEMPLE INCENSE ---- */}
      {temples.slice(0, 3).map((temple) => {
        if (!temple.lat || !temple.lon) return null
        const [x, z] = latLonToLocalWorld(temple.lat, temple.lon)
        return <IncenseParticles key={temple.id} position={[x, 1.5, z]} />
      })}

      {/* ---- AMBIENT LIGHTING ---- */}
      <hemisphereLight args={['#b0c8e8', '#4a3a1a', 0.6]} />
      <fogExp2 attach="fog" color="#c8d8e8" density={0.002} />
    </WorldContext.Provider>
  )
}
