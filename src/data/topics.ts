import { FlaskConical, Microscope, Atom, Dna, Sparkles, Beaker, TestTubes, Flame, Leaf, Bug, Brain, Zap, Magnet, Waves, CircleDot, Orbit, Radiation } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface Subtopic {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  overview: string;
  keyFacts: string[];
  experiment: string;
  funFact: string;
  modelType: '3d-beaker' | '3d-atom' | '3d-dna' | '3d-molecule' | '3d-cell' | '3d-wave' | '3d-magnet' | '3d-flask';
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  subtopics: Subtopic[];
}

export const topics: Topic[] = [
  {
    id: 'chemistry',
    title: 'Chemistry',
    description: 'Explore the science of matter, chemical reactions, and the building blocks of everything around us.',
    icon: FlaskConical,
    color: '#14b8a6',
    subtopics: [
      {
        id: 'chemical-reactions',
        title: 'Chemical Reactions',
        description: 'Learn how substances transform into new materials',
        icon: Flame,
        color: '#f97316',
        modelType: '3d-flask',
        overview: 'Chemical reactions occur when substances combine or break apart to form new substances with different properties. During a reaction, chemical bonds between atoms are broken and new bonds are formed, resulting in the rearrangement of atoms.',
        keyFacts: [
          'Chemical reactions involve the breaking and forming of chemical bonds between atoms.',
          'The law of conservation of mass states that matter cannot be created or destroyed in a chemical reaction.',
          'Catalysts speed up reactions without being consumed in the process.',
          'Exothermic reactions release energy (heat), while endothermic reactions absorb energy.',
          'The rate of reaction depends on temperature, concentration, surface area, and presence of catalysts.',
        ],
        experiment: 'Create an elephant toothpaste reaction! Mix hydrogen peroxide with yeast and dish soap. The yeast acts as a catalyst, rapidly decomposing the peroxide and creating a massive foam eruption!',
        funFact: 'The fastest chemical reaction ever recorded happens in just 1 femtosecond (one quadrillionth of a second) - faster than the time it takes light to travel across a human hair!',
      },
      {
        id: 'acids-and-bases',
        title: 'Acids & Bases',
        description: 'Discover the pH scale and how acids and bases interact',
        icon: Beaker,
        color: '#22c55e',
        modelType: '3d-beaker',
        overview: 'Acids and bases are two fundamental categories of chemical compounds. Acids donate hydrogen ions (H+) while bases accept them. The pH scale measures how acidic or basic a solution is, ranging from 0 (most acidic) to 14 (most basic), with 7 being neutral.',
        keyFacts: [
          'The pH scale ranges from 0 to 14, with 7 being neutral (like pure water).',
          'Acids taste sour (like lemons) and bases taste bitter (like baking soda).',
          'When acids and bases mix, they neutralize each other, forming water and a salt.',
          'Your stomach contains hydrochloric acid with a pH of 1.5-3.5.',
          'Rain is naturally slightly acidic (pH ~5.6) due to dissolved carbon dioxide.',
        ],
        experiment: 'Make a red cabbage pH indicator! Boil red cabbage, strain the purple liquid, and use it to test different household substances. Acids turn it red/pink, bases turn it green/yellow!',
        funFact: 'The most acidic substance known is fluoroantimonic acid - it\'s 10 quadrillion times stronger than stomach acid and can dissolve glass!',
      },
      {
        id: 'solutions-mixtures',
        title: 'Solutions & Mixtures',
        description: 'Understand how substances combine and separate',
        icon: TestTubes,
        color: '#3b82f6',
        modelType: '3d-beaker',
        overview: 'A solution is a homogeneous mixture where one substance (solute) dissolves completely in another (solvent). Mixtures can be separated using various techniques based on the physical properties of their components.',
        keyFacts: [
          'Water is called the "universal solvent" because it dissolves more substances than any other liquid.',
          'Solubility increases with temperature for most solid solutes but decreases for gases.',
          'Saturated solutions contain the maximum amount of dissolved solute at a given temperature.',
          'Mixtures can be separated by filtration, distillation, evaporation, or chromatography.',
          'Colloids (like milk or fog) are mixtures where particles are larger than in solutions but don\'t settle.',
        ],
        experiment: 'Separate ink colors using paper chromatography! Draw a dot of black marker on filter paper, dip the edge in water, and watch as different colored pigments separate as the water travels up!',
        funFact: 'Seawater contains about 3.5% dissolved salt - if all the salt in the oceans was extracted and spread on land, it would form a layer 500 feet thick!',
      },
    ],
  },
  {
    id: 'biology',
    title: 'Biology',
    description: 'Discover the fascinating world of living organisms, from cells to ecosystems.',
    icon: Dna,
    color: '#a855f7',
    subtopics: [
      {
        id: 'cells',
        title: 'Cell Structure',
        description: 'Explore the building blocks of all living things',
        icon: CircleDot,
        color: '#ec4899',
        modelType: '3d-cell',
        overview: 'Cells are the basic structural and functional units of all living organisms. There are two main types: prokaryotic cells (bacteria) lack a nucleus, while eukaryotic cells (plants, animals, fungi) have a membrane-bound nucleus and organelles.',
        keyFacts: [
          'The human body contains approximately 37.2 trillion cells.',
          'Red blood cells live for about 120 days, while some nerve cells last a lifetime.',
          'Mitochondria, the "powerhouses" of cells, have their own DNA and were once free-living bacteria.',
          'Plant cells have cell walls and chloroplasts that animal cells lack.',
          'The largest single cell is an ostrich egg, while the smallest is a bacterium.',
        ],
        experiment: 'View onion cells under a microscope! Peel the thin membrane from an onion layer, stain it with iodine, and observe the brick-like cell walls and nuclei!',
        funFact: 'Your body produces and destroys about 3.8 million cells every second. By the time you finish reading this sentence, 50 million of your cells will have died and been replaced!',
      },
      {
        id: 'photosynthesis',
        title: 'Photosynthesis',
        description: 'Learn how plants convert sunlight into energy',
        icon: Leaf,
        color: '#22c55e',
        modelType: '3d-molecule',
        overview: 'Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. This process uses carbon dioxide and water, releasing oxygen as a byproduct.',
        keyFacts: [
          'The equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂',
          'Chlorophyll in chloroplasts absorbs red and blue light, reflecting green (why plants look green).',
          'About 70% of Earth\'s oxygen comes from marine photosynthetic organisms.',
          'Photosynthesis has two stages: light-dependent reactions and the Calvin cycle.',
          'A large tree can produce about 260 pounds of oxygen per year.',
        ],
        experiment: 'Prove plants produce oxygen! Place an aquatic plant in water under a funnel with an inverted test tube on top. In sunlight, watch oxygen bubbles collect in the tube!',
        funFact: 'If photosynthesis stopped tomorrow, most life on Earth would die within 25 years as oxygen levels dropped and food chains collapsed!',
      },
      {
        id: 'genetics',
        title: 'Genetics & DNA',
        description: 'Uncover the code of life and heredity',
        icon: Dna,
        color: '#a855f7',
        modelType: '3d-dna',
        overview: 'Genetics is the study of heredity and how traits are passed from parents to offspring through DNA. DNA (deoxyribonucleic acid) is a double helix molecule containing the genetic instructions for building and maintaining living organisms.',
        keyFacts: [
          'DNA contains four bases: Adenine (A), Thymine (T), Guanine (G), and Cytosine (C).',
          'Humans share 99.9% of their DNA with each other and about 60% with bananas.',
          'If uncoiled, the DNA in one cell would stretch about 6 feet long.',
          'Genes are segments of DNA that code for specific proteins.',
          'Mutations are changes in DNA that can be harmful, beneficial, or neutral.',
        ],
        experiment: 'Extract DNA from a strawberry! Mash strawberries with salt and dish soap, strain through a filter, add cold rubbing alcohol, and watch the white, stringy DNA precipitate!',
        funFact: 'Your DNA could store all the data ever created by humans - about 215 petabytes (215 million gigabytes) - in a space smaller than a sugar cube!',
      },
    ],
  },
  {
    id: 'physics',
    title: 'Physics',
    description: 'Understand the fundamental laws that govern the universe, from gravity to quantum mechanics.',
    icon: Sparkles,
    color: '#3b82f6',
    subtopics: [
      {
        id: 'forces-motion',
        title: 'Forces & Motion',
        description: 'Discover Newton\'s laws and how objects move',
        icon: Zap,
        color: '#eab308',
        modelType: '3d-atom',
        overview: 'Forces cause objects to accelerate, slow down, or change direction. Newton\'s three laws of motion describe how forces affect the motion of objects, forming the foundation of classical mechanics.',
        keyFacts: [
          'Newton\'s 1st Law: An object at rest stays at rest; an object in motion stays in motion (inertia).',
          'Newton\'s 2nd Law: Force equals mass times acceleration (F = ma).',
          'Newton\'s 3rd Law: For every action, there is an equal and opposite reaction.',
          'Friction is a force that opposes motion between surfaces in contact.',
          'Terminal velocity occurs when air resistance equals gravitational force.',
        ],
        experiment: 'Demonstrate inertia with a coin drop! Place a card on a glass with a coin on top. Flick the card quickly - the coin drops straight down because of inertia!',
        funFact: 'In space, astronauts can "throw" heavy objects with ease - a 200-pound satellite can be pushed with one finger because there\'s no friction or gravity to resist!',
      },
      {
        id: 'electricity-magnetism',
        title: 'Electricity & Magnetism',
        description: 'Explore the invisible forces that power our world',
        icon: Magnet,
        color: '#ef4444',
        modelType: '3d-magnet',
        overview: 'Electricity and magnetism are two aspects of the same fundamental force: electromagnetism. Moving electric charges create magnetic fields, and changing magnetic fields create electric currents.',
        keyFacts: [
          'Electric current is the flow of electrons through a conductor.',
          'Voltage (potential difference) is the "pressure" that pushes electrons through a circuit.',
          'Magnets have north and south poles - opposite poles attract, like poles repel.',
          'Electromagnets are created by running electric current through a coiled wire.',
          'Earth\'s magnetic field protects us from harmful solar radiation.',
        ],
        experiment: 'Build an electromagnet! Wrap insulated copper wire around an iron nail, connect to a battery, and watch it pick up paper clips. More coils = stronger magnet!',
        funFact: 'A bolt of lightning contains enough energy to toast 100,000 slices of bread - but it happens so fast (0.0002 seconds) that we can\'t harness it efficiently!',
      },
      {
        id: 'waves-sound',
        title: 'Waves & Sound',
        description: 'Learn how energy travels through space and matter',
        icon: Waves,
        color: '#06b6d4',
        modelType: '3d-wave',
        overview: 'Waves transfer energy without transferring matter. Sound waves are mechanical waves that require a medium (air, water, solids) to travel, while light waves are electromagnetic and can travel through a vacuum.',
        keyFacts: [
          'Sound travels at about 343 m/s in air, faster in liquids, and fastest in solids.',
          'The frequency of a sound wave determines its pitch; amplitude determines loudness.',
          'Ultrasound (above 20,000 Hz) is used in medical imaging and by bats for echolocation.',
          'The Doppler effect explains why a siren sounds higher as it approaches and lower as it moves away.',
          'Sound cannot travel in space because there\'s no medium to carry the vibrations.',
        ],
        experiment: 'Visualize sound waves! Stretch plastic wrap over a bowl, sprinkle salt on top, and play loud music nearby. Watch the salt dance as sound waves vibrate the plastic!',
        funFact: 'The loudest sound ever recorded was the 1883 Krakatoa eruption - it was heard 3,000 miles away and ruptured the eardrums of sailors 40 miles from the volcano!',
      },
    ],
  },
  {
    id: 'atoms',
    title: 'Atomic Structure',
    description: 'Dive into the microscopic world of atoms, electrons, and the particles that make up matter.',
    icon: Atom,
    color: '#f97316',
    subtopics: [
      {
        id: 'subatomic-particles',
        title: 'Subatomic Particles',
        description: 'Meet protons, neutrons, and electrons',
        icon: CircleDot,
        color: '#f97316',
        modelType: '3d-atom',
        overview: 'Atoms are made of three main subatomic particles: protons (positive charge) and neutrons (no charge) in the nucleus, and electrons (negative charge) orbiting around it. These particles determine an element\'s identity and chemical behavior.',
        keyFacts: [
          'Protons have a positive charge and determine the element\'s atomic number.',
          'Neutrons have no charge and contribute to atomic mass; varying neutrons create isotopes.',
          'Electrons have a negative charge and are about 1,836 times lighter than protons.',
          'The strong nuclear force holds protons and neutrons together in the nucleus.',
          'Quarks are even smaller particles that make up protons and neutrons.',
        ],
        experiment: 'Model an atom! Use different colored balls for protons, neutrons, and electrons. Protons and neutrons cluster in the center, electrons orbit at different distances!',
        funFact: 'If an atom were the size of a football stadium, the nucleus would be a marble at the center field, and electrons would be gnats flying around the stands - atoms are 99.9999999% empty space!',
      },
      {
        id: 'electron-orbitals',
        title: 'Electron Orbitals',
        description: 'Explore where electrons live around atoms',
        icon: Orbit,
        color: '#8b5cf6',
        modelType: '3d-atom',
        overview: 'Electrons don\'t orbit atoms in neat circles like planets. Instead, they exist in probability clouds called orbitals - regions where electrons are most likely to be found. These orbitals come in different shapes: s (spherical), p (dumbbell), d (cloverleaf), and f (complex).',
        keyFacts: [
          'Electron shells are labeled K, L, M, N... or 1, 2, 3, 4... from the nucleus outward.',
          'Each shell can hold a maximum number of electrons: 2n² (2, 8, 18, 32...).',
          'Valence electrons in the outermost shell determine chemical bonding behavior.',
          'The Pauli exclusion principle: no two electrons can have identical quantum numbers.',
          'Electrons fill lower energy orbitals before higher ones (Aufbau principle).',
        ],
        experiment: 'Visualize orbitals with balloons! A single balloon represents an s orbital. Two balloons tied together represent p orbitals pointing in opposite directions!',
        funFact: 'According to quantum mechanics, there\'s a tiny probability that an electron from your body could spontaneously appear on the other side of the universe - it\'s just incredibly unlikely!',
      },
      {
        id: 'radioactivity',
        title: 'Radioactivity',
        description: 'Learn about unstable atoms and nuclear decay',
        icon: Radiation,
        color: '#22c55e',
        modelType: '3d-atom',
        overview: 'Radioactivity occurs when unstable atomic nuclei release energy and particles to become more stable. There are three main types of radiation: alpha particles (helium nuclei), beta particles (electrons), and gamma rays (electromagnetic radiation).',
        keyFacts: [
          'Half-life is the time it takes for half of a radioactive sample to decay.',
          'Carbon-14 dating uses radioactive decay to determine the age of organic materials.',
          'Alpha particles can be stopped by paper; beta by aluminum; gamma needs lead or concrete.',
          'Nuclear fission splits heavy atoms (used in power plants); fusion combines light atoms (like in the Sun).',
          'Marie Curie discovered polonium and radium, winning two Nobel Prizes.',
        ],
        experiment: 'Simulate half-life with coins! Start with 100 coins (atoms). Flip them all, remove "heads" (decayed atoms). Repeat and graph the number remaining - you\'ll see exponential decay!',
        funFact: 'Bananas are radioactive! They contain potassium-40, but you\'d need to eat 10 million bananas at once to get a lethal radiation dose!',
      },
    ],
  },
];

export function getTopic(topicId: string): Topic | undefined {
  return topics.find(t => t.id === topicId);
}

export function getSubtopic(topicId: string, subtopicId: string): Subtopic | undefined {
  const topic = getTopic(topicId);
  return topic?.subtopics.find(s => s.id === subtopicId);
}
