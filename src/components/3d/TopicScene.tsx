import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, MeshDistortMaterial, useTexture, Sparkles, ContactShadows } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

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
        {/* Table top */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 0.15, 3]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Table legs */}
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
        {/* Cabinet doors */}
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
        {/* Window frame */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[4.2, 0.1, 0.1]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.1, 3.2, 0.1]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* Small dust particles / ambient particles */}
      <Sparkles count={50} size={1} scale={[10, 6, 10]} position={[0, 2, 0]} color="#cbd5e1" opacity={0.3} />
    </group>
  );
}

// Enhanced Beaker with realistic glass
function BeakerModel({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
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
        
        {/* Liquid with realistic refraction */}
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

        {/* Rising bubbles */}
        {[...Array(12)].map((_, i) => (
          <Float key={i} speed={3 + i * 0.3} floatIntensity={0.4}>
            <mesh position={[(Math.random() - 0.5) * 0.35, -0.5 + i * 0.12, (Math.random() - 0.5) * 0.35]}>
              <sphereGeometry args={[0.02 + Math.random() * 0.025, 16, 16]} />
              <meshPhysicalMaterial color="#ffffff" transparent opacity={0.5} transmission={0.8} roughness={0.1} />
            </mesh>
          </Float>
        ))}
      </group>
    </Float>
  );
}

// Enhanced Atom Model with glowing effects
function AtomModel() {
  const groupRef = useRef<THREE.Group>(null);
  const electronRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    // Animate electrons around orbits
    electronRefs.current.forEach((electron, i) => {
      if (electron) {
        const angle = state.clock.elapsedTime * (2 + i * 0.5) + i * (Math.PI * 2 / 3);
        const radius = 1.4;
        electron.position.x = Math.cos(angle) * radius;
        electron.position.z = Math.sin(angle) * radius;
      }
    });
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} scale={1.3} position={[0, 0.3, 0]}>
        {/* Nucleus with protons and neutrons */}
        <group>
          {/* Core glow */}
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#ff6b00" emissive="#ff4500" emissiveIntensity={0.4} />
          </mesh>
          {/* Protons (red) */}
          {[[-0.15, 0.1, 0.1], [0.15, -0.1, 0.1], [0, 0.1, -0.15], [0.1, -0.15, -0.1]].map((pos, i) => (
            <mesh key={`proton-${i}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          ))}
          {/* Neutrons (gray) */}
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
            {/* Orbit ring */}
            <mesh>
              <torusGeometry args={[1.4, 0.015, 16, 100]} />
              <meshStandardMaterial color="#0ea5e9" transparent opacity={0.4} />
            </mesh>
            
            {/* Electron with glow */}
            <mesh 
              ref={el => { if (el) electronRefs.current[i] = el; }}
              position={[1.4, 0, 0]}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial 
                color="#22d3ee" 
                emissive="#22d3ee" 
                emissiveIntensity={1}
              />
            </mesh>
            
            {/* Electron glow halo */}
            <mesh position={[1.4, 0, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

// Enhanced DNA Model with realistic structure
function DNAModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  const basePairColors = [
    { a: '#ef4444', b: '#22c55e' }, // A-T (red-green)
    { a: '#3b82f6', b: '#eab308' }, // G-C (blue-yellow)
  ];
  
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <group ref={groupRef} scale={1.4} position={[0, 0.3, 0]}>
        {Array.from({ length: 28 }).map((_, i) => {
          const y = (i - 14) * 0.15;
          const angle = i * 0.45;
          const pairColor = basePairColors[i % 2];
          
          return (
            <group key={i}>
              {/* Sugar-phosphate backbone - strand 1 */}
              <mesh position={[Math.cos(angle) * 0.45, y, Math.sin(angle) * 0.45]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial color="#a855f7" roughness={0.3} metalness={0.2} />
              </mesh>
              
              {/* Sugar-phosphate backbone - strand 2 */}
              <mesh position={[-Math.cos(angle) * 0.45, y, -Math.sin(angle) * 0.45]}>
                <sphereGeometry args={[0.07, 16, 16]} />
                <meshStandardMaterial color="#a855f7" roughness={0.3} metalness={0.2} />
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
              
              {/* Base pairs (every other) */}
              {i % 2 === 0 && (
                <group rotation={[0, angle, 0]}>
                  {/* Base 1 */}
                  <mesh position={[0.2, y, 0]}>
                    <boxGeometry args={[0.25, 0.06, 0.12]} />
                    <meshStandardMaterial color={pairColor.a} roughness={0.4} />
                  </mesh>
                  {/* Base 2 */}
                  <mesh position={[-0.2, y, 0]}>
                    <boxGeometry args={[0.25, 0.06, 0.12]} />
                    <meshStandardMaterial color={pairColor.b} roughness={0.4} />
                  </mesh>
                  {/* Hydrogen bond (dotted effect) */}
                  <mesh position={[0, y, 0]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
                    <meshStandardMaterial color="#94a3b8" transparent opacity={0.6} />
                  </mesh>
                </group>
              )}
            </group>
          );
        })}
      </group>
    </Float>
  );
}

// Enhanced Molecule Model 
function MoleculeModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.35;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  const atoms = [
    { pos: [0, 0, 0], color: '#1a1a1a', size: 0.4, label: 'C' }, // Carbon - center
    { pos: [0.9, 0.5, 0.3], color: '#ef4444', size: 0.35, label: 'O' }, // Oxygen
    { pos: [-0.9, 0.5, -0.3], color: '#ef4444', size: 0.35, label: 'O' }, // Oxygen
    { pos: [0, -0.9, 0.5], color: '#3b82f6', size: 0.3, label: 'N' }, // Nitrogen
    { pos: [0.6, -0.3, -0.8], color: '#f8fafc', size: 0.2, label: 'H' }, // Hydrogen
    { pos: [-0.6, -0.3, 0.8], color: '#f8fafc', size: 0.2, label: 'H' }, // Hydrogen
  ];

  return (
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.35}>
      <group ref={groupRef} scale={1.3} position={[0, 0.3, 0]}>
        {atoms.map((atom, i) => (
          <group key={i}>
            {/* Atom sphere with realistic shading */}
            <mesh position={atom.pos as [number, number, number]} castShadow>
              <sphereGeometry args={[atom.size, 32, 32]} />
              <meshStandardMaterial 
                color={atom.color} 
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
            {/* Specular highlight */}
            <mesh position={[atom.pos[0] - atom.size * 0.3, atom.pos[1] + atom.size * 0.3, atom.pos[2] + atom.size * 0.3]}>
              <sphereGeometry args={[atom.size * 0.15, 16, 16]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          </group>
        ))}
        
        {/* Bonds between atoms */}
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
                <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.4} />
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
      </group>
    </Float>
  );
}

// Enhanced Cell Model with organelles
function CellModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
      <group ref={groupRef} scale={1.1} position={[0, 0.2, 0]}>
        {/* Cell membrane - outer */}
        <mesh>
          <sphereGeometry args={[1.4, 64, 64]} />
          <meshPhysicalMaterial 
            color="#fda4af" 
            transparent 
            opacity={0.2}
            roughness={0.2}
            transmission={0.7}
            thickness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Cell membrane - phospholipid bilayer effect */}
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
        
        {/* Cytoplasm */}
        <mesh>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshStandardMaterial color="#fce7f3" transparent opacity={0.3} />
        </mesh>
        
        {/* Nucleus */}
        <group position={[0.2, 0, 0]}>
          {/* Nuclear envelope */}
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
          {/* Nucleoplasm */}
          <mesh>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial color="#8b5cf6" transparent opacity={0.6} />
          </mesh>
          {/* Nucleolus */}
          <mesh position={[0.15, 0.1, 0.1]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#4c1d95" />
          </mesh>
          {/* Chromatin */}
          {[[-0.1, -0.1, 0.2], [0.2, -0.15, -0.1], [-0.15, 0.2, 0]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <torusKnotGeometry args={[0.06, 0.02, 32, 8]} />
              <meshStandardMaterial color="#6d28d9" />
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
          <group key={i} position={mito.pos as [number, number, number]} rotation={mito.rot as [number, number, number]}>
            <mesh>
              <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
              <meshStandardMaterial color="#f97316" roughness={0.4} />
            </mesh>
            {/* Inner membrane folds (cristae) */}
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.12, 0.02, 0.08]} />
              <meshStandardMaterial color="#fb923c" />
            </mesh>
          </group>
        ))}
        
        {/* Endoplasmic Reticulum */}
        <group position={[-0.4, 0.1, 0.6]}>
          {[0, 0.12, 0.24].map((offset, i) => (
            <mesh key={i} position={[offset * 0.5, offset, 0]} rotation={[0, 0, Math.PI / 6]}>
              <torusGeometry args={[0.15 - offset * 0.2, 0.03, 8, 24]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
          ))}
        </group>
        
        {/* Golgi apparatus */}
        <group position={[0.6, 0.3, -0.5]} rotation={[0.3, 0.5, 0]}>
          {[0, 0.08, 0.16, 0.24].map((y, i) => (
            <mesh key={i} position={[0, y, i * 0.02]}>
              <torusGeometry args={[0.12 - i * 0.02, 0.025, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#eab308" />
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

// Enhanced Wave Model
function WaveModel() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    pointsRef.current.forEach((point, i) => {
      if (point) {
        point.position.y = Math.sin(state.clock.elapsedTime * 3 + i * 0.4) * 0.5;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      {/* Wave particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh 
          key={i} 
          ref={el => { if (el) pointsRef.current[i] = el; }}
          position={[(i - 12) * 0.18, 0, 0]}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color={`hsl(${200 + i * 6}, 80%, 55%)`} 
            emissive={`hsl(${200 + i * 6}, 80%, 35%)`}
            emissiveIntensity={0.5}
          />
        </mesh>
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
      
      {/* Arrows */}
      <mesh position={[2.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}

// Enhanced Magnet Model
function MagnetModel() {
  const groupRef = useRef<THREE.Group>(null);
  const fieldLinesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
    if (fieldLinesRef.current) {
      fieldLinesRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 0.2, 0]}>
        {/* Horseshoe magnet body */}
        <mesh>
          <torusGeometry args={[0.7, 0.18, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#71717a" roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* North pole (red) */}
        <group position={[-0.7, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.35, 0.7, 0.35]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* N label */}
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.02, 0.2, 0.15]} />
            <meshStandardMaterial color="#fef2f2" />
          </mesh>
        </group>
        
        {/* South pole (blue) */}
        <group position={[0.7, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.35, 0.7, 0.35]} />
            <meshStandardMaterial color="#2563eb" roughness={0.4} metalness={0.5} />
          </mesh>
          {/* S label */}
          <mesh position={[-0.18, 0, 0]}>
            <boxGeometry args={[0.02, 0.2, 0.1]} />
            <meshStandardMaterial color="#eff6ff" />
          </mesh>
        </group>
        
        {/* Magnetic field lines */}
        <group ref={fieldLinesRef}>
          {[0.25, 0.45, 0.65].map((r, i) => (
            <group key={i}>
              {/* Field lines between poles */}
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3 - i * 0.15, 0]}>
                <torusGeometry args={[0.5 + i * 0.15, 0.008, 8, 32, Math.PI]} />
                <meshStandardMaterial 
                  color="#a855f7" 
                  transparent 
                  opacity={0.6 - i * 0.15}
                  emissive="#a855f7"
                  emissiveIntensity={0.3}
                />
              </mesh>
              {/* Field lines above magnet */}
              <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5 + i * 0.12, 0]}>
                <torusGeometry args={[0.6 + i * 0.12, 0.008, 8, 32, Math.PI]} />
                <meshStandardMaterial 
                  color="#a855f7" 
                  transparent 
                  opacity={0.5 - i * 0.12}
                  emissive="#a855f7"
                  emissiveIntensity={0.2}
                />
              </mesh>
            </group>
          ))}
          
          {/* Moving particles along field lines */}
          <Sparkles count={30} size={2} scale={[2, 1.5, 0.5]} color="#c084fc" opacity={0.6} />
        </group>
      </group>
    </Float>
  );
}

// Enhanced Flask Model
function FlaskModel({ color }: { color: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
      <group ref={meshRef} scale={1.4} position={[0, 0.3, 0]}>
        {/* Flask body - Erlenmeyer shape */}
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
        
        {/* Flask bottom */}
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
        
        {/* Liquid */}
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
        
        {/* Liquid surface */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 32]} />
          <meshStandardMaterial color={color} transparent opacity={0.9} />
        </mesh>
        
        {/* Cork stopper */}
        <mesh position={[0, 1.45, 0]}>
          <cylinderGeometry args={[0.13, 0.11, 0.2, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>

        {/* Rising vapor */}
        {[...Array(6)].map((_, i) => (
          <Float key={i} speed={2 + i * 0.5} floatIntensity={0.6}>
            <mesh position={[(Math.random() - 0.5) * 0.15, 1.6 + i * 0.12, (Math.random() - 0.5) * 0.15]}>
              <sphereGeometry args={[0.04 + i * 0.015, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.25 - i * 0.03} />
            </mesh>
          </Float>
        ))}
        
        {/* Measurement markings */}
        {[0, 0.2, 0.4].map((y, i) => (
          <mesh key={i} position={[0.72 - y * 0.3, -0.5 + y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.008, 0.06, 0.008]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
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
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[4, 2.5, 4]} fov={45} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.5}
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
          <pointLight position={[-8, 3, 0]} intensity={0.6} color="#87ceeb" /> {/* Window light */}
          <spotLight position={[-3, 6, 0]} intensity={0.3} color="#ffffff" angle={0.5} />
          <spotLight position={[3, 6, 0]} intensity={0.3} color="#ffffff" angle={0.5} />
          
          {/* Lab environment */}
          <LabEnvironment />
          
          {/* Main model */}
          <group position={[0, 0, 0]}>
            {renderModel()}
          </group>
          
          {/* Contact shadows for realism */}
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
