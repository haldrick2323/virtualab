import { motion } from 'framer-motion';
import { BookMarked } from 'lucide-react';

interface SourceCreditsProps {
  topicTitle: string;
  color: string;
}

const defaultCredits: Record<string, string[]> = {
  'Chemical Reactions': [
    'Khan Academy – Chemistry: Chemical Reactions',
    'LibreTexts Chemistry – Types of Chemical Reactions',
    'National Science Foundation – Chemistry Resources',
  ],
  'Acids & Bases': [
    'Khan Academy – Acids, Bases, and pH',
    'CK-12 Foundation – Acids and Bases',
    'American Chemical Society – pH Scale',
  ],
  'Solutions & Mixtures': [
    'Khan Academy – Solutions, Mixtures, and Compounds',
    'BBC Bitesize – Mixtures and Separation',
  ],
  'Cells': [
    'Khan Academy – Biology: Cell Structure',
    'National Institutes of Health – Cell Biology',
    'CK-12 Foundation – Cell Biology',
  ],
  'DNA & Genetics': [
    'Khan Academy – Molecular Biology of the Gene',
    'National Human Genome Research Institute',
    'Nature Education – Genetics',
  ],
  'Ecosystems': [
    'Khan Academy – Ecology',
    'National Geographic – Ecosystems',
    'EPA – Ecosystem Services',
  ],
  'Forces & Motion': [
    'Khan Academy – Physics: Forces and Newton\'s Laws',
    'PhET Interactive Simulations – Forces and Motion',
  ],
  'Waves & Sound': [
    'Khan Academy – Physics: Waves and Optics',
    'The Physics Classroom – Sound Waves',
  ],
  'Electricity & Magnetism': [
    'Khan Academy – Physics: Electrical Engineering',
    'HyperPhysics – Electricity and Magnetism',
  ],
  'Atomic Structure': [
    'Khan Academy – Chemistry: Atomic Structure',
    'LibreTexts – Atomic Theory',
  ],
  'Periodic Table': [
    'Khan Academy – The Periodic Table',
    'Royal Society of Chemistry – Periodic Table',
    'IUPAC – Periodic Table of Elements',
  ],
  'Radioactivity': [
    'Khan Academy – Nuclear Physics',
    'World Nuclear Association – Radiation',
    'US NRC – Radioactive Decay',
  ],
};

export default function SourceCredits({ topicTitle, color }: SourceCreditsProps) {
  const credits = defaultCredits[topicTitle] || ['General science educational resources'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="glass-card p-5 mt-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookMarked className="w-4 h-4" style={{ color }} />
        <h3 className="font-display text-sm font-semibold text-foreground">Sources & Credits</h3>
      </div>
      <ul className="space-y-1.5">
        {credits.map((credit, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0 bg-muted-foreground/50" />
            {credit}
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground/60 mt-3 italic">
        Content adapted for educational purposes.
      </p>
    </motion.div>
  );
}
