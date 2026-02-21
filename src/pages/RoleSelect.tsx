import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function RoleSelect() {
  const { setUserRole, role, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'student') navigate('/');
    if (role === 'teacher') navigate('/teacher');
  }, [role, navigate]);

  const handleSelect = async (selectedRole: 'student' | 'teacher') => {
    const { error } = await setUserRole(selectedRole);
    if (error) {
      toast.error('Failed to set role');
      return;
    }
    if (selectedRole === 'student') {
      navigate('/');
    } else {
      navigate('/teacher');
    }
  };

  if (role) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Welcome to Science Laboratory
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            Choose your role
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Select how you'd like to use the platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Student Card */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onClick={() => handleSelect('student')}
            className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 text-left cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Student</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Explore topics, watch videos, take quizzes, and interact with 3D models
              </p>
              <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Get started <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>

          {/* Teacher Card */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            onClick={() => handleSelect('teacher')}
            className="group relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 text-left cursor-pointer transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/15 group-hover:scale-110 transition-all duration-300">
                <BookOpen className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Teacher</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Create and manage subjects, add topics with educational content for students
              </p>
              <div className="flex items-center gap-2 text-accent-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Get started <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <Button variant="ghost" onClick={signOut} className="text-muted-foreground gap-2 hover:text-foreground">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
