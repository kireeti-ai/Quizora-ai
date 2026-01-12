import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, User, Code, Hexagon } from 'lucide-react';
import './Student.css';

const StudentDashboard = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Helper to get user name (optional, if stored in localStorage)
  // You might need to update Auth.jsx to store 'userName' if you want this to be dynamic
  const userName = localStorage.getItem('userName') || 'Student';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/auth'); // Redirect to login
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError("Code must be 6 characters.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Fetch Quiz Data
      const res = await axios.get(`http://localhost:8080/quiz/code/${code}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        // Navigate to Player with Quiz Data
        navigate(`/student/quiz/${code}`, { state: { quizData: res.data } });
      } else {
        setError("Invalid Code");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setError("Quiz not found! Please check the code.");
      } else {
        setError("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <Hexagon size={28} strokeWidth={2.5} />
          <span>Quizora</span>
        </div>
        <div className="nav-user">
          <div className="user-info">
            <User size={20} />
            <span>{userName}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Ready to learn?</h1>
          <p>Enter the code provided by your faculty to start a quiz.</p>
        </div>

        {/* Join Quiz Card */}
        <div className="dashboard-card join-quiz-card">
          <Code size={48} color="#4f46e5" style={{ marginBottom: '1rem' }} />
          <h2>Join a Quiz</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Input the unique 6-character session code.
          </p>

          <form onSubmit={handleJoin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="code-input-group">
              <input
                type="text"
                placeholder="A1B2C3"
                className="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                required
              />
              <button type="submit" className="join-btn">
                Join
              </button>
            </div>
          </form>

          {error && (
            <div style={{ marginTop: '16px', color: '#ef4444', fontWeight: '500' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;