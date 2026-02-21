import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import TopicDetail from "./pages/TopicDetail";
import Auth from "./pages/Auth";
import RoleSelect from "./pages/RoleSelect";
import TeacherDashboard from "./pages/TeacherDashboard";
import JoinGame from "./pages/JoinGame";
import CreateLiveQuiz from "./pages/CreateLiveQuiz";
import HostGame from "./pages/HostGame";
import PlayGame from "./pages/PlayGame";
import CreateAssignment from "./pages/CreateAssignment";
import TakeAssignment from "./pages/TakeAssignment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/role-select" element={<RoleSelect />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/join" element={<JoinGame />} />
            <Route path="/create-quiz" element={<CreateLiveQuiz />} />
            <Route path="/host/:sessionId" element={<HostGame />} />
            <Route path="/play/:sessionId" element={<PlayGame />} />
            <Route path="/create-assignment" element={<CreateAssignment />} />
            <Route path="/assignment/:assignmentId" element={<TakeAssignment />} />
            <Route path="/topic/:topicId/:subtopicId" element={<TopicDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
