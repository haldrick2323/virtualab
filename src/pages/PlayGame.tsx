import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Trophy, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface GameSession {
  id: string;
  title: string;
  status: string;
  current_question_index: number;
  question_duration_seconds: number;
}

interface GameQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  order_index: number;
}

interface Participant {
  id: string;
  user_id: string;
  display_name: string;
  score: number;
}

export default function PlayGame() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState<GameSession | null>(null);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [joined, setJoined] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [lastResult, setLastResult] = useState<{ correct: boolean; points: number } | null>(null);

  useEffect(() => {
    if (!sessionId || !user) return;
    fetchSession();
    fetchQuestions();

    const channel = supabase
      .channel(`play-${sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` }, (payload) => {
        const updated = payload.new as any;
        setSession(prev => {
          if (prev && updated.current_question_index !== prev.current_question_index) {
            setSelectedAnswer(null);
            setAnswered(false);
            setLastResult(null);
            setTimeLeft(updated.question_duration_seconds);
            setQuestionStartTime(Date.now());
          }
          return updated as GameSession;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_participants', filter: `session_id=eq.${sessionId}` }, () => fetchParticipants())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId, user]);

  useEffect(() => {
    if (session?.status !== 'active' || timeLeft <= 0 || answered) return;
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, session?.status, answered]);

  const fetchSession = async () => {
    const { data } = await supabase.from('game_sessions').select('*').eq('id', sessionId!).single();
    if (data) {
      setSession(data as GameSession);
      if (data.status === 'active') {
        setTimeLeft(data.question_duration_seconds);
        setQuestionStartTime(Date.now());
      }
    }
  };

  const fetchQuestions = async () => {
    const { data } = await supabase.from('game_questions').select('*').eq('session_id', sessionId!).order('order_index');
    if (data) setQuestions(data.map(q => ({ ...q, options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options })) as GameQuestion[]);
  };

  const fetchParticipants = async () => {
    const { data } = await supabase.from('game_participants').select('*').eq('session_id', sessionId!).order('score', { ascending: false });
    if (data) setParticipants(data as Participant[]);
  };

  const joinGame = async () => {
    if (!user || !sessionId) return;
    const { data: profile } = await supabase.from('profiles').select('display_name').eq('user_id', user.id).single();
    const displayName = profile?.display_name || user.email?.split('@')[0] || 'Player';

    const { error } = await supabase.from('game_participants').upsert({
      session_id: sessionId,
      user_id: user.id,
      display_name: displayName,
    }, { onConflict: 'session_id,user_id' });

    if (error) { toast.error('Failed to join'); return; }
    setJoined(true);
    fetchParticipants();
  };

  const submitAnswer = async (answerIndex: number) => {
    if (answered || !session || !user) return;
    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const currentQ = questions[session.current_question_index];
    const isCorrect = answerIndex === currentQ.correct_answer;
    const timeTaken = Date.now() - questionStartTime;
    const maxPoints = 1000;
    const points = isCorrect ? Math.max(100, Math.round(maxPoints * (1 - timeTaken / (session.question_duration_seconds * 1000)))) : 0;

    setLastResult({ correct: isCorrect, points });

    await supabase.from('game_answers').insert({
      session_id: session.id,
      question_id: currentQ.id,
      user_id: user.id,
      selected_answer: answerIndex,
      is_correct: isCorrect,
      time_taken_ms: timeTaken,
      points_earned: points,
    });

    if (points > 0) {
      const { data: participant } = await supabase
        .from('game_participants')
        .select('score')
        .eq('session_id', session.id)
        .eq('user_id', user.id)
        .single();

      if (participant) {
        await supabase
          .from('game_participants')
          .update({ score: participant.score + points })
          .eq('session_id', session.id)
          .eq('user_id', user.id);
      }
    }
  };

  if (!session) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const currentQ = questions[session.current_question_index];
  const optionColors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      <div className="relative z-10 w-full max-w-2xl mx-4">
        {/* Not joined yet */}
        {!joined && session.status !== 'finished' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">{session.title}</h1>
            <p className="text-muted-foreground mb-6">Ready to play?</p>
            <Button onClick={joinGame} size="lg" className="text-lg px-8">Join Game</Button>
          </motion.div>
        )}

        {/* Joined, waiting */}
        {joined && session.status === 'waiting' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">You're in!</h2>
            <p className="text-muted-foreground">Waiting for the teacher to start the game...</p>
            <p className="text-sm text-muted-foreground mt-4">{participants.length} player{participants.length !== 1 ? 's' : ''} joined</p>
          </motion.div>
        )}

        {/* Active question */}
        {joined && session.status === 'active' && currentQ && (
          <div className="space-y-6">
            {/* Timer & Question */}
            <div className="glass-card p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-muted-foreground" />
                <span className="font-mono text-3xl font-bold" style={{ color: timeLeft <= 5 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }}>
                  {timeLeft}
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">{currentQ.question_text}</h2>
            </div>

            {/* Answer feedback */}
            <AnimatePresence>
              {lastResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-xl text-center ${lastResult.correct ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
                >
                  {lastResult.correct ? <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" /> : <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />}
                  <p className="font-display text-xl font-bold text-foreground">
                    {lastResult.correct ? `Correct! +${lastResult.points} pts` : 'Wrong!'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Options */}
            {!answered && (
              <div className="grid grid-cols-2 gap-4">
                {currentQ.options.map((opt: string, i: number) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => submitAnswer(i)}
                    className={`p-6 rounded-xl text-white font-bold text-lg ${optionColors[i]} hover:opacity-90 transition-opacity`}
                  >
                    <span className="block text-sm opacity-80 mb-1">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Finished */}
        {session.status === 'finished' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
            <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">Game Over!</h2>
            <div className="max-w-sm mx-auto space-y-3 mb-6">
              {participants.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">{i + 1}</span>
                    <span className="font-medium text-foreground">{p.display_name}</span>
                    {p.user_id === user?.id && <span className="text-xs text-primary">(You)</span>}
                  </div>
                  <span className="font-mono font-bold text-primary">{p.score}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate('/')}>Back Home</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
