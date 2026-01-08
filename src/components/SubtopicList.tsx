import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Topic } from '@/data/topics';
import { Button } from '@/components/ui/button';

interface SubtopicListProps {
  topic: Topic | null;
  onClose: () => void;
}

export default function SubtopicList({ topic, onClose }: SubtopicListProps) {
  const navigate = useNavigate();

  const handleSubtopicClick = (subtopicId: string) => {
    if (topic) {
      navigate(`/topic/${topic.id}/${subtopicId}`);
    }
  };

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
            className="relative w-full max-w-2xl glass-card p-8"
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

            <div className="flex items-center gap-4 mb-6">
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${topic.color}20` }}
              >
                <topic.icon className="w-8 h-8" style={{ color: topic.color }} />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {topic.title}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Select a topic to explore
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {topic.subtopics.map((subtopic, index) => (
                <motion.button
                  key={subtopic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  onClick={() => handleSubtopicClick(subtopic.id)}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-primary/30 transition-all duration-300 text-left"
                >
                  <div 
                    className="p-2.5 rounded-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${subtopic.color}20` }}
                  >
                    <subtopic.icon className="w-5 h-5" style={{ color: subtopic.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {subtopic.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {subtopic.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
