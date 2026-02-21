import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function JoinGame() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!code.trim()) return;
    if (!user) {
      toast.error('Please sign in first');
      navigate('/auth');
      return;
    }

    setLoading(true);
    const upperCode = code.trim().toUpperCase();

    // Check live game sessions first
    const { data: session } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('game_code', upperCode)
      .in('status', ['waiting', 'active'])
      .maybeSingle();

    if (session) {
      navigate(`/play/${session.id}`);
      setLoading(false);
      return;
    }

    // Check assignments
    const { data: assignment } = await supabase
      .from('assignments')
      .select('*')
      .eq('game_code', upperCode)
      .eq('is_active', true)
      .maybeSingle();

    if (assignment) {
      navigate(`/assignment/${assignment.id}`);
      setLoading(false);
      return;
    }

    toast.error('Invalid game code. Please check and try again.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      
      <div className="absolute top-4 left-4 z-20">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <Gamepad2 className="w-10 h-10 text-primary" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Join Game</h1>
          <p className="text-muted-foreground mb-8">Enter the code from your teacher</p>

          <div className="space-y-4">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="GAME CODE"
              className="text-center text-2xl tracking-[0.3em] font-mono h-14 uppercase"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            <Button
              onClick={handleJoin}
              disabled={loading || code.length < 4}
              className="w-full h-12 text-lg gap-2"
            >
              <Zap className="w-5 h-5" />
              {loading ? 'Joining...' : 'Join'}
            </Button>
          </div>

          {!user && (
            <p className="text-sm text-muted-foreground mt-4">
              You need to <button onClick={() => navigate('/auth')} className="text-primary underline">sign in</button> first
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
