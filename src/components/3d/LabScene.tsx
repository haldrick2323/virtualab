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

function ParticleField() {
  const count = 100;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
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
      <pointsMaterial size={0.03} color="#14b8a6" transparent opacity={0.6} />
    </points>
  );
}

export default function LabScene() {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={12}
            autoRotate
            autoRotateSpeed={0.5}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-3, 2, -3]} intensity={0.5} color="#14b8a6" />
          <pointLight position={[3, 2, 3]} intensity={0.5} color="#f97316" />
          
          {/* Lab equipment */}
          <LabTable />
          <Beaker position={[-2, 0.4, 0]} color="#14b8a6" />
          <Beaker position={[-1.2, 0.4, 0.5]} color="#a855f7" scale={0.8} />
          <Flask position={[0, 0.4, -0.3]} color="#f97316" />
          <TestTube position={[1.5, 0.4, 0.3]} rotation={[0, 0, 0.2]} color="#22c55e" />
          <TestTube position={[1.8, 0.4, -0.2]} rotation={[0, 0, -0.15]} color="#3b82f6" />
          <Microscope position={[2.5, -0.35, 0]} />
          
          {/* Floating models */}
          <AtomModel position={[-2.5, 2, 0]} />
          <DNAHelix position={[2.5, 2.5, -1]} />
          
          {/* Atmosphere */}
          <ParticleField />
          <Environment preset="night" />
          
          {/* Background gradient sphere */}
          <mesh scale={20}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#0f172a" side={THREE.BackSide} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
