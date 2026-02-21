import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Send, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateGameCode } from '@/lib/gameCode';

interface QuestionDraft {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function CreateAssignment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]);
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
    if (questions.some(q => !q.question.trim() || q.options.some(o => !o.trim()))) {
      toast.error('Fill in all questions and options');
      return;
    }

    setLoading(true);
    const gameCode = generateGameCode();

    const { error } = await supabase.from('assignments').insert({
      title,
      description: description || null,
      game_code: gameCode,
      questions: JSON.stringify(questions),
      created_by: user!.id,
    });

    if (error) {
      toast.error('Failed to create assignment');
      setLoading(false);
      return;
    }

    setCreatedCode(gameCode);
    toast.success('Assignment created!');
    setLoading(false);
  };

  if (createdCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 glass-card p-8 text-center max-w-md mx-4">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Assignment Created!</h2>
          <p className="text-muted-foreground mb-6">Share this code with your students</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="font-mono text-4xl font-bold tracking-[0.3em] text-primary">{createdCode}</span>
            <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(createdCode); toast.success('Copied!'); }}>
              <Copy className="w-5 h-5" />
            </Button>
          </div>
          <Button onClick={() => navigate('/teacher')}>Back to Dashboard</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      <header className="relative z-20 p-6 flex items-center gap-3 border-b border-border">
        <Button variant="ghost" onClick={() => navigate('/teacher')} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground">Create Assignment</h1>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto p-6 space-y-6">
        <div className="glass-card p-6 space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chapter 5 Practice" />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Instructions for students..." rows={3} />
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
            <Input value={q.question} onChange={(e) => updateQuestion(qi, 'question', e.target.value)} placeholder="Enter your question..." />
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi} onChange={() => updateQuestion(qi, 'correctAnswer', oi)} className="accent-primary" />
                  <Input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oi)}`} className="flex-1" />
                </div>
              ))}
            </div>
            <div>
              <Label>Explanation (shown after answering)</Label>
              <Input value={q.explanation} onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)} placeholder="Why this is the correct answer..." />
            </div>
          </motion.div>
        ))}

        <div className="flex gap-3">
          <Button variant="outline" onClick={addQuestion} className="gap-2 flex-1">
            <Plus className="w-4 h-4" /> Add Question
          </Button>
          <Button onClick={handleCreate} disabled={loading} className="gap-2 flex-1">
            <Send className="w-4 h-4" /> {loading ? 'Creating...' : 'Create Assignment'}
          </Button>
        </div>
      </div>
    </div>
  );
}
