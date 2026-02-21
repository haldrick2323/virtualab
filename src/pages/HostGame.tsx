import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Play, SkipForward, Trophy, Users, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GameSession {
  id: string;
  title: string;
  game_code: string;
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

export default function HostGame() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<GameSession | null>(null);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    fetchSession();
    fetchQuestions();
    fetchParticipants();

    // Realtime subscriptions
    const channel = supabase
      .channel(`host-${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_participants', filter: `session_id=eq.${sessionId}` }, () => fetchParticipants())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'game_answers', filter: `session_id=eq.${sessionId}` }, () => {
        setAnswerCount(c => c + 1);
        fetchParticipants();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  // Timer
  useEffect(() => {
    if (session?.status !== 'active' || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, session?.status]);

  const fetchSession = async () => {
    const { data } = await supabase.from('game_sessions').select('*').eq('id', sessionId!).single();
    if (data) setSession(data as GameSession);
  };

  const fetchQuestions = async () => {
    const { data } = await supabase.from('game_questions').select('*').eq('session_id', sessionId!).order('order_index');
    if (data) setQuestions(data.map(q => ({ ...q, options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options })) as GameQuestion[]);
  };

  const fetchParticipants = async () => {
    const { data } = await supabase.from('game_participants').select('*').eq('session_id', sessionId!).order('score', { ascending: false });
    if (data) setParticipants(data as Participant[]);
  };

  const startGame = async () => {
    await supabase.from('game_sessions').update({ status: 'active', started_at: new Date().toISOString(), current_question_index: 0 }).eq('id', sessionId!);
    setSession(s => s ? { ...s, status: 'active', current_question_index: 0 } : s);
    setTimeLeft(session?.question_duration_seconds ?? 20);
    setAnswerCount(0);
  };

  const nextQuestion = async () => {
    if (!session) return;
    const next = session.current_question_index + 1;
    if (next >= questions.length) {
      await supabase.from('game_sessions').update({ status: 'finished', finished_at: new Date().toISOString() }).eq('id', sessionId!);
      setSession(s => s ? { ...s, status: 'finished' } : s);
      return;
    }
    await supabase.from('game_sessions').update({ current_question_index: next }).eq('id', sessionId!);
    setSession(s => s ? { ...s, current_question_index: next } : s);
    setTimeLeft(session.question_duration_seconds);
    setAnswerCount(0);
  };

  const copyCode = () => {
    if (session) {
      navigator.clipboard.writeText(session.game_code);
      toast.success('Code copied!');
    }
  };

  if (!session) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;

  const currentQ = questions[session.current_question_index];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header with game code */}
        <div className="glass-card p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{session.title}</h1>
            <p className="text-muted-foreground text-sm">
              {session.status === 'waiting' ? 'Waiting for players...' : session.status === 'active' ? `Question ${session.current_question_index + 1} of ${questions.length}` : 'Game Over'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" />
              <span className="font-semibold">{participants.length}</span>
            </div>
            <Button variant="outline" onClick={copyCode} className="gap-2 font-mono text-lg tracking-widest">
              {session.game_code}
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Waiting state */}
        {session.status === 'waiting' && (
          <div className="text-center space-y-6">
            <div className="glass-card p-12">
              <p className="font-display text-6xl font-bold tracking-[0.3em] text-primary mb-4">{session.game_code}</p>
              <p className="text-muted-foreground text-lg mb-2">Share this code with your students</p>
              <p className="text-muted-foreground">They can join at the "Join Game" page</p>
            </div>

            {participants.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-foreground mb-3">Players ({participants.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {participants.map(p => (
                    <span key={p.id} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {p.display_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={startGame} disabled={participants.length === 0} size="lg" className="gap-2 text-lg px-8">
              <Play className="w-5 h-5" /> Start Game
            </Button>
          </div>
        )}

        {/* Active question */}
        {session.status === 'active' && currentQ && (
          <div className="space-y-6">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Timer className="w-5 h-5" />
                  <span className="font-mono text-2xl font-bold" style={{ color: timeLeft <= 5 ? 'hsl(var(--destructive))' : undefined }}>
                    {timeLeft}s
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{answerCount} / {participants.length} answered</span>
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground mb-6">{currentQ.question_text}</h2>

              <div className="grid grid-cols-2 gap-4">
                {currentQ.options.map((opt: string, i: number) => {
                  const colors = ['bg-red-500/10 border-red-500/30', 'bg-blue-500/10 border-blue-500/30', 'bg-yellow-500/10 border-yellow-500/30', 'bg-green-500/10 border-green-500/30'];
                  return (
                    <div key={i} className={`p-4 rounded-xl border-2 ${colors[i]} flex items-center gap-3`}>
                      <span className="w-8 h-8 rounded-full bg-card flex items-center justify-center font-bold text-sm">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-foreground font-medium">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={nextQuestion} className="gap-2">
                <SkipForward className="w-4 h-4" />
                {session.current_question_index < questions.length - 1 ? 'Next Question' : 'End Game'}
              </Button>
            </div>
          </div>
        )}

        {/* Finished - Leaderboard */}
        {session.status === 'finished' && (
          <div className="glass-card p-8 text-center">
            <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">Final Leaderboard</h2>
            <div className="max-w-md mx-auto space-y-3">
              {participants.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="font-medium text-foreground">{p.display_name}</span>
                  </div>
                  <span className="font-mono font-bold text-primary">{p.score} pts</span>
                </motion.div>
              ))}
            </div>
            <Button onClick={() => navigate('/teacher')} className="mt-8">Back to Dashboard</Button>
          </div>
        )}
      </div>
    </div>
  );
}
