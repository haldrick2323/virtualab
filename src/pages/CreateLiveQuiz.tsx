import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateGameCode } from '@/lib/gameCode';

interface QuestionDraft {
  question_text: string;
  options: string[];
  correct_answer: number;
}

export default function CreateLiveQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(20);
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    { question_text: '', options: ['', '', '', ''], correct_answer: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_answer: 0 }]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[idx] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleCreate = async () => {
    if (!title.trim()) { toast.error('Enter a title'); return; }
    if (questions.some(q => !q.question_text.trim() || q.options.some(o => !o.trim()))) {
      toast.error('Fill in all questions and options');
      return;
    }

    setLoading(true);
    const gameCode = generateGameCode();

    const { data: session, error } = await supabase
      .from('game_sessions')
      .insert({
        title,
        game_code: gameCode,
        question_duration_seconds: duration,
        created_by: user!.id,
      })
      .select()
      .single();

    if (error || !session) {
      toast.error('Failed to create quiz');
      setLoading(false);
      return;
    }

    const questionsToInsert = questions.map((q, i) => ({
      session_id: session.id,
      question_text: q.question_text,
      options: JSON.stringify(q.options),
      correct_answer: q.correct_answer,
      order_index: i,
    }));

    const { error: qError } = await supabase.from('game_questions').insert(questionsToInsert);
    if (qError) {
      toast.error('Failed to add questions');
      setLoading(false);
      return;
    }

    toast.success('Quiz created!');
    navigate(`/host/${session.id}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      <header className="relative z-20 p-6 flex items-center gap-3 border-b border-border">
        <Button variant="ghost" onClick={() => navigate('/teacher')} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground">Create Live Quiz</h1>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto p-6 space-y-6">
        <div className="glass-card p-6 space-y-4">
          <div>
            <Label>Quiz Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chapter 5 Review" />
          </div>
          <div>
            <Label>Seconds per question</Label>
            <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={5} max={120} />
          </div>
        </div>

        {questions.map((q, qi) => (
          <motion.div key={qi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">Question {qi + 1}</h3>
              {questions.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeQuestion(qi)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
            <Input
              value={q.question_text}
              onChange={(e) => updateQuestion(qi, 'question_text', e.target.value)}
              placeholder="Enter your question..."
            />
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correct_answer === oi}
                    onChange={() => updateQuestion(qi, 'correct_answer', oi)}
                    className="accent-primary"
                  />
                  <Input
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="flex gap-3">
          <Button variant="outline" onClick={addQuestion} className="gap-2 flex-1">
            <Plus className="w-4 h-4" /> Add Question
          </Button>
          <Button onClick={handleCreate} disabled={loading} className="gap-2 flex-1">
            <Play className="w-4 h-4" /> {loading ? 'Creating...' : 'Create & Host'}
          </Button>
        </div>
      </div>
    </div>
  );
}
