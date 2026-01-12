import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import QuestionBank from './pages/Faculty/QuestionBank'; // Ensure this import is correct

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        {/* Make sure this path matches exactly what is in your Sidebar */}
        <Route path="/faculty/questions" element={<QuestionBank />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;