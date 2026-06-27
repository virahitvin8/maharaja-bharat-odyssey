// Varanasi (Kashi) — Real 3D city from OpenStreetMap data
// Renders actual buildings, streets, temples, Ganges river, and foliage
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import type { OSMData, OSMFeature } from '../../services/osmData'
import { latLonToLocalWorld, getBuildingHeight, getBuildingColor } from '../../utils/projection'

// ---- Water material (animated) ----
function WaterSurface({ position, size, color = '#1a6aaa' }: { position: [number, number, number]; size: [number, number]; color?: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 1.2 + position[0] * 0.1) * 0.06
    }
  })
  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent opacity={0.72}
        roughness={0.1} metalness={0.4}
        emissive={color} emissiveIntensity={0.15}
      />
    </mesh>
  )
}

// ---- Road Material ----
const ROAD_COLOR = '#3a3a3a'

// ---- Building Mesh ----
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

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  )
}

// ---- All Roads (merged into single geometry for performance) ----
function AllRoads({ roads }: { roads: OSMFeature[] }) {
  const { geometry } = useMemo(() => {
    const positions: number[] = []
    const indices: number[] = []
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
          indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3)
          vertexOffset += 4
        }
      } catch {}
    }

    if (positions.length === 0) return { geometry: null }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    return { geometry: geom }
  }, [roads])

  if (!geometry) return null

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color={ROAD_COLOR} roughness={0.9} metalness={0} />
    </mesh>
  )
}

// ---- Temple Structure (special 3D) ----
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
      {/* Temple platform */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* Base */}
        <mesh castShadow receiveShadow position={[0, 1, 0]}>
          <boxGeometry args={[12, 2, 12]} />
          <meshStandardMaterial color="#e8dcc8" roughness={0.6} />
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
        {/* Gold kalash on top */}
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
        {/* Door (entrance to interior) */}
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
      {/* Name label glow */}
      <pointLight color="#FFD700" intensity={isMajor ? 8 : 3} distance={isMajor ? 30 : 15} position={[0, 8, 0]} />
      {/* Additional major temple features */}
      {isMajor && (
        <>
          {/* Side towers */}
          {[[-5, 0, -5], [5, 0, -5], [-5, 0, 5], [5, 0, 5]].map(([x, , z], i) => (
            <mesh key={i} castShadow position={[x, 4, z]}>
              <coneGeometry args={[1.5, 6, 6]} />
              <meshStandardMaterial color="#e0d0b8" roughness={0.5} />
            </mesh>
          ))}
          {/* Sacred light beam */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.5, 2, 0.5, 8]} />
            <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1} transparent opacity={0.3} />
          </mesh>
        </>
      )}
    </group>
  )
}

// ---- Tree from OSM natural data ----
function OSMTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const s = scale * (0.8 + Math.random() * 0.4)
  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Trunk */}
      <mesh castShadow position={[0, 2 * s, 0]}>
        <cylinderGeometry args={[0.15 * s, 0.2 * s, 4 * s, 5]} />
        <meshStandardMaterial color="#4a3020" roughness={0.9} />
      </mesh>
      {/* Canopy */}
      <mesh castShadow position={[0, 5 * s, 0]}>
        <sphereGeometry args={[2 * s, 6, 5]} />
        <meshStandardMaterial color="#2a7a2a" roughness={0.8} />
      </mesh>
    </group>
  )
}

// ---- Foliage cluster from landuse data ----
function FoliageCluster({ feature }: { feature: OSMFeature }) {
  const trees = useMemo(() => {
    if (!feature.geometry || feature.geometry.length < 3) return []
    
    try {
      // Get bounding box
      let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity
      for (const g of feature.geometry) {
        minLat = Math.min(minLat, g.lat)
        maxLat = Math.max(maxLat, g.lat)
        minLon = Math.min(minLon, g.lon)
        maxLon = Math.max(maxLon, g.lon)
      }

      // Scatter trees within the bounding box
      const count = Math.floor(((maxLat - minLat) * (maxLon - minLon)) * 5000)
      const clampedCount = Math.min(Math.max(count, 3), 50)
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

  return (
    <>
      {trees.map((pos, i) => (
        <OSMTree key={i} position={pos} scale={0.8 + Math.random() * 0.6} />
      ))}
    </>
  )
}

// ---- Main Dynamic Map World ----
interface DynamicWorldProps {
  data: OSMData
  onLoadingChange?: (loading: boolean) => void
}

export function DynamicWorld({ data }: DynamicWorldProps) {
  // If no data yet, show an empty ground plane
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

  // Process buildings, roads, temples, etc.
  const { buildings, roads, temples, waterBodies, waterways, landuse, natural } = data

  // ---- Ground Plane (large enough for the city) ----
  const groundGeo = useMemo(() => new THREE.PlaneGeometry(3000, 3000, 1, 1), [])

  return (
    <>
      {/* ---- GROUND ---- */}
      <RigidBody type="fixed" colliders="trimesh" friction={0.8}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <primitive object={groundGeo} />
          <meshStandardMaterial color="#6a8a5a" roughness={0.95} metalness={0} />
        </mesh>
      </RigidBody>

      {/* ---- GANGES RIVER ---- */}
      {waterways.filter(w => w.tags.waterway === 'river' || w.tags.waterway === 'stream').map((waterway, i) => {
        if (!waterway.geometry || waterway.geometry.length < 2) return null
        // For the Ganges, create a wide water surface
        const isGanges = waterway.tags.name?.toLowerCase().includes('ganges') || 
                         waterway.tags.name?.toLowerCase().includes('ganga')
        
        // Get bounding box of the river geometry
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
        const height = latLonToLocalWorld(maxLat, maxLon)[1] - latLonToLocalWorld(minLat, minLon)[1]

        return (
          <WaterSurface
            key={waterway.id}
            position={[cx, -0.1, cz]}
            size={[Math.abs(width), Math.abs(height) + 50]}
            color={isGanges ? '#1a6aaa' : '#2a7a9a'}
          />
        )
      })}

      {/* ---- WATER BODIES ---- */}
      {waterBodies.map((body, i) => {
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
          <WaterSurface
            key={body.id}
            position={[cx, -0.1, cz]}
            size={[Math.abs(w - wx) + 5, Math.abs(h - wz) + 5]}
            color="#2a7a9a"
          />
        )
      })}

      {/* ---- BUILDINGS ---- */}
      {/* Render only a subset in view for performance */}
      {buildings.slice(0, 300).map((building) => (
        <BuildingMesh key={building.id} feature={building} />
      ))}

      {/* ---- ROADS (single merged mesh) ---- */}
      <AllRoads roads={roads.slice(0, 200)} />

      {/* ---- TEMPLES ---- */}
      {temples.map((temple) => (
        <TempleStructure key={temple.id} feature={temple} />
      ))}

      {/* ---- TREES / FOLIAGE from landuse ---- */}
      {landuse.slice(0, 30).map((area) => (
        <FoliageCluster key={area.id} feature={area} />
      ))}

      {/* ---- INDIVIDUAL TREES from natural data ---- */}
      {natural.filter(n => n.tags.natural === 'tree').slice(0, 100).map((tree) => {
        if (!tree.lat || !tree.lon) return null
        const [x, z] = latLonToLocalWorld(tree.lat, tree.lon)
        return <OSMTree key={tree.id} position={[x, 0, z]} scale={0.8 + Math.random() * 0.8} />
      })}

      {/* ---- AMBIENT LIGHTING ---- */}
      <hemisphereLight args={['#b0c8e8', '#4a3a1a', 0.6]} />
      <fogExp2 attach="fog" color="#c8d8e8" density={0.002} />
    </>
  )
}
