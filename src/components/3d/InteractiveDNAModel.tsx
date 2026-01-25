import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Html, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dna } from 'lucide-react';
import PartsDropdown from './PartsDropdown';

interface PartInfo {
  id: string;
  name: string;
  description: string;
  facts: string[];
  color: string;
}

const dnaPartsInfo: Record<string, PartInfo> = {
  backbone: {
    id: 'backbone',
    name: 'Sugar-Phosphate Backbone',
    description: 'The structural framework of DNA, made of alternating sugar (deoxyribose) and phosphate groups that form the sides of the double helix ladder.',
    facts: [
      'Made of deoxyribose sugar and phosphate groups',
      'Provides structural support for the molecule',
      'The two strands run in opposite directions (antiparallel)',
      'Connected by phosphodiester bonds'
    ],
    color: '#3b82f6'
  },
  adenine: {
    id: 'adenine',
    name: 'Adenine (A)',
    description: 'One of the four nucleotide bases in DNA. Adenine always pairs with Thymine through two hydrogen bonds.',
    facts: [
      'Purine base with a double-ring structure',
      'Always pairs with Thymine (A-T)',
      'Forms 2 hydrogen bonds with Thymine',
      'Also found in ATP, the energy molecule'
    ],
    color: '#ef4444'
  },
  thymine: {
    id: 'thymine',
    name: 'Thymine (T)',
    description: 'A nucleotide base that pairs exclusively with Adenine. Thymine is unique to DNA and is replaced by Uracil in RNA.',
    facts: [
      'Pyrimidine base with a single-ring structure',
      'Always pairs with Adenine (T-A)',
      'Unique to DNA (replaced by Uracil in RNA)',
      'Contains a methyl group that distinguishes it from Uracil'
    ],
    color: '#22c55e'
  },
  guanine: {
    id: 'guanine',
    name: 'Guanine (G)',
    description: 'A purine base that pairs with Cytosine through three hydrogen bonds, making G-C pairs stronger than A-T pairs.',
    facts: [
      'Purine base with a double-ring structure',
      'Always pairs with Cytosine (G-C)',
      'Forms 3 hydrogen bonds (stronger than A-T)',
      'Named after guano, where it was first isolated'
    ],
    color: '#f59e0b'
  },
  cytosine: {
    id: 'cytosine',
    name: 'Cytosine (C)',
    description: 'A pyrimidine base that pairs with Guanine. The G-C base pair has three hydrogen bonds, making it more stable.',
    facts: [
      'Pyrimidine base with a single-ring structure',
      'Always pairs with Guanine (C-G)',
      'Can be methylated for gene regulation',
      'Found in both DNA and RNA'
    ],
    color: '#8b5cf6'
  },
  helix: {
    id: 'helix',
    name: 'Double Helix Structure',
    description: 'The iconic twisted ladder shape of DNA, discovered by Watson and Crick in 1953. The helix makes one complete turn every 10.5 base pairs.',
    facts: [
      'Discovered by Watson and Crick in 1953',
      'Right-handed helix (turns clockwise)',
      'One complete turn every 10.5 base pairs',
      '2 nanometers in diameter'
    ],
    color: '#06b6d4'
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
  const info = dnaPartsInfo[partId];

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

function DNAHelix({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const helixRef = useRef<THREE.Group>(null);
  const nucleotideCount = 20;
  const helixRadius = 0.8;
  const helixHeight = 6;
  const turnsPerLength = 2;

  const nucleotides = useMemo(() => {
    const pairs: Array<{ y: number; angle: number; type: 'AT' | 'GC' }> = [];
    for (let i = 0; i < nucleotideCount; i++) {
      const y = (i / nucleotideCount) * helixHeight - helixHeight / 2;
      const angle = (i / nucleotideCount) * Math.PI * 2 * turnsPerLength;
      const type = i % 2 === 0 ? 'AT' : 'GC';
      pairs.push({ y, angle, type });
    }
    return pairs;
  }, []);

  useFrame((state) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const isBackboneSelected = selectedPart === 'backbone';
  const isHelixSelected = selectedPart === 'helix';

  return (
    <group ref={helixRef}>
      {/* Double helix clickable area */}
      <ClickablePart partId="helix" selectedPart={selectedPart} onSelect={onSelect}>
        <mesh visible={false}>
          <cylinderGeometry args={[1.2, 1.2, helixHeight, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </ClickablePart>

      {nucleotides.map((nuc, i) => {
        const x1 = Math.cos(nuc.angle) * helixRadius;
        const z1 = Math.sin(nuc.angle) * helixRadius;
        const x2 = Math.cos(nuc.angle + Math.PI) * helixRadius;
        const z2 = Math.sin(nuc.angle + Math.PI) * helixRadius;

        const baseColor1 = nuc.type === 'AT' ? '#ef4444' : '#f59e0b';
        const baseColor2 = nuc.type === 'AT' ? '#22c55e' : '#8b5cf6';
        const basePart1 = nuc.type === 'AT' ? 'adenine' : 'guanine';
        const basePart2 = nuc.type === 'AT' ? 'thymine' : 'cytosine';

        return (
          <group key={i}>
            {/* Backbone spheres */}
            <ClickablePart partId="backbone" selectedPart={selectedPart} onSelect={onSelect}>
              <mesh position={[x1, nuc.y, z1]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial 
                  color={isBackboneSelected ? '#60a5fa' : '#3b82f6'} 
                  emissive="#3b82f6"
                  emissiveIntensity={isBackboneSelected || isHelixSelected ? 0.3 : 0.1}
                />
              </mesh>
            </ClickablePart>
            <ClickablePart partId="backbone" selectedPart={selectedPart} onSelect={onSelect}>
              <mesh position={[x2, nuc.y, z2]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial 
                  color={isBackboneSelected ? '#60a5fa' : '#3b82f6'} 
                  emissive="#3b82f6"
                  emissiveIntensity={isBackboneSelected || isHelixSelected ? 0.3 : 0.1}
                />
              </mesh>
            </ClickablePart>

            {/* Backbone connections */}
            {i < nucleotideCount - 1 && (
              <>
                <mesh position={[(x1 + Math.cos(nucleotides[i + 1].angle) * helixRadius) / 2, (nuc.y + nucleotides[i + 1].y) / 2, (z1 + Math.sin(nucleotides[i + 1].angle) * helixRadius) / 2]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
                  <meshStandardMaterial color="#3b82f6" />
                </mesh>
                <mesh position={[(x2 + Math.cos(nucleotides[i + 1].angle + Math.PI) * helixRadius) / 2, (nuc.y + nucleotides[i + 1].y) / 2, (z2 + Math.sin(nucleotides[i + 1].angle + Math.PI) * helixRadius) / 2]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
                  <meshStandardMaterial color="#3b82f6" />
                </mesh>
              </>
            )}

            {/* Base pair 1 */}
            <ClickablePart partId={basePart1} selectedPart={selectedPart} onSelect={onSelect}>
              <mesh position={[x1 * 0.5, nuc.y, z1 * 0.5]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial 
                  color={baseColor1} 
                  emissive={baseColor1}
                  emissiveIntensity={selectedPart === basePart1 ? 0.5 : 0.1}
                />
              </mesh>
            </ClickablePart>

            {/* Base pair 2 */}
            <ClickablePart partId={basePart2} selectedPart={selectedPart} onSelect={onSelect}>
              <mesh position={[x2 * 0.5, nuc.y, z2 * 0.5]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial 
                  color={baseColor2} 
                  emissive={baseColor2}
                  emissiveIntensity={selectedPart === basePart2 ? 0.5 : 0.1}
                />
              </mesh>
            </ClickablePart>

            {/* Hydrogen bonds (center connection) */}
            <mesh position={[0, nuc.y, 0]} rotation={[0, nuc.angle, 0]}>
              <boxGeometry args={[0.02, 0.02, 0.6]} />
              <meshBasicMaterial color="#94a3b8" transparent opacity={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function LabEnvironment() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <Sparkles count={50} scale={10} size={1.5} speed={0.3} opacity={0.3} color="#8b5cf6" />
    </>
  );
}

function CameraController({ selectedPart }: { selectedPart: string | null }) {
  const cameraRef = useRef<THREE.Vector3>(new THREE.Vector3(4, 0, 4));
  
  const partPositions: Record<string, THREE.Vector3> = {
    backbone: new THREE.Vector3(1.5, 0.6, 1.5),
    adenine: new THREE.Vector3(1.2, 0, 1.2),
    thymine: new THREE.Vector3(1.2, 0, 1.2),
    guanine: new THREE.Vector3(1.2, 0.3, 1.2),
    cytosine: new THREE.Vector3(1.2, 0.3, 1.2),
    helix: new THREE.Vector3(3, 0, 3),
  };

  useFrame(({ camera }) => {
    const targetPos = selectedPart ? partPositions[selectedPart] : new THREE.Vector3(4, 0, 4);
    cameraRef.current.lerp(targetPos, 0.05);
    camera.position.copy(cameraRef.current);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function InfoPanel({ partId, onClose }: { partId: string; onClose: () => void }) {
  const info = dnaPartsInfo[partId];
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
            <Dna className="w-5 h-5" style={{ color: info.color }} />
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

export default function InteractiveDNAModel() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [4, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, -3]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[3, -3, 3]} intensity={0.3} color="#3b82f6" />
        
        <CameraController selectedPart={selectedPart} />
        <LabEnvironment />
        <DNAHelix selectedPart={selectedPart} onSelect={setSelectedPart} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
          autoRotate={!selectedPart}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Parts Dropdown */}
      <PartsDropdown
        parts={dnaPartsInfo}
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
            🧬 Click on base pairs or the backbone to learn about DNA structure
          </p>
        </motion.div>
      )}
    </div>
  );
}
