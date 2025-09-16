"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text, Box, Sphere } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import * as THREE from "three"

interface IntroMotion3DProps {
  onComplete: () => void
}

// 3D Bar component with sine wave animation
function AnimatedBar({ position, index, selected, onSelect }: {
  position: [number, number, number]
  index: number
  selected: boolean
  onSelect: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Sine wave animation for bars
      const time = state.clock.getElapsedTime()
      const waveHeight = Math.sin(time * 2 + index * 0.5) * 0.5 + 1
      meshRef.current.scale.y = waveHeight
      
      // Auto-rotation
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[0.5, 1, 0.5]}
      onClick={onSelect}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={selected ? "#3b82f6" : hovered ? "#60a5fa" : "#e5e7eb"}
        emissive={selected ? "#1e40af" : hovered ? "#2563eb" : "#000000"}
        emissiveIntensity={selected ? 0.3 : hovered ? 0.1 : 0}
      />
    </Box>
  )
}

// 3D Cube component
function AnimatedCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      meshRef.current.rotation.x = time * 0.5
      meshRef.current.rotation.y = time * 0.3
      meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.2
    }
  })

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[0.8, 0.8, 0.8]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#7c3aed"
        emissiveIntensity={0.2}
        metalness={0.3}
        roughness={0.4}
      />
    </Box>
  )
}

// Lighting setup with ambient, directional, and point lights
function Lighting() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Directional light with shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Point lights for dynamic lighting */}
      <pointLight position={[-10, 0, -20]} color="#3b82f6" intensity={0.5} />
      <pointLight position={[10, 0, -20]} color="#8b5cf6" intensity={0.5} />
    </>
  )
}

// Main 3D Scene component
function Scene3D({ selectedBar, setSelectedBar }: {
  selectedBar: number | null
  setSelectedBar: (index: number | null) => void
}) {
  const { camera } = useThree()
  
  // Generate bar positions in a grid
  const barPositions = useMemo(() => {
    const positions: [number, number, number][] = []
    for (let i = 0; i < 12; i++) {
      const x = (i % 4) * 2 - 3
      const z = Math.floor(i / 4) * 2 - 2
      positions.push([x, 0, z])
    }
    return positions
  }, [])

  // Auto-rotation of the entire scene
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    camera.position.x = Math.cos(time * 0.2) * 8
    camera.position.z = Math.sin(time * 0.2) * 8
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <Lighting />
      
      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      
      {/* Animated bars */}
      {barPositions.map((position, index) => (
        <AnimatedBar
          key={index}
          position={position}
          index={index}
          selected={selectedBar === index}
          onSelect={() => setSelectedBar(selectedBar === index ? null : index)}
        />
      ))}
      
      {/* Animated cubes */}
      <AnimatedCube position={[0, 2, 0]} />
      <AnimatedCube position={[-4, 1.5, -4]} />
      <AnimatedCube position={[4, 1.8, -4]} />
      
      {/* 3D Text */}
      <Text
        position={[0, 3, 0]}
        fontSize={1}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        KrsjenSWb
      </Text>
      
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        autoRotate={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  )
}

// UI Overlay component
function UIOverlay({ selectedBar, onComplete }: {
  selectedBar: number | null
  onComplete: () => void
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Skip button */}
      <div className="absolute top-8 right-8 pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onComplete}
          className="glass text-muted-foreground hover:text-foreground"
          aria-label="Skip 3D animation"
        >
          Skip <span className="ml-1">→</span>
        </Button>
      </div>
      
      {/* Legend */}
      <div className="absolute top-8 left-8 pointer-events-auto">
        <div className="glass p-4 rounded-lg max-w-xs">
          <h3 className="font-semibold text-sm mb-2">Interactive 3D Scene</h3>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Hover bars to highlight</li>
            <li>• Click bars to select</li>
            <li>• Auto-rotating camera</li>
            <li>• Sine wave animations</li>
          </ul>
        </div>
      </div>
      
      {/* Selected data panel */}
      {selectedBar !== null && (
        <div className="absolute bottom-8 left-8 pointer-events-auto">
          <div className="glass p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Selected Bar #{selectedBar + 1}</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Position: {Math.floor(selectedBar / 4)}, {selectedBar % 4}</p>
              <p>Animation: Sine wave active</p>
              <p>Status: Interactive</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function IntroMotion3D({ onComplete }: IntroMotion3DProps) {
  const [selectedBar, setSelectedBar] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => onComplete(), 800)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-background via-background to-muted/20">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <Scene3D selectedBar={selectedBar} setSelectedBar={setSelectedBar} />
      </Canvas>
      
      {/* UI Overlay */}
      <UIOverlay selectedBar={selectedBar} onComplete={handleComplete} />
    </div>
  )
}
