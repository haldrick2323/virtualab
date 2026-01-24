import { lazy, Suspense } from 'react';

// Lazy load interactive models for better performance
const InteractiveCellModel = lazy(() => import('./InteractiveCellModel'));
const InteractiveAtomModel = lazy(() => import('./InteractiveAtomModel'));
const InteractiveFlaskModel = lazy(() => import('./InteractiveFlaskModel'));
const InteractiveBeakerModel = lazy(() => import('./InteractiveBeakerModel'));
const InteractiveDNAModel = lazy(() => import('./InteractiveDNAModel'));
const InteractiveMoleculeModel = lazy(() => import('./InteractiveMoleculeModel'));
const InteractiveWaveModel = lazy(() => import('./InteractiveWaveModel'));
const InteractiveMagnetModel = lazy(() => import('./InteractiveMagnetModel'));

interface InteractiveModelWrapperProps {
  modelType: string;
  color?: string;
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background/50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading interactive model...</p>
      </div>
    </div>
  );
}

export default function InteractiveModelWrapper({ modelType, color = '#14b8a6' }: InteractiveModelWrapperProps) {
  const interactiveModels: Record<string, React.ReactNode> = {
    '3d-cell': <Suspense fallback={<LoadingFallback />}><InteractiveCellModel color={color} /></Suspense>,
    '3d-atom': <Suspense fallback={<LoadingFallback />}><InteractiveAtomModel /></Suspense>,
    '3d-flask': <Suspense fallback={<LoadingFallback />}><InteractiveFlaskModel /></Suspense>,
    '3d-beaker': <Suspense fallback={<LoadingFallback />}><InteractiveBeakerModel /></Suspense>,
    '3d-dna': <Suspense fallback={<LoadingFallback />}><InteractiveDNAModel /></Suspense>,
    '3d-molecule': <Suspense fallback={<LoadingFallback />}><InteractiveMoleculeModel /></Suspense>,
    '3d-wave': <Suspense fallback={<LoadingFallback />}><InteractiveWaveModel /></Suspense>,
    '3d-magnet': <Suspense fallback={<LoadingFallback />}><InteractiveMagnetModel /></Suspense>,
  };

  if (interactiveModels[modelType]) {
    return <>{interactiveModels[modelType]}</>;
  }

  // Fallback for any unmapped types
  return <Suspense fallback={<LoadingFallback />}><InteractiveAtomModel /></Suspense>;
}
