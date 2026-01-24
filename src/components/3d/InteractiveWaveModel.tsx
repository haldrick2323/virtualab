import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Waves } from 'lucide-react';

interface PartInfo {
  id: string;
  name: string;
  description: string;
  facts: string[];
  color: string;
}

const wavePartsInfo: Record<string, PartInfo> = {
  crest: {
    id: 'crest',
    name: 'Wave Crest',
    description: 'The highest point of a wave, where particles are at maximum displacement above the equilibrium position.',
    facts: [
      'Maximum positive displacement from rest',
      'Point of highest potential energy',
      'Particles momentarily at rest here',
      'Distance between crests = wavelength'
    ],
    color: '#3b82f6'
  },
  trough: {
    id: 'trough',
    name: 'Wave Trough',
    description: 'The lowest point of a wave, where particles are at maximum displacement below the equilibrium position.',
    facts: [
      'Maximum negative displacement from rest',
      'Also a point of maximum potential energy',
      'Opposite phase from the crest',
      'Distance from crest to trough = half wavelength'
    ],
    color: '#8b5cf6'
  },
  amplitude: {
    id: 'amplitude',
    name: 'Amplitude',
    description: 'The maximum displacement from the equilibrium position. In sound waves, amplitude determines loudness; in light, it determines brightness.',
    facts: [
      'Measured from rest position to peak',
      'Related to wave energy (E ∝ A²)',
      'Determines loudness in sound waves',
      'Determines brightness in light waves'
    ],
    color: '#f59e0b'
  },
  wavelength: {
    id: 'wavelength',
    name: 'Wavelength (λ)',
    description: 'The distance between two consecutive points in phase, such as crest to crest or trough to trough.',
    facts: [
      'Symbol: λ (lambda)',
      'Measured in meters (or nanometers for light)',
      'Inversely related to frequency (v = fλ)',
      'Determines color in visible light'
    ],
    color: '#22c55e'
  },
  frequency: {
    id: 'frequency',
    name: 'Frequency',
    description: 'The number of complete wave cycles passing a point per second, measured in Hertz (Hz).',
    facts: [
      'Measured in Hertz (Hz = cycles/second)',
      'Determines pitch in sound waves',
      'Related to wavelength: f = v/λ',
      'Human hearing: 20 Hz to 20,000 Hz'
    ],
    color: '#ef4444'
  },
  medium: {
    id: 'medium',
    name: 'Wave Medium',
    description: 'The material through which a mechanical wave travels. The medium itself doesn\'t travel; only energy is transferred.',
    facts: [
      'Particles oscillate but don\'t travel with wave',
      'Different media have different wave speeds',
      'Sound needs a medium; light doesn\'t',
      'Denser media often transmit sound faster'
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
  const info = wavePartsInfo[partId];

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

function AnimatedWave({ selectedPart, onSelect }: { selectedPart: string | null; onSelect: (id: string | null) => void }) {
  const waveRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  
  const amplitude = 1;
  const wavelength = 3;
  const frequency = 0.5;
  const particleCount = 40;

  const isCrestSelected = selectedPart === 'crest';
  const isTroughSelected = selectedPart === 'trough';
  const isAmplitudeSelected = selectedPart === 'amplitude';
  const isWavelengthSelected = selectedPart === 'wavelength';
  const isFrequencySelected = selectedPart === 'frequency';
  const isMediumSelected = selectedPart === 'medium';

  useFrame((state, delta) => {
    timeRef.current += delta * frequency * Math.PI * 2;
    
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const x = (i / particleCount) * 10 - 5;
        const y = amplitude * Math.sin((2 * Math.PI * x) / wavelength + timeRef.current);
        particle.position.y = y;
      });
    }
  });

  const wavePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 10 - 5;
      points.push(new THREE.Vector3(x, 0, 0));
    }
    return points;
  }, []);

  return (
    <group ref={waveRef}>
      {/* Medium particles */}
      <ClickablePart partId="medium" selectedPart={selectedPart} onSelect={onSelect}>
        <group ref={particlesRef}>
          {Array.from({ length: particleCount }).map((_, i) => (
            <mesh key={i} position={[(i / particleCount) * 10 - 5, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial 
                color={isMediumSelected ? '#22d3ee' : '#06b6d4'}
                emissive="#06b6d4"
                emissiveIntensity={isMediumSelected ? 0.5 : 0.1}
              />
            </mesh>
          ))}
        </group>
      </ClickablePart>

      {/* Crest indicator */}
      <ClickablePart partId="crest" selectedPart={selectedPart} onSelect={onSelect}>
        <group position={[0, amplitude, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
              color={isCrestSelected ? '#60a5fa' : '#3b82f6'}
              emissive="#3b82f6"
              emissiveIntensity={isCrestSelected ? 0.5 : 0.2}
            />
          </mesh>
          {isCrestSelected && (
            <mesh position={[0, 0.3, 0]}>
              <coneGeometry args={[0.1, 0.2, 8]} />
              <meshBasicMaterial color="#3b82f6" />
            </mesh>
          )}
        </group>
      </ClickablePart>

      {/* Trough indicator */}
      <ClickablePart partId="trough" selectedPart={selectedPart} onSelect={onSelect}>
        <group position={[wavelength / 2, -amplitude, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
              color={isTroughSelected ? '#a78bfa' : '#8b5cf6'}
              emissive="#8b5cf6"
              emissiveIntensity={isTroughSelected ? 0.5 : 0.2}
            />
          </mesh>
          {isTroughSelected && (
            <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.1, 0.2, 8]} />
              <meshBasicMaterial color="#8b5cf6" />
            </mesh>
          )}
        </group>
      </ClickablePart>

      {/* Amplitude indicator */}
      <ClickablePart partId="amplitude" selectedPart={selectedPart} onSelect={onSelect}>
        <group position={[-2.5, 0, 0]}>
          {/* Vertical line showing amplitude */}
          <mesh position={[0, amplitude / 2, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.05, amplitude, 0.05]} />
            <meshBasicMaterial 
              color={isAmplitudeSelected ? '#fbbf24' : '#f59e0b'} 
            />
          </mesh>
          {/* Arrow heads */}
          <mesh position={[0, amplitude, 0]}>
            <coneGeometry args={[0.08, 0.15, 8]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.08, 0.15, 8]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          {isAmplitudeSelected && (
            <pointLight color="#f59e0b" intensity={2} distance={2} />
          )}
        </group>
      </ClickablePart>

      {/* Wavelength indicator */}
      <ClickablePart partId="wavelength" selectedPart={selectedPart} onSelect={onSelect}>
        <group position={[0, -amplitude - 0.5, 0]}>
          {/* Horizontal line showing wavelength */}
          <mesh position={[wavelength / 4, 0, 0]}>
            <boxGeometry args={[wavelength / 2, 0.05, 0.05]} />
            <meshBasicMaterial 
              color={isWavelengthSelected ? '#4ade80' : '#22c55e'} 
            />
          </mesh>
          {/* Arrow heads */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.15, 8]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          <mesh position={[wavelength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.15, 8]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          {isWavelengthSelected && (
            <pointLight color="#22c55e" intensity={2} distance={3} />
          )}
        </group>
      </ClickablePart>

      {/* Frequency indicator - animated pulse */}
      <ClickablePart partId="frequency" selectedPart={selectedPart} onSelect={onSelect}>
        <group position={[3, amplitude + 0.8, 0]}>
          <mesh>
            <torusGeometry args={[0.2, 0.05, 16, 32]} />
            <meshStandardMaterial 
              color={isFrequencySelected ? '#f87171' : '#ef4444'}
              emissive="#ef4444"
              emissiveIntensity={isFrequencySelected ? 0.5 : 0.2}
            />
          </mesh>
          {isFrequencySelected && (
            <pointLight color="#ef4444" intensity={2} distance={2} />
          )}
        </group>
      </ClickablePart>

      {/* Equilibrium line */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12, 0.02, 0.02]} />
        <meshBasicMaterial color="#64748b" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function LabEnvironment() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <Sparkles count={30} scale={10} size={1} speed={0.3} opacity={0.3} color="#3b82f6" />
    </>
  );
}

function CameraController({ selectedPart }: { selectedPart: string | null }) {
  const cameraRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 8));
  
  const partPositions: Record<string, THREE.Vector3> = {
    crest: new THREE.Vector3(0, 2, 4),
    trough: new THREE.Vector3(1.5, 0, 4),
    amplitude: new THREE.Vector3(-2, 2, 4),
    wavelength: new THREE.Vector3(0, -1, 5),
    frequency: new THREE.Vector3(3, 3, 4),
    medium: new THREE.Vector3(0, 1, 5),
  };

  useFrame(({ camera }) => {
    const targetPos = selectedPart ? partPositions[selectedPart] : new THREE.Vector3(0, 2, 8);
    cameraRef.current.lerp(targetPos, 0.05);
    camera.position.copy(cameraRef.current);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function InfoPanel({ partId, onClose }: { partId: string; onClose: () => void }) {
  const info = wavePartsInfo[partId];
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
            <Waves className="w-5 h-5" style={{ color: info.color }} />
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

export default function InteractiveWaveModel() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-3, 3, -3]} intensity={0.5} color="#3b82f6" />
        
        <CameraController selectedPart={selectedPart} />
        <LabEnvironment />
        <AnimatedWave selectedPart={selectedPart} onSelect={setSelectedPart} />
        
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
            🌊 Click on wave parts to learn about wave properties
          </p>
        </motion.div>
      )}
    </div>
  );
}
