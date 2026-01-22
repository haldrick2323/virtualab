import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Sparkles, ContactShadows, Html, Text } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { X, ZoomIn, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Part information data
interface PartInfo {
  id: string;
  name: string;
  description: string;
  facts: string[];
  color: string;
}

const cellPartsInfo: Record<string, PartInfo> = {
  nucleus: {
    id: 'nucleus',
    name: 'Nucleus',
    description: 'The nucleus is the command center of the cell, containing genetic material (DNA) that controls all cellular activities.',
    facts: [
      'Contains all the cell\'s genetic information',
      'Surrounded by a double membrane called nuclear envelope',
      'Houses the nucleolus where ribosomes are made',
      'Controls protein synthesis and cell reproduction'
    ],
    color: '#7c3aed'
  },
  mitochondria: {
    id: 'mitochondria',
    name: 'Mitochondria',
    description: 'Known as the "powerhouse of the cell," mitochondria convert nutrients into ATP, the energy currency of cells.',
    facts: [
      'Produces over 90% of the cell\'s energy (ATP)',
      'Has its own DNA separate from the nucleus',
      'Can divide independently within the cell',
      'Believed to have once been separate organisms'
    ],
    color: '#f97316'
  },
  membrane: {
    id: 'membrane',
    name: 'Cell Membrane',
    description: 'The cell membrane is a flexible barrier that protects the cell while controlling what enters and exits.',
    facts: [
      'Made of a phospholipid bilayer',
      'Contains protein channels for transport',
      'Selectively permeable - controls substance flow',
      'About 7-8 nanometers thick'
    ],
    color: '#fb7185'
  },
  endoplasmic_reticulum: {
    id: 'endoplasmic_reticulum',
    name: 'Endoplasmic Reticulum',
    description: 'A network of membranes that manufactures, processes, and transports proteins and lipids.',
    facts: [
      'Two types: Rough ER (with ribosomes) and Smooth ER',
      'Rough ER synthesizes proteins',
      'Smooth ER produces lipids and detoxifies',
      'Connected directly to the nuclear envelope'
    ],
    color: '#3b82f6'
  },
  golgi: {
    id: 'golgi',
    name: 'Golgi Apparatus',
    description: 'The Golgi apparatus modifies, packages, and ships proteins and lipids to their destinations.',
    facts: [
      'Named after Camillo Golgi who discovered it',
      'Looks like stacked pancakes',
      'Adds "shipping labels" to proteins',
      'Creates lysosomes'
    ],
    color: '#eab308'
  },
  ribosome: {
    id: 'ribosome',
    name: 'Ribosomes',
    description: 'Tiny molecular machines that read genetic instructions and build proteins from amino acids.',
    facts: [
      'Made of RNA and protein',
      'Each cell contains millions of ribosomes',
      'Can be free-floating or attached to ER',
      'Work like a 3D printer for proteins'
    ],
    color: '#1e293b'
  },
  nucleolus: {
    id: 'nucleolus',
    name: 'Nucleolus',
    description: 'A dense structure inside the nucleus where ribosomal RNA is produced and ribosomes begin to assemble.',
    facts: [
      'Not surrounded by a membrane',
      'The largest structure in the nucleus',
      'Produces ribosomal subunits',
      'Can have multiple nucleoli in one nucleus'
    ],
    color: '#4c1d95'
  },
  cytoplasm: {
    id: 'cytoplasm',
    name: 'Cytoplasm',
    description: 'The gel-like substance filling the cell where organelles float and chemical reactions occur.',
    facts: [
      'Mostly water (about 80%)',
      'Contains enzymes for metabolic reactions',
      'Provides support and structure',
      'Allows organelle movement'
    ],
    color: '#fce7f3'
  }
};

// Clickable part wrapper component
function ClickablePart({ 
  children, 
  partId, 
  onSelect, 
  isSelected,
  position = [0, 0, 0]
}: { 
  children: React.ReactNode; 
  partId: string; 
  onSelect: (id: string | null) => void;
  isSelected: boolean;
  position?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current && hovered && !isSelected) {
      groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.03);
    } else if (groupRef.current && !isSelected) {
      groupRef.current.scale.setScalar(1);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(isSelected ? null : partId);
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {children}
      
      {/* Hover indicator */}
      {hovered && !isSelected && (
        <Html center distanceFactor={4}>
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 shadow-lg pointer-events-none whitespace-nowrap">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-3 h-3 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {cellPartsInfo[partId]?.name || partId}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Animated particle system for the cell
function CellParticles({ color = '#fb7185', isActive = false }: { color?: string; isActive?: boolean }) {
  const particles = useRef<THREE.Points>(null);
  const count = 60;
  const particlePositions = useRef<Float32Array>();
  const particleVelocities = useRef<Float32Array>();
  
  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * 1.2;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }
    
    particlePositions.current = positions;
    particleVelocities.current = velocities;
    
    if (particles.current) {
      particles.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, []);
  
  useFrame(() => {
    if (!particles.current || !particlePositions.current || !particleVelocities.current) return;
    
    const positions = particlePositions.current;
    const velocities = particleVelocities.current;
    const speed = isActive ? 1.5 : 1;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] * speed;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * speed;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * speed;
      
      const dist = Math.sqrt(
        positions[i * 3] ** 2 + 
        positions[i * 3 + 1] ** 2 + 
        positions[i * 3 + 2] ** 2
      );
      
      if (dist > 1.2) {
        const factor = -0.5;
        velocities[i * 3] = positions[i * 3] * factor * 0.02;
        velocities[i * 3 + 1] = positions[i * 3 + 1] * factor * 0.02;
        velocities[i * 3 + 2] = positions[i * 3 + 2] * factor * 0.02;
      }
    }
    
    particles.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particles}>
      <bufferGeometry />
      <pointsMaterial
        size={0.025}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Enhanced Interactive Cell Model
function InteractiveCellContent({ 
  isInteracting, 
  selectedPart, 
  onSelectPart 
}: { 
  isInteracting: boolean; 
  selectedPart: string | null;
  onSelectPart: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && !selectedPart) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const isPartSelected = (partId: string) => selectedPart === partId;
  const isAnySelected = selectedPart !== null;

  return (
    <Float speed={selectedPart ? 0 : 1.2} rotationIntensity={selectedPart ? 0 : 0.1} floatIntensity={selectedPart ? 0 : 0.15}>
      <group ref={groupRef} scale={1.1} position={[0, 0.2, 0]}>
        {/* Cell membrane - Clickable */}
        <ClickablePart 
          partId="membrane" 
          onSelect={onSelectPart} 
          isSelected={isPartSelected('membrane')}
        >
          <mesh>
            <sphereGeometry args={[1.4, 64, 64]} />
            <meshPhysicalMaterial 
              color="#fda4af" 
              transparent 
              opacity={isPartSelected('membrane') ? 0.5 : (isAnySelected ? 0.15 : (isInteracting ? 0.3 : 0.2))}
              roughness={0.2}
              transmission={0.7}
              thickness={0.3}
              side={THREE.DoubleSide}
              emissive="#fb7185"
              emissiveIntensity={isPartSelected('membrane') ? 0.3 : 0}
            />
          </mesh>
          
          <mesh>
            <sphereGeometry args={[1.35, 64, 64]} />
            <meshPhysicalMaterial 
              color="#fb7185" 
              transparent 
              opacity={isPartSelected('membrane') ? 0.25 : 0.1}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </ClickablePart>
        
        {/* Cytoplasm - Clickable */}
        <ClickablePart 
          partId="cytoplasm" 
          onSelect={onSelectPart} 
          isSelected={isPartSelected('cytoplasm')}
        >
          <mesh>
            <sphereGeometry args={[1.3, 32, 32]} />
            <meshStandardMaterial 
              color="#fce7f3" 
              transparent 
              opacity={isPartSelected('cytoplasm') ? 0.5 : 0.2}
              emissive="#fce7f3"
              emissiveIntensity={isPartSelected('cytoplasm') ? 0.2 : 0}
            />
          </mesh>
        </ClickablePart>
        
        {/* Flowing particles inside cell */}
        {(isInteracting || isPartSelected('cytoplasm')) && (
          <CellParticles color="#fb7185" isActive={true} />
        )}
        
        {/* Nucleus - Clickable */}
        <ClickablePart 
          partId="nucleus" 
          onSelect={onSelectPart} 
          isSelected={isPartSelected('nucleus')}
          position={[0.2, 0, 0]}
        >
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshPhysicalMaterial 
              color="#7c3aed" 
              transparent 
              opacity={isPartSelected('nucleus') ? 0.7 : (isAnySelected && !isPartSelected('nucleus') ? 0.2 : 0.4)}
              roughness={0.3}
              transmission={0.4}
              emissive="#7c3aed"
              emissiveIntensity={isPartSelected('nucleus') ? 0.5 : (isInteracting ? 0.1 : 0)}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshStandardMaterial 
              color="#8b5cf6" 
              transparent 
              opacity={isPartSelected('nucleus') ? 0.8 : 0.5}
              emissive="#8b5cf6"
              emissiveIntensity={isPartSelected('nucleus') ? 0.4 : (isInteracting ? 0.2 : 0)}
            />
          </mesh>
          
          {/* Nucleolus inside nucleus - Clickable */}
          <ClickablePart 
            partId="nucleolus" 
            onSelect={onSelectPart} 
            isSelected={isPartSelected('nucleolus')}
            position={[0.15, 0.1, 0.1]}
          >
            <mesh>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial 
                color="#4c1d95"
                emissive="#4c1d95"
                emissiveIntensity={isPartSelected('nucleolus') ? 0.5 : 0}
              />
            </mesh>
          </ClickablePart>
          
          {/* Chromatin */}
          {[[-0.1, -0.1, 0.2], [0.2, -0.15, -0.1], [-0.15, 0.2, 0]].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <torusKnotGeometry args={[0.06, 0.02, 32, 8]} />
              <meshStandardMaterial 
                color="#6d28d9"
                emissive="#6d28d9"
                emissiveIntensity={isPartSelected('nucleus') ? 0.4 : (isInteracting ? 0.2 : 0)}
              />
            </mesh>
          ))}
        </ClickablePart>
        
        {/* Mitochondria - Clickable */}
        {[
          { pos: [-0.6, 0.5, 0.4], rot: [0.3, 0.5, 0] },
          { pos: [0.7, -0.4, 0.5], rot: [-0.2, 0.8, 0.3] },
          { pos: [-0.5, -0.6, -0.4], rot: [0.5, -0.3, 0.2] },
          { pos: [0.3, 0.7, -0.5], rot: [-0.4, 0.2, -0.3] },
        ].map((mito, i) => (
          <ClickablePart 
            key={i}
            partId="mitochondria" 
            onSelect={onSelectPart} 
            isSelected={isPartSelected('mitochondria')}
            position={mito.pos as [number, number, number]}
          >
            <Float speed={isInteracting ? 3 : 1} floatIntensity={0.1}>
              <group rotation={mito.rot as [number, number, number]}>
                <mesh>
                  <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
                  <meshStandardMaterial 
                    color="#f97316" 
                    roughness={0.4}
                    emissive="#f97316"
                    emissiveIntensity={isPartSelected('mitochondria') ? 0.5 : (isInteracting ? 0.2 : 0)}
                    transparent
                    opacity={isAnySelected && !isPartSelected('mitochondria') ? 0.4 : 1}
                  />
                </mesh>
                {/* Cristae folds inside mitochondria */}
                {[-0.08, 0, 0.08].map((offset, j) => (
                  <mesh key={j} position={[0, offset, 0.02]}>
                    <boxGeometry args={[0.12, 0.02, 0.06]} />
                    <meshStandardMaterial 
                      color="#fb923c"
                      emissive="#fb923c"
                      emissiveIntensity={isPartSelected('mitochondria') ? 0.3 : 0}
                    />
                  </mesh>
                ))}
              </group>
            </Float>
          </ClickablePart>
        ))}
        
        {/* Endoplasmic Reticulum - Clickable */}
        <ClickablePart 
          partId="endoplasmic_reticulum" 
          onSelect={onSelectPart} 
          isSelected={isPartSelected('endoplasmic_reticulum')}
          position={[-0.4, 0.1, 0.6]}
        >
          {[0, 0.12, 0.24, 0.36].map((offset, i) => (
            <mesh key={i} position={[offset * 0.5, offset, 0]} rotation={[0, 0, Math.PI / 6]}>
              <torusGeometry args={[0.15 - offset * 0.15, 0.035, 8, 24]} />
              <meshStandardMaterial 
                color="#3b82f6"
                emissive="#3b82f6"
                emissiveIntensity={isPartSelected('endoplasmic_reticulum') ? 0.5 : (isInteracting ? 0.15 : 0)}
                transparent
                opacity={isAnySelected && !isPartSelected('endoplasmic_reticulum') ? 0.4 : 1}
              />
            </mesh>
          ))}
          {/* Attached ribosomes on rough ER */}
          {[[0.15, 0.05, 0.08], [0.1, 0.15, -0.05], [0.2, 0.2, 0.03]].map((pos, i) => (
            <mesh key={`rib-${i}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          ))}
        </ClickablePart>
        
        {/* Golgi apparatus - Clickable */}
        <ClickablePart 
          partId="golgi" 
          onSelect={onSelectPart} 
          isSelected={isPartSelected('golgi')}
          position={[0.6, 0.3, -0.5]}
        >
          <group rotation={[0.3, 0.5, 0]}>
            {[0, 0.08, 0.16, 0.24, 0.32].map((y, i) => (
              <mesh key={i} position={[0, y, i * 0.02]}>
                <torusGeometry args={[0.14 - i * 0.015, 0.028, 8, 24, Math.PI]} />
                <meshStandardMaterial 
                  color="#eab308"
                  emissive="#eab308"
                  emissiveIntensity={isPartSelected('golgi') ? 0.5 : (isInteracting ? 0.15 : 0)}
                  transparent
                  opacity={isAnySelected && !isPartSelected('golgi') ? 0.4 : 1}
                />
              </mesh>
            ))}
            {/* Vesicles budding off */}
            {[[0.18, 0.1, 0.05], [-0.16, 0.2, 0.08]].map((pos, i) => (
              <mesh key={`ves-${i}`} position={pos as [number, number, number]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial 
                  color="#fde047"
                  emissive="#fde047"
                  emissiveIntensity={isPartSelected('golgi') ? 0.3 : 0}
                />
              </mesh>
            ))}
          </group>
        </ClickablePart>
        
        {/* Ribosomes - Clickable (scattered) */}
        <ClickablePart 
          partId="ribosome" 
          onSelect={onSelectPart} 
          isSelected={isPartSelected('ribosome')}
        >
          {Array.from({ length: 25 }).map((_, i) => {
            const theta = (i / 25) * Math.PI * 2 + Math.sin(i * 0.7) * 0.5;
            const phi = Math.acos(1 - 2 * ((i + 0.5) / 25));
            const r = 0.85 + Math.sin(i * 1.3) * 0.25;
            return (
              <mesh 
                key={i} 
                position={[
                  r * Math.sin(phi) * Math.cos(theta),
                  r * Math.sin(phi) * Math.sin(theta),
                  r * Math.cos(phi)
                ]}
              >
                <sphereGeometry args={[0.028, 8, 8]} />
                <meshStandardMaterial 
                  color="#1e293b"
                  emissive="#1e293b"
                  emissiveIntensity={isPartSelected('ribosome') ? 0.5 : 0}
                  transparent
                  opacity={isAnySelected && !isPartSelected('ribosome') ? 0.3 : 1}
                />
              </mesh>
            );
          })}
        </ClickablePart>
        
        {/* Sparkles when part is selected */}
        {selectedPart && (
          <Sparkles 
            count={40} 
            size={3} 
            scale={2} 
            color={cellPartsInfo[selectedPart]?.color || '#ffffff'} 
            opacity={0.8} 
            speed={2} 
          />
        )}
      </group>
    </Float>
  );
}

// Camera controller for zoom
function CameraController({ 
  selectedPart, 
  partPositions 
}: { 
  selectedPart: string | null;
  partPositions: Record<string, [number, number, number]>;
}) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0.2, 0));
  const positionRef = useRef(new THREE.Vector3(4, 2.5, 4));
  
  useFrame(() => {
    const targetPosition = selectedPart && partPositions[selectedPart] 
      ? new THREE.Vector3(...partPositions[selectedPart]).add(new THREE.Vector3(0, 0.2, 0))
      : new THREE.Vector3(0, 0.2, 0);
    
    const cameraDistance = selectedPart ? 2.5 : 4;
    const cameraOffset = selectedPart 
      ? new THREE.Vector3(cameraDistance, cameraDistance * 0.6, cameraDistance)
      : new THREE.Vector3(4, 2.5, 4);
    
    const newCameraPos = targetPosition.clone().add(cameraOffset);
    
    targetRef.current.lerp(targetPosition, 0.05);
    positionRef.current.lerp(newCameraPos, 0.05);
    
    camera.position.copy(positionRef.current);
    camera.lookAt(targetRef.current);
  });
  
  return null;
}

// Laboratory Environment (simplified)
function LabEnvironment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.1} />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) =>
        Array.from({ length: 8 }).map((_, j) => (
          <mesh key={`tile-${i}-${j}`} rotation={[-Math.PI / 2, 0, 0]} position={[(i - 4) * 2, -1.99, (j - 4) * 2]}>
            <planeGeometry args={[1.9, 1.9]} />
            <meshStandardMaterial color={((i + j) % 2 === 0) ? "#f1f5f9" : "#e2e8f0"} roughness={0.2} />
          </mesh>
        ))
      )}

      <mesh position={[0, 3, -8]} receiveShadow>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>

      <group position={[0, -1.5, 0]}>
        <mesh castShadow receiveShadow>
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

      <Sparkles count={30} size={1} scale={[10, 6, 10]} position={[0, 2, 0]} color="#cbd5e1" opacity={0.2} />
    </group>
  );
}

// Info Panel Component
function InfoPanel({ 
  partInfo, 
  onClose 
}: { 
  partInfo: PartInfo; 
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-4 bottom-4 w-80 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col z-50"
    >
      {/* Header */}
      <div 
        className="p-4 border-b border-border flex items-center justify-between"
        style={{ backgroundColor: `${partInfo.color}15` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: partInfo.color }}
          >
            <Info className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">
            {partInfo.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {partInfo.description}
        </p>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: partInfo.color }}
            />
            Key Facts
          </h4>
          <ul className="space-y-2">
            {partInfo.facts.map((fact, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" 
                  style={{ backgroundColor: partInfo.color }}
                />
                {fact}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer hint */}
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Click elsewhere or the × to explore other parts
        </p>
      </div>
    </motion.div>
  );
}

// Part positions for camera zoom
const partPositions: Record<string, [number, number, number]> = {
  nucleus: [0.2, 0.2, 0],
  nucleolus: [0.35, 0.3, 0.1],
  mitochondria: [0, 0.2, 0.3],
  membrane: [0, 0.2, 0],
  endoplasmic_reticulum: [-0.4, 0.3, 0.6],
  golgi: [0.6, 0.5, -0.5],
  ribosome: [0, 0.2, 0],
  cytoplasm: [0, 0.2, 0]
};

// Main Component
interface InteractiveCellModelProps {
  color?: string;
}

export default function InteractiveCellModel({ color = '#fb7185' }: InteractiveCellModelProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  
  const handlePointerDown = useCallback(() => setIsInteracting(true), []);
  const handlePointerUp = useCallback(() => setIsInteracting(false), []);
  
  const handleSelectPart = useCallback((partId: string | null) => {
    setSelectedPart(partId);
  }, []);

  const selectedPartInfo = selectedPart ? cellPartsInfo[selectedPart] : null;

  return (
    <div 
      className="w-full h-full cursor-grab active:cursor-grabbing relative"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[4, 2.5, 4]} fov={45} />
          <CameraController selectedPart={selectedPart} partPositions={partPositions} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={10}
            autoRotate={!selectedPart}
            autoRotateSpeed={isInteracting ? 0 : 0.3}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 6}
          />
          
          <ambientLight intensity={0.5} color="#f8fafc" />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#e0f2fe" />
          <pointLight position={[-8, 3, 0]} intensity={0.5} color="#87ceeb" />
          
          <LabEnvironment />
          
          <group position={[0, 0, 0]}>
            <InteractiveCellContent 
              isInteracting={isInteracting} 
              selectedPart={selectedPart}
              onSelectPart={handleSelectPart}
            />
          </group>
          
          <ContactShadows position={[0, -1.45, 0]} opacity={0.4} scale={8} blur={2} far={4} />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

      {/* Instructions */}
      <AnimatePresence>
        {!selectedPart && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg"
          >
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ZoomIn className="w-4 h-4 text-primary" />
              Click on any cell part to learn more
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Panel */}
      <AnimatePresence>
        {selectedPartInfo && (
          <InfoPanel 
            partInfo={selectedPartInfo} 
            onClose={() => setSelectedPart(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
