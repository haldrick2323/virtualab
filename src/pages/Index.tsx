import { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope } from 'lucide-react';
import LabScene from '@/components/3d/LabScene';
import TopicCard from '@/components/TopicCard';
import SubtopicList from '@/components/SubtopicList';
import { topics, Topic } from '@/data/topics';

export default function Index() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* 3D Scene Section */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative">
          <LabScene />
          
          {/* Overlay title on 3D scene */}
          <div className="absolute top-8 left-8 right-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Microscope className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-widest">
                  Interactive Learning
                </span>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
                Science <span className="text-gradient">Laboratory</span>
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto lg:mx-0"
          >
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Welcome to your interactive science laboratory! Explore the wonders of 
              chemistry, biology, physics, and atomic structure through immersive 3D 
              visualizations and engaging educational content.
            </p>

            <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              Explore Topics
            </h2>

            <div className="grid gap-4">
              {topics.map((topic, index) => (
                <TopicCard
                  key={topic.id}
                  title={topic.title}
                  description={topic.description}
                  icon={topic.icon}
                  color={topic.color}
                  delay={0.4 + index * 0.1}
                  onClick={() => setSelectedTopic(topic)}
                />
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-sm text-muted-foreground text-center lg:text-left"
            >
              💡 Click on any topic to explore subtopics and dive deeper into the science!
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Subtopic Selection Modal */}
      <SubtopicList topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
    </div>
  );
}
