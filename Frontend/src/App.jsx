import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import QuestionBank from './pages/Faculty/QuestionBank';
import StudentDashboard from './pages/Student/StudentDashboard';
import QuizPlayer from './pages/Student/QuizPlayer';
import ResultPage from './pages/Student/ResultPage';
import AIQuestionGenerator from './pages/Faculty/AIQuestionGenerator';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<StudentDashboard />} /> {/* Student Home */}

        {/* Faculty Routes */}
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/questions" element={<QuestionBank />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/quiz/:code" element={<QuizPlayer />} />
        <Route path="/student/result/:id" element={<ResultPage />} />
        <Route path="/faculty/ai-generator" element={<AIQuestionGenerator />} />
        
        {/* Profile Route */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;