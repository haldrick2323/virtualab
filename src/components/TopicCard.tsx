import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface TopicCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  delay?: number;
  onClick?: () => void;
}

export default function TopicCard({ title, description, icon: Icon, color, delay = 0, onClick }: TopicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="topic-card glow-border cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
