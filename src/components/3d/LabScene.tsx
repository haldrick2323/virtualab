import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function Beaker({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Glass body */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.4, 0.5, 1.5, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#a8d8ea"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      
      {/* Liquid inside */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.8, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </mesh>
      
      {/* Glass rim */}
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[0.4, 0.03, 16, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

function Flask({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Flask body - sphere */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color="#e8f4f8"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0}
          transmission={0.95}
          thickness={0.3}
        />
      </mesh>
      
      {/* Liquid */}
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
        <meshStandardMaterial color={color} transparent opacity={0.85} />
      </mesh>
      
      {/* Flask neck */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 0.8, 32]} />
        <meshPhysicalMaterial
          color="#e8f4f8"
          transparent
          opacity={0.3}
          roughness={0.05}
          transmission={0.9}
        />
      </mesh>
    </group>
  );
}

function TestTube({ position, rotation, color }: { position: [number, number, number]; rotation?: [number, number, number]; color: string }) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Tube body */}
      <mesh>
        <capsuleGeometry args={[0.12, 0.8, 16, 32]} />
        <meshPhysicalMaterial
          color="#f0f8ff"
          transparent
          opacity={0.25}
          roughness={0.05}
          transmission={0.92}
          thickness={0.2}
        />
      </mesh>
      
      {/* Liquid */}
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.09, 0.4, 16, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Microscope({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1, 0.1, 0.6]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Stage */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.4]} />
        <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Arm */}
      <mesh position={[-0.3, 0.6, 0]}>
        <boxGeometry args={[0.15, 1, 0.15]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Eyepiece */}
      <mesh position={[-0.15, 1.1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 32]} />
        <meshStandardMaterial color="#1a202c" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Objective */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.2, 32]} />
        <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function AtomModel({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Nucleus */}
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <MeshDistortMaterial
            color="#f97316"
            distort={0.3}
            speed={2}
            roughness={0.4}
          />
        </mesh>
        
        {/* Electron orbits */}
        {[0, Math.PI / 3, -Math.PI / 3].map((rotation, i) => (
          <group key={i} rotation={[rotation, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.8, 0.02, 16, 100]} />
              <meshStandardMaterial color="#14b8a6" transparent opacity={0.6} />
            </mesh>
            
            {/* Electron */}
            <mesh position={[0.8 * Math.cos(i * 2), 0, 0.8 * Math.sin(i * 2)]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

function DNAHelix({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
  
  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: 20 }).map((_, i) => {
        const y = (i - 10) * 0.15;
        const angle = i * 0.5;
        
        return (
          <group key={i}>
            {/* Left backbone */}
            <mesh position={[Math.cos(angle) * 0.3, y, Math.sin(angle) * 0.3]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#a855f7" />
            </mesh>
            
            {/* Right backbone */}
            <mesh position={[-Math.cos(angle) * 0.3, y, -Math.sin(angle) * 0.3]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#a855f7" />
            </mesh>
            
            {/* Base pair connection */}
            {i % 2 === 0 && (
              <mesh position={[0, y, 0]} rotation={[0, angle, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.55, 8]} />
                <meshStandardMaterial color={colors[i % 4]} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

function LabTable() {
  return (
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[8, 0.2, 4]} />
      <meshStandardMaterial color="#1e293b" roughness={0.8} />
    </mesh>
  );
}

function LabEnvironment() {
  return (
    <group>
      {/* Floor - white lab tiles */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Floor tile lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <group key={`floor-line-${i}`}>
          <mesh position={[(i - 5) * 2, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.02, 20]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
          <mesh position={[0, -0.58, (i - 5) * 2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.02, 20]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
        </group>
      ))}
      
      {/* Back wall */}
      <mesh position={[0, 3, -6]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-8, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 6.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      
      {/* Ceiling fluorescent lights */}
      {[[-3, 0], [3, 0], [0, -3], [0, 3]].map(([x, z], i) => (
        <group key={`ceiling-light-${i}`} position={[x, 6.3, z]}>
          <mesh>
            <boxGeometry args={[2, 0.1, 0.4]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
          <pointLight position={[0, -0.5, 0]} intensity={0.4} color="#f8fafc" distance={6} />
        </group>
      ))}
      
      {/* Window on left wall */}
      <group position={[-7.9, 3, -2]}>
        <mesh>
          <boxGeometry args={[0.1, 3, 4]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} emissive="#87ceeb" emissiveIntensity={0.3} />
        </mesh>
        {/* Window frame */}
        <mesh position={[0.05, 0, 0]}>
          <boxGeometry args={[0.15, 3.2, 0.1]} />
          <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 0, -2]}>
          <boxGeometry args={[0.15, 3.2, 0.1]} />
          <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 0, 2]}>
          <boxGeometry args={[0.15, 3.2, 0.1]} />
          <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 1.5, 0]}>
          <boxGeometry args={[0.15, 0.1, 4.2]} />
          <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, -1.5, 0]}>
          <boxGeometry args={[0.15, 0.1, 4.2]} />
          <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
      
      {/* Wall shelf with equipment */}
      <group position={[0, 2, -5.8]}>
        <mesh>
          <boxGeometry args={[6, 0.15, 0.6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Shelf brackets */}
        <mesh position={[-2.5, -0.2, 0.2]}>
          <boxGeometry args={[0.1, 0.4, 0.5]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
        <mesh position={[2.5, -0.2, 0.2]}>
          <boxGeometry args={[0.1, 0.4, 0.5]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
        {/* Books on shelf */}
        {[[-2, '#3b82f6'], [-1.6, '#ef4444'], [-1.3, '#22c55e'], [1.5, '#8b5cf6'], [1.8, '#f59e0b']].map(([x, color], i) => (
          <mesh key={`book-${i}`} position={[x as number, 0.25, 0]}>
            <boxGeometry args={[0.2, 0.4, 0.3]} />
            <meshStandardMaterial color={color as string} roughness={0.8} />
          </mesh>
        ))}
        {/* Small beakers on shelf */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.4, 16]} />
          <meshPhysicalMaterial color="#a8d8ea" transparent opacity={0.3} transmission={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.5, 0.25, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.3, 16]} />
          <meshPhysicalMaterial color="#a8d8ea" transparent opacity={0.3} transmission={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Lab cabinet on right */}
      <group position={[5, 0.8, -4]}>
        <mesh>
          <boxGeometry args={[2, 2.5, 0.8]} />
          <meshStandardMaterial color="#374151" roughness={0.7} />
        </mesh>
        {/* Cabinet doors */}
        <mesh position={[-0.45, 0, 0.42]}>
          <boxGeometry args={[0.9, 2.3, 0.05]} />
          <meshStandardMaterial color="#4b5563" roughness={0.6} />
        </mesh>
        <mesh position={[0.45, 0, 0.42]}>
          <boxGeometry args={[0.9, 2.3, 0.05]} />
          <meshStandardMaterial color="#4b5563" roughness={0.6} />
        </mesh>
        {/* Handles */}
        <mesh position={[-0.1, 0, 0.48]}>
          <boxGeometry args={[0.05, 0.3, 0.05]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.1, 0, 0.48]}>
          <boxGeometry args={[0.05, 0.3, 0.05]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Second lab table in background */}
      <group position={[-4, -0.4, -4]}>
        <mesh>
          <boxGeometry args={[4, 0.15, 1.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Table legs */}
        {[[-1.8, -0.6], [1.8, -0.6], [-1.8, 0.6], [1.8, 0.6]].map(([x, z], i) => (
          <mesh key={`bg-leg-${i}`} position={[x, -0.55, z]}>
            <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
            <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>
      
      {/* Lab sink on back wall */}
      <group position={[4, 0.1, -5.5]}>
        <mesh>
          <boxGeometry args={[1.2, 0.4, 0.8]} />
          <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1, 0.3, 0.6]} />
          <meshStandardMaterial color="#374151" roughness={0.3} />
        </mesh>
        {/* Faucet */}
        <mesh position={[0, 0.4, -0.3]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.55, -0.15]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Whiteboard on back wall */}
      <group position={[-3, 2.5, -5.9]}>
        <mesh>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        {/* Frame */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[3.2, 0.1, 0.15]} />
          <meshStandardMaterial color="#4b5563" metalness={0.5} />
        </mesh>
        <mesh position={[0, -1.05, 0]}>
          <boxGeometry args={[3.2, 0.1, 0.15]} />
          <meshStandardMaterial color="#4b5563" metalness={0.5} />
        </mesh>
        <mesh position={[-1.55, 0, 0]}>
          <boxGeometry args={[0.1, 2.2, 0.15]} />
          <meshStandardMaterial color="#4b5563" metalness={0.5} />
        </mesh>
        <mesh position={[1.55, 0, 0]}>
          <boxGeometry args={[0.1, 2.2, 0.15]} />
          <meshStandardMaterial color="#4b5563" metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function DustParticles() {
  const count = 50;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = Math.random() * 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#94a3b8" transparent opacity={0.4} />
    </points>
  );
}

export default function LabScene() {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[4, 2.5, 6]} fov={50} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2.1}
          />
          
          {/* Laboratory environment */}
          <LabEnvironment />
          
          {/* Main lighting - bright lab lighting */}
          <ambientLight intensity={0.6} color="#f8fafc" />
          <directionalLight 
            position={[5, 8, 5]} 
            intensity={1.2} 
            castShadow 
            color="#ffffff"
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Window light */}
          <directionalLight position={[-8, 4, -2]} intensity={0.8} color="#87ceeb" />
          
          {/* Accent lights on equipment */}
          <pointLight position={[-2, 1, 0]} intensity={0.3} color="#14b8a6" />
          <pointLight position={[0, 1, 0]} intensity={0.3} color="#f97316" />
          
          {/* Lab equipment on main table */}
          <LabTable />
          <Beaker position={[-2, 0.4, 0]} color="#14b8a6" />
          <Beaker position={[-1.2, 0.4, 0.5]} color="#a855f7" scale={0.8} />
          <Flask position={[0, 0.4, -0.3]} color="#f97316" />
          <TestTube position={[1.5, 0.4, 0.3]} rotation={[0, 0, 0.2]} color="#22c55e" />
          <TestTube position={[1.8, 0.4, -0.2]} rotation={[0, 0, -0.15]} color="#3b82f6" />
          <Microscope position={[2.5, -0.35, 0]} />
          
          {/* Floating educational models */}
          <AtomModel position={[-2.5, 2, 0]} />
          <DNAHelix position={[2.5, 2.5, -1]} />
          
          {/* Subtle dust particles in the air */}
          <DustParticles />
          
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>
    </div>
  );
}
