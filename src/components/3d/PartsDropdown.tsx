import { ChevronDown, Focus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface PartInfo {
  id: string;
  name: string;
  color: string;
}

interface PartsDropdownProps {
  parts: Record<string, PartInfo>;
  selectedPart: string | null;
  onSelectPart: (id: string | null) => void;
}

export default function PartsDropdown({ parts, selectedPart, onSelectPart }: PartsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const partsList = Object.values(parts);
  const selectedPartInfo = selectedPart ? parts[selectedPart] : null;

  return (
    <div ref={dropdownRef} className="absolute top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card/95 backdrop-blur-md border border-border rounded-lg px-3 py-2 shadow-lg hover:bg-accent/50 transition-colors"
      >
        <Focus className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          {selectedPartInfo ? selectedPartInfo.name : 'Zoom to Part'}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-56 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-border">
              <p className="text-xs text-muted-foreground px-2">Click to zoom to a part</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {partsList.map((part) => (
                <button
                  key={part.id}
                  onClick={() => {
                    onSelectPart(selectedPart === part.id ? null : part.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedPart === part.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-accent/50 text-foreground'
                  }`}
                >
                  <span 
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${selectedPart === part.id ? 'ring-2 ring-offset-1 ring-offset-card' : ''}`}
                    style={{ 
                      backgroundColor: part.color,
                      boxShadow: selectedPart === part.id ? `0 0 0 2px ${part.color}40` : 'none'
                    }}
                  />
                  <span className="text-sm font-medium">{part.name}</span>
                  {selectedPart === part.id && (
                    <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
            {selectedPart && (
              <div className="p-2 border-t border-border">
                <button
                  onClick={() => {
                    onSelectPart(null);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-muted-foreground text-sm"
                >
                  Reset View
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
