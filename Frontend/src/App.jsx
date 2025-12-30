import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import QuestionBank from './pages/Faculty/QuestionBank';

function App() {
  return (

      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/questions" element={<QuestionBank />} />
      </Routes>
   
  )
}

export default App;