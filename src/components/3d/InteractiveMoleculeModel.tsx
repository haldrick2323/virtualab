import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf } from 'lucide-react';
import PartsDropdown from './PartsDropdown';

interface PartInfo {
  id: string;
  name: string;
  description: string;
  facts: string[];
  color: string;
}

const moleculePartsInfo: Record<string, PartInfo> = {
  carbon: {
    id: 'carbon',
    name: 'Carbon Atom (C)',
    description: 'Carbon is the backbone of organic molecules. In glucose and other carbohydrates, carbon atoms form the central chain that gives the molecule its structure.',
    facts: [
      'Can form 4 covalent bonds with other atoms',
      'Essential for all known life forms',
      'Makes up 18% of the human body by mass',
      'Forms the backbone of organic molecules'
    ],
    color: '#1e293b'
  },
  oxygen: {
    id: 'oxygen',
    name: 'Oxygen Atom (O)',
    description: 'Oxygen atoms in glucose are essential for its chemical properties. They participate in hydrogen bonding and are released during photosynthesis.',
    facts: [
      'Product of photosynthesis (O₂ release)',
      'Makes up 65% of the human body by mass',
      'Can form 2 covalent bonds',
      'Essential for cellular respiration'
    ],
    color: '#ef4444'
  },
  hydrogen: {
    id: 'hydrogen',
    name: 'Hydrogen Atom (H)',
    description: 'Hydrogen is the most abundant element in the universe. In organic molecules, hydrogen atoms bond to carbon and oxygen, completing their electron shells.',
    facts: [
      'Lightest and most abundant element',
      'Forms one covalent bond',
      'Essential for pH balance in cells',
      'Released during photosynthesis from water'
    ],
    color: '#f8fafc'
  },
  chlorophyll: {
    id: 'chlorophyll',
    name: 'Chlorophyll',
    description: 'The green pigment in plants that captures light energy for photosynthesis. Located in chloroplasts, it converts light energy into chemical energy.',
    facts: [
      'Absorbs red and blue light, reflects green',
      'Contains magnesium at its center',
      'Found in thylakoid membranes',
      'Two main types: chlorophyll a and b'
    ],
    color: '#22c55e'
  },
  glucose: {
    id: 'glucose',
    name: 'Glucose Molecule (C₆H₁₂O₆)',
    description: 'The primary product of photosynthesis and the main energy source for cells. Plants convert CO₂ and H₂O into glucose using sunlight.',
    facts: [
      'Formula: C₆H₁₂O₆ (6 carbon sugar)',
      'Product of photosynthesis',
      'Universal cellular fuel source',
      'Stored as starch in plants, glycogen in animals'
    ],
    color: '#f59e0b'
  },
  bonds: {
    id: 'bonds',
    name: 'Covalent Bonds',
    description: 'Chemical bonds formed by sharing electrons between atoms. Single, double, and triple bonds can form depending on how many electrons are shared.',
    facts: [
      'Formed by sharing electron pairs',
      'Single bonds share 2 electrons',
      'Double bonds share 4 electrons',
      'Bond strength determines molecular stability'
    ],
    color: '#6366f1'
  }
};

interface ClickablePartProps {
  children: React.ReactNode;
  partId: string;
  selectedPart: string | null;
  onSelect: (id: string | null) => void;
}

function ClickablePart({ children, partId, selectedPart, onSelect }: ClickablePartProps) {
  const [hovered, setHovered] = useState(false);
  const info = moleculePartsInfo[partId];

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect(selectedPart === partId ? null : partId);
      }}
      onPointerOver={(e) => {
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
      {hovered && !selectedPart && (
        <Html center distanceFactor={10}>
          <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border shadow-lg">
            {info?.name || partId}
          </div>
        </Html>
      )}
    </group>
  );
}

function GlucoseMolecule({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const moleculeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (moleculeRef.current) {
      moleculeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // Simplified glucose ring structure positions
  const carbons = [
    { x: 0.8, y: 0, z: 0.5 },
    { x: 0.3, y: 0, z: 1 },
    { x: -0.5, y: 0, z: 0.8 },
    { x: -0.8, y: 0, z: 0 },
    { x: -0.3, y: 0, z: -0.8 },
    { x: 0.5, y: 0, z: -0.5 },
  ];

  const oxygens = [
    { x: 0.8, y: 0.6, z: 0.5 },
    { x: -0.5, y: 0.6, z: 0.8 },
    { x: -0.8, y: -0.6, z: 0 },
    { x: 0.5, y: 0.6, z: -0.5 },
    { x: 0, y: 0, z: 0 }, // Ring oxygen
    { x: 0.3, y: -0.6, z: 1 },
  ];

  const hydrogens = [
    { x: 1.2, y: 0, z: 0.8 },
    { x: 0.5, y: -0.5, z: 1.3 },
    { x: -0.8, y: -0.5, z: 1.1 },
    { x: -1.2, y: 0, z: -0.3 },
    { x: -0.5, y: 0.5, z: -1.1 },
    { x: 0.8, y: -0.5, z: -0.8 },
  ];

  const isCarbonSelected = selectedPart === 'carbon';
  const isOxygenSelected = selectedPart === 'oxygen';
  const isHydrogenSelected = selectedPart === 'hydrogen';
  const isGlucoseSelected = selectedPart === 'glucose';
  const isBondsSelected = selectedPart === 'bonds';

  return (
    <group ref={moleculeRef}>
      {/* Glucose clickable wrapper */}
      <ClickablePart partId="glucose" selectedPart={selectedPart} onSelect={onSelect}>
        <mesh visible={false}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </ClickablePart>

      {/* Carbon atoms */}
      {carbons.map((pos, i) => (
        <ClickablePart key={`c${i}`} partId="carbon" selectedPart={selectedPart} onSelect={onSelect}>
          <mesh position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshStandardMaterial 
              color={isCarbonSelected || isGlucoseSelected ? '#475569' : '#1e293b'} 
              emissive="#1e293b"
              emissiveIntensity={isCarbonSelected ? 0.3 : 0}
            />
          </mesh>
        </ClickablePart>
      ))}

      {/* Oxygen atoms */}
      {oxygens.map((pos, i) => (
        <ClickablePart key={`o${i}`} partId="oxygen" selectedPart={selectedPart} onSelect={onSelect}>
          <mesh position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
              color={isOxygenSelected || isGlucoseSelected ? '#f87171' : '#ef4444'} 
              emissive="#ef4444"
              emissiveIntensity={isOxygenSelected ? 0.4 : 0.1}
            />
          </mesh>
        </ClickablePart>
      ))}

      {/* Hydrogen atoms */}
      {hydrogens.map((pos, i) => (
        <ClickablePart key={`h${i}`} partId="hydrogen" selectedPart={selectedPart} onSelect={onSelect}>
          <mesh position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial 
              color={isHydrogenSelected || isGlucoseSelected ? '#ffffff' : '#e2e8f0'} 
              emissive="#f8fafc"
              emissiveIntensity={isHydrogenSelected ? 0.5 : 0.1}
            />
          </mesh>
        </ClickablePart>
      ))}

      {/* Bonds between atoms */}
      <ClickablePart partId="bonds" selectedPart={selectedPart} onSelect={onSelect}>
        <group>
          {carbons.map((pos, i) => {
            const nextC = carbons[(i + 1) % carbons.length];
            const midX = (pos.x + nextC.x) / 2;
            const midZ = (pos.z + nextC.z) / 2;
            const angle = Math.atan2(nextC.z - pos.z, nextC.x - pos.x);
            
            return (
              <mesh key={`bond${i}`} position={[midX, 0, midZ]} rotation={[0, -angle, Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
                <meshStandardMaterial 
                  color={isBondsSelected ? '#818cf8' : '#6366f1'}
                  emissive="#6366f1"
                  emissiveIntensity={isBondsSelected ? 0.4 : 0}
                />
              </mesh>
            );
          })}
        </group>
      </ClickablePart>
    </group>
  );
}

function Chloroplast({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const isSelected = selectedPart === 'chlorophyll';
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <ClickablePart partId="chlorophyll" selectedPart={selectedPart} onSelect={onSelect}>
        <group position={[-2, 0.5, 0]}>
          {/* Chloroplast outer membrane */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
            <meshStandardMaterial 
              color={isSelected ? '#4ade80' : '#22c55e'} 
              transparent 
              opacity={0.7}
              emissive="#22c55e"
              emissiveIntensity={isSelected ? 0.4 : 0.2}
            />
          </mesh>
          {/* Internal thylakoids */}
          {[-0.15, 0, 0.15].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.15, 0.03, 8, 16]} />
              <meshStandardMaterial 
                color="#16a34a" 
                emissive="#22c55e"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
          {isSelected && (
            <pointLight color="#22c55e" intensity={2} distance={2} />
          )}
        </group>
      </ClickablePart>
    </Float>
  );
}

function LabEnvironment() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <Sparkles count={40} scale={8} size={1.5} speed={0.3} opacity={0.3} color="#22c55e" />
    </>
  );
}

function CameraController({ selectedPart }: { selectedPart: string | null }) {
  const cameraRef = useRef<THREE.Vector3>(new THREE.Vector3(4, 2, 4));
  
  const partPositions: Record<string, THREE.Vector3> = {
    carbon: new THREE.Vector3(2, 1, 2),
    oxygen: new THREE.Vector3(2, 1.5, 2),
    hydrogen: new THREE.Vector3(2.5, 1, 2.5),
    glucose: new THREE.Vector3(3, 1.5, 3),
    bonds: new THREE.Vector3(2, 0.5, 2),
    chlorophyll: new THREE.Vector3(-1, 1, 2),
  };

  useFrame(({ camera }) => {
    const targetPos = selectedPart ? partPositions[selectedPart] : new THREE.Vector3(4, 2, 4);
    cameraRef.current.lerp(targetPos, 0.05);
    camera.position.copy(cameraRef.current);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function InfoPanel({ partId, onClose }: { partId: string; onClose: () => void }) {
  const info = moleculePartsInfo[partId];
  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute right-4 top-1/2 -translate-y-1/2 w-80 max-h-[70vh] overflow-y-auto z-50"
    >
      <div 
        className="glass-card p-6 rounded-2xl border shadow-2xl"
        style={{ borderColor: `${info.color}40` }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${info.color}20` }}
          >
            <Leaf className="w-5 h-5" style={{ color: info.color }} />
          </div>
          <h3 className="font-display text-xl font-bold" style={{ color: info.color }}>
            {info.name}
          </h3>
        </div>

        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {info.description}
        </p>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
            Key Facts
          </h4>
          {info.facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span 
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: info.color }}
              />
              {fact}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function InteractiveMoleculeModel() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [4, 2, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, -3]} intensity={0.5} color="#22c55e" />
        
        <CameraController selectedPart={selectedPart} />
        <LabEnvironment />
        
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
          <GlucoseMolecule selectedPart={selectedPart} onSelect={setSelectedPart} />
        </Float>
        <Chloroplast selectedPart={selectedPart} onSelect={setSelectedPart} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>

      {/* Parts Dropdown */}
      <PartsDropdown
        parts={moleculePartsInfo}
        selectedPart={selectedPart}
        onSelectPart={setSelectedPart}
      />

      <AnimatePresence>
        {selectedPart && (
          <InfoPanel partId={selectedPart} onClose={() => setSelectedPart(null)} />
        )}
      </AnimatePresence>

      {!selectedPart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-4 right-4 text-center"
        >
          <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
            🌿 Click on atoms or molecules to learn about photosynthesis
          </p>
        </motion.div>
      )}
    </div>
  );
}
