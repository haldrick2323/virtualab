import { lazy, Suspense } from 'react';
import TopicScene from './TopicScene';

// Lazy load interactive models for better performance
const InteractiveCellModel = lazy(() => import('./InteractiveCellModel'));
const InteractiveAtomModel = lazy(() => import('./InteractiveAtomModel'));

interface InteractiveModelWrapperProps {
  modelType: string;
  color?: string;
}

// Loading fallback
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
  // Map model types to interactive versions
  const interactiveModels: Record<string, React.ReactNode> = {
    '3d-cell': (
      <Suspense fallback={<LoadingFallback />}>
        <InteractiveCellModel color={color} />
      </Suspense>
    ),
    '3d-atom': (
      <Suspense fallback={<LoadingFallback />}>
        <InteractiveAtomModel />
      </Suspense>
    ),
  };

  // If we have an interactive version, use it; otherwise fall back to the original
  if (interactiveModels[modelType]) {
    return <>{interactiveModels[modelType]}</>;
  }

  // Fall back to original TopicScene for models without interactive versions
  return <TopicScene modelType={modelType} color={color} />;
}
