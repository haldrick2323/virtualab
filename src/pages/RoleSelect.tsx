import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, LogOut } from 'lucide-react';
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
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Who are you?
          </h1>
          <p className="text-muted-foreground">Select your role to get started</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => handleSelect('student')}
            className="glass-card p-8 text-center cursor-pointer hover:scale-[1.03] transition-transform group"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Student</h2>
            <p className="text-muted-foreground text-sm">
              Explore topics, watch videos, take quizzes, and interact with 3D models
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => handleSelect('teacher')}
            className="glass-card p-8 text-center cursor-pointer hover:scale-[1.03] transition-transform group"
          >
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
              <BookOpen className="w-10 h-10 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">Teacher</h2>
            <p className="text-muted-foreground text-sm">
              Create and manage subjects, add topics with educational content for students
            </p>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Button variant="ghost" onClick={signOut} className="text-muted-foreground gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
