import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Video, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  color: string;
}

export default function VideoPlayer({ videoUrl, title, color }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const videoId = videoUrl ? getYouTubeId(videoUrl) : null;

  if (!videoUrl || !videoId) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Video className="w-5 h-5" style={{ color }} />
          <h2 className="font-display text-xl font-semibold text-foreground">Educational Video</h2>
        </div>
        <div 
          className="aspect-video rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}10`, border: `1px dashed ${color}40` }}
        >
          <div className="text-center">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color }} />
            <p className="text-muted-foreground text-sm">Video coming soon for this topic</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Video className="w-5 h-5" style={{ color }} />
          <h2 className="font-display text-xl font-semibold text-foreground">Watch & Learn</h2>
        </div>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Open in YouTube
        </a>
      </div>
      
      <div className="aspect-video rounded-lg overflow-hidden relative bg-black/20">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center group cursor-pointer"
            style={{ backgroundColor: `${color}15` }}
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={`${title} video thumbnail`}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                // Fallback to hqdefault if maxresdefault doesn't exist
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div 
              className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            >
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-3 text-center">
        🎬 Watch this video while exploring the interactive 3D model above!
      </p>
    </motion.div>
  );
}
