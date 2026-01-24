import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Html, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Magnet } from 'lucide-react';

interface PartInfo {
  id: string;
  name: string;
  description: string;
  facts: string[];
  color: string;
}

const magnetPartsInfo: Record<string, PartInfo> = {
  northPole: {
    id: 'northPole',
    name: 'North Pole (N)',
    description: 'The north-seeking pole of a magnet. When suspended freely, this end points toward Earth\'s magnetic north pole.',
    facts: [
      'Points toward geographic north',
      'Repels other north poles',
      'Attracts south poles',
      'Named because it seeks Earth\'s north'
    ],
    color: '#ef4444'
  },
  southPole: {
    id: 'southPole',
    name: 'South Pole (S)',
    description: 'The south-seeking pole of a magnet. It\'s attracted to the north pole of other magnets and repelled by south poles.',
    facts: [
      'Points toward geographic south',
      'Attracts north poles',
      'Repels other south poles',
      'Cannot exist without a north pole'
    ],
    color: '#3b82f6'
  },
  fieldLines: {
    id: 'fieldLines',
    name: 'Magnetic Field Lines',
    description: 'Invisible lines that represent the magnetic field. They show the direction a compass needle would point at any location.',
    facts: [
      'Exit from north pole, enter at south',
      'Never cross each other',
      'Closer lines = stronger field',
      'Form continuous closed loops'
    ],
    color: '#22c55e'
  },
  domains: {
    id: 'domains',
    name: 'Magnetic Domains',
    description: 'Microscopic regions within a magnetic material where atomic magnetic moments are aligned in the same direction.',
    facts: [
      'Randomly oriented in unmagnetized material',
      'Aligned when material is magnetized',
      'Can be disrupted by heat or impact',
      'Explain permanent vs temporary magnets'
    ],
    color: '#f59e0b'
  },
  compass: {
    id: 'compass',
    name: 'Compass Needle',
    description: 'A small magnet that aligns with magnetic field lines, pointing from the field\'s south to north direction.',
    facts: [
      'Always aligns with field lines',
      'North end points to field source\'s south pole',
      'Used to visualize magnetic fields',
      'Earth\'s field makes compasses work'
    ],
    color: '#8b5cf6'
  },
  current: {
    id: 'current',
    name: 'Electric Current',
    description: 'Moving electric charges create magnetic fields. This is the principle behind electromagnets and electric motors.',
    facts: [
      'Moving charges create magnetic fields',
      'Right-hand rule determines field direction',
      'Basis for electromagnets',
      'Discovered by Oersted in 1820'
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
  const info = magnetPartsInfo[partId];

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

function BarMagnet({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const isNorthSelected = selectedPart === 'northPole';
  const isSouthSelected = selectedPart === 'southPole';
  const isDomainsSelected = selectedPart === 'domains';

  return (
    <group>
      {/* North pole (red) */}
      <ClickablePart partId="northPole" selectedPart={selectedPart} onSelect={onSelect}>
        <mesh position={[1, 0, 0]}>
          <boxGeometry args={[1, 0.5, 0.3]} />
          <meshStandardMaterial 
            color={isNorthSelected ? '#f87171' : '#ef4444'}
            emissive="#ef4444"
            emissiveIntensity={isNorthSelected ? 0.5 : 0.1}
          />
        </mesh>
        <Html position={[1, 0.4, 0]} center>
          <span className="text-white font-bold text-sm bg-red-600/80 px-2 rounded">N</span>
        </Html>
      </ClickablePart>

      {/* South pole (blue) */}
      <ClickablePart partId="southPole" selectedPart={selectedPart} onSelect={onSelect}>
        <mesh position={[-1, 0, 0]}>
          <boxGeometry args={[1, 0.5, 0.3]} />
          <meshStandardMaterial 
            color={isSouthSelected ? '#60a5fa' : '#3b82f6'}
            emissive="#3b82f6"
            emissiveIntensity={isSouthSelected ? 0.5 : 0.1}
          />
        </mesh>
        <Html position={[-1, 0.4, 0]} center>
          <span className="text-white font-bold text-sm bg-blue-600/80 px-2 rounded">S</span>
        </Html>
      </ClickablePart>

      {/* Domain visualization (small arrows inside) */}
      <ClickablePart partId="domains" selectedPart={selectedPart} onSelect={onSelect}>
        <group>
          {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.06, 0.15, 8]} />
              <meshBasicMaterial 
                color={isDomainsSelected ? '#fbbf24' : '#f59e0b'} 
                transparent
                opacity={isDomainsSelected ? 1 : 0.6}
              />
            </mesh>
          ))}
        </group>
      </ClickablePart>
    </group>
  );
}

function MagneticFieldLines({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const linesRef = useRef<THREE.Group>(null);
  const isSelected = selectedPart === 'fieldLines';

  // Generate field line curves
  const fieldCurves = useMemo(() => {
    const curves: THREE.Vector3[][] = [];
    const heights = [0.3, 0.6, 1, 1.5, 2];
    
    heights.forEach((h) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * Math.PI; // 0 to π
        const x = 1.5 * Math.cos(t);
        const y = h * Math.sin(t);
        points.push(new THREE.Vector3(x, y, 0));
      }
      curves.push(points);
      
      // Mirror for bottom
      const bottomPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * Math.PI;
        const x = 1.5 * Math.cos(t);
        const y = -h * Math.sin(t);
        bottomPoints.push(new THREE.Vector3(x, y, 0));
      }
      curves.push(bottomPoints);
    });
    
    return curves;
  }, []);

  return (
    <ClickablePart partId="fieldLines" selectedPart={selectedPart} onSelect={onSelect}>
      <group ref={linesRef}>
        {fieldCurves.map((points, i) => (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color={isSelected ? '#4ade80' : '#22c55e'} 
              transparent 
              opacity={isSelected ? 0.9 : 0.4}
              linewidth={2}
            />
          </line>
        ))}
        {/* Field direction arrows */}
        {[0.5, 1, 1.5].map((h, i) => (
          <group key={i}>
            <mesh position={[0, h, 0]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.05, 0.1, 8]} />
              <meshBasicMaterial color={isSelected ? '#4ade80' : '#22c55e'} />
            </mesh>
            <mesh position={[0, -h, 0]} rotation={[0, 0, 0]}>
              <coneGeometry args={[0.05, 0.1, 8]} />
              <meshBasicMaterial color={isSelected ? '#4ade80' : '#22c55e'} />
            </mesh>
          </group>
        ))}
      </group>
    </ClickablePart>
  );
}

function CompassNeedles({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const compassRef = useRef<THREE.Group>(null);
  const isSelected = selectedPart === 'compass';

  useFrame((state) => {
    if (compassRef.current) {
      compassRef.current.children.forEach((compass, i) => {
        // Slight wobble animation
        compass.rotation.z = Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
      });
    }
  });

  const compassPositions = [
    { x: 2.5, y: 0.5, angle: -0.3 },
    { x: 2.5, y: -0.5, angle: 0.3 },
    { x: -2.5, y: 0.5, angle: Math.PI - 0.3 },
    { x: -2.5, y: -0.5, angle: Math.PI + 0.3 },
    { x: 0, y: 1.5, angle: -Math.PI / 2 },
    { x: 0, y: -1.5, angle: Math.PI / 2 },
  ];

  return (
    <ClickablePart partId="compass" selectedPart={selectedPart} onSelect={onSelect}>
      <group ref={compassRef}>
        {compassPositions.map((pos, i) => (
          <group key={i} position={[pos.x, pos.y, 0.3]} rotation={[0, 0, pos.angle]}>
            {/* Compass body */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
              <meshStandardMaterial
                color="#fafaf9" 
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
            {/* Needle - north pointing red */}
            <mesh position={[0.08, 0, 0.03]}>
              <boxGeometry args={[0.12, 0.02, 0.01]} />
              <meshBasicMaterial color={isSelected ? '#f87171' : '#ef4444'} />
            </mesh>
            {/* Needle - south pointing white */}
            <mesh position={[-0.08, 0, 0.03]}>
              <boxGeometry args={[0.12, 0.02, 0.01]} />
              <meshBasicMaterial color="#e2e8f0" />
            </mesh>
            {isSelected && (
              <pointLight color="#8b5cf6" intensity={0.5} distance={1} />
            )}
          </group>
        ))}
      </group>
    </ClickablePart>
  );
}

function CurrentLoop({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const electronRef = useRef<THREE.Mesh>(null);
  const isSelected = selectedPart === 'current';

  useFrame((state) => {
    if (electronRef.current) {
      const t = state.clock.elapsedTime * 2;
      electronRef.current.position.x = 3 * Math.cos(t);
      electronRef.current.position.z = 0.8 * Math.sin(t);
    }
  });

  return (
    <ClickablePart partId="current" selectedPart={selectedPart} onSelect={onSelect}>
      <group position={[0, -2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Wire loop */}
        <mesh>
          <torusGeometry args={[3, 0.05, 16, 64]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Moving electron */}
        <Trail
          width={0.3}
          length={5}
          color={isSelected ? '#22d3ee' : '#06b6d4'}
          attenuation={(t) => t * t}
        >
          <mesh ref={electronRef}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color={isSelected ? '#22d3ee' : '#06b6d4'} />
          </mesh>
        </Trail>
        {/* Current direction arrows */}
        {[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].map((angle, i) => (
          <mesh key={i} position={[3 * Math.cos(angle), 3 * Math.sin(angle), 0]} rotation={[0, 0, angle + Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.15, 8]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        ))}
      </group>
    </ClickablePart>
  );
}

function LabEnvironment() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <Sparkles count={40} scale={10} size={1.5} speed={0.3} opacity={0.3} color="#8b5cf6" />
    </>
  );
}

function CameraController({ selectedPart }: { selectedPart: string | null }) {
  const cameraRef = useRef<THREE.Vector3>(new THREE.Vector3(5, 3, 5));
  
  const partPositions: Record<string, THREE.Vector3> = {
    northPole: new THREE.Vector3(3, 1, 2),
    southPole: new THREE.Vector3(-3, 1, 2),
    fieldLines: new THREE.Vector3(0, 2, 5),
    domains: new THREE.Vector3(0, 0.5, 2),
    compass: new THREE.Vector3(3, 1, 4),
    current: new THREE.Vector3(0, -1, 6),
  };

  useFrame(({ camera }) => {
    const targetPos = selectedPart ? partPositions[selectedPart] : new THREE.Vector3(5, 3, 5);
    cameraRef.current.lerp(targetPos, 0.05);
    camera.position.copy(cameraRef.current);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function InfoPanel({ partId, onClose }: { partId: string; onClose: () => void }) {
  const info = magnetPartsInfo[partId];
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
            <Magnet className="w-5 h-5" style={{ color: info.color }} />
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

export default function InteractiveMagnetModel() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, -3]} intensity={0.5} color="#8b5cf6" />
        
        <CameraController selectedPart={selectedPart} />
        <LabEnvironment />
        <BarMagnet selectedPart={selectedPart} onSelect={setSelectedPart} />
        <MagneticFieldLines selectedPart={selectedPart} onSelect={setSelectedPart} />
        <CompassNeedles selectedPart={selectedPart} onSelect={setSelectedPart} />
        <CurrentLoop selectedPart={selectedPart} onSelect={setSelectedPart} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={12}
        />
      </Canvas>

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
            🧲 Click on magnet parts to explore electricity and magnetism
          </p>
        </motion.div>
      )}
    </div>
  );
}
