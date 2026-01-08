import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lightbulb, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Topic {
  id: string;
  title: string;
  overview: string;
  keyFacts: string[];
  experiment: string;
  funFact: string;
}

const topicsData: Record<string, Topic> = {
  chemistry: {
    id: 'chemistry',
    title: 'Chemistry: The Science of Matter',
    overview: 'Chemistry is the scientific study of matter, its properties, composition, structure, and the changes it undergoes during chemical reactions. It bridges physics with biology and connects to many other scientific disciplines.',
    keyFacts: [
      'There are 118 known elements on the periodic table, with 94 occurring naturally on Earth.',
      'Water (H₂O) is called the "universal solvent" because it can dissolve more substances than any other liquid.',
      'Chemical reactions involve the breaking and forming of chemical bonds between atoms.',
      'The pH scale measures how acidic or basic a solution is, ranging from 0 (most acidic) to 14 (most basic).',
    ],
    experiment: 'Try the classic baking soda and vinegar volcano! When sodium bicarbonate (baking soda) reacts with acetic acid (vinegar), it produces carbon dioxide gas, water, and sodium acetate. The rapid production of CO₂ creates the bubbling "eruption" effect.',
    funFact: 'The human body contains enough carbon to make 900 pencils, enough iron to make a 3-inch nail, and enough phosphorus to make 2,200 match heads!',
  },
  biology: {
    id: 'biology',
    title: 'Biology: The Study of Life',
    overview: 'Biology explores living organisms and their vital processes. From the smallest bacteria to the largest whales, biology helps us understand how life works, evolves, and interacts with the environment.',
    keyFacts: [
      'DNA, the molecule of heredity, contains the genetic instructions for building and maintaining living organisms.',
      'The human body contains approximately 37.2 trillion cells, each performing specific functions.',
      'Photosynthesis converts sunlight, water, and CO₂ into glucose and oxygen, sustaining most life on Earth.',
      'Evolution through natural selection explains how species change over time to adapt to their environments.',
    ],
    experiment: 'Extract DNA at home! Mash a strawberry in a bag with salt and dish soap, strain through a coffee filter, then add cold rubbing alcohol. Watch as white, stringy DNA precipitates and floats to the top!',
    funFact: 'If you uncoiled all the DNA in your body and laid it end to end, it would stretch about 10 billion miles—enough to reach Pluto and back!',
  },
  physics: {
    id: 'physics',
    title: 'Physics: Understanding the Universe',
    overview: 'Physics is the fundamental science that studies matter, energy, and the interactions between them. It explains everything from why apples fall to how stars shine, and forms the foundation for all other natural sciences.',
    keyFacts: [
      'The speed of light in a vacuum is approximately 299,792,458 meters per second (about 670 million mph).',
      'Gravity is the weakest of the four fundamental forces but dominates at large scales due to its infinite range.',
      'Einstein\'s E=mc² shows that mass and energy are interchangeable, explaining nuclear reactions.',
      'Quantum mechanics reveals that particles can exist in multiple states simultaneously until observed.',
    ],
    experiment: 'Demonstrate inertia with a classic tablecloth trick! Place dishes on a smooth tablecloth, then quickly pull the cloth straight down. If done fast enough, the dishes stay in place because objects at rest tend to stay at rest (Newton\'s First Law).',
    funFact: 'If you could fold a piece of paper 42 times, it would reach the Moon! This demonstrates the power of exponential growth.',
  },
  atoms: {
    id: 'atoms',
    title: 'Atoms: Building Blocks of Matter',
    overview: 'Atoms are the smallest units of ordinary matter that form chemical elements. Understanding atoms is key to understanding all of chemistry and much of physics.',
    keyFacts: [
      'Atoms consist of a nucleus (protons and neutrons) surrounded by electrons in orbital shells.',
      'An atom is mostly empty space—if an atom were the size of a stadium, the nucleus would be like a marble at the center.',
      'The number of protons in an atom\'s nucleus determines what element it is (atomic number).',
      'Isotopes are atoms of the same element with different numbers of neutrons.',
    ],
    experiment: 'Create a 3D atom model using styrofoam balls and wire! Use a large ball for the nucleus, smaller balls in different colors for protons and neutrons, and even smaller ones on wire orbits for electrons.',
    funFact: 'There are more atoms in a glass of water than there are glasses of water in all the oceans on Earth!',
  },
};

interface TopicContentProps {
  topicId: string | null;
  onClose: () => void;
}

export default function TopicContent({ topicId, onClose }: TopicContentProps) {
  const topic = topicId ? topicsData[topicId] : null;

  return (
    <AnimatePresence>
      {topic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-card p-8 scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl font-bold text-gradient mb-6"
            >
              {topic.title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Overview */}
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-2">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">{topic.overview}</p>
                </div>
              </div>

              {/* Key Facts */}
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-3">Key Facts</h3>
                  <ul className="space-y-2">
                    {topic.keyFacts.map((fact, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-muted-foreground text-sm flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {fact}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Try This Experiment */}
              <div className="flex items-start gap-3">
                <FlaskConical className="w-5 h-5 text-science-green mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-2">Try This Experiment</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm bg-secondary/50 p-4 rounded-lg border border-border">
                    {topic.experiment}
                  </p>
                </div>
              </div>

              {/* Fun Fact */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-xl border border-primary/20"
              >
                <p className="text-sm">
                  <span className="font-display font-semibold text-primary">Fun Fact: </span>
                  <span className="text-foreground">{topic.funFact}</span>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
