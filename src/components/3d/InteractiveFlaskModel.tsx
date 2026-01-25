import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FlaskConical } from 'lucide-react';
import PartsDropdown from './PartsDropdown';

interface PartInfo {
  id: string;
  name: string;
  description: string;
  facts: string[];
  color: string;
}

const flaskPartsInfo: Record<string, PartInfo> = {
  flask: {
    id: 'flask',
    name: 'Erlenmeyer Flask',
    description: 'A conical laboratory flask with a flat bottom, wide body, and cylindrical neck. Named after German chemist Emil Erlenmeyer who created it in 1860.',
    facts: [
      'The conical shape prevents spillage when swirling liquids',
      'The narrow neck reduces evaporation and allows easy stoppage',
      'Made from borosilicate glass to resist thermal shock',
      'Most commonly used for mixing, heating, and storage'
    ],
    color: '#f97316'
  },
  liquid: {
    id: 'liquid',
    name: 'Reaction Mixture',
    description: 'The liquid inside the flask where chemical reactions take place. Different colors indicate different chemicals and reaction stages.',
    facts: [
      'Color changes often indicate chemical reactions occurring',
      'Temperature affects reaction rate - warmer = faster',
      'Catalysts can speed up reactions without being consumed',
      'Products form as reactants combine and transform'
    ],
    color: '#22c55e'
  },
  bubbles: {
    id: 'bubbles',
    name: 'Gas Evolution',
    description: 'Bubbles forming during a reaction indicate gas is being produced. This is common in many chemical reactions.',
    facts: [
      'Common gases produced: CO₂, O₂, H₂, and N₂',
      'Bubble rate indicates reaction speed',
      'Gas collection is done over water or by displacement',
      'Effervescence is the scientific term for bubbling'
    ],
    color: '#3b82f6'
  },
  burner: {
    id: 'burner',
    name: 'Bunsen Burner',
    description: 'A gas burner that produces a single open flame, used for heating, sterilization, and combustion in laboratory settings.',
    facts: [
      'Invented by Robert Bunsen in 1857',
      'Burns natural gas or LPG at up to 1500°C',
      'Blue flame indicates complete combustion',
      'Yellow/orange flame means incomplete combustion'
    ],
    color: '#f59e0b'
  },
  flame: {
    id: 'flame',
    name: 'Flame',
    description: 'The visible part of combustion, where fuel reacts with oxygen to produce heat, light, and combustion products.',
    facts: [
      'Flame colors indicate temperature and composition',
      'Blue flames are hotter than yellow flames',
      'The inner cone is the hottest part (~1500°C)',
      'Flame tests identify metal ions by color'
    ],
    color: '#ef4444'
  }
};

interface ClickablePartProps {
  children: React.ReactNode;
  partId: string;
  selectedPart: string | null;
  onSelect: (id: string | null) => void;
  isInteracting: boolean;
}

function ClickablePart({ children, partId, selectedPart, onSelect, isInteracting }: ClickablePartProps) {
  const [hovered, setHovered] = useState(false);
  const info = flaskPartsInfo[partId];

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

function Flask({ selectedPart, onSelect, isInteracting }: { selectedPart: string | null; onSelect: (id: string | null) => void; isInteracting: boolean }) {
  const flaskRef = useRef<THREE.Group>(null);
  const isSelected = selectedPart === 'flask';
  
  return (
    <ClickablePart partId="flask" selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting}>
      <group ref={flaskRef}>
        {/* Flask body - conical shape */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.3, 0.8, 1.4, 32]} />
          <meshPhysicalMaterial
            color="#e8f4f8"
            transparent
            opacity={isSelected ? 0.9 : 0.4}
            roughness={0.1}
            metalness={0}
            transmission={0.9}
            thickness={0.5}
          />
        </mesh>
        {/* Flask neck */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.15, 0.3, 0.6, 32]} />
          <meshPhysicalMaterial
            color="#e8f4f8"
            transparent
            opacity={isSelected ? 0.9 : 0.4}
            roughness={0.1}
            metalness={0}
            transmission={0.9}
            thickness={0.5}
          />
        </mesh>
        {/* Flask rim */}
        <mesh position={[0, 2.15, 0]}>
          <torusGeometry args={[0.15, 0.03, 16, 32]} />
          <meshStandardMaterial color="#a0d8ef" />
        </mesh>
      </group>
    </ClickablePart>
  );
}

function Liquid({ selectedPart, onSelect, isInteracting }: { selectedPart: string | null; onSelect: (id: string | null) => void; isInteracting: boolean }) {
  const liquidRef = useRef<THREE.Mesh>(null);
  const isSelected = selectedPart === 'liquid';
  
  useFrame((state) => {
    if (liquidRef.current) {
      liquidRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <ClickablePart partId="liquid" selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting}>
      <mesh ref={liquidRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.25, 0.7, 1, 32]} />
        <meshPhysicalMaterial
          color={isSelected ? '#4ade80' : '#22c55e'}
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.1}
          emissive="#22c55e"
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </mesh>
    </ClickablePart>
  );
}

function Bubbles({ selectedPart, onSelect, isInteracting }: { selectedPart: string | null; onSelect: (id: string | null) => void; isInteracting: boolean }) {
  const bubblesRef = useRef<THREE.Group>(null);
  const isSelected = selectedPart === 'bubbles';
  
  const bubblePositions = useMemo(() => 
    Array.from({ length: 15 }, () => ({
      x: (Math.random() - 0.5) * 0.8,
      y: Math.random() * 1.2,
      z: (Math.random() - 0.5) * 0.8,
      speed: 0.5 + Math.random() * 0.5,
      size: 0.03 + Math.random() * 0.05
    })), []);

  useFrame((state) => {
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((bubble, i) => {
        const data = bubblePositions[i];
        bubble.position.y = ((state.clock.elapsedTime * data.speed + data.y) % 1.2) + 0.2;
        bubble.position.x = data.x + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
      });
    }
  });

  return (
    <ClickablePart partId="bubbles" selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting}>
      <group ref={bubblesRef}>
        {bubblePositions.map((pos, i) => (
          <mesh key={i} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[pos.size, 16, 16]} />
            <meshPhysicalMaterial
              color={isSelected ? '#60a5fa' : '#93c5fd'}
              transparent
              opacity={0.7}
              roughness={0.1}
              transmission={0.5}
              emissive="#3b82f6"
              emissiveIntensity={isSelected ? 0.5 : 0.1}
            />
          </mesh>
        ))}
      </group>
    </ClickablePart>
  );
}

function Burner({ selectedPart, onSelect, isInteracting }: { selectedPart: string | null; onSelect: (id: string | null) => void; isInteracting: boolean }) {
  const isSelected = selectedPart === 'burner';
  
  return (
    <ClickablePart partId="burner" selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting}>
      <group position={[0, -0.5, 0]}>
        {/* Base */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.15, 32]} />
          <meshStandardMaterial 
            color={isSelected ? '#525252' : '#404040'} 
            metalness={0.8} 
            roughness={0.3}
          />
        </mesh>
        {/* Tube */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.6, 32]} />
          <meshStandardMaterial 
            color={isSelected ? '#525252' : '#404040'} 
            metalness={0.8} 
            roughness={0.3}
          />
        </mesh>
        {/* Collar */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.18, 0.15, 0.15, 32]} />
          <meshStandardMaterial 
            color={isSelected ? '#525252' : '#404040'} 
            metalness={0.8} 
            roughness={0.3}
          />
        </mesh>
      </group>
    </ClickablePart>
  );
}

function Flame({ selectedPart, onSelect, isInteracting }: { selectedPart: string | null; onSelect: (id: string | null) => void; isInteracting: boolean }) {
  const flameRef = useRef<THREE.Group>(null);
  const isSelected = selectedPart === 'flame';
  
  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      flameRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.05;
    }
  });

  return (
    <ClickablePart partId="flame" selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting}>
      <group ref={flameRef} position={[0, 0.1, 0]}>
        {/* Inner cone (hottest) */}
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.06, 0.2, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
        </mesh>
        {/* Outer flame */}
        <mesh position={[0, 0.1, 0]}>
          <coneGeometry args={[0.1, 0.25, 32]} />
          <meshBasicMaterial 
            color={isSelected ? '#fbbf24' : '#f97316'} 
            transparent 
            opacity={0.7} 
          />
        </mesh>
        {/* Outer glow */}
        <pointLight 
          color="#f97316" 
          intensity={isSelected ? 3 : 1.5} 
          distance={3} 
        />
      </group>
    </ClickablePart>
  );
}

function LabEnvironment() {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Workbench */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#374151" metalness={0.3} roughness={0.7} />
      </mesh>
      <Sparkles count={30} scale={6} size={1} speed={0.3} opacity={0.3} />
    </>
  );
}

function CameraController({ selectedPart }: { selectedPart: string | null }) {
  const cameraRef = useRef<THREE.Vector3>(new THREE.Vector3(3, 2, 3));
  
  const partPositions: Record<string, THREE.Vector3> = {
    flask: new THREE.Vector3(2, 1.5, 2),
    liquid: new THREE.Vector3(1.5, 1, 1.5),
    bubbles: new THREE.Vector3(1.5, 1.2, 1.5),
    burner: new THREE.Vector3(2, 0, 2),
    flame: new THREE.Vector3(1.5, 0.5, 1.5),
  };

  useFrame(({ camera }) => {
    const targetPos = selectedPart ? partPositions[selectedPart] : new THREE.Vector3(3, 2, 3);
    cameraRef.current.lerp(targetPos, 0.05);
    camera.position.copy(cameraRef.current);
    
    const lookTarget = selectedPart 
      ? new THREE.Vector3(0, partPositions[selectedPart].y * 0.5, 0)
      : new THREE.Vector3(0, 0.5, 0);
    camera.lookAt(lookTarget);
  });

  return null;
}

function InfoPanel({ partId, onClose }: { partId: string; onClose: () => void }) {
  const info = flaskPartsInfo[partId];
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
            <FlaskConical className="w-5 h-5" style={{ color: info.color }} />
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

function InteractiveFlaskContent({ selectedPart, onSelect, isInteracting }: {
  selectedPart: string | null;
  onSelect: (id: string | null) => void;
  isInteracting: boolean;
}) {
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group>
        <Flask selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting} />
        <Liquid selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting} />
        <Bubbles selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting} />
        <Burner selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting} />
        <Flame selectedPart={selectedPart} onSelect={onSelect} isInteracting={isInteracting} />
      </group>
    </Float>
  );
}

export default function InteractiveFlaskModel() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={() => setIsInteracting(true)}
        onPointerUp={() => setIsInteracting(false)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, -3]} intensity={0.5} color="#f97316" />
        
        <CameraController selectedPart={selectedPart} />
        <LabEnvironment />
        <InteractiveFlaskContent
          selectedPart={selectedPart}
          onSelect={setSelectedPart}
          isInteracting={isInteracting}
        />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Parts Dropdown */}
      <PartsDropdown
        parts={flaskPartsInfo}
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
            🔬 Click on any part to learn more about chemical reactions
          </p>
        </motion.div>
      )}
    </div>
  );
}
