
-- Game sessions (Kahoot-style live quizzes)
CREATE TABLE public.game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  game_code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  current_question_index int NOT NULL DEFAULT 0,
  question_duration_seconds int NOT NULL DEFAULT 20,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz
);

-- Questions for a game session
CREATE TABLE public.game_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer int NOT NULL,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Participants in a game session
CREATE TABLE public.game_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  score int NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Student answers during a game
CREATE TABLE public.game_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.game_questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_answer int NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  time_taken_ms int,
  points_earned int NOT NULL DEFAULT 0,
  answered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(question_id, user_id)
);

-- Self-paced assignments (Khan-style)
CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  game_code text NOT NULL UNIQUE,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  due_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Assignment submissions
CREATE TABLE public.assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  score int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Enable realtime for live quiz
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_answers;

-- RLS: game_sessions
CREATE POLICY "Anyone authenticated can read game sessions" ON public.game_sessions FOR SELECT USING (true);
CREATE POLICY "Teachers can create game sessions" ON public.game_sessions FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher') AND auth.uid() = created_by);
CREATE POLICY "Teachers can update own game sessions" ON public.game_sessions FOR UPDATE USING (auth.uid() = created_by AND has_role(auth.uid(), 'teacher'));
CREATE POLICY "Teachers can delete own game sessions" ON public.game_sessions FOR DELETE USING (auth.uid() = created_by AND has_role(auth.uid(), 'teacher'));

-- RLS: game_questions
CREATE POLICY "Anyone authenticated can read game questions" ON public.game_questions FOR SELECT USING (true);
CREATE POLICY "Teachers can manage game questions" ON public.game_questions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.game_sessions WHERE id = session_id AND created_by = auth.uid()));
CREATE POLICY "Teachers can update game questions" ON public.game_questions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.game_sessions WHERE id = session_id AND created_by = auth.uid()));
CREATE POLICY "Teachers can delete game questions" ON public.game_questions FOR DELETE USING (EXISTS (SELECT 1 FROM public.game_sessions WHERE id = session_id AND created_by = auth.uid()));

-- RLS: game_participants
CREATE POLICY "Anyone can read participants" ON public.game_participants FOR SELECT USING (true);
CREATE POLICY "Students can join game sessions" ON public.game_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own participant record" ON public.game_participants FOR UPDATE USING (auth.uid() = user_id);

-- RLS: game_answers
CREATE POLICY "Participants can read own answers" ON public.game_answers FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.game_sessions WHERE id = session_id AND created_by = auth.uid()));
CREATE POLICY "Students can submit answers" ON public.game_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS: assignments
CREATE POLICY "Anyone authenticated can read assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Teachers can create assignments" ON public.assignments FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher') AND auth.uid() = created_by);
CREATE POLICY "Teachers can update own assignments" ON public.assignments FOR UPDATE USING (auth.uid() = created_by AND has_role(auth.uid(), 'teacher'));
CREATE POLICY "Teachers can delete own assignments" ON public.assignments FOR DELETE USING (auth.uid() = created_by AND has_role(auth.uid(), 'teacher'));

-- RLS: assignment_submissions
CREATE POLICY "Students can read own submissions" ON public.assignment_submissions FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.assignments WHERE id = assignment_id AND created_by = auth.uid()));
CREATE POLICY "Students can submit assignments" ON public.assignment_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for assignments updated_at
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
