import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, ChevronRight, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AssignmentQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function TakeAssignment() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<any>(null);
  const [questions, setQuestions] = useState<AssignmentQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (!assignmentId || !user) return;
    fetchAssignment();
    checkExisting();
  }, [assignmentId, user]);

  const fetchAssignment = async () => {
    const { data } = await supabase.from('assignments').select('*').eq('id', assignmentId!).single();
    if (data) {
      setAssignment(data);
      const parsed = typeof data.questions === 'string' ? JSON.parse(data.questions) : data.questions;
      setQuestions(parsed);
    }
  };

  const checkExisting = async () => {
    const { data } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('assignment_id', assignmentId!)
      .eq('user_id', user!.id)
      .maybeSingle();
    if (data) setAlreadySubmitted(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      const finalScore = score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0);
      // Only count score once (already incremented in handleAnswer)
      // Submit
      await supabase.from('assignment_submissions').insert({
        assignment_id: assignmentId!,
        user_id: user!.id,
        answers: JSON.stringify([]),
        score: finalScore,
        total: questions.length,
      });
    }
  };

  if (!assignment) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className="relative z-10 glass-card p-8 text-center max-w-md mx-4">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Already Completed</h2>
          <p className="text-muted-foreground mb-6">You've already submitted this assignment.</p>
          <Button onClick={() => navigate('/')}>Back Home</Button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 glass-card p-8 text-center max-w-md mx-4">
          <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Assignment Complete!</h2>
          <p className="text-muted-foreground mb-4">You scored {score} out of {questions.length}</p>
          <div className="w-full bg-muted rounded-full h-4 mb-6 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-primary" />
          </div>
          <p className="text-lg font-medium text-primary mb-6">
            {percentage >= 80 ? "🎉 Excellent!" : percentage >= 60 ? "👍 Good job!" : percentage >= 40 ? "📚 Keep studying!" : "💪 You'll improve!"}
          </p>
          <Button onClick={() => navigate('/')}>Back Home</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      <div className="relative z-10 w-full max-w-xl mx-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">{assignment.title}</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-lg font-medium text-foreground mb-6">{question.question}</p>

              <div className="space-y-3 mb-6">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                      className={cn(
                        "w-full p-4 rounded-xl text-left transition-all border-2 flex items-center gap-3",
                        selectedAnswer === null && "hover:border-primary/50 cursor-pointer bg-card/50 border-border",
                        selectedAnswer !== null && "cursor-default",
                        showResult && isCorrect && "bg-green-500/10 border-green-500",
                        showResult && isSelected && !isCorrect && "bg-red-500/10 border-red-500",
                        showResult && !isSelected && !isCorrect && "bg-card/30 border-border/50 opacity-50"
                      )}
                    >
                      <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                        !showResult && "bg-muted text-muted-foreground",
                        showResult && isCorrect && "bg-green-500 text-white",
                        showResult && isSelected && !isCorrect && "bg-red-500 text-white"
                      )}>
                        {showResult && isCorrect ? <CheckCircle className="w-4 h-4" /> :
                         showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                         String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-foreground">{option}</span>
                    </motion.button>
                  );
                })}
              </div>

              {showExplanation && question.explanation && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
                  <div className="p-4 rounded-xl border-l-4 bg-primary/5 border-primary">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Explanation: </span>
                      {question.explanation}
                    </p>
                  </div>
                </motion.div>
              )}

              {showExplanation && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                  <Button onClick={handleNext} className="gap-2">
                    {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
