import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, BookOpen, LogOut, ArrowLeft, FileText, Gamepad2, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Subject {
  id: string;
  title: string;
  description: string | null;
  color: string;
  created_at: string;
}

interface Topic {
  id: string;
  subject_id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  source_credit: string | null;
  color: string;
  created_at: string;
}

export default function TeacherDashboard() {
  const { user, signOut, role } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [showTopicDialog, setShowTopicDialog] = useState(false);
  const [subjectForm, setSubjectForm] = useState({ title: '', description: '', color: '#3b82f6' });
  const [topicForm, setTopicForm] = useState({ title: '', description: '', content: '', video_url: '', source_credit: '', color: '#14b8a6' });

  useEffect(() => {
    if (role !== 'teacher') {
      navigate('/role-select');
      return;
    }
    fetchSubjects();
  }, [role]);

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from('teacher_subjects')
      .select('*')
      .eq('created_by', user!.id)
      .order('created_at', { ascending: false });
    if (data) setSubjects(data as Subject[]);
  };

  const fetchTopics = async (subjectId: string) => {
    const { data } = await supabase
      .from('teacher_topics')
      .select('*')
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: false });
    if (data) setTopics(data as Topic[]);
  };

  const handleCreateSubject = async () => {
    if (!subjectForm.title.trim()) return;
    const { error } = await supabase.from('teacher_subjects').insert({
      title: subjectForm.title,
      description: subjectForm.description || null,
      color: subjectForm.color,
      created_by: user!.id,
    });
    if (error) { toast.error('Failed to create subject'); return; }
    toast.success('Subject created!');
    setShowSubjectDialog(false);
    setSubjectForm({ title: '', description: '', color: '#3b82f6' });
    fetchSubjects();
  };

  const handleCreateTopic = async () => {
    if (!topicForm.title.trim() || !selectedSubject) return;
    const { error } = await supabase.from('teacher_topics').insert({
      subject_id: selectedSubject.id,
      title: topicForm.title,
      description: topicForm.description || null,
      content: topicForm.content || null,
      video_url: topicForm.video_url || null,
      source_credit: topicForm.source_credit || null,
      color: topicForm.color,
      created_by: user!.id,
    });
    if (error) { toast.error('Failed to create topic'); return; }
    toast.success('Topic created!');
    setShowTopicDialog(false);
    setTopicForm({ title: '', description: '', content: '', video_url: '', source_credit: '', color: '#14b8a6' });
    fetchTopics(selectedSubject.id);
  };

  const handleDeleteSubject = async (id: string) => {
    const { error } = await supabase.from('teacher_subjects').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Subject deleted');
    if (selectedSubject?.id === id) { setSelectedSubject(null); setTopics([]); }
    fetchSubjects();
  };

  const handleDeleteTopic = async (id: string) => {
    const { error } = await supabase.from('teacher_topics').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Topic deleted');
    if (selectedSubject) fetchTopics(selectedSubject.id);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      <header className="relative z-20 p-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-accent" />
          <h1 className="font-display text-xl font-bold text-foreground">Teacher Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/create-quiz')} className="gap-1">
            <Gamepad2 className="w-4 h-4" /> Live Quiz
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/create-assignment')} className="gap-1">
            <ClipboardList className="w-4 h-4" /> Assignment
          </Button>
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Student View
          </Button>
          <Button variant="ghost" onClick={signOut} className="gap-2 text-muted-foreground">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* Subjects Panel */}
        <div className="w-full lg:w-1/3 p-6 border-r border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">My Subjects</h2>
            <Button size="sm" onClick={() => setShowSubjectDialog(true)} className="gap-1">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="space-y-3">
            {subjects.map((subject) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`glass-card p-4 cursor-pointer transition-all ${selectedSubject?.id === subject.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => { setSelectedSubject(subject); fetchTopics(subject.id); }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                    <h3 className="font-display font-semibold text-foreground">{subject.title}</h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteSubject(subject.id); }}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                {subject.description && <p className="text-muted-foreground text-sm mt-1 ml-6">{subject.description}</p>}
              </motion.div>
            ))}
            {subjects.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">No subjects yet. Click "Add" to create one!</p>
            )}
          </div>
        </div>

        {/* Topics Panel */}
        <div className="w-full lg:w-2/3 p-6">
          {selectedSubject ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Topics in <span style={{ color: selectedSubject.color }}>{selectedSubject.title}</span>
                </h2>
                <Button size="sm" onClick={() => setShowTopicDialog(true)} className="gap-1">
                  <Plus className="w-4 h-4" /> Add Topic
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {topics.map((topic) => (
                  <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" style={{ color: topic.color }} />
                        <h3 className="font-display font-semibold text-foreground">{topic.title}</h3>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTopic(topic.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    {topic.description && <p className="text-muted-foreground text-sm mb-2">{topic.description}</p>}
                    {topic.source_credit && (
                      <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2">
                        📚 Source: {topic.source_credit}
                      </p>
                    )}
                  </motion.div>
                ))}
                {topics.length === 0 && (
                  <p className="text-muted-foreground text-sm col-span-2 text-center py-8">No topics yet. Add one!</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a subject to view and manage its topics
            </div>
          )}
        </div>
      </div>

      {/* Create Subject Dialog */}
      <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Subject</DialogTitle>
            <DialogDescription>Add a new subject for your students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={subjectForm.title} onChange={(e) => setSubjectForm({ ...subjectForm, title: e.target.value })} placeholder="e.g. Biology" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={subjectForm.description} onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })} placeholder="Brief description..." />
            </div>
            <div>
              <Label>Color</Label>
              <Input type="color" value={subjectForm.color} onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })} />
            </div>
            <Button onClick={handleCreateSubject} className="w-full">Create Subject</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Topic Dialog */}
      <Dialog open={showTopicDialog} onOpenChange={setShowTopicDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Topic</DialogTitle>
            <DialogDescription>Create a new topic for {selectedSubject?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={topicForm.title} onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })} placeholder="e.g. Photosynthesis" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={topicForm.description} onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })} placeholder="Short description..." />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea value={topicForm.content} onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })} placeholder="Full educational content..." rows={6} />
            </div>
            <div>
              <Label>YouTube Video URL (optional)</Label>
              <Input 
                value={topicForm.video_url} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(val)) {
                    setTopicForm({ ...topicForm, video_url: val });
                  }
                }} 
                placeholder="https://youtube.com/watch?v=..." 
              />
              {topicForm.video_url && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(topicForm.video_url) && (
                <p className="text-xs text-destructive mt-1">Must be a YouTube URL</p>
              )}
            </div>
            <div>
              <Label>Source / Credit (optional)</Label>
              <Input value={topicForm.source_credit} onChange={(e) => setTopicForm({ ...topicForm, source_credit: e.target.value })} placeholder="e.g. Khan Academy, Wikipedia" />
            </div>
            <div>
              <Label>Color</Label>
              <Input type="color" value={topicForm.color} onChange={(e) => setTopicForm({ ...topicForm, color: e.target.value })} />
            </div>
            <Button onClick={handleCreateTopic} className="w-full">Create Topic</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
