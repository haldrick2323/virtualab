import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Sparkles, ContactShadows, Trail } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Interactive context for mouse tracking
function useMousePosition() {
  const { viewport } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return mouse;
}

// Animated Particle System
function ParticleSystem({ count = 100, color = '#14b8a6', radius = 2, isActive = false }: { 
  count?: number; 
  color?: string; 
  radius?: number;
  isActive?: boolean;
}) {
  const particles = useRef<THREE.Points>(null);
  const particlePositions = useRef<Float32Array>();
  const particleVelocities = useRef<Float32Array>();
  
  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * radius;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = Math.random() * 0.03 + 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    particlePositions.current = positions;
    particleVelocities.current = velocities;
    
    if (particles.current) {
      particles.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, [count, radius]);
  
  useFrame((state) => {
    if (!particles.current || !particlePositions.current || !particleVelocities.current) return;
    
    const positions = particlePositions.current;
    const velocities = particleVelocities.current;
    const speed = isActive ? 2 : 1;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] * speed;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * speed;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * speed;
      
      // Reset particles that go too far
      const dist = Math.sqrt(
        positions[i * 3] ** 2 + 
        positions[i * 3 + 1] ** 2 + 
        positions[i * 3 + 2] ** 2
      );
      
      if (dist > radius * 1.5 || positions[i * 3 + 1] > radius) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.3;
        positions[i * 3] = r * Math.cos(theta);
        positions[i * 3 + 1] = -radius * 0.5;
        positions[i * 3 + 2] = r * Math.sin(theta);
      }
    }
    
    particles.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particles}>
      <bufferGeometry />
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Bubble particle component
function Bubble({ position, speed, size, delay }: { 
  position: [number, number, number]; 
  speed: number; 
  size: number;
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.position.y = initialY + ((time * speed) % 2);
      meshRef.current.position.x = position[0] + Math.sin(time * 2) * 0.05;
      meshRef.current.position.z = position[2] + Math.cos(time * 2) * 0.05;
      
      // Pop and reset
      if (meshRef.current.position.y > 1) {
        meshRef.current.position.y = initialY;
      }
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transparent
        opacity={0.6}
        transmission={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

// Animated liquid surface with waves
function LiquidSurface({ color, radius = 0.5, height = 0 }: { color: string; radius?: number; height?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.CircleGeometry>(null);
  
  useFrame((state) => {
    if (meshRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const dist = Math.sqrt(x * x + y * y);
        
        // Create wave effect
        const wave = Math.sin(dist * 8 - time * 3) * 0.02;
        positions.setZ(i, wave);
      }
      
      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry ref={geometryRef} args={[radius, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        transparent 
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Laboratory Environment
function LabEnvironment() {
  return (
    <group>
      {/* Floor - Lab tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#e2e8f0" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Tile grid pattern on floor */}
      {Array.from({ length: 10 }).map((_, i) =>
        Array.from({ length: 10 }).map((_, j) => (
          <mesh 
            key={`tile-${i}-${j}`} 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[(i - 5) * 2, -1.99, (j - 5) * 2]}
          >
            <planeGeometry args={[1.9, 1.9]} />
            <meshStandardMaterial 
              color={((i + j) % 2 === 0) ? "#f1f5f9" : "#e2e8f0"} 
              roughness={0.2}
              metalness={0.05}
            />
          </mesh>
        ))
      )}

      {/* Back wall */}
      <mesh position={[0, 3, -8]} receiveShadow>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>

      {/* Lab table */}
      <group position={[0, -1.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 0.15, 3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
        </mesh>
        {[[-2.7, -0.5, 1.2], [2.7, -0.5, 1.2], [-2.7, -0.5, -1.2], [2.7, -0.5, -1.2]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.15, 1, 0.15]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Shelves on back wall */}
      <mesh position={[3, 1.5, -7.8]} castShadow>
        <boxGeometry args={[4, 0.1, 0.5]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-3, 2, -7.8]} castShadow>
        <boxGeometry args={[3, 0.1, 0.5]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Equipment on shelves - beakers */}
      {[2, 3, 4].map((x, i) => (
        <group key={i} position={[x, 1.7, -7.6]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.15, 0.4, 16]} />
            <meshPhysicalMaterial color="#b3e0ff" transparent opacity={0.4} transmission={0.8} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 0.2, 16]} />
            <meshStandardMaterial color={['#22c55e', '#3b82f6', '#ef4444'][i]} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Books on shelf */}
      {[-4, -3.5, -2.8].map((x, i) => (
        <mesh key={i} position={[x, 2.2, -7.6]} rotation={[0, Math.random() * 0.2, 0]}>
          <boxGeometry args={[0.25, 0.4, 0.3]} />
          <meshStandardMaterial color={['#1e40af', '#991b1b', '#166534'][i]} />
        </mesh>
      ))}

      {/* Side cabinet */}
      <group position={[5, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 4, 2]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </mesh>
        <mesh position={[0.76, 0.5, 0]}>
          <boxGeometry args={[0.02, 1.8, 1.8]} />
          <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0.76, -1.2, 0]}>
          <boxGeometry args={[0.02, 1.4, 1.8]} />
          <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* Ceiling with fluorescent lights */}
      <mesh position={[0, 6, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f1f5f9" side={THREE.DoubleSide} />
      </mesh>

      {/* Fluorescent light fixtures */}
      {[-3, 3].map((x, i) => (
        <group key={i} position={[x, 5.8, 0]}>
          <mesh>
            <boxGeometry args={[0.3, 0.1, 4]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.25, 0.05, 3.8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Window with light coming in */}
      <group position={[-8, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[4, 3]} />
          <meshBasicMaterial color="#87ceeb" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[4.2, 0.1, 0.1]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.1, 3.2, 0.1]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* Ambient dust particles */}
      <Sparkles count={50} size={1} scale={[10, 6, 10]} position={[0, 2, 0]} color="#cbd5e1" opacity={0.3} />
    </group>
  );
}

// Enhanced Beaker with interactive bubbles and liquid
function BeakerModel({ color, isInteracting }: { color: string; isInteracting: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle tilt based on mouse position
      meshRef.current.rotation.x = mouse.y * 0.1;
      meshRef.current.rotation.z = -mouse.x * 0.1;
    }
    
    if (liquidRef.current) {
      // Liquid sloshing effect
      const slosh = isInteracting ? 0.15 : 0.05;
      liquidRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * slosh + mouse.y * 0.1;
      liquidRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 2) * slosh - mouse.x * 0.1;
    }
  });

  const bubbles = Array.from({ length: isInteracting ? 20 : 8 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 0.3,
      -0.8 + Math.random() * 0.3,
      (Math.random() - 0.5) * 0.3
    ] as [number, number, number],
    speed: 0.3 + Math.random() * 0.4,
    size: 0.015 + Math.random() * 0.02,
    delay: Math.random() * 5
  }));

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group scale={1.8} position={[0, 0.5, 0]}>
        {/* Glass beaker body */}
        <mesh ref={meshRef} castShadow>
          <cylinderGeometry args={[0.5, 0.65, 1.8, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={0.25}
            roughness={0.05}
            metalness={0}
            transmission={0.95}
            thickness={0.8}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Bottom of beaker */}
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.64, 0.64, 0.02, 32]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.9}
            thickness={0.2}
          />
        </mesh>
        
        {/* Liquid with sloshing effect */}
        <group ref={liquidRef}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.45, 0.58, 1.1, 32]} />
            <meshPhysicalMaterial 
              color={color} 
              transparent 
              opacity={0.85}
              roughness={0.1}
              transmission={0.3}
              thickness={0.5}
            />
          </mesh>
          
          {/* Animated liquid surface */}
          <LiquidSurface color={color} radius={0.45} height={0.3} />
        </group>
        
        {/* Rim highlight */}
        <mesh position={[0, 0.9, 0]}>
          <torusGeometry args={[0.5, 0.025, 16, 32]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.6} roughness={0.05} metalness={0.1} />
        </mesh>

        {/* Measurement lines */}
        {[0, 0.3, 0.6].map((y, i) => (
          <mesh key={i} position={[0.52, -0.6 + y * 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.01, 0.08, 0.01]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        ))}

        {/* Interactive bubbles */}
        {bubbles.map((bubble, i) => (
          <Bubble key={i} {...bubble} />
        ))}
        
        {/* Particle system for active state */}
        {isInteracting && (
          <ParticleSystem count={50} color={color} radius={0.5} isActive={true} />
        )}
        
        {/* Glow effect when interacting */}
        {isInteracting && (
          <Sparkles count={30} size={2} scale={[1, 1.5, 1]} position={[0, 0, 0]} color={color} opacity={0.8} />
        )}
      </group>
    </Float>
  );
}

// Enhanced Atom Model with glowing electron trails
function AtomModel({ isInteracting }: { isInteracting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const electronRefs = useRef<THREE.Mesh[]>([]);
  const mouse = useMousePosition();
  
  useFrame((state) => {
    if (groupRef.current) {
      const speed = isInteracting ? 0.6 : 0.3;
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
      groupRef.current.rotation.x = mouse.y * 0.2;
      groupRef.current.rotation.z = mouse.x * 0.2;
    }
    
    electronRefs.current.forEach((electron, i) => {
      if (electron) {
        const speed = isInteracting ? 4 : 2;
        const angle = state.clock.elapsedTime * (speed + i * 0.5) + i * (Math.PI * 2 / 3);
        const radius = 1.4;
        electron.position.x = Math.cos(angle) * radius;
        electron.position.z = Math.sin(angle) * radius;
      }
    });
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} scale={1.3} position={[0, 0.3, 0]}>
        {/* Nucleus with protons and neutrons */}
        <group>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial 
              color="#ff6b00" 
              emissive="#ff4500" 
              emissiveIntensity={isInteracting ? 0.8 : 0.4} 
            />
          </mesh>
          {/* Nucleus glow */}
          {isInteracting && (
            <mesh>
              <sphereGeometry args={[0.6, 32, 32]} />
              <meshStandardMaterial color="#ff6b00" transparent opacity={0.2} />
            </mesh>
          )}
          {/* Protons */}
          {[[-0.15, 0.1, 0.1], [0.15, -0.1, 0.1], [0, 0.1, -0.15], [0.1, -0.15, -0.1]].map((pos, i) => (
            <mesh key={`proton-${i}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          ))}
          {/* Neutrons */}
          {[[0.1, 0.15, 0], [-0.1, -0.15, 0], [0, 0, 0.18], [-0.12, 0.05, -0.1]].map((pos, i) => (
            <mesh key={`neutron-${i}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          ))}
        </group>
        
        {/* Electron orbits with trails */}
        {[0, Math.PI / 3, -Math.PI / 3].map((rotation, i) => (
          <group key={i} rotation={[rotation, i * 0.6, i * 0.3]}>
            <mesh>
              <torusGeometry args={[1.4, 0.015, 16, 100]} />
              <meshStandardMaterial 
                color="#0ea5e9" 
                transparent 
                opacity={isInteracting ? 0.7 : 0.4}
                emissive="#0ea5e9"
                emissiveIntensity={isInteracting ? 0.3 : 0}
              />
            </mesh>
            
            {/* Electron with trail */}
            <Trail
              width={isInteracting ? 0.5 : 0.2}
              length={isInteracting ? 8 : 4}
              color="#22d3ee"
              attenuation={(t) => t * t}
            >
              <mesh 
                ref={el => { if (el) electronRefs.current[i] = el; }}
                position={[1.4, 0, 0]}
              >
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial 
                  color="#22d3ee" 
                  emissive="#22d3ee" 
                  emissiveIntensity={isInteracting ? 2 : 1}
                />
              </mesh>
            </Trail>
            
            {/* Electron glow */}
            <mesh position={[1.4, 0, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}
        
        {/* Energy particles when active */}
        {isInteracting && (
          <Sparkles count={60} size={3} scale={3} color="#22d3ee" opacity={0.8} speed={2} />
        )}
      </group>
    </Float>
  );
}

// Enhanced DNA Model with pulsing effect
function DNAModel({ isInteracting }: { isInteracting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();
  
  useFrame((state) => {
    if (groupRef.current) {
      const speed = isInteracting ? 0.5 : 0.25;
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
      groupRef.current.rotation.x = mouse.y * 0.15;
    }
  });

  const basePairColors = [
    { a: '#ef4444', b: '#22c55e' },
    { a: '#3b82f6', b: '#eab308' },
  ];
  
  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} scale={1.4} position={[0, 0.3, 0]}>
        {Array.from({ length: 28 }).map((_, i) => {
          const y = (i - 14) * 0.15;
          const angle = i * 0.45;
          const pairColor = basePairColors[i % 2];
          
          return (
            <group key={i}>
              {/* Backbone spheres with glow */}
              <mesh position={[Math.cos(angle) * 0.45, y, Math.sin(angle) * 0.45]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial 
                  color="#a855f7" 
                  roughness={0.3} 
                  metalness={0.2}
                  emissive="#a855f7"
                  emissiveIntensity={isInteracting ? 0.3 : 0}
                />
              </mesh>
              
              <mesh position={[-Math.cos(angle) * 0.45, y, -Math.sin(angle) * 0.45]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial 
                  color="#a855f7" 
                  roughness={0.3} 
                  metalness={0.2}
                  emissive="#a855f7"
                  emissiveIntensity={isInteracting ? 0.3 : 0}
                />
              </mesh>
              
              {/* Backbone connections */}
              {i < 27 && (
                <>
                  <mesh 
                    position={[
                      (Math.cos(angle) + Math.cos(angle + 0.45)) * 0.225,
                      y + 0.075,
                      (Math.sin(angle) + Math.sin(angle + 0.45)) * 0.225
                    ]}
                    rotation={[0, -angle - 0.225, Math.PI / 6]}
                  >
                    <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
                    <meshStandardMaterial color="#c084fc" />
                  </mesh>
                  <mesh 
                    position={[
                      -(Math.cos(angle) + Math.cos(angle + 0.45)) * 0.225,
                      y + 0.075,
                      -(Math.sin(angle) + Math.sin(angle + 0.45)) * 0.225
                    ]}
                    rotation={[0, angle + 0.225, -Math.PI / 6]}
                  >
                    <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
                    <meshStandardMaterial color="#c084fc" />
                  </mesh>
                </>
              )}
              
              {/* Base pairs */}
              {i % 2 === 0 && (
                <group rotation={[0, angle, 0]}>
                  <mesh position={[0.2, y, 0]}>
                    <boxGeometry args={[0.25, 0.06, 0.12]} />
                    <meshStandardMaterial 
                      color={pairColor.a} 
                      roughness={0.4}
                      emissive={pairColor.a}
                      emissiveIntensity={isInteracting ? 0.2 : 0}
                    />
                  </mesh>
                  <mesh position={[-0.2, y, 0]}>
                    <boxGeometry args={[0.25, 0.06, 0.12]} />
                    <meshStandardMaterial 
                      color={pairColor.b} 
                      roughness={0.4}
                      emissive={pairColor.b}
                      emissiveIntensity={isInteracting ? 0.2 : 0}
                    />
                  </mesh>
                  <mesh position={[0, y, 0]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
                    <meshStandardMaterial color="#94a3b8" transparent opacity={0.6} />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}
        
        {/* Particles around DNA */}
        {isInteracting && (
          <Sparkles count={40} size={2} scale={[1, 3, 1]} color="#a855f7" opacity={0.7} speed={1.5} />
        )}
      </group>
    </Float>
  );
}

// Enhanced Molecule Model with bond vibrations
function MoleculeModel({ isInteracting }: { isInteracting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();
  const atomRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.35;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1 + mouse.y * 0.1;
    }
    
    // Vibrate atoms when interacting
    if (isInteracting) {
      atomRefs.current.forEach((atom, i) => {
        if (atom) {
          const vibration = Math.sin(state.clock.elapsedTime * 15 + i) * 0.02;
          atom.position.x += vibration;
        }
      });
    }
  });

  const atoms = [
    { pos: [0, 0, 0], color: '#1a1a1a', size: 0.4, label: 'C' },
    { pos: [0.9, 0.5, 0.3], color: '#ef4444', size: 0.35, label: 'O' },
    { pos: [-0.9, 0.5, -0.3], color: '#ef4444', size: 0.35, label: 'O' },
    { pos: [0, -0.9, 0.5], color: '#3b82f6', size: 0.3, label: 'N' },
    { pos: [0.6, -0.3, -0.8], color: '#f8fafc', size: 0.2, label: 'H' },
    { pos: [-0.6, -0.3, 0.8], color: '#f8fafc', size: 0.2, label: 'H' },
  ];

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={groupRef} scale={1.3} position={[0, 0.3, 0]}>
        {atoms.map((atom, i) => (
          <group key={i}>
            <mesh 
              ref={el => { if (el) atomRefs.current[i] = el; }}
              position={atom.pos as [number, number, number]} 
              castShadow
            >
              <sphereGeometry args={[atom.size, 32, 32]} />
              <meshStandardMaterial 
                color={atom.color} 
                roughness={0.3}
                metalness={0.1}
                emissive={atom.color}
                emissiveIntensity={isInteracting ? 0.2 : 0}
              />
            </mesh>
            {/* Specular highlight */}
            <mesh position={[atom.pos[0] - atom.size * 0.3, atom.pos[1] + atom.size * 0.3, atom.pos[2] + atom.size * 0.3]}>
              <sphereGeometry args={[atom.size * 0.15, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          </group>
        ))}
        
        {/* Bonds */}
        {[
          { from: 0, to: 1, double: true },
          { from: 0, to: 2, double: true },
          { from: 0, to: 3, double: false },
          { from: 3, to: 4, double: false },
          { from: 3, to: 5, double: false },
        ].map((bond, i) => {
          const fromPos = atoms[bond.from].pos;
          const toPos = atoms[bond.to].pos;
          const midPoint = [
            (fromPos[0] + toPos[0]) / 2,
            (fromPos[1] + toPos[1]) / 2,
            (fromPos[2] + toPos[2]) / 2,
          ];
          const length = Math.sqrt(
            Math.pow(toPos[0] - fromPos[0], 2) +
            Math.pow(toPos[1] - fromPos[1], 2) +
            Math.pow(toPos[2] - fromPos[2], 2)
          ) - atoms[bond.from].size - atoms[bond.to].size + 0.1;
          
          const direction = new THREE.Vector3(
            toPos[0] - fromPos[0],
            toPos[1] - fromPos[1],
            toPos[2] - fromPos[2]
          ).normalize();
          
          const quaternion = new THREE.Quaternion();
          quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
          
          return (
            <group key={i}>
              <mesh position={midPoint as [number, number, number]} quaternion={quaternion}>
                <cylinderGeometry args={[0.06, 0.06, length, 16]} />
                <meshStandardMaterial 
                  color="#64748b" 
                  metalness={0.3} 
                  roughness={0.4}
                  emissive="#64748b"
                  emissiveIntensity={isInteracting ? 0.2 : 0}
                />
              </mesh>
              {bond.double && (
                <mesh position={[midPoint[0] + 0.1, midPoint[1], midPoint[2] + 0.1] as [number, number, number]} quaternion={quaternion}>
                  <cylinderGeometry args={[0.05, 0.05, length * 0.8, 16]} />
                  <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.4} />
                </mesh>
              )}
            </group>
          );
        })}
        
        {isInteracting && (
          <Sparkles count={40} size={2} scale={2} color="#22c55e" opacity={0.7} speed={2} />
        )}
      </group>
    </Float>
  );
}

// Enhanced Cell Model with flowing organelles
function CellModel({ isInteracting }: { isInteracting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = mouse.y * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
      <group ref={groupRef} scale={1.1} position={[0, 0.2, 0]}>
        {/* Cell membrane */}
        <mesh>
          <sphereGeometry args={[1.4, 64, 64]} />
          <meshPhysicalMaterial 
            color="#fda4af" 
            transparent 
            opacity={isInteracting ? 0.3 : 0.2}
            roughness={0.2}
            transmission={0.7}
            thickness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh>
          <sphereGeometry args={[1.35, 64, 64]} />
          <meshPhysicalMaterial 
            color="#fb7185" 
            transparent 
            opacity={0.15}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Cytoplasm with particles */}
        <mesh>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshStandardMaterial color="#fce7f3" transparent opacity={0.3} />
        </mesh>
        
        {/* Flowing particles inside cell */}
        {isInteracting && (
          <ParticleSystem count={80} color="#fb7185" radius={1.2} isActive={true} />
        )}
        
        {/* Nucleus */}
        <group position={[0.2, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshPhysicalMaterial 
              color="#7c3aed" 
              transparent 
              opacity={0.4}
              roughness={0.3}
              transmission={0.4}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial 
              color="#8b5cf6" 
              transparent 
              opacity={0.6}
              emissive="#8b5cf6"
              emissiveIntensity={isInteracting ? 0.3 : 0}
            />
          </mesh>
          <mesh position={[0.15, 0.1, 0.1]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#4c1d95" />
          </mesh>
          {/* Chromatin */}
          {[[-0.1, -0.1, 0.2], [0.2, -0.15, -0.1], [-0.15, 0.2, 0]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <torusKnotGeometry args={[0.06, 0.02, 32, 8]} />
              <meshStandardMaterial 
                color="#6d28d9"
                emissive="#6d28d9"
                emissiveIntensity={isInteracting ? 0.3 : 0}
              />
            </mesh>
          ))}
        </group>
        
        {/* Mitochondria */}
        {[
          { pos: [-0.6, 0.5, 0.4], rot: [0.3, 0.5, 0] },
          { pos: [0.7, -0.4, 0.5], rot: [-0.2, 0.8, 0.3] },
          { pos: [-0.5, -0.6, -0.4], rot: [0.5, -0.3, 0.2] },
          { pos: [0.3, 0.7, -0.5], rot: [-0.4, 0.2, -0.3] },
        ].map((mito, i) => (
          <Float key={i} speed={isInteracting ? 3 : 1} floatIntensity={0.1}>
            <group position={mito.pos as [number, number, number]} rotation={mito.rot as [number, number, number]}>
              <mesh>
                <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
                <meshStandardMaterial 
                  color="#f97316" 
                  roughness={0.4}
                  emissive="#f97316"
                  emissiveIntensity={isInteracting ? 0.3 : 0}
                />
              </mesh>
              <mesh position={[0, 0, 0.02]}>
                <boxGeometry args={[0.12, 0.02, 0.08]} />
                <meshStandardMaterial color="#fb923c" />
              </mesh>
            </group>
          </Float>
        ))}
        
        {/* Endoplasmic Reticulum */}
        <group position={[-0.4, 0.1, 0.6]}>
          {[0, 0.12, 0.24].map((offset, i) => (
            <mesh key={i} position={[offset * 0.5, offset, 0]} rotation={[0, 0, Math.PI / 6]}>
              <torusGeometry args={[0.15 - offset * 0.2, 0.03, 8, 24]} />
              <meshStandardMaterial 
                color="#3b82f6"
                emissive="#3b82f6"
                emissiveIntensity={isInteracting ? 0.2 : 0}
              />
            </mesh>
          ))}
        </group>
        
        {/* Golgi apparatus */}
        <group position={[0.6, 0.3, -0.5]} rotation={[0.3, 0.5, 0]}>
          {[0, 0.08, 0.16, 0.24].map((y, i) => (
            <mesh key={i} position={[0, y, i * 0.02]}>
              <torusGeometry args={[0.12 - i * 0.02, 0.025, 8, 24, Math.PI]} />
              <meshStandardMaterial 
                color="#eab308"
                emissive="#eab308"
                emissiveIntensity={isInteracting ? 0.2 : 0}
              />
            </mesh>
          ))}
        </group>
        
        {/* Ribosomes */}
        {Array.from({ length: 20 }).map((_, i) => {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const r = 0.9 + Math.random() * 0.3;
          return (
            <mesh 
              key={i} 
              position={[
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
              ]}
            >
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

// Enhanced Wave Model with animated particles
function WaveModel({ isInteracting }: { isInteracting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    const speed = isInteracting ? 5 : 3;
    const amplitude = isInteracting ? 0.8 : 0.5;
    
    pointsRef.current.forEach((point, i) => {
      if (point) {
        point.position.y = Math.sin(state.clock.elapsedTime * speed + i * 0.4) * amplitude;
        point.scale.setScalar(isInteracting ? 1.3 : 1);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Wave particles with trails */}
      {Array.from({ length: 25 }).map((_, i) => (
        <Trail
          key={i}
          width={isInteracting ? 0.3 : 0.15}
          length={isInteracting ? 5 : 3}
          color={`hsl(${200 + i * 6}, 80%, 55%)`}
          attenuation={(t) => t * t}
        >
          <mesh 
            ref={el => { if (el) pointsRef.current[i] = el; }}
            position={[(i - 12) * 0.18, 0, 0]}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial 
              color={`hsl(${200 + i * 6}, 80%, 55%)`} 
              emissive={`hsl(${200 + i * 6}, 80%, 35%)`}
              emissiveIntensity={isInteracting ? 0.8 : 0.5}
            />
          </mesh>
        </Trail>
      ))}
      
      {/* Wave envelope lines */}
      {[-0.6, 0, 0.6].map((z, lineIndex) => (
        <group key={lineIndex} position={[0, 0, z]}>
          {Array.from({ length: 24 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[(i - 11.5) * 0.18, Math.sin(i * 0.4) * 0.5, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
              <meshStandardMaterial color="#0ea5e9" transparent opacity={0.3 - lineIndex * 0.08} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Axis */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 5, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      <mesh position={[2.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      {isInteracting && (
        <Sparkles count={50} size={2} scale={[5, 2, 1]} color="#0ea5e9" opacity={0.7} speed={2} />
      )}
    </group>
  );
}

// Enhanced Magnet Model with animated field particles
function MagnetModel({ isInteracting }: { isInteracting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const fieldLinesRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      groupRef.current.rotation.x = mouse.y * 0.1;
    }
    if (fieldLinesRef.current) {
      const intensity = isInteracting ? 0.15 : 0.05;
      fieldLinesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * intensity;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} position={[0, 0.2, 0]}>
        {/* Horseshoe magnet body */}
        <mesh>
          <torusGeometry args={[0.7, 0.18, 16, 32, Math.PI]} />
          <meshStandardMaterial 
            color="#71717a" 
            roughness={0.3} 
            metalness={0.7}
            emissive="#71717a"
            emissiveIntensity={isInteracting ? 0.1 : 0}
          />
        </mesh>
        
        {/* North pole */}
        <group position={[-0.7, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.35, 0.7, 0.35]} />
            <meshStandardMaterial 
              color="#dc2626" 
              roughness={0.4} 
              metalness={0.5}
              emissive="#dc2626"
              emissiveIntensity={isInteracting ? 0.3 : 0}
            />
          </mesh>
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.02, 0.2, 0.15]} />
            <meshStandardMaterial color="#fef2f2" />
          </mesh>
        </group>
        
        {/* South pole */}
        <group position={[0.7, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.35, 0.7, 0.35]} />
            <meshStandardMaterial 
              color="#2563eb" 
              roughness={0.4} 
              metalness={0.5}
              emissive="#2563eb"
              emissiveIntensity={isInteracting ? 0.3 : 0}
            />
          </mesh>
          <mesh position={[-0.18, 0, 0]}>
            <boxGeometry args={[0.02, 0.2, 0.1]} />
            <meshStandardMaterial color="#eff6ff" />
          </mesh>
        </group>
        
        {/* Magnetic field lines */}
        <group ref={fieldLinesRef}>
          {[0.25, 0.45, 0.65].map((r, i) => (
            <group key={i}>
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3 - i * 0.15, 0]}>
                <torusGeometry args={[0.5 + i * 0.15, 0.008, 8, 32, Math.PI]} />
                <meshStandardMaterial 
                  color="#a855f7" 
                  transparent 
                  opacity={isInteracting ? 0.8 : 0.6 - i * 0.15}
                  emissive="#a855f7"
                  emissiveIntensity={isInteracting ? 0.5 : 0.3}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5 + i * 0.12, 0]}>
                <torusGeometry args={[0.6 + i * 0.12, 0.008, 8, 32, Math.PI]} />
                <meshStandardMaterial 
                  color="#a855f7" 
                  transparent 
                  opacity={isInteracting ? 0.7 : 0.5 - i * 0.12}
                  emissive="#a855f7"
                  emissiveIntensity={isInteracting ? 0.4 : 0.2}
                />
              </mesh>
            </group>
          ))}
          
          {/* Field particles */}
          <Sparkles 
            count={isInteracting ? 60 : 30} 
            size={isInteracting ? 3 : 2} 
            scale={[2, 1.5, 0.5]} 
            color="#c084fc" 
            opacity={isInteracting ? 0.9 : 0.6}
            speed={isInteracting ? 3 : 1}
          />
        </group>
      </group>
    </Float>
  );
}

// Enhanced Flask Model with bubbling liquid
function FlaskModel({ color, isInteracting }: { color: string; isInteracting: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = mouse.y * 0.08;
      meshRef.current.rotation.z = -mouse.x * 0.08;
    }
    
    if (liquidRef.current) {
      const slosh = isInteracting ? 0.1 : 0.03;
      liquidRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * slosh;
      liquidRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 2) * slosh;
    }
  });

  const bubbles = Array.from({ length: isInteracting ? 15 : 6 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 0.4,
      -0.5 + Math.random() * 0.2,
      (Math.random() - 0.5) * 0.4
    ] as [number, number, number],
    speed: 0.25 + Math.random() * 0.3,
    size: 0.012 + Math.random() * 0.015,
    delay: Math.random() * 5
  }));

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.25}>
      <group ref={meshRef} scale={1.4} position={[0, 0.3, 0]}>
        {/* Flask body */}
        <mesh castShadow>
          <coneGeometry args={[0.9, 1.2, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={0.2}
            roughness={0.05}
            transmission={0.95}
            thickness={0.5}
            ior={1.5}
            clearcoat={1}
          />
        </mesh>
        
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.88, 0.88, 0.02, 32]} />
          <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.25} transmission={0.9} />
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.18, 1, 32]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={0.25}
            roughness={0.05}
            transmission={0.95}
            thickness={0.3}
          />
        </mesh>
        
        {/* Liquid with sloshing */}
        <group ref={liquidRef}>
          <mesh position={[0, -0.35, 0]}>
            <coneGeometry args={[0.7, 0.6, 32]} />
            <meshPhysicalMaterial 
              color={color} 
              transparent 
              opacity={0.85}
              roughness={0.15}
              transmission={0.2}
            />
          </mesh>
          
          <LiquidSurface color={color} radius={0.55} height={-0.05} />
        </group>
        
        {/* Cork stopper */}
        <mesh position={[0, 1.45, 0]}>
          <cylinderGeometry args={[0.13, 0.11, 0.2, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>

        {/* Rising vapor */}
        {[...Array(isInteracting ? 12 : 6)].map((_, i) => (
          <Float key={i} speed={2 + i * 0.5} floatIntensity={isInteracting ? 1 : 0.6}>
            <mesh position={[(Math.random() - 0.5) * 0.15, 1.6 + i * 0.1, (Math.random() - 0.5) * 0.15]}>
              <sphereGeometry args={[0.04 + i * 0.01, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={isInteracting ? 0.4 : 0.25 - i * 0.03} />
            </mesh>
          </Float>
        ))}
        
        {/* Bubbles in liquid */}
        {bubbles.map((bubble, i) => (
          <Bubble key={i} {...bubble} />
        ))}
        
        {/* Measurement markings */}
        {[0, 0.2, 0.4].map((y, i) => (
          <mesh key={i} position={[0.72 - y * 0.3, -0.5 + y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.008, 0.06, 0.008]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        ))}
        
        {isInteracting && (
          <Sparkles count={25} size={2} scale={[1, 1.5, 1]} position={[0, 0.5, 0]} color={color} opacity={0.7} />
        )}
      </group>
    </Float>
  );
}

interface TopicSceneProps {
  modelType: string;
  color?: string;
}

export default function TopicScene({ modelType, color = '#14b8a6' }: TopicSceneProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  
  const handlePointerDown = useCallback(() => setIsInteracting(true), []);
  const handlePointerUp = useCallback(() => setIsInteracting(false), []);
  
  const renderModel = () => {
    switch (modelType) {
      case '3d-beaker':
        return <BeakerModel color={color} isInteracting={isInteracting} />;
      case '3d-atom':
        return <AtomModel isInteracting={isInteracting} />;
      case '3d-dna':
        return <DNAModel isInteracting={isInteracting} />;
      case '3d-molecule':
        return <MoleculeModel isInteracting={isInteracting} />;
      case '3d-cell':
        return <CellModel isInteracting={isInteracting} />;
      case '3d-wave':
        return <WaveModel isInteracting={isInteracting} />;
      case '3d-magnet':
        return <MagnetModel isInteracting={isInteracting} />;
      case '3d-flask':
        return <FlaskModel color={color} isInteracting={isInteracting} />;
      default:
        return <AtomModel isInteracting={isInteracting} />;
    }
  };

  return (
    <div 
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[4, 2.5, 4]} fov={45} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={isInteracting ? 0 : 0.5}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 6}
          />
          
          {/* Realistic lab lighting */}
          <ambientLight intensity={0.4} color="#f8fafc" />
          <directionalLight 
            position={[5, 8, 5]} 
            intensity={1.2} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#e0f2fe" />
          <pointLight position={[-8, 3, 0]} intensity={0.6} color="#87ceeb" />
          <spotLight position={[-3, 6, 0]} intensity={0.3} color="#ffffff" angle={0.5} />
          <spotLight position={[3, 6, 0]} intensity={0.3} color="#ffffff" angle={0.5} />
          
          {/* Lab environment */}
          <LabEnvironment />
          
          {/* Main model */}
          <group position={[0, 0, 0]}>
            {renderModel()}
          </group>
          
          {/* Contact shadows */}
          <ContactShadows 
            position={[0, -1.45, 0]} 
            opacity={0.4} 
            scale={8} 
            blur={2} 
            far={4}
          />
          
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>
    </div>
  );
}