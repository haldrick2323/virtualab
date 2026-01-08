import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Lightbulb, FlaskConical, Sparkles } from 'lucide-react';
import { getTopic, getSubtopic } from '@/data/topics';
import TopicScene from '@/components/3d/TopicScene';
import { Button } from '@/components/ui/button';

export default function TopicDetail() {
  const { topicId, subtopicId } = useParams<{ topicId: string; subtopicId: string }>();
  const navigate = useNavigate();

  const topic = topicId ? getTopic(topicId) : undefined;
  const subtopic = topicId && subtopicId ? getSubtopic(topicId, subtopicId) : undefined;

  if (!topic || !subtopic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Topic not found</h1>
          <Button onClick={() => navigate('/')}>Go back home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: subtopic.color }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: topic.color }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 p-6">
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Topics
        </Button>
      </header>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* 3D Scene Section */}
        <div className="w-full lg:w-1/2 h-[40vh] lg:h-auto relative">
          <TopicScene modelType={subtopic.modelType} color={subtopic.color} />
          
          {/* Title overlay */}
          <div className="absolute top-8 left-8 right-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <topic.icon className="w-5 h-5" style={{ color: topic.color }} />
                <span className="text-sm font-medium uppercase tracking-widest" style={{ color: topic.color }}>
                  {topic.title}
                </span>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <subtopic.icon className="w-8 h-8" style={{ color: subtopic.color }} />
                {subtopic.title}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 overflow-y-auto scrollbar-hide">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto lg:mx-0 space-y-8"
          >
            {/* Overview */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">Overview</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {subtopic.overview}
              </p>
            </div>

            {/* Key Facts */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h2 className="font-display text-xl font-semibold text-foreground">Key Facts</h2>
              </div>
              <ul className="space-y-3">
                {subtopic.keyFacts.map((fact, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: subtopic.color }}
                    />
                    <span className="text-sm leading-relaxed">{fact}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Experiment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6 border-l-4"
              style={{ borderLeftColor: subtopic.color }}
            >
              <div className="flex items-center gap-3 mb-4">
                <FlaskConical className="w-5 h-5" style={{ color: subtopic.color }} />
                <h2 className="font-display text-xl font-semibold text-foreground">Try This Experiment</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {subtopic.experiment}
              </p>
            </motion.div>

            {/* Fun Fact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="p-6 rounded-xl border"
              style={{ 
                background: `linear-gradient(135deg, ${subtopic.color}10, ${topic.color}10)`,
                borderColor: `${subtopic.color}30`
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5" style={{ color: subtopic.color }} />
                <h2 className="font-display text-lg font-semibold" style={{ color: subtopic.color }}>
                  Fun Fact
                </h2>
              </div>
              <p className="text-foreground leading-relaxed">
                {subtopic.funFact}
              </p>
            </motion.div>

            {/* Navigation hint */}
            <p className="text-center text-sm text-muted-foreground pt-4">
              🔬 Interact with the 3D model by dragging to rotate and scrolling to zoom!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
