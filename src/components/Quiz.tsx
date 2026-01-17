import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, RefreshCw, ChevronRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  topicColor: string;
  onComplete?: (score: number, total: number) => void;
}

export default function Quiz({ questions, topicColor, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const question = questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);
    
    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      onComplete?.(score + (selectedAnswer === question.correctAnswer ? 1 : 0), questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsComplete(false);
    setAnswers([]);
  };

  const finalScore = score + (selectedAnswer === question?.correctAnswer ? 1 : 0);
  const percentage = Math.round((finalScore / questions.length) * 100);

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${topicColor}20` }}
        >
          <Trophy className="w-12 h-12" style={{ color: topicColor }} />
        </motion.div>
        
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
          Quiz Complete!
        </h3>
        
        <p className="text-muted-foreground mb-4">
          You scored {finalScore} out of {questions.length}
        </p>
        
        <div className="w-full bg-muted rounded-full h-4 mb-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full"
            style={{ backgroundColor: topicColor }}
          />
        </div>
        
        <p className="text-lg font-medium mb-6" style={{ color: topicColor }}>
          {percentage >= 80 ? "🎉 Excellent! You've mastered this topic!" :
           percentage >= 60 ? "👍 Good job! Keep learning!" :
           percentage >= 40 ? "📚 Not bad! Review the material and try again!" :
           "💪 Keep practicing! You'll get better!"}
        </p>
        
        <Button
          onClick={handleRestart}
          className="gap-2"
          style={{ backgroundColor: topicColor }}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5" style={{ color: topicColor }} />
          <h2 className="font-display text-xl font-semibold text-foreground">
            Knowledge Check
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          className="h-full rounded-full transition-all duration-300"
          style={{ backgroundColor: topicColor }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg font-medium text-foreground mb-6">
            {question.question}
          </p>

          {/* Options */}
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
                    "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3",
                    "border-2",
                    selectedAnswer === null && "hover:border-primary/50 cursor-pointer",
                    selectedAnswer !== null && "cursor-default",
                    !showResult && "bg-card/50 border-border",
                    showResult && isCorrect && "bg-green-500/10 border-green-500",
                    showResult && isSelected && !isCorrect && "bg-red-500/10 border-red-500",
                    showResult && !isSelected && !isCorrect && "bg-card/30 border-border/50 opacity-50"
                  )}
                >
                  <span 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                      !showResult && "bg-muted text-muted-foreground",
                      showResult && isCorrect && "bg-green-500 text-white",
                      showResult && isSelected && !isCorrect && "bg-red-500 text-white"
                    )}
                  >
                    {showResult && isCorrect ? <CheckCircle className="w-4 h-4" /> :
                     showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                     String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-foreground">{option}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div 
                  className="p-4 rounded-xl border-l-4"
                  style={{ 
                    backgroundColor: `${topicColor}10`,
                    borderLeftColor: topicColor 
                  }}
                >
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Explanation: </span>
                    {question.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <Button
                onClick={handleNext}
                className="gap-2"
                style={{ backgroundColor: topicColor }}
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
