import { FlaskConical, Microscope, Atom, Dna, Sparkles, Beaker, TestTubes, Flame, Leaf, Bug, Brain, Zap, Magnet, Waves, CircleDot, Orbit, Radiation } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { QuizQuestion } from '@/components/Quiz';

export interface Subtopic {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  overview: string;
  detailedContent: string;
  keyFacts: string[];
  experiment: string;
  funFact: string;
  modelType: '3d-beaker' | '3d-atom' | '3d-dna' | '3d-molecule' | '3d-cell' | '3d-wave' | '3d-magnet' | '3d-flask';
  quiz: QuizQuestion[];
  videoUrl?: string;
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
        overview: 'Chemical reactions are the fundamental processes that transform one substance into another. Every moment, countless reactions occur around us and within us, from the rusting of iron to the digestion of food. Understanding chemical reactions is essential to comprehending how matter interacts and changes in our world.',
        detailedContent: `A chemical reaction occurs when the chemical bonds between atoms are broken and new bonds are formed, creating entirely new substances with different properties. This process involves the rearrangement of atoms, but importantly, no atoms are created or destroyed—they are simply reorganized.

The study of chemical reactions reveals several fundamental principles that govern how matter behaves. The law of conservation of mass, established by Antoine Lavoisier in 1789, states that the total mass of reactants must equal the total mass of products. This principle means that in a balanced chemical equation, the number of atoms of each element on the reactant side equals the number on the product side.

Chemical reactions can be classified into several types based on how atoms and molecules interact. In synthesis reactions, two or more simple substances combine to form a more complex product. Decomposition reactions are the opposite—a complex substance breaks down into simpler components. Single replacement reactions occur when one element replaces another in a compound, while double replacement reactions involve two compounds exchanging partners.

The speed at which reactions occur, known as the reaction rate, depends on multiple factors. Temperature plays a crucial role; higher temperatures provide molecules with more kinetic energy, increasing the frequency and force of collisions. Concentration matters too—more reactant molecules in a given space means more potential collisions. Surface area affects reactions involving solids; finely powdered substances react faster than large chunks because more surface is exposed. Catalysts are substances that speed up reactions without being consumed, lowering the activation energy needed to start the reaction.

Energy changes accompany all chemical reactions. Exothermic reactions release energy, typically as heat, making their surroundings warmer—burning wood is a classic example. Endothermic reactions absorb energy from their surroundings, causing cooling—this is why instant cold packs feel cold when activated. Understanding these energy changes is crucial for industrial processes, from manufacturing fertilizers to generating power.`,
        keyFacts: [
          'Chemical reactions involve the breaking and forming of chemical bonds between atoms, requiring energy to break bonds and releasing energy when new bonds form.',
          'The law of conservation of mass states that matter cannot be created or destroyed in a chemical reaction—total mass remains constant throughout the process.',
          'Catalysts speed up reactions by lowering activation energy without being consumed, enabling reactions that would otherwise be too slow to observe.',
          'Exothermic reactions release energy (heat) to surroundings, while endothermic reactions absorb energy, affecting temperature of the environment.',
          'Reaction rates depend on temperature, concentration, surface area, and catalysts—understanding these allows chemists to control industrial processes.',
        ],
        experiment: 'Create an elephant toothpaste reaction! Mix hydrogen peroxide with yeast and dish soap in a tall container. The yeast acts as a catalyst, rapidly decomposing the peroxide into water and oxygen gas. The dish soap traps the oxygen, creating a massive foam eruption that resembles toothpaste squeezed from a giant tube! The reaction is exothermic, so the foam will feel warm to the touch.',
        funFact: 'The fastest chemical reaction ever recorded happens in just 1 femtosecond (one quadrillionth of a second)—faster than the time it takes light to travel across a single human hair! This ultrafast reaction involves the breaking of chemical bonds and was measured using special laser techniques developed by Nobel Prize-winning chemist Ahmed Zewail.',
        quiz: [
          {
            question: 'What is the law of conservation of mass?',
            options: [
              'Matter can be created in chemical reactions',
              'Matter cannot be created or destroyed in a chemical reaction',
              'Energy is always conserved in reactions',
              'Mass increases during chemical reactions'
            ],
            correctAnswer: 1,
            explanation: 'The law of conservation of mass, established by Lavoisier, states that matter cannot be created or destroyed in a chemical reaction. The total mass of reactants equals the total mass of products.'
          },
          {
            question: 'What does a catalyst do in a chemical reaction?',
            options: [
              'It slows down the reaction',
              'It is consumed during the reaction',
              'It speeds up the reaction without being consumed',
              'It increases the temperature required'
            ],
            correctAnswer: 2,
            explanation: 'A catalyst speeds up a chemical reaction by lowering the activation energy without being consumed in the process. It remains unchanged after the reaction is complete.'
          },
          {
            question: 'Which type of reaction releases heat to the surroundings?',
            options: [
              'Endothermic reaction',
              'Exothermic reaction',
              'Decomposition reaction',
              'Synthesis reaction'
            ],
            correctAnswer: 1,
            explanation: 'Exothermic reactions release energy in the form of heat to the surroundings. Examples include burning fuel and mixing acids with bases.'
          },
          {
            question: 'Which factor does NOT affect the rate of a chemical reaction?',
            options: [
              'Temperature',
              'Concentration of reactants',
              'Color of the container',
              'Presence of a catalyst'
            ],
            correctAnswer: 2,
            explanation: 'The color of the container has no effect on reaction rate. Temperature, concentration, surface area, and catalysts are the main factors that influence how fast reactions occur.'
          },
          {
            question: 'In a decomposition reaction, what happens?',
            options: [
              'Two substances combine to form one',
              'One substance breaks down into simpler substances',
              'Elements exchange partners',
              'No change occurs'
            ],
            correctAnswer: 1,
            explanation: 'In a decomposition reaction, a single complex substance breaks down into two or more simpler substances. For example, water can decompose into hydrogen and oxygen gases.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=8m6RtOpqvtU'
      },
      {
        id: 'acids-and-bases',
        title: 'Acids & Bases',
        description: 'Discover the pH scale and how acids and bases interact',
        icon: Beaker,
        color: '#22c55e',
        modelType: '3d-beaker',
        overview: 'Acids and bases represent two fundamental categories of chemical compounds that shape our world in countless ways. From the citric acid in lemons to the sodium hydroxide in drain cleaners, these substances influence everything from biological processes to industrial manufacturing. Understanding acids and bases helps explain phenomena ranging from digestion to environmental issues like acid rain.',
        detailedContent: `The concepts of acids and bases have evolved significantly since their discovery. The Arrhenius definition, developed in the late 1800s, describes acids as substances that produce hydrogen ions (H⁺) in water, and bases as substances that produce hydroxide ions (OH⁻). The Brønsted-Lowry definition expanded this, describing acids as proton donors and bases as proton acceptors, allowing the concept to apply beyond aqueous solutions.

The pH scale provides a quantitative measure of acidity and basicity, ranging from 0 to 14. The scale is logarithmic, meaning each whole number change represents a tenfold change in hydrogen ion concentration. Pure water has a pH of 7, considered neutral. Values below 7 indicate acidic solutions, while values above 7 indicate basic (alkaline) solutions. Household substances span this range: lemon juice has a pH around 2, blood maintains a pH of about 7.4, and bleach reaches about 12.5.

When acids and bases meet, they undergo neutralization reactions, producing water and a salt. This principle underlies many practical applications, from antacids neutralizing stomach acid to treating acid spills with baking soda. The products of neutralization depend on the specific acid and base involved—hydrochloric acid and sodium hydroxide produce sodium chloride (table salt) and water.

Buffer solutions resist changes in pH when small amounts of acid or base are added. These are crucial in biological systems; human blood contains carbonic acid/bicarbonate buffers that maintain pH within the narrow range (7.35-7.45) necessary for life. Enzymes, the proteins that catalyze biological reactions, are extremely sensitive to pH changes and require buffered environments to function properly.

The environmental impact of acids extends beyond the laboratory. Acid rain, formed when sulfur dioxide and nitrogen oxides react with atmospheric water, has damaged forests, corroded monuments, and acidified lakes. Understanding acid-base chemistry has enabled scientists to develop scrubbers that remove these pollutants from power plant emissions and implement policies to reduce environmental damage.`,
        keyFacts: [
          'The pH scale ranges from 0 to 14, with 7 being neutral like pure water. Each unit represents a tenfold change in hydrogen ion concentration.',
          'Acids taste sour (like citrus fruits) and can conduct electricity, while bases taste bitter (like baking soda) and feel slippery.',
          'When acids and bases mix in proper proportions, they neutralize each other, producing water and a salt compound.',
          'Your stomach contains hydrochloric acid with a pH of 1.5-3.5, strong enough to dissolve metal, protected by mucus lining.',
          'Natural rain is slightly acidic (pH ~5.6) due to dissolved carbon dioxide forming carbonic acid; pollution creates more harmful acid rain.',
        ],
        experiment: 'Create a red cabbage pH indicator! Chop red cabbage and boil it in water for 15-20 minutes. Strain the purple liquid and let it cool. Now test different household substances: add vinegar (acid—turns red/pink), lemon juice (acid—turns red), baking soda solution (base—turns green), soap (base—turns blue/green). The anthocyanin pigments in cabbage change color based on pH, giving you a natural universal indicator!',
        funFact: 'The most acidic substance known is fluoroantimonic acid—it\'s approximately 10 quadrillion (10¹⁶) times stronger than concentrated sulfuric acid! It can dissolve glass, and even explodes on contact with water. Scientists must store it in specially treated containers because it destroys almost everything else.',
        quiz: [
          {
            question: 'What does a pH of 7 indicate?',
            options: [
              'Strongly acidic',
              'Weakly acidic',
              'Neutral',
              'Strongly basic'
            ],
            correctAnswer: 2,
            explanation: 'A pH of 7 is neutral, meaning the solution has equal concentrations of hydrogen ions and hydroxide ions. Pure water at 25°C has a pH of exactly 7.'
          },
          {
            question: 'What products are formed when an acid reacts with a base?',
            options: [
              'More acid and more base',
              'Water and a salt',
              'Only water',
              'Carbon dioxide and water'
            ],
            correctAnswer: 1,
            explanation: 'When an acid neutralizes a base, the products are always water (from H⁺ and OH⁻) and a salt (from the remaining ions). This is called a neutralization reaction.'
          },
          {
            question: 'Why is the pH scale considered logarithmic?',
            options: [
              'Because pH values are always whole numbers',
              'Because each unit change represents a 10-fold change in H⁺ concentration',
              'Because it only goes from 0 to 14',
              'Because it measures temperature'
            ],
            correctAnswer: 1,
            explanation: 'The pH scale is logarithmic, meaning each whole number change represents a tenfold (10×) change in hydrogen ion concentration. A solution with pH 3 is 10 times more acidic than pH 4.'
          },
          {
            question: 'What is the pH of normal human blood?',
            options: [
              'About 5.0 (acidic)',
              'Exactly 7.0 (neutral)',
              'About 7.4 (slightly basic)',
              'About 10.0 (basic)'
            ],
            correctAnswer: 2,
            explanation: 'Human blood maintains a pH of about 7.35-7.45, slightly basic. This narrow range is crucial for enzyme function and cellular processes. Buffer systems help maintain this precise pH.'
          },
          {
            question: 'What causes acid rain?',
            options: [
              'Natural volcanic activity only',
              'Sulfur dioxide and nitrogen oxides reacting with water vapor',
              'Too much carbon dioxide in the air',
              'Ocean water evaporation'
            ],
            correctAnswer: 1,
            explanation: 'Acid rain forms when sulfur dioxide and nitrogen oxides (mainly from burning fossil fuels) react with atmospheric water to form sulfuric and nitric acids, which then fall as precipitation.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=pIyTwH0c0qg'
      },
      {
        id: 'solutions-mixtures',
        title: 'Solutions & Mixtures',
        description: 'Understand how substances combine and separate',
        icon: TestTubes,
        color: '#3b82f6',
        modelType: '3d-beaker',
        overview: 'Understanding how substances combine and can be separated is fundamental to chemistry. Solutions and mixtures are everywhere in our daily lives—from the air we breathe to the beverages we drink. Mastering these concepts enables everything from purifying drinking water to developing new medicines and materials.',
        detailedContent: `Matter can be classified as either pure substances or mixtures. Pure substances have fixed compositions—elements contain only one type of atom, and compounds contain atoms of different elements in fixed ratios. Mixtures, on the other hand, contain two or more substances physically combined but not chemically bonded, meaning they can be separated by physical means.

Mixtures come in two main varieties: homogeneous and heterogeneous. Homogeneous mixtures, also called solutions, have uniform composition throughout—you cannot distinguish the different components. When you dissolve sugar in water, the sugar disperses evenly, creating a solution where every drop has the same sweetness. Heterogeneous mixtures have visibly different regions—a salad or sand mixed with pebbles are examples where you can see the different parts.

Solutions consist of a solute (the dissolved substance) and a solvent (the substance doing the dissolving). Water earns its title as the "universal solvent" because its polar molecular structure allows it to dissolve more substances than any other common liquid. The dissolving process involves solvent molecules surrounding solute particles, pulling them away from each other and dispersing them throughout the solution.

Solubility—how much solute can dissolve in a given amount of solvent—depends on several factors. Temperature significantly affects solubility: for most solid solutes, higher temperatures increase solubility as molecular motion helps break apart the solute. However, gases behave oppositely; warm soda goes flat faster because carbon dioxide is less soluble in warm water. Pressure primarily affects gas solubility, which is why pressurized soda bottles contain more dissolved CO₂.

Separation techniques exploit the physical properties of mixture components. Filtration separates based on particle size, trapping solid particles while liquid passes through. Distillation uses differences in boiling points—heating a mixture causes the component with the lower boiling point to vaporize first, then condense separately. Chromatography separates components based on how they interact with a stationary phase; this technique is sensitive enough to identify trace amounts of substances in forensic investigations.`,
        keyFacts: [
          'Water is called the "universal solvent" because its polar molecular structure dissolves more substances than any other liquid.',
          'Solubility generally increases with temperature for solid solutes but decreases for gases—explaining why warm soda goes flat.',
          'Saturated solutions contain the maximum amount of dissolved solute at a given temperature; supersaturated solutions hold even more temporarily.',
          'Mixtures can be separated by physical methods: filtration (by size), distillation (by boiling point), evaporation, or chromatography (by chemical interaction).',
          'Colloids like milk, fog, and gelatin are mixtures where particles are larger than in solutions but too small to settle out.',
        ],
        experiment: 'Separate ink colors using paper chromatography! Draw a thick dot of black marker about 2 cm from the bottom of a coffee filter strip. Hang the strip so the bottom edge dips into water (but the ink dot stays above the water). Watch as water travels up the paper, carrying different pigments at different rates. Black ink often separates into blue, purple, and even yellow components! This works because different dye molecules have different attractions to the paper versus the water.',
        funFact: 'Seawater contains about 3.5% dissolved salts by weight. If all the salt in Earth\'s oceans could be extracted and spread evenly over all the land on Earth, it would form a layer about 500 feet (152 meters) thick—taller than a 40-story building! The ocean contains approximately 50 quadrillion tons of dissolved salts.',
        quiz: [
          {
            question: 'What is a solution?',
            options: [
              'A heterogeneous mixture',
              'A homogeneous mixture with uniform composition',
              'A pure substance',
              'A mixture that can be seen as separate parts'
            ],
            correctAnswer: 1,
            explanation: 'A solution is a homogeneous mixture with uniform composition throughout. The dissolved substance (solute) is evenly distributed in the solvent, so every part of the solution is identical.'
          },
          {
            question: 'Why is water called the "universal solvent"?',
            options: [
              'It can dissolve everything',
              'It dissolves more substances than any other common liquid',
              'It is the only liquid that can dissolve solids',
              'It is found universally on Earth'
            ],
            correctAnswer: 1,
            explanation: 'Water is called the universal solvent because its polar molecular structure allows it to dissolve more substances than any other common liquid. However, it cannot dissolve everything—oils and fats, for example, don\'t dissolve in water.'
          },
          {
            question: 'How does temperature affect the solubility of gases in water?',
            options: [
              'Higher temperature increases gas solubility',
              'Higher temperature decreases gas solubility',
              'Temperature has no effect on gas solubility',
              'It depends on the type of gas'
            ],
            correctAnswer: 1,
            explanation: 'Higher temperatures decrease the solubility of gases in water. This is why a cold soda holds more fizz than a warm one—the carbon dioxide escapes as the liquid warms up.'
          },
          {
            question: 'Which separation technique is based on differences in boiling points?',
            options: [
              'Filtration',
              'Chromatography',
              'Distillation',
              'Sedimentation'
            ],
            correctAnswer: 2,
            explanation: 'Distillation separates mixtures based on differences in boiling points. The component with the lower boiling point vaporizes first, then condenses and is collected separately.'
          },
          {
            question: 'What is a colloid?',
            options: [
              'A pure substance',
              'A mixture where particles are larger than in solutions but don\'t settle',
              'A solution of two liquids',
              'A mixture that separates immediately'
            ],
            correctAnswer: 1,
            explanation: 'Colloids are mixtures where particles are larger than those in true solutions (1-1000 nm) but small enough that they don\'t settle out due to gravity. Examples include milk, fog, and mayonnaise.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=Jo2BHU8RDRI'
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
        overview: 'Cells are the fundamental building blocks of all living organisms, representing the smallest unit of life capable of performing all life functions. From the simplest bacteria to the most complex human, all life is composed of these remarkable microscopic structures. Understanding cells is essential to comprehending how life works at its most basic level.',
        detailedContent: `The cell theory, one of biology's most fundamental principles, states that all living organisms are composed of one or more cells, cells are the basic units of life, and all cells arise from pre-existing cells. This theory, developed in the 1800s by scientists including Schleiden, Schwann, and Virchow, revolutionized our understanding of life.

Cells come in two fundamental types: prokaryotic and eukaryotic. Prokaryotic cells, found in bacteria and archaea, are simpler and smaller, lacking a membrane-bound nucleus. Their genetic material floats freely in the cytoplasm. Eukaryotic cells, found in plants, animals, fungi, and protists, are larger and more complex, with DNA contained within a nucleus and various membrane-bound organelles performing specialized functions.

The cell membrane, a phospholipid bilayer, forms the boundary between the cell and its environment. This remarkable structure is selectively permeable, controlling what enters and exits the cell. Embedded proteins serve various functions: channel proteins allow specific molecules to pass, receptor proteins detect chemical signals, and carrier proteins actively transport materials against concentration gradients.

Inside eukaryotic cells, organelles work like specialized organs. The nucleus, often called the cell's control center, contains DNA organized into chromosomes and is surrounded by a double membrane with pores for RNA transport. The endoplasmic reticulum (ER) comes in two forms: rough ER, studded with ribosomes for protein synthesis, and smooth ER for lipid synthesis and detoxification. The Golgi apparatus modifies, packages, and ships proteins to their destinations.

Mitochondria deserve special attention as the powerhouses of the cell, generating ATP through cellular respiration. Remarkably, mitochondria contain their own DNA and reproduce independently within cells, evidence supporting the endosymbiotic theory that they were once free-living bacteria engulfed by ancestral cells. Plant cells contain chloroplasts with similar origins, converting light energy into chemical energy through photosynthesis.`,
        keyFacts: [
          'The human body contains approximately 37.2 trillion cells, working together in specialized tissues and organs.',
          'Red blood cells live for about 120 days and lack a nucleus, while some nerve cells last an entire lifetime.',
          'Mitochondria, the "powerhouses" of cells, have their own DNA, suggesting they were once free-living bacteria.',
          'Plant cells have cell walls made of cellulose and chloroplasts for photosynthesis—structures animal cells lack.',
          'The largest single cell is an ostrich egg, while the smallest free-living cells are mycoplasma bacteria at 0.2 micrometers.',
        ],
        experiment: 'View onion cells under a microscope! Carefully peel the thin, transparent membrane (epidermis) from between layers of an onion. Place it flat on a glass slide, add a drop of iodine stain (which colors the nuclei brown), and cover with a coverslip. Under magnification, you\'ll clearly see the rectangular brick-like cells with their cell walls, dark-stained nuclei, and granular cytoplasm. This classic experiment reveals the basic unit of plant life!',
        funFact: 'Your body produces and destroys about 3.8 million cells every second! By the time you finish reading this sentence, approximately 50 million of your cells will have died and been replaced by new ones. Most of these are blood cells and cells lining your digestive tract, which experience constant wear and renewal.',
        quiz: [
          {
            question: 'What is the main difference between prokaryotic and eukaryotic cells?',
            options: [
              'Prokaryotes are larger than eukaryotes',
              'Eukaryotes have a membrane-bound nucleus, prokaryotes do not',
              'Prokaryotes have more organelles',
              'Eukaryotes cannot reproduce'
            ],
            correctAnswer: 1,
            explanation: 'The defining difference is that eukaryotic cells have a membrane-bound nucleus containing their DNA, while prokaryotic cells lack this structure—their DNA floats freely in the cytoplasm.'
          },
          {
            question: 'Why are mitochondria called the "powerhouses" of the cell?',
            options: [
              'They control cell division',
              'They generate ATP through cellular respiration',
              'They store genetic information',
              'They digest waste materials'
            ],
            correctAnswer: 1,
            explanation: 'Mitochondria are called powerhouses because they produce ATP (adenosine triphosphate) through cellular respiration. ATP is the primary energy currency that powers virtually all cellular activities.'
          },
          {
            question: 'Which structure is found in plant cells but NOT in animal cells?',
            options: [
              'Mitochondria',
              'Cell membrane',
              'Chloroplasts',
              'Nucleus'
            ],
            correctAnswer: 2,
            explanation: 'Chloroplasts are found only in plant cells (and some protists). These organelles contain chlorophyll and perform photosynthesis, converting light energy into chemical energy stored in glucose.'
          },
          {
            question: 'What does the cell membrane do?',
            options: [
              'Produces energy for the cell',
              'Stores genetic information',
              'Controls what enters and exits the cell',
              'Makes proteins'
            ],
            correctAnswer: 2,
            explanation: 'The cell membrane (plasma membrane) is selectively permeable, meaning it controls which substances can enter or exit the cell. It maintains the cell\'s internal environment while allowing necessary materials to pass.'
          },
          {
            question: 'According to cell theory, where do new cells come from?',
            options: [
              'They form spontaneously from non-living matter',
              'They arise from pre-existing cells',
              'They are created by the nucleus',
              'They develop from proteins'
            ],
            correctAnswer: 1,
            explanation: 'Cell theory states that all cells arise from pre-existing cells through cell division. This principle disproved the old idea of spontaneous generation and is fundamental to understanding life and reproduction.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8'
      },
      {
        id: 'photosynthesis',
        title: 'Photosynthesis',
        description: 'Learn how plants convert sunlight into energy',
        icon: Leaf,
        color: '#22c55e',
        modelType: '3d-molecule',
        overview: 'Photosynthesis is arguably the most important biological process on Earth, converting solar energy into chemical energy that sustains virtually all life. This remarkable process, occurring in plants, algae, and some bacteria, not only provides food but also generates the oxygen we breathe. Understanding photosynthesis reveals how energy flows through ecosystems.',
        detailedContent: `Photosynthesis is a complex series of chemical reactions that can be summarized by the equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. In words, carbon dioxide and water, powered by light, produce glucose (sugar) and release oxygen as a byproduct. This simple equation belies the incredible complexity of the actual process.

The process occurs in two main stages within chloroplasts. The light-dependent reactions take place in the thylakoid membranes, where chlorophyll and other pigments absorb light energy. This energy splits water molecules (photolysis), releasing oxygen and energized electrons. The electrons pass through an electron transport chain, generating ATP and NADPH—energy-carrying molecules that power the next stage.

The light-independent reactions (Calvin cycle) occur in the stroma, the fluid-filled space surrounding the thylakoids. Here, ATP and NADPH from the first stage power the fixation of carbon dioxide into organic molecules. The enzyme RuBisCO, the most abundant protein on Earth, catalyzes the crucial step of attaching CO₂ to a five-carbon sugar. Through a series of reactions, glucose and other carbohydrates are produced.

Chlorophyll, the primary photosynthetic pigment, absorbs red and blue light most efficiently while reflecting green light—which is why plants appear green to our eyes. However, plants also contain accessory pigments like carotenoids (orange and yellow) and anthocyanins (red and purple) that absorb other wavelengths and can transfer that energy to chlorophyll.

The ecological significance of photosynthesis cannot be overstated. It forms the foundation of almost all food chains, as photosynthetic organisms (producers) convert inorganic carbon into organic compounds that other organisms consume. Additionally, about 70% of Earth's oxygen comes from marine photosynthetic organisms, particularly phytoplankton and cyanobacteria. Terrestrial plants contribute the remaining 30%, with tropical rainforests being particularly important.`,
        keyFacts: [
          'The complete equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂ (carbon dioxide + water + light → glucose + oxygen).',
          'Chlorophyll absorbs red and blue light most efficiently, reflecting green wavelengths—which is why plants appear green.',
          'About 70% of Earth\'s oxygen comes from marine photosynthetic organisms like phytoplankton and cyanobacteria.',
          'Photosynthesis occurs in two stages: light-dependent reactions in thylakoids and the Calvin cycle in the stroma.',
          'A large tree can produce about 260 pounds (118 kg) of oxygen per year—enough for two people to breathe.',
        ],
        experiment: 'Prove plants produce oxygen with this classic experiment! Place an aquatic plant (like Elodea) in a beaker of water with a funnel inverted over it and a test tube filled with water over the funnel\'s stem. Place in bright sunlight or under a lamp. Over several hours, watch as oxygen bubbles collect in the test tube, pushing water out. You can test the collected gas by inserting a glowing splint—it will burst into flame in the presence of oxygen!',
        funFact: 'If photosynthesis stopped completely tomorrow, most life on Earth would die within about 25 years. Oxygen levels would gradually decline as respiration consumed the remaining atmospheric oxygen, and the food chain would collapse without plants producing new organic matter. Even the deep-sea ecosystems around hydrothermal vents would eventually be affected.',
        quiz: [
          {
            question: 'What are the products of photosynthesis?',
            options: [
              'Carbon dioxide and water',
              'Glucose and oxygen',
              'ATP and NADPH',
              'Chlorophyll and light'
            ],
            correctAnswer: 1,
            explanation: 'Photosynthesis produces glucose (C₆H₁₂O₆) and oxygen (O₂). The glucose stores chemical energy that the plant uses for growth and metabolism, while oxygen is released as a byproduct.'
          },
          {
            question: 'Where in the plant cell does photosynthesis occur?',
            options: [
              'Mitochondria',
              'Nucleus',
              'Chloroplasts',
              'Cell membrane'
            ],
            correctAnswer: 2,
            explanation: 'Photosynthesis occurs in chloroplasts, organelles containing chlorophyll and other components needed for the process. The light reactions occur in thylakoids, and the Calvin cycle occurs in the stroma.'
          },
          {
            question: 'Why do plants appear green?',
            options: [
              'Chlorophyll absorbs green light',
              'Chlorophyll reflects green light while absorbing red and blue',
              'Plants produce green pigments as waste',
              'Green light is the only light plants receive'
            ],
            correctAnswer: 1,
            explanation: 'Chlorophyll absorbs red and blue light most efficiently for photosynthesis but reflects green wavelengths. Our eyes perceive this reflected green light, making plants appear green.'
          },
          {
            question: 'What percentage of Earth\'s oxygen comes from marine organisms?',
            options: [
              'About 10%',
              'About 30%',
              'About 70%',
              'About 90%'
            ],
            correctAnswer: 2,
            explanation: 'Approximately 70% of Earth\'s oxygen is produced by marine photosynthetic organisms, primarily phytoplankton and cyanobacteria. Terrestrial plants, including forests, contribute the remaining 30%.'
          },
          {
            question: 'What is the role of the Calvin cycle in photosynthesis?',
            options: [
              'To absorb light energy',
              'To split water molecules',
              'To fix carbon dioxide into glucose',
              'To release oxygen'
            ],
            correctAnswer: 2,
            explanation: 'The Calvin cycle (light-independent reactions) uses ATP and NADPH from the light reactions to fix carbon dioxide into organic molecules, eventually producing glucose. This occurs in the stroma of chloroplasts.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=sQK3Yr4Sc_k'
      },
      {
        id: 'genetics',
        title: 'Genetics & DNA',
        description: 'Uncover the code of life and heredity',
        icon: Dna,
        color: '#a855f7',
        modelType: '3d-dna',
        overview: 'Genetics is the science of heredity—how traits pass from parents to offspring through generations. At the heart of genetics lies DNA, the remarkable molecule that stores the instructions for building and maintaining every living organism. Understanding genetics has revolutionized medicine, agriculture, and our understanding of life itself.',
        detailedContent: `DNA (deoxyribonucleic acid) is a double helix molecule composed of two strands wound around each other. Each strand consists of a sugar-phosphate backbone with nitrogenous bases attached. The four bases—adenine (A), thymine (T), guanine (G), and cytosine (C)—pair specifically: A with T, and G with C. This complementary base pairing is crucial for DNA replication and the transfer of genetic information.

The sequence of bases along DNA encodes genetic information in units called genes. A gene typically contains instructions for making one or more proteins, which perform virtually all cellular functions. The human genome contains approximately 20,000-25,000 protein-coding genes, though this represents only about 1.5% of our total DNA. The remaining DNA was once called "junk DNA" but is now known to have regulatory and other functions.

The flow of genetic information follows the "central dogma" of molecular biology: DNA → RNA → Protein. During transcription, the DNA sequence of a gene is copied into messenger RNA (mRNA). This mRNA then travels to ribosomes, where translation occurs—the mRNA sequence is read in three-letter "words" called codons, each specifying a particular amino acid. The chain of amino acids folds into a functional protein.

Heredity follows patterns discovered by Gregor Mendel in the 1860s. Organisms inherit two copies of each gene (alleles), one from each parent. Dominant alleles mask the effects of recessive alleles. When both alleles are the same (homozygous), the trait is straightforward, but heterozygous individuals (with different alleles) may show intermediate traits or dominant phenotypes.

Mutations are changes in DNA sequence that can arise from replication errors, radiation, or chemical damage. While many mutations are neutral or harmful, some provide advantages that natural selection can act upon—this is the raw material of evolution. Modern genetic engineering harnesses our understanding of mutations and gene function to develop disease treatments, improve crops, and advance scientific research.`,
        keyFacts: [
          'DNA contains four bases: Adenine (A) pairs with Thymine (T), and Guanine (G) pairs with Cytosine (C).',
          'Humans share 99.9% of their DNA with each other and about 60% with bananas, 85% with mice, and 98% with chimpanzees.',
          'If uncoiled, the DNA in a single human cell would stretch about 6 feet (2 meters) long—yet it fits in a nucleus 6 micrometers wide.',
          'Genes are segments of DNA that code for specific proteins through the process of transcription and translation.',
          'Mutations are changes in DNA sequence that can be harmful, beneficial, or neutral—they provide the variation for natural selection.',
        ],
        experiment: 'Extract visible DNA from strawberries! Mash 2-3 strawberries in a zip-lock bag with 10ml of extraction solution (1 cup water + 1 tablespoon dish soap + 1 teaspoon salt). Strain through a coffee filter into a glass. Slowly add cold rubbing alcohol down the side of the glass to form a layer on top. At the boundary, you\'ll see white, stringy DNA precipitate! Strawberries work great because they\'re octoploid (8 copies of each chromosome), giving lots of DNA.',
        funFact: 'Your DNA could theoretically store all the data ever created by humanity—about 215 petabytes (215 million gigabytes)—in a space smaller than a sugar cube! Scientists have already demonstrated storing digital data in DNA and are working on making this practical for long-term data archiving. DNA is incredibly stable and can last thousands of years under the right conditions.',
        quiz: [
          {
            question: 'What base pairs with Adenine (A) in DNA?',
            options: [
              'Guanine (G)',
              'Cytosine (C)',
              'Thymine (T)',
              'Uracil (U)'
            ],
            correctAnswer: 2,
            explanation: 'In DNA, Adenine (A) always pairs with Thymine (T) through two hydrogen bonds. Guanine (G) pairs with Cytosine (C) through three hydrogen bonds. This complementary base pairing is fundamental to DNA structure and replication.'
          },
          {
            question: 'What is a gene?',
            options: [
              'A complete chromosome',
              'A segment of DNA that codes for a specific protein',
              'A type of RNA',
              'A cell organelle'
            ],
            correctAnswer: 1,
            explanation: 'A gene is a segment of DNA that contains the instructions for making one or more proteins (or functional RNA molecules). Genes are the basic units of heredity passed from parents to offspring.'
          },
          {
            question: 'What percentage of DNA do all humans share?',
            options: [
              'About 50%',
              'About 75%',
              'About 99.9%',
              '100%'
            ],
            correctAnswer: 2,
            explanation: 'All humans share approximately 99.9% of their DNA. The 0.1% variation accounts for all the differences between individuals, including physical traits, disease susceptibility, and other characteristics.'
          },
          {
            question: 'What is the "central dogma" of molecular biology?',
            options: [
              'Cells arise from pre-existing cells',
              'DNA → RNA → Protein',
              'Survival of the fittest',
              'All living things are made of cells'
            ],
            correctAnswer: 1,
            explanation: 'The central dogma describes the flow of genetic information: DNA is transcribed into RNA, which is then translated into protein. This process explains how genetic instructions are converted into functional molecules.'
          },
          {
            question: 'What are mutations?',
            options: [
              'Always harmful changes to DNA',
              'Changes in DNA sequence that can be harmful, beneficial, or neutral',
              'The copying of DNA',
              'The translation of RNA to protein'
            ],
            correctAnswer: 1,
            explanation: 'Mutations are changes in DNA sequence. They can be harmful (causing diseases), beneficial (providing advantages), or neutral (having no effect). Beneficial mutations are the raw material for evolution.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=8kK2zwjRV0M'
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
        overview: 'Forces and motion form the foundation of classical mechanics, explaining how and why objects move. From the orbit of planets to the swing of a pendulum, these principles govern all movement in our everyday world. Isaac Newton\'s three laws of motion, formulated in the 17th century, remain remarkably accurate for describing most phenomena we observe.',
        detailedContent: `Motion is described using several key quantities. Displacement is the change in position, including direction. Velocity is the rate of change of displacement—how fast something moves and in what direction. Acceleration is the rate of change of velocity—how quickly speed or direction changes. Understanding these quantities allows us to predict and analyze movement precisely.

Newton's First Law, often called the law of inertia, states that an object at rest tends to stay at rest, and an object in motion tends to stay in motion with the same speed and direction, unless acted upon by an unbalanced force. This explains why passengers lurch forward when a car stops suddenly—their bodies want to continue moving forward even as the car stops. Mass is a measure of inertia; more massive objects resist changes in motion more than less massive ones.

Newton's Second Law quantifies the relationship between force, mass, and acceleration: F = ma. This elegant equation tells us that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. Doubling the force doubles the acceleration, but doubling the mass halves it. This law allows engineers to calculate exactly how much force is needed to achieve desired motion.

Newton's Third Law states that for every action, there is an equal and opposite reaction. When you push against a wall, the wall pushes back on you with equal force. This principle explains how rockets work—the exhaust gases push against the rocket, and the rocket pushes against the gases, propelling it forward even in the vacuum of space where there's nothing to "push off" against.

Friction is a force that opposes motion between surfaces in contact. While often seen as undesirable, friction is essential for walking, driving, and writing. There are two types: static friction prevents stationary objects from starting to move, while kinetic friction opposes the motion of moving objects. The coefficient of friction depends on the materials involved—ice has low friction, while rubber on asphalt has high friction.`,
        keyFacts: [
          'Newton\'s 1st Law (Inertia): An object at rest stays at rest; an object in motion stays in motion unless acted upon by an unbalanced force.',
          'Newton\'s 2nd Law: Force equals mass times acceleration (F = ma)—the foundation for calculating motion.',
          'Newton\'s 3rd Law: For every action, there is an equal and opposite reaction—explaining rocket propulsion and walking.',
          'Friction is a force that opposes motion between surfaces; it can be static (preventing motion) or kinetic (opposing ongoing motion).',
          'Terminal velocity occurs when air resistance equals gravitational force, resulting in constant falling speed—about 120 mph for a human skydiver.',
        ],
        experiment: 'Demonstrate inertia with a coin drop trick! Place an index card on top of a glass, then put a coin on the card. Quickly flick the card horizontally out from under the coin. The coin will drop straight into the glass! This happens because the coin\'s inertia resists the horizontal motion—it wants to stay where it is. The card moves, but the coin doesn\'t move sideways, so gravity pulls it straight down.',
        funFact: 'In space, astronauts can "throw" extremely heavy objects with ease. A 200-pound satellite can be pushed with a single finger because there\'s no friction or gravity to resist the motion. Once pushed, it will continue moving forever at constant speed unless another force acts on it—a perfect demonstration of Newton\'s First Law!',
        quiz: [
          {
            question: 'What does Newton\'s First Law describe?',
            options: [
              'The relationship between force and acceleration',
              'Action and reaction forces',
              'The tendency of objects to resist changes in motion',
              'The force of gravity'
            ],
            correctAnswer: 2,
            explanation: 'Newton\'s First Law, the law of inertia, describes how objects resist changes in their motion. An object at rest tends to stay at rest, and an object in motion tends to stay in motion, unless acted upon by an external force.'
          },
          {
            question: 'According to F = ma, what happens if you double the force on an object?',
            options: [
              'The acceleration halves',
              'The acceleration doubles',
              'The mass doubles',
              'Nothing changes'
            ],
            correctAnswer: 1,
            explanation: 'According to Newton\'s Second Law (F = ma), acceleration is directly proportional to force. If you double the force while keeping mass constant, the acceleration also doubles.'
          },
          {
            question: 'Why can rockets work in the vacuum of space?',
            options: [
              'They push against air molecules',
              'They use Newton\'s Third Law—exhaust pushes against rocket',
              'They are pulled by gravity',
              'They use magnetic propulsion'
            ],
            correctAnswer: 1,
            explanation: 'Rockets work via Newton\'s Third Law. The rocket expels exhaust gases at high speed (action), and the gases push back on the rocket with equal force (reaction). No external medium is needed.'
          },
          {
            question: 'What is terminal velocity?',
            options: [
              'The maximum speed any object can reach',
              'The speed when air resistance equals gravitational force',
              'The velocity at which objects stop',
              'The speed of sound'
            ],
            correctAnswer: 1,
            explanation: 'Terminal velocity is reached when the force of air resistance equals the force of gravity. At this point, the net force is zero, so there\'s no acceleration, and the object falls at constant speed.'
          },
          {
            question: 'Which type of friction prevents a stationary object from starting to move?',
            options: [
              'Kinetic friction',
              'Rolling friction',
              'Static friction',
              'Fluid friction'
            ],
            correctAnswer: 2,
            explanation: 'Static friction acts on stationary objects and prevents them from starting to move. It must be overcome before an object can begin moving. Once moving, kinetic friction takes over.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=kKKM8Y-u7ds'
      },
      {
        id: 'electricity-magnetism',
        title: 'Electricity & Magnetism',
        description: 'Explore the invisible forces that power our world',
        icon: Magnet,
        color: '#ef4444',
        modelType: '3d-magnet',
        overview: 'Electricity and magnetism, seemingly different phenomena, are actually two aspects of the same fundamental force: electromagnetism. This unification, one of the greatest achievements in physics, explains everything from how motors work to why compasses point north. Electromagnetism powers our modern civilization and enables technologies from smartphones to MRI machines.',
        detailedContent: `Electric charge is a fundamental property of matter. Protons carry positive charge, electrons carry negative charge. Like charges repel each other while opposite charges attract—this is the basic principle underlying all electrical phenomena. Materials can be conductors (allowing charges to flow freely, like metals) or insulators (restricting charge flow, like rubber or glass).

Electric current is the flow of electric charge, typically electrons moving through a conductor. Current is measured in amperes (A). Voltage, or electric potential difference, is the "pressure" that pushes charges through a circuit, measured in volts (V). Resistance opposes current flow and is measured in ohms (Ω). These three quantities are related by Ohm's Law: V = IR.

Magnetism arises from moving electric charges. Every electron orbiting an atomic nucleus and every current flowing through a wire creates a magnetic field. Permanent magnets exist because of the aligned magnetic fields of countless electrons in their atoms. All magnets have two poles—north and south—that cannot be separated. Like poles repel; opposite poles attract.

The connection between electricity and magnetism was discovered in the 19th century. Hans Christian Ørsted found that electric current creates magnetic fields. Michael Faraday discovered electromagnetic induction—changing magnetic fields create electric current. This principle underlies electric generators, which convert mechanical energy into electrical energy, and transformers, which change voltage levels for efficient power transmission.

Electromagnets are created by passing electric current through a coiled wire, usually around an iron core. Unlike permanent magnets, electromagnets can be turned on and off and their strength can be controlled by adjusting the current. This makes them essential in motors, speakers, MRI machines, and countless other applications.`,
        keyFacts: [
          'Electric current is the flow of electrons through a conductor, measured in amperes (A).',
          'Voltage (potential difference) is the "pressure" pushing electrons through a circuit, measured in volts (V).',
          'Magnets always have north and south poles—opposite poles attract, like poles repel, and poles cannot be isolated.',
          'Electromagnets are created by running electric current through coiled wire; their strength depends on current and number of coils.',
          'Earth\'s magnetic field, generated by molten iron currents in the outer core, protects us from harmful solar radiation.',
        ],
        experiment: 'Build a simple electromagnet! Wrap about 50 turns of insulated copper wire around a large iron nail. Connect the ends of the wire to a D-cell battery. The nail becomes a magnet that can pick up paper clips! Try experimenting: more coils = stronger magnet; two batteries = even stronger. Remember to disconnect the battery when not in use, as the wire will get warm. This demonstrates how electric current creates magnetic fields.',
        funFact: 'A single bolt of lightning contains enough energy to toast 100,000 slices of bread—about 1 billion joules! However, the discharge happens so fast (about 0.0002 seconds) that capturing and storing this energy is impractical with current technology. The peak power of a lightning bolt can reach 1 trillion watts, but only for that fraction of a second.',
        quiz: [
          {
            question: 'What is electric current?',
            options: [
              'The pressure pushing electrons',
              'The flow of electric charges through a conductor',
              'The resistance to electron flow',
              'The magnetic field of electrons'
            ],
            correctAnswer: 1,
            explanation: 'Electric current is the flow of electric charges (usually electrons) through a conductor. It is measured in amperes (A), where 1 ampere = 1 coulomb of charge per second.'
          },
          {
            question: 'What does Ohm\'s Law state?',
            options: [
              'Power = Current × Voltage',
              'Voltage = Current × Resistance',
              'Force = Mass × Acceleration',
              'Energy = Mass × Speed of light squared'
            ],
            correctAnswer: 1,
            explanation: 'Ohm\'s Law states that V = IR, meaning voltage equals current multiplied by resistance. This fundamental relationship allows us to calculate any of these quantities when we know the other two.'
          },
          {
            question: 'What creates a magnetic field?',
            options: [
              'Static electric charges',
              'Moving electric charges',
              'Gravity',
              'Nuclear forces'
            ],
            correctAnswer: 1,
            explanation: 'Moving electric charges create magnetic fields. This includes electrons flowing as current in a wire and electrons orbiting in atoms. This connection between electricity and magnetism is fundamental to electromagnetism.'
          },
          {
            question: 'What is electromagnetic induction?',
            options: [
              'Static electricity buildup',
              'Changing magnetic fields creating electric current',
              'Electric current creating light',
              'Magnetism from permanent magnets'
            ],
            correctAnswer: 1,
            explanation: 'Electromagnetic induction is the process by which a changing magnetic field creates an electric current in a conductor. This principle is used in generators, transformers, and induction charging.'
          },
          {
            question: 'How can you make an electromagnet stronger?',
            options: [
              'Use less wire',
              'Increase the current or add more coils',
              'Use a wooden core',
              'Decrease the voltage'
            ],
            correctAnswer: 1,
            explanation: 'An electromagnet\'s strength can be increased by increasing the current flowing through it, adding more coils of wire, or using a better core material (like soft iron). More current and more coils = stronger magnetic field.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=TKF6nFzpHBU'
      },
      {
        id: 'waves-sound',
        title: 'Waves & Sound',
        description: 'Learn how energy travels through space and matter',
        icon: Waves,
        color: '#06b6d4',
        modelType: '3d-wave',
        overview: 'Waves are disturbances that transfer energy from one place to another without transferring matter. From the ripples on a pond to the light reaching us from distant stars, wave phenomena are everywhere. Sound waves, in particular, allow us to communicate, enjoy music, and perceive the world around us through hearing.',
        detailedContent: `Waves are characterized by several key properties. Wavelength is the distance between successive crests (or troughs). Frequency is the number of complete waves passing a point per second, measured in Hertz (Hz). Amplitude is the maximum displacement from the rest position, determining a wave's intensity or loudness for sound. Wave speed equals frequency times wavelength: v = fλ.

There are two main types of waves based on how they oscillate. Transverse waves oscillate perpendicular to their direction of travel—like waves on a rope or electromagnetic waves. Longitudinal waves oscillate parallel to their direction of travel—sound waves are the primary example, consisting of alternating compressions and rarefactions of the medium.

Sound waves are mechanical waves requiring a medium to travel through. They move fastest through solids (about 5,000 m/s in steel), slower through liquids (about 1,500 m/s in water), and slowest through gases (about 343 m/s in air at room temperature). Sound cannot travel through a vacuum because there are no particles to compress and expand.

The frequency of a sound wave determines its pitch—high frequency means high pitch, low frequency means low pitch. Humans typically hear frequencies from 20 Hz to 20,000 Hz. Sounds below 20 Hz (infrasound) are used by elephants for long-distance communication, while sounds above 20,000 Hz (ultrasound) are used by bats and dolphins for echolocation, and in medical imaging.

The Doppler effect explains why a siren sounds higher pitched as it approaches and lower as it moves away. As a sound source approaches, sound waves are compressed, increasing frequency and pitch. As it recedes, waves are stretched out, decreasing frequency. This effect also applies to light waves—astronomers use redshift (light from receding galaxies stretched to longer wavelengths) to measure the expansion of the universe.`,
        keyFacts: [
          'Sound travels at about 343 m/s in air, faster in liquids (~1,500 m/s), and fastest in solids (~5,000 m/s).',
          'Frequency determines pitch (high frequency = high pitch); amplitude determines loudness.',
          'Ultrasound (above 20,000 Hz) is used in medical imaging, cleaning, and by bats and dolphins for echolocation.',
          'The Doppler effect explains why sirens sound higher when approaching and lower when moving away.',
          'Sound cannot travel in space because there\'s no medium (air, water, or solid) to carry the vibrations.',
        ],
        experiment: 'Visualize sound waves with dancing salt! Stretch plastic wrap tightly over a bowl or the top of a speaker and secure it. Sprinkle salt evenly on the surface. Play loud music or make noise nearby and watch the salt dance and form patterns! Different frequencies create different patterns. This demonstrates how sound waves cause vibrations in the air that transfer to the plastic wrap.',
        funFact: 'The loudest natural sound ever recorded was the 1883 eruption of Krakatoa volcano. The explosion was heard clearly 3,000 miles (4,800 km) away in Australia and Rodrigues Island. The shockwave circled the Earth four times, and the sound reached an estimated 180 decibels at 100 miles—enough to rupture the eardrums of sailors 40 miles from the volcano.',
        quiz: [
          {
            question: 'What determines the pitch of a sound?',
            options: [
              'Amplitude',
              'Frequency',
              'Wavelength only',
              'Speed of the wave'
            ],
            correctAnswer: 1,
            explanation: 'The pitch of a sound is determined by its frequency. Higher frequency waves produce higher pitched sounds, while lower frequency waves produce lower pitched sounds. Amplitude determines loudness, not pitch.'
          },
          {
            question: 'Why can\'t sound travel through space?',
            options: [
              'Space is too cold',
              'There\'s no medium to carry the vibrations',
              'Sound only travels in one direction',
              'The distance is too great'
            ],
            correctAnswer: 1,
            explanation: 'Sound is a mechanical wave that requires a medium (matter) to travel through. Space is a vacuum with no matter, so there are no particles to compress and expand to carry the sound wave.'
          },
          {
            question: 'In which medium does sound travel fastest?',
            options: [
              'Air',
              'Water',
              'Steel (solid)',
              'Sound travels equally fast in all media'
            ],
            correctAnswer: 2,
            explanation: 'Sound travels fastest through solids like steel because the molecules are closer together and can transmit vibrations more efficiently. Sound is slower in liquids and slowest in gases.'
          },
          {
            question: 'What is the Doppler effect?',
            options: [
              'Sound getting louder over distance',
              'The change in frequency due to relative motion between source and observer',
              'Sound echoing off surfaces',
              'The absorption of sound by materials'
            ],
            correctAnswer: 1,
            explanation: 'The Doppler effect is the change in perceived frequency of a wave when the source and observer are moving relative to each other. An approaching source has higher frequency (higher pitch), a receding source has lower frequency.'
          },
          {
            question: 'What frequency range can humans typically hear?',
            options: [
              '1 Hz to 1,000 Hz',
              '20 Hz to 20,000 Hz',
              '100 Hz to 100,000 Hz',
              '50 Hz to 5,000 Hz'
            ],
            correctAnswer: 1,
            explanation: 'Humans typically hear frequencies from about 20 Hz to 20,000 Hz (20 kHz). This range decreases with age. Sounds below 20 Hz are infrasound; above 20,000 Hz are ultrasound.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=0MkKfAslOXE'
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
        overview: 'Atoms, once thought to be indivisible, are actually composed of even smaller subatomic particles. Understanding these particles—protons, neutrons, and electrons—reveals how atoms form, how elements differ from one another, and why matter behaves the way it does. This knowledge forms the foundation for all chemistry and much of physics.',
        detailedContent: `The journey to understand atomic structure began in the late 19th century. J.J. Thomson discovered the electron in 1897, proving atoms were not indivisible. Ernest Rutherford's famous gold foil experiment in 1911 revealed that atoms have a tiny, dense, positively charged nucleus with electrons orbiting around it—mostly empty space. James Chadwick discovered the neutron in 1932, completing our basic picture of atomic structure.

Protons carry a positive electric charge and reside in the nucleus. The number of protons defines the element—hydrogen has 1, carbon has 6, uranium has 92. This number is called the atomic number. Protons have a mass of approximately 1.67 × 10⁻²⁷ kg, about 1,836 times heavier than an electron.

Neutrons are electrically neutral particles also found in the nucleus. They contribute to the atom's mass but not its charge. Atoms of the same element can have different numbers of neutrons—these variants are called isotopes. For example, carbon-12 has 6 neutrons, while carbon-14 has 8. Some isotopes are radioactive and decay over time.

Electrons carry a negative charge equal in magnitude to the proton's positive charge. They exist in probability clouds called orbitals surrounding the nucleus. Despite their tiny mass (about 9.11 × 10⁻³¹ kg), electrons are responsible for chemical bonding and determine how atoms interact with each other and with light.

The strong nuclear force holds the nucleus together despite the electromagnetic repulsion between protons. This force is incredibly powerful but acts only over extremely short distances. When this force is overcome—through nuclear fission or fusion—enormous amounts of energy are released, as described by Einstein's E = mc².`,
        keyFacts: [
          'Protons have a positive charge (+1) and determine the atomic number, defining which element an atom is.',
          'Neutrons have no charge and contribute to atomic mass; varying neutrons create isotopes of the same element.',
          'Electrons have a negative charge (-1) and are about 1,836 times lighter than protons.',
          'The strong nuclear force holds the nucleus together, overcoming proton-proton repulsion.',
          'Quarks are even smaller particles that make up protons (2 up + 1 down) and neutrons (1 up + 2 down).',
        ],
        experiment: 'Create a 3D model of an atom! Use different colored balls or clay: large balls for protons (red) and neutrons (blue) clustered in the center as the nucleus, and small balls for electrons (yellow) on wire orbits around it. Start with hydrogen (1 proton, 1 electron), then try helium (2 protons, 2 neutrons, 2 electrons). Notice how the nucleus stays tiny while the electron "cloud" is much larger!',
        funFact: 'If an atom were the size of a football stadium, the nucleus would be a marble at the center field, and electrons would be like gnats flying around the upper seats. Atoms are 99.9999999999999% empty space! If you removed all the empty space from atoms in the human body, you could fit the entire human race in a volume the size of a sugar cube.',
        quiz: [
          {
            question: 'Which subatomic particle determines what element an atom is?',
            options: [
              'Electrons',
              'Neutrons',
              'Protons',
              'Quarks'
            ],
            correctAnswer: 2,
            explanation: 'The number of protons determines the element. This number is called the atomic number. For example, all atoms with 6 protons are carbon, regardless of how many neutrons or electrons they have.'
          },
          {
            question: 'What are isotopes?',
            options: [
              'Atoms with different numbers of protons',
              'Atoms with different numbers of neutrons',
              'Atoms with different numbers of electrons',
              'Completely different elements'
            ],
            correctAnswer: 1,
            explanation: 'Isotopes are atoms of the same element with different numbers of neutrons. They have identical chemical properties but different masses. For example, carbon-12 and carbon-14 are both carbon, but carbon-14 has 2 extra neutrons.'
          },
          {
            question: 'What force holds the atomic nucleus together?',
            options: [
              'Electromagnetic force',
              'Gravitational force',
              'Strong nuclear force',
              'Weak nuclear force'
            ],
            correctAnswer: 2,
            explanation: 'The strong nuclear force holds protons and neutrons together in the nucleus, overcoming the electromagnetic repulsion between positively charged protons. It\'s the strongest of the four fundamental forces but only acts over very short distances.'
          },
          {
            question: 'How much heavier is a proton compared to an electron?',
            options: [
              'About 10 times heavier',
              'About 100 times heavier',
              'About 1,836 times heavier',
              'They have equal mass'
            ],
            correctAnswer: 2,
            explanation: 'A proton is approximately 1,836 times heavier than an electron. This huge mass difference is why the nucleus, containing protons and neutrons, contains almost all of an atom\'s mass despite being tiny.'
          },
          {
            question: 'What particles make up protons and neutrons?',
            options: [
              'Electrons and photons',
              'Quarks',
              'Muons and taus',
              'Nothing—they are fundamental'
            ],
            correctAnswer: 1,
            explanation: 'Protons and neutrons are made of quarks. Protons contain 2 up quarks and 1 down quark. Neutrons contain 1 up quark and 2 down quarks. Quarks are held together by the strong force mediated by gluons.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=LhveTGblGHY'
      },
      {
        id: 'electron-orbitals',
        title: 'Electron Orbitals',
        description: 'Explore where electrons live around atoms',
        icon: Orbit,
        color: '#8b5cf6',
        modelType: '3d-atom',
        overview: 'Electrons don\'t orbit atoms in neat circles like planets around the sun. Instead, quantum mechanics reveals that electrons exist in three-dimensional probability clouds called orbitals—regions where electrons are most likely to be found. Understanding electron orbitals is key to explaining chemical bonding, molecular shapes, and the periodic table\'s organization.',
        detailedContent: `The quantum mechanical model of the atom replaced the earlier planetary model. While the planetary model (Bohr model) is useful for basic concepts, electrons actually behave as both particles and waves, and we can only describe their probable locations, not exact paths. This is captured by the Heisenberg uncertainty principle—we cannot simultaneously know both an electron's exact position and momentum.

Orbitals are described by quantum numbers. The principal quantum number (n = 1, 2, 3...) indicates energy level and size—higher n means higher energy and larger orbital. The angular momentum quantum number (l = 0 to n-1) determines orbital shape: l=0 gives spherical s orbitals, l=1 gives dumbbell-shaped p orbitals, l=2 gives cloverleaf d orbitals, and l=3 gives complex f orbitals.

Each energy level can hold a specific maximum number of electrons, calculated as 2n². The first level (n=1) holds 2 electrons in one s orbital. The second level (n=2) holds 8 electrons in one s and three p orbitals. The third level holds 18, the fourth holds 32, and so on.

Electrons fill orbitals according to three rules. The Aufbau principle states that electrons fill lower-energy orbitals before higher ones. Pauli's exclusion principle requires that each orbital hold at most 2 electrons with opposite spins. Hund's rule says electrons occupy orbitals of equal energy singly before pairing up.

Valence electrons—those in the outermost energy level—determine an atom's chemical behavior. Elements in the same column of the periodic table have similar valence configurations, explaining why they have similar chemical properties. The quest to achieve stable, full outer shells (like noble gases) drives chemical bonding.`,
        keyFacts: [
          'Electron shells are labeled 1, 2, 3, 4... or K, L, M, N... from the nucleus outward, with higher numbers meaning higher energy.',
          'Each shell can hold a maximum of 2n² electrons: first shell holds 2, second holds 8, third holds 18.',
          'Valence electrons in the outermost shell determine chemical bonding behavior and reactivity.',
          'The Pauli exclusion principle: no two electrons in an atom can have identical sets of quantum numbers.',
          'Electrons fill lower energy orbitals before higher ones (Aufbau principle) and spread out before pairing (Hund\'s rule).',
        ],
        experiment: 'Visualize orbital shapes with balloons! A single round balloon represents a spherical s orbital. Tie two long balloons together at their bases pointing in opposite directions to represent a p orbital\'s dumbbell shape. You can make three of these p orbital pairs pointing along x, y, and z axes. For d orbitals, try making four-lobed clover patterns with four balloons. This helps visualize the 3D nature of where electrons "live."',
        funFact: 'According to quantum mechanics, there\'s a tiny but non-zero probability that an electron from your body could spontaneously appear on the other side of the universe. This is because an electron\'s probability wave extends infinitely, though it becomes vanishingly small at great distances. The chances are so astronomically small that it would take longer than the age of the universe to happen, but technically it\'s not impossible!',
        quiz: [
          {
            question: 'What shape is an s orbital?',
            options: [
              'Dumbbell-shaped',
              'Spherical',
              'Clover-shaped',
              'Ring-shaped'
            ],
            correctAnswer: 1,
            explanation: 'S orbitals are spherical in shape. Each energy level has one s orbital. The size of the s orbital increases with higher energy levels (1s < 2s < 3s), but they all maintain their spherical shape.'
          },
          {
            question: 'How many electrons can the second energy level (n=2) hold?',
            options: [
              '2 electrons',
              '6 electrons',
              '8 electrons',
              '18 electrons'
            ],
            correctAnswer: 2,
            explanation: 'Using the formula 2n², the second energy level (n=2) can hold 2(2)² = 8 electrons. These fill one 2s orbital (2 electrons) and three 2p orbitals (6 electrons).'
          },
          {
            question: 'What does the Aufbau principle state?',
            options: [
              'Electrons repel each other',
              'Electrons fill lower energy orbitals before higher ones',
              'Each orbital can hold only 2 electrons',
              'Electrons spread out before pairing'
            ],
            correctAnswer: 1,
            explanation: 'The Aufbau principle states that electrons fill orbitals starting from the lowest energy level and moving to higher ones. "Aufbau" is German for "building up," describing how electron configurations are built.'
          },
          {
            question: 'What are valence electrons?',
            options: [
              'Electrons in the nucleus',
              'Electrons in the innermost shell',
              'Electrons in the outermost shell',
              'Paired electrons only'
            ],
            correctAnswer: 2,
            explanation: 'Valence electrons are the electrons in the outermost (highest energy) shell of an atom. They determine an element\'s chemical properties and how it bonds with other atoms.'
          },
          {
            question: 'According to Pauli\'s exclusion principle, how many electrons can one orbital hold?',
            options: [
              '1 electron',
              '2 electrons with opposite spins',
              '2 electrons with same spins',
              '8 electrons'
            ],
            correctAnswer: 1,
            explanation: 'Pauli\'s exclusion principle states that each orbital can hold a maximum of 2 electrons, and they must have opposite spins (one spin up, one spin down). No two electrons can have identical quantum numbers.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=K7xpLMQdpWE'
      },
      {
        id: 'radioactivity',
        title: 'Radioactivity',
        description: 'Learn about unstable atoms and nuclear decay',
        icon: Radiation,
        color: '#22c55e',
        modelType: '3d-atom',
        overview: 'Radioactivity is the spontaneous emission of radiation from unstable atomic nuclei as they transform into more stable configurations. This natural phenomenon, discovered by Henri Becquerel in 1896, has profound applications ranging from medical imaging and cancer treatment to carbon dating and nuclear power generation.',
        detailedContent: `Radioactive decay occurs because some nuclear configurations are unstable. The ratio of protons to neutrons determines nuclear stability—too many or too few neutrons relative to protons creates instability. The nucleus releases energy and particles to reach a more stable state. This process is random for individual atoms but statistically predictable for large numbers.

Three main types of radiation emerge from radioactive decay. Alpha particles (α) are helium nuclei (2 protons + 2 neutrons) ejected from heavy nuclei—they're relatively slow, can be stopped by paper, and cause high local damage if inhaled or ingested. Beta particles (β) are high-energy electrons (or positrons) emitted when a neutron converts to a proton—they penetrate further than alpha but are stopped by aluminum. Gamma rays (γ) are high-energy electromagnetic radiation released to shed excess energy—they require lead or concrete shielding.

Half-life is the time required for half of a radioactive sample to decay. Each isotope has a characteristic half-life: carbon-14's is about 5,730 years, making it perfect for dating organic materials up to about 50,000 years old. Uranium-238 has a half-life of 4.5 billion years, useful for dating rocks and the age of Earth. Some isotopes have half-lives of fractions of a second; others, billions of years.

Nuclear fission occurs when heavy nuclei split into lighter nuclei, releasing enormous energy. This process powers nuclear reactors and atomic bombs. Nuclear fusion, the opposite process, combines light nuclei into heavier ones—this powers the Sun and hydrogen bombs. Fusion releases even more energy than fission and produces less radioactive waste, but achieving controlled fusion on Earth remains one of science's great challenges.

Radioactivity has numerous applications. Medical imaging uses radioactive tracers to visualize organs and detect diseases. Radiation therapy destroys cancer cells. Smoke detectors contain americium-241. Nuclear power provides about 10% of the world's electricity. Radiocarbon dating has revolutionized archaeology and paleontology.`,
        keyFacts: [
          'Half-life is the time for half of a radioactive sample to decay—carbon-14\'s half-life is ~5,730 years, used for dating organic materials.',
          'Three types of radiation: alpha (helium nuclei, stopped by paper), beta (electrons, stopped by aluminum), gamma (electromagnetic, needs lead).',
          'Nuclear fission splits heavy atoms (powers reactors); fusion combines light atoms (powers the Sun).',
          'Marie Curie discovered polonium and radium, becoming the first woman to win a Nobel Prize and the only person to win in two different sciences.',
          'Radioactive decay follows exponential decay—predictable for large samples but random for individual atoms.',
        ],
        experiment: 'Simulate radioactive half-life with coins! Start with 100 coins representing radioactive atoms. Flip them all; remove the "heads" (they\'ve "decayed"). Count and record how many remain. Repeat the process, recording each count. Plot your data on a graph—you\'ll see the characteristic exponential decay curve! After each "half-life" (flip round), about half the coins should remain. This demonstrates why decay is random for individuals but predictable for large numbers.',
        funFact: 'Bananas are radioactive! They contain potassium-40, a naturally radioactive isotope. Scientists even use "banana equivalent dose" (BED) as an informal unit of radiation exposure. Eating one banana gives you about 0.1 microsieverts of radiation. Don\'t worry though—you\'d need to eat about 10 million bananas at once to receive a lethal radiation dose. Your body also regulates potassium levels, so eating more bananas doesn\'t actually increase your radiation exposure!',
        quiz: [
          {
            question: 'What is half-life?',
            options: [
              'The time for all atoms to decay',
              'The time for half of a radioactive sample to decay',
              'Half the energy released during decay',
              'The life span of a radioactive atom'
            ],
            correctAnswer: 1,
            explanation: 'Half-life is the time required for half of the atoms in a radioactive sample to undergo decay. After one half-life, 50% remains; after two half-lives, 25% remains; after three, 12.5%, and so on.'
          },
          {
            question: 'Which type of radiation can be stopped by a sheet of paper?',
            options: [
              'Alpha particles',
              'Beta particles',
              'Gamma rays',
              'X-rays'
            ],
            correctAnswer: 0,
            explanation: 'Alpha particles are relatively large and slow, and can be stopped by a sheet of paper or even human skin. However, they\'re very dangerous if radioactive material is inhaled or ingested because they cause intense local damage.'
          },
          {
            question: 'What process powers the Sun?',
            options: [
              'Nuclear fission',
              'Nuclear fusion',
              'Chemical burning',
              'Radioactive decay'
            ],
            correctAnswer: 1,
            explanation: 'The Sun is powered by nuclear fusion, specifically the fusion of hydrogen nuclei into helium. This process releases enormous amounts of energy and is what makes stars shine. Scientists are trying to harness fusion for clean energy on Earth.'
          },
          {
            question: 'What is carbon-14 dating used for?',
            options: [
              'Dating very old rocks',
              'Dating organic materials up to ~50,000 years old',
              'Measuring radiation levels',
              'Nuclear medicine'
            ],
            correctAnswer: 1,
            explanation: 'Carbon-14 dating is used to determine the age of organic materials (once-living things) up to about 50,000 years old. Living organisms maintain constant carbon-14 levels; after death, the carbon-14 decays with a half-life of 5,730 years.'
          },
          {
            question: 'What causes radioactive decay?',
            options: [
              'Exposure to light',
              'High temperatures',
              'Unstable nuclear configurations seeking stability',
              'Chemical reactions'
            ],
            correctAnswer: 2,
            explanation: 'Radioactive decay occurs because some nuclei have unstable configurations of protons and neutrons. These nuclei spontaneously emit radiation to achieve a more stable arrangement. The process is random and unaffected by external conditions like temperature or pressure.'
          }
        ],
        videoUrl: 'https://www.youtube.com/watch?v=oFNdQYMJgT0'
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
