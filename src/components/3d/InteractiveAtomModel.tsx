import { Canvas, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Sparkles, ContactShadows, Html, Trail } from '@react-three/drei';
import { Suspense, useRef, useState, useCallback } from 'react';
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

const atomPartsInfo: Record<string, PartInfo> = {
  nucleus: {
    id: 'nucleus',
    name: 'Atomic Nucleus',
    description: 'The dense central core of an atom containing protons and neutrons, held together by the strong nuclear force.',
    facts: [
      'Contains 99.9% of the atom\'s mass',
      'Incredibly dense - if an atom were the size of a stadium, the nucleus would be the size of a pea',
      'Held together by the strongest force in nature',
      'Discovered by Ernest Rutherford in 1911'
    ],
    color: '#ff6b00'
  },
  proton: {
    id: 'proton',
    name: 'Protons',
    description: 'Positively charged subatomic particles found in the nucleus. The number of protons determines which element an atom is.',
    facts: [
      'Have a positive +1 electric charge',
      'Made up of three quarks (2 up, 1 down)',
      'Mass is approximately 1.67 × 10⁻²⁷ kg',
      'Number of protons = Atomic Number'
    ],
    color: '#dc2626'
  },
  neutron: {
    id: 'neutron',
    name: 'Neutrons',
    description: 'Electrically neutral particles in the nucleus that help stabilize atoms and affect their mass.',
    facts: [
      'Have no electric charge (neutral)',
      'Made up of three quarks (1 up, 2 down)',
      'Slightly heavier than protons',
      'Different numbers create isotopes'
    ],
    color: '#64748b'
  },
  electron: {
    id: 'electron',
    name: 'Electrons',
    description: 'Tiny, negatively charged particles that orbit the nucleus in electron shells, enabling chemical bonding.',
    facts: [
      'Have a negative -1 electric charge',
      'Mass is about 1/1836 of a proton',
      'Move in orbitals (probability clouds)',
      'Responsible for chemical reactions and bonding'
    ],
    color: '#22d3ee'
  },
  orbit: {
    id: 'orbit',
    name: 'Electron Orbitals',
    description: 'The paths and probability regions where electrons are likely to be found around the nucleus.',
    facts: [
      'Not fixed paths, but probability zones',
      'Different shapes: s, p, d, f orbitals',
      'Each orbital can hold 2 electrons max',
      'Energy levels increase with distance'
    ],
    color: '#0ea5e9'
  }
};

// Clickable part wrapper
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
      groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 8) * 0.05);
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
      
      {hovered && !isSelected && (
        <Html center distanceFactor={4}>
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 shadow-lg pointer-events-none whitespace-nowrap">
            <div className="flex items-center gap-2">
              <ZoomIn className="w-3 h-3 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {atomPartsInfo[partId]?.name || partId}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Interactive Atom Content
function InteractiveAtomContent({ 
  isInteracting, 
  selectedPart, 
  onSelectPart 
}: { 
  isInteracting: boolean; 
  selectedPart: string | null;
  onSelectPart: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const electronRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (groupRef.current && !selectedPart) {
      const speed = isInteracting ? 0.4 : 0.2;
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
    
    electronRefs.current.forEach((electron, i) => {
      if (electron) {
        const speed = selectedPart === 'electron' ? 1 : (isInteracting ? 3 : 1.5);
        const angle = state.clock.elapsedTime * (speed + i * 0.3) + i * (Math.PI * 2 / 3);
        const radius = 1.4;
        electron.position.x = Math.cos(angle) * radius;
        electron.position.z = Math.sin(angle) * radius;
      }
    });
  });

  const isPartSelected = (partId: string) => selectedPart === partId;
  const isAnySelected = selectedPart !== null;

  return (
    <Float speed={selectedPart ? 0 : 1.5} rotationIntensity={selectedPart ? 0 : 0.1} floatIntensity={selectedPart ? 0 : 0.2}>
      <group ref={groupRef} scale={1.3} position={[0, 0.3, 0]}>
        {/* Nucleus - Clickable */}
        <ClickablePart 
          partId="nucleus" 
          onSelect={onSelectPart} 
          isSelected={isPartSelected('nucleus')}
        >
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial 
              color="#ff6b00" 
              emissive="#ff4500" 
              emissiveIntensity={isPartSelected('nucleus') ? 1 : (isInteracting ? 0.6 : 0.3)}
              transparent
              opacity={isAnySelected && !isPartSelected('nucleus') && !isPartSelected('proton') && !isPartSelected('neutron') ? 0.4 : 1}
            />
          </mesh>
          {isPartSelected('nucleus') && (
            <mesh>
              <sphereGeometry args={[0.6, 32, 32]} />
              <meshStandardMaterial color="#ff6b00" transparent opacity={0.3} />
            </mesh>
          )}
        </ClickablePart>
        
        {/* Protons - Clickable */}
        <ClickablePart 
          partId="proton" 
          onSelect={onSelectPart} 
          isSelected={isPartSelected('proton')}
        >
          {[[-0.15, 0.1, 0.1], [0.15, -0.1, 0.1], [0, 0.1, -0.15], [0.1, -0.15, -0.1]].map((pos, i) => (
            <mesh key={`proton-${i}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial 
                color="#dc2626"
                emissive="#dc2626"
                emissiveIntensity={isPartSelected('proton') ? 0.6 : 0.1}
                transparent
                opacity={isAnySelected && !isPartSelected('proton') && !isPartSelected('nucleus') ? 0.4 : 1}
              />
            </mesh>
          ))}
        </ClickablePart>
        
        {/* Neutrons - Clickable */}
        <ClickablePart 
          partId="neutron" 
          onSelect={onSelectPart} 
          isSelected={isPartSelected('neutron')}
        >
          {[[0.1, 0.15, 0], [-0.1, -0.15, 0], [0, 0, 0.18], [-0.12, 0.05, -0.1]].map((pos, i) => (
            <mesh key={`neutron-${i}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial 
                color="#64748b"
                emissive="#64748b"
                emissiveIntensity={isPartSelected('neutron') ? 0.4 : 0}
                transparent
                opacity={isAnySelected && !isPartSelected('neutron') && !isPartSelected('nucleus') ? 0.4 : 1}
              />
            </mesh>
          ))}
        </ClickablePart>
        
        {/* Electron orbits and electrons */}
        {[0, Math.PI / 3, -Math.PI / 3].map((rotation, i) => (
          <group key={i} rotation={[rotation, i * 0.6, i * 0.3]}>
            {/* Orbit ring - Clickable */}
            <ClickablePart 
              partId="orbit" 
              onSelect={onSelectPart} 
              isSelected={isPartSelected('orbit')}
            >
              <mesh>
                <torusGeometry args={[1.4, 0.02, 16, 100]} />
                <meshStandardMaterial 
                  color="#0ea5e9" 
                  transparent 
                  opacity={isPartSelected('orbit') ? 0.9 : (isAnySelected && !isPartSelected('orbit') && !isPartSelected('electron') ? 0.2 : (isInteracting ? 0.6 : 0.35))}
                  emissive="#0ea5e9"
                  emissiveIntensity={isPartSelected('orbit') ? 0.5 : (isInteracting ? 0.2 : 0)}
                />
              </mesh>
            </ClickablePart>
            
            {/* Electron with trail - Clickable */}
            <ClickablePart 
              partId="electron" 
              onSelect={onSelectPart} 
              isSelected={isPartSelected('electron')}
            >
              <Trail
                width={isPartSelected('electron') ? 0.8 : (isInteracting ? 0.4 : 0.2)}
                length={isPartSelected('electron') ? 12 : (isInteracting ? 6 : 3)}
                color="#22d3ee"
                attenuation={(t) => t * t}
              >
                <mesh 
                  ref={el => { if (el) electronRefs.current[i] = el; }}
                  position={[1.4, 0, 0]}
                >
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshStandardMaterial 
                    color="#22d3ee" 
                    emissive="#22d3ee" 
                    emissiveIntensity={isPartSelected('electron') ? 3 : (isInteracting ? 1.5 : 0.8)}
                  />
                </mesh>
              </Trail>
              
              {/* Electron glow */}
              <mesh position={[1.4, 0, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial 
                  color="#22d3ee" 
                  transparent 
                  opacity={isPartSelected('electron') ? 0.5 : 0.25}
                />
              </mesh>
            </ClickablePart>
          </group>
        ))}
        
        {/* Energy particles when selected */}
        {selectedPart && (
          <Sparkles 
            count={50} 
            size={3} 
            scale={3} 
            color={atomPartsInfo[selectedPart]?.color || '#22d3ee'} 
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
  selectedPart 
}: { 
  selectedPart: string | null;
}) {
  const { camera } = useThree();
  const positionRef = useRef(new THREE.Vector3(4, 2.5, 4));
  const targetRef = useRef(new THREE.Vector3(0, 0.3, 0));
  
  useFrame(() => {
    let targetPos = new THREE.Vector3(0, 0.3, 0);
    let camPos = new THREE.Vector3(4, 2.5, 4);
    
    if (selectedPart === 'nucleus' || selectedPart === 'proton' || selectedPart === 'neutron') {
      camPos = new THREE.Vector3(1.5, 1, 1.5);
      targetPos = new THREE.Vector3(0, 0.3, 0);
    } else if (selectedPart === 'electron' || selectedPart === 'orbit') {
      camPos = new THREE.Vector3(3, 2, 3);
      targetPos = new THREE.Vector3(0, 0.3, 0);
    }
    
    positionRef.current.lerp(camPos, 0.05);
    targetRef.current.lerp(targetPos, 0.05);
    
    camera.position.copy(positionRef.current);
    camera.lookAt(targetRef.current);
  });
  
  return null;
}

// Laboratory Environment
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

      <Sparkles count={30} size={1} scale={[10, 6, 10]} position={[0, 2, 0]} color="#cbd5e1" opacity={0.2} />
    </group>
  );
}

// Info Panel Component
function InfoPanel({ partInfo, onClose }: { partInfo: PartInfo; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-4 bottom-4 w-80 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col z-50"
    >
      <div className="p-4 border-b border-border flex items-center justify-between" style={{ backgroundColor: `${partInfo.color}15` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: partInfo.color }}>
            <Info className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">{partInfo.name}</h3>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{partInfo.description}</p>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: partInfo.color }} />
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
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: partInfo.color }} />
                {fact}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">Click elsewhere or the × to explore other parts</p>
      </div>
    </motion.div>
  );
}

// Main Component
export default function InteractiveAtomModel() {
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  
  const handlePointerDown = useCallback(() => setIsInteracting(true), []);
  const handlePointerUp = useCallback(() => setIsInteracting(false), []);
  const handleSelectPart = useCallback((partId: string | null) => setSelectedPart(partId), []);

  const selectedPartInfo = selectedPart ? atomPartsInfo[selectedPart] : null;

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
          <CameraController selectedPart={selectedPart} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.5}
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
            <InteractiveAtomContent 
              isInteracting={isInteracting} 
              selectedPart={selectedPart}
              onSelectPart={handleSelectPart}
            />
          </group>
          
          <ContactShadows position={[0, -1.45, 0]} opacity={0.4} scale={8} blur={2} far={4} />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

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
              Click on any atomic part to learn more
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPartInfo && (
          <InfoPanel partInfo={selectedPartInfo} onClose={() => setSelectedPart(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
