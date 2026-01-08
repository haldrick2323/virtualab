import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Beaker Scene
function BeakerModel({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group scale={1.5}>
        <mesh ref={meshRef}>
          <cylinderGeometry args={[0.6, 0.8, 2, 32, 1, true]} />
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
        
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.5, 0.7, 1.2, 32]} />
          <meshStandardMaterial color={color} transparent opacity={0.85} />
        </mesh>
        
        <mesh position={[0, 1, 0]}>
          <torusGeometry args={[0.6, 0.04, 16, 32]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.5} roughness={0.1} />
        </mesh>

        {/* Bubbles */}
        {[...Array(8)].map((_, i) => (
          <Float key={i} speed={3 + i * 0.5} floatIntensity={0.3}>
            <mesh position={[(Math.random() - 0.5) * 0.4, -0.5 + i * 0.15, (Math.random() - 0.5) * 0.4]}>
              <sphereGeometry args={[0.03 + Math.random() * 0.03, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          </Float>
        ))}
      </group>
    </Float>
  );
}

// Atom Model
function AtomModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} scale={1.2}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <MeshDistortMaterial color="#f97316" distort={0.3} speed={2} roughness={0.4} />
        </mesh>
        
        {[0, Math.PI / 3, -Math.PI / 3].map((rotation, i) => (
          <group key={i} rotation={[rotation, i * 0.5, 0]}>
            <mesh>
              <torusGeometry args={[1.2, 0.03, 16, 100]} />
              <meshStandardMaterial color="#14b8a6" transparent opacity={0.7} />
            </mesh>
            
            <Float speed={4 + i} rotationIntensity={0}>
              <mesh position={[1.2, 0, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
              </mesh>
            </Float>
          </group>
        ))}
      </group>
    </Float>
  );
}

// DNA Model
function DNAModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.3}>
        {Array.from({ length: 24 }).map((_, i) => {
          const y = (i - 12) * 0.18;
          const angle = i * 0.5;
          
          return (
            <group key={i}>
              <mesh position={[Math.cos(angle) * 0.4, y, Math.sin(angle) * 0.4]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#a855f7" />
              </mesh>
              
              <mesh position={[-Math.cos(angle) * 0.4, y, -Math.sin(angle) * 0.4]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color="#a855f7" />
              </mesh>
              
              {i % 2 === 0 && (
                <mesh position={[0, y, 0]} rotation={[0, angle, 0]}>
                  <cylinderGeometry args={[0.025, 0.025, 0.75, 8]} />
                  <meshStandardMaterial color={colors[i % 4]} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    </Float>
  );
}

// Molecule Model
function MoleculeModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef} scale={1.2}>
        {/* Central atom */}
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        
        {/* Surrounding atoms */}
        {[
          { pos: [0.8, 0.5, 0], color: '#3b82f6' },
          { pos: [-0.8, 0.5, 0], color: '#3b82f6' },
          { pos: [0, -0.8, 0.5], color: '#ef4444' },
          { pos: [0.5, 0, 0.8], color: '#ef4444' },
          { pos: [-0.5, 0, -0.8], color: '#eab308' },
        ].map((atom, i) => (
          <group key={i}>
            <mesh position={atom.pos as [number, number, number]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color={atom.color} />
            </mesh>
            {/* Bond */}
            <mesh position={[atom.pos[0] / 2, atom.pos[1] / 2, atom.pos[2] / 2]}>
              <cylinderGeometry args={[0.04, 0.04, Math.sqrt(atom.pos[0]**2 + atom.pos[1]**2 + atom.pos[2]**2) - 0.4, 8]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

// Cell Model
function CellModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.2}>
        {/* Cell membrane */}
        <mesh>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshPhysicalMaterial color="#ec4899" transparent opacity={0.3} roughness={0.2} transmission={0.6} />
        </mesh>
        
        {/* Nucleus */}
        <mesh position={[0.2, 0, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#7c3aed" />
        </mesh>
        
        {/* Nucleolus */}
        <mesh position={[0.3, 0.1, 0.1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#4c1d95" />
        </mesh>
        
        {/* Mitochondria */}
        {[[-0.5, 0.4, 0.3], [0.6, -0.3, 0.4], [-0.4, -0.5, -0.3]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[Math.random(), Math.random(), 0]}>
            <capsuleGeometry args={[0.08, 0.2, 8, 16]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
        ))}
        
        {/* ER */}
        <mesh position={[-0.3, 0.1, 0.5]}>
          <torusGeometry args={[0.2, 0.05, 8, 20]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </group>
    </Float>
  );
}

// Wave Model
function WaveModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y = Math.sin(state.clock.elapsedTime * 2 + i * 0.3) * 0.3;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[(i - 10) * 0.2, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color={`hsl(${180 + i * 8}, 70%, 50%)`} 
            emissive={`hsl(${180 + i * 8}, 70%, 30%)`}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* Wave line */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.5, 0.02, 8, 100, Math.PI]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Magnet Model
function MagnetModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef}>
        {/* Horseshoe magnet */}
        <mesh>
          <torusGeometry args={[0.6, 0.15, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        
        {/* North pole */}
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        
        {/* South pole */}
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
        
        {/* Field lines */}
        {[0.3, 0.5, 0.7].map((r, i) => (
          <mesh key={i} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[r, 0.01, 8, 32, Math.PI]} />
            <meshStandardMaterial color="#a855f7" transparent opacity={0.4 - i * 0.1} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Flask Model
function FlaskModel({ color }: { color: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef} scale={1.3}>
        {/* Flask body */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshPhysicalMaterial
            color="#e8f4f8"
            transparent
            opacity={0.25}
            roughness={0.05}
            transmission={0.95}
            thickness={0.3}
          />
        </mesh>
        
        {/* Liquid */}
        <mesh position={[0, -0.5, 0]}>
          <sphereGeometry args={[0.65, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
          <meshStandardMaterial color={color} transparent opacity={0.85} />
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.15, 0.25, 1, 32]} />
          <meshPhysicalMaterial
            color="#e8f4f8"
            transparent
            opacity={0.3}
            roughness={0.05}
            transmission={0.9}
          />
        </mesh>

        {/* Vapor/steam effect */}
        {[...Array(5)].map((_, i) => (
          <Float key={i} speed={2 + i} floatIntensity={0.5}>
            <mesh position={[0, 1.2 + i * 0.15, 0]}>
              <sphereGeometry args={[0.05 + i * 0.02, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.3 - i * 0.05} />
            </mesh>
          </Float>
        ))}
      </group>
    </Float>
  );
}

interface TopicSceneProps {
  modelType: string;
  color?: string;
}

export default function TopicScene({ modelType, color = '#14b8a6' }: TopicSceneProps) {
  const renderModel = () => {
    switch (modelType) {
      case '3d-beaker':
        return <BeakerModel color={color} />;
      case '3d-atom':
        return <AtomModel />;
      case '3d-dna':
        return <DNAModel />;
      case '3d-molecule':
        return <MoleculeModel />;
      case '3d-cell':
        return <CellModel />;
      case '3d-wave':
        return <WaveModel />;
      case '3d-magnet':
        return <MagnetModel />;
      case '3d-flask':
        return <FlaskModel color={color} />;
      default:
        return <AtomModel />;
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={50} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={1}
          />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-3, 2, -3]} intensity={0.5} color="#14b8a6" />
          <pointLight position={[3, 2, 3]} intensity={0.5} color="#f97316" />
          
          {renderModel()}
          
          <Environment preset="night" />
          
          <mesh scale={15}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#0f172a" side={THREE.BackSide} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
