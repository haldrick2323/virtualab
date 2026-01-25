import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float, Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Beaker } from 'lucide-react';
import PartsDropdown from './PartsDropdown';

interface PartInfo {
  id: string;
  name: string;
  description: string;
  facts: string[];
  color: string;
}

const beakerPartsInfo: Record<string, PartInfo> = {
  beaker: {
    id: 'beaker',
    name: 'Laboratory Beaker',
    description: 'A cylindrical container with a flat bottom and a small spout for pouring. Used for mixing, heating, and measuring liquids in laboratory settings.',
    facts: [
      'Made from borosilicate glass (Pyrex) for thermal resistance',
      'Graduated markings show approximate volume',
      'The spout allows controlled pouring',
      'Can withstand temperatures up to 500°C'
    ],
    color: '#3b82f6'
  },
  solution: {
    id: 'solution',
    name: 'Acid-Base Solution',
    description: 'A liquid mixture that can be acidic (pH < 7), neutral (pH = 7), or basic (pH > 7). pH indicators change color based on the acidity level.',
    facts: [
      'pH scale ranges from 0 (most acidic) to 14 (most basic)',
      'Universal indicators show rainbow of colors across pH range',
      'Neutralization occurs when acid meets base',
      'Buffer solutions resist pH changes'
    ],
    color: '#22c55e'
  },
  stirrer: {
    id: 'stirrer',
    name: 'Magnetic Stirrer',
    description: 'A device that uses a rotating magnetic field to spin a stir bar in the liquid, providing consistent and hands-free mixing.',
    facts: [
      'Uses a magnetic field to rotate the stir bar',
      'Allows heating while stirring',
      'Speeds can range from 100 to 1500 RPM',
      'Essential for consistent mixing in reactions'
    ],
    color: '#8b5cf6'
  },
  phStrip: {
    id: 'phStrip',
    name: 'pH Indicator Strip',
    description: 'Paper strips treated with indicator chemicals that change color based on the pH of a solution, providing a quick way to measure acidity.',
    facts: [
      'Changes color based on hydrogen ion concentration',
      'Litmus paper turns red in acid, blue in base',
      'Universal indicator shows full pH spectrum',
      'Quick and inexpensive pH testing method'
    ],
    color: '#f59e0b'
  },
  vapor: {
    id: 'vapor',
    name: 'Chemical Vapor',
    description: 'Gaseous molecules that evaporate from the liquid surface. Some reactions produce visible vapors or fumes.',
    facts: [
      'Vapor pressure increases with temperature',
      'Some vapors are toxic and require fume hoods',
      'Condensation occurs when vapor cools',
      'Evaporation is an endothermic process'
    ],
    color: '#94a3b8'
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
  const info = beakerPartsInfo[partId];

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

function BeakerGlass({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const isSelected = selectedPart === 'beaker';
  
  return (
    <ClickablePart partId="beaker" selectedPart={selectedPart} onSelect={onSelect}>
      <group>
        {/* Main cylinder */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 1.6, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={isSelected ? 0.6 : 0.3}
            roughness={0.05}
            metalness={0}
            transmission={0.95}
            thickness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Bottom */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.7, 32]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={isSelected ? 0.6 : 0.3}
            roughness={0.05}
            transmission={0.95}
          />
        </mesh>
        {/* Spout */}
        <mesh position={[0.6, 1.6, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.3, 0.1, 0.2]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={0.4}
            transmission={0.9}
          />
        </mesh>
        {/* Graduation marks */}
        {[0.4, 0.7, 1.0, 1.3].map((y, i) => (
          <mesh key={i} position={[0.68, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.02, 0.15, 0.02]} />
            <meshBasicMaterial color="#64748b" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </ClickablePart>
  );
}

function Solution({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const liquidRef = useRef<THREE.Mesh>(null);
  const isSelected = selectedPart === 'solution';
  
  useFrame((state) => {
    if (liquidRef.current) {
      liquidRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
    }
  });

  return (
    <ClickablePart partId="solution" selectedPart={selectedPart} onSelect={onSelect}>
      <mesh ref={liquidRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 1.1, 32]} />
        <meshPhysicalMaterial
          color={isSelected ? '#4ade80' : '#22c55e'}
          transparent
          opacity={0.75}
          roughness={0.1}
          metalness={0}
          emissive="#22c55e"
          emissiveIntensity={isSelected ? 0.3 : 0.1}
        />
      </mesh>
    </ClickablePart>
  );
}

function MagneticStirrer({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const stirBarRef = useRef<THREE.Mesh>(null);
  const isSelected = selectedPart === 'stirrer';
  
  useFrame((state) => {
    if (stirBarRef.current) {
      stirBarRef.current.rotation.y = state.clock.elapsedTime * 5;
    }
  });

  return (
    <ClickablePart partId="stirrer" selectedPart={selectedPart} onSelect={onSelect}>
      <group>
        {/* Stirrer base */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial 
            color={isSelected ? '#6366f1' : '#4f46e5'} 
            metalness={0.7} 
            roughness={0.3} 
          />
        </mesh>
        {/* Control dial */}
        <mesh position={[0.6, -0.35, 0.6]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Stir bar in liquid */}
        <mesh ref={stirBarRef} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.05, 0.4, 8, 16]} />
          <meshStandardMaterial 
            color={isSelected ? '#a78bfa' : '#8b5cf6'} 
            emissive="#8b5cf6"
            emissiveIntensity={isSelected ? 0.3 : 0.1}
          />
        </mesh>
      </group>
    </ClickablePart>
  );
}

function PHStrip({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const isSelected = selectedPart === 'phStrip';
  
  return (
    <ClickablePart partId="phStrip" selectedPart={selectedPart} onSelect={onSelect}>
      <group position={[1.2, 0.8, 0]} rotation={[0, 0, 0.2]}>
        <RoundedBox args={[0.15, 1.2, 0.02]} radius={0.01}>
          <meshStandardMaterial color="#fef3c7" />
        </RoundedBox>
        {/* pH color gradient */}
        {['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'].map((color, i) => (
          <mesh key={i} position={[0, 0.4 - i * 0.12, 0.015]}>
            <boxGeometry args={[0.1, 0.1, 0.005]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}
        {isSelected && (
          <pointLight color="#f59e0b" intensity={2} distance={2} />
        )}
      </group>
    </ClickablePart>
  );
}

function Vapor({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const vaporRef = useRef<THREE.Group>(null);
  const isSelected = selectedPart === 'vapor';
  
  const particles = useMemo(() => 
    Array.from({ length: 20 }, () => ({
      x: (Math.random() - 0.5) * 0.8,
      y: Math.random() * 0.5,
      z: (Math.random() - 0.5) * 0.8,
      speed: 0.2 + Math.random() * 0.3,
      size: 0.02 + Math.random() * 0.03
    })), []);

  useFrame((state) => {
    if (vaporRef.current) {
      vaporRef.current.children.forEach((particle, i) => {
        const data = particles[i];
        particle.position.y = 1.2 + ((state.clock.elapsedTime * data.speed + data.y) % 1);
        particle.position.x = data.x + Math.sin(state.clock.elapsedTime + i) * 0.1;
        const scale = 1 - (particle.position.y - 1.2);
        particle.scale.setScalar(Math.max(0.1, scale));
      });
    }
  });

  return (
    <ClickablePart partId="vapor" selectedPart={selectedPart} onSelect={onSelect}>
      <group ref={vaporRef}>
        {particles.map((pos, i) => (
          <mesh key={i} position={[pos.x, 1.2 + pos.y, pos.z]}>
            <sphereGeometry args={[pos.size, 8, 8]} />
            <meshBasicMaterial
              color={isSelected ? '#cbd5e1' : '#94a3b8'}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </group>
    </ClickablePart>
  );
}

function LabEnvironment() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <Sparkles count={30} scale={6} size={1} speed={0.3} opacity={0.3} />
    </>
  );
}

function CameraController({ selectedPart }: { selectedPart: string | null }) {
  const cameraRef = useRef<THREE.Vector3>(new THREE.Vector3(3, 2, 3));
  
  const partPositions: Record<string, THREE.Vector3> = {
    beaker: new THREE.Vector3(1.2, 1, 1.2),
    solution: new THREE.Vector3(1, 0.6, 1),
    stirrer: new THREE.Vector3(1.2, 0.3, 1.2),
    phStrip: new THREE.Vector3(1.5, 1, 0.6),
    vapor: new THREE.Vector3(1.2, 1.5, 1.2),
  };

  useFrame(({ camera }) => {
    const targetPos = selectedPart ? partPositions[selectedPart] : new THREE.Vector3(3, 2, 3);
    cameraRef.current.lerp(targetPos, 0.05);
    camera.position.copy(cameraRef.current);
    
    const lookTarget = selectedPart 
      ? new THREE.Vector3(0, partPositions[selectedPart].y * 0.4, 0)
      : new THREE.Vector3(0, 0.5, 0);
    camera.lookAt(lookTarget);
  });

  return null;
}

function InfoPanel({ partId, onClose }: { partId: string; onClose: () => void }) {
  const info = beakerPartsInfo[partId];
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
            <Beaker className="w-5 h-5" style={{ color: info.color }} />
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

function InteractiveBeakerContent({ selectedPart, onSelect }: {
  selectedPart: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.15}>
      <group>
        <BeakerGlass selectedPart={selectedPart} onSelect={onSelect} />
        <Solution selectedPart={selectedPart} onSelect={onSelect} />
        <MagneticStirrer selectedPart={selectedPart} onSelect={onSelect} />
        <PHStrip selectedPart={selectedPart} onSelect={onSelect} />
        <Vapor selectedPart={selectedPart} onSelect={onSelect} />
      </group>
    </Float>
  );
}

export default function InteractiveBeakerModel() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, -3]} intensity={0.5} color="#22c55e" />
        
        <CameraController selectedPart={selectedPart} />
        <LabEnvironment />
        <InteractiveBeakerContent
          selectedPart={selectedPart}
          onSelect={setSelectedPart}
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
        parts={beakerPartsInfo}
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
            🧪 Click on any part to explore acids, bases, and pH
          </p>
        </motion.div>
      )}
    </div>
  );
}
