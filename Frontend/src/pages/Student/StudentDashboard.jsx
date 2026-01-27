import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, User, Code, Hexagon, History, Clock, UserCircle } from 'lucide-react';
import './Student.css';

const StudentDashboard = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'Student';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      // Updated Endpoint: No longer sending userId in URL
      const res = await axios.get(`http://localhost:8080/quiz/attempts/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttempts(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
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
      const res = await axios.get(`http://localhost:8080/quiz/code/${code}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        navigate(`/student/quiz/${code}`, { state: { quizData: res.data } });
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("⛔ You have reached the maximum attempts for this quiz.");
      } else if (err.response && err.response.status === 404) {
        setError("Quiz not found! Please check the code.");
      } else {
        setError("Server error. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
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
          <button onClick={() => navigate('/profile')} className="profile-btn">
            <UserCircle size={18} /> <span>Profile</span>
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {userName}!</h1>
          <p>Enter a quiz code to begin or review your past results.</p>
        </div>

        <div className="dashboard-card join-quiz-card">
          <Code size={48} color="#4f46e5" style={{ marginBottom: '1rem' }} />
          <h2>Join a Quiz</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Enter the 6-character code.</p>

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
              <button type="submit" className="join-btn">Start</button>
            </div>
          </form>
          {error && <div style={{ marginTop: '16px', color: '#ef4444', fontWeight: '500' }}>{error}</div>}
        </div>

        <div className="dashboard-card">
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
            <History size={24} color="#4f46e5"/>
            <h2 style={{margin:0, fontSize:'1.25rem'}}>Recent Activity</h2>
          </div>

          {attempts.length === 0 ? (
            <p style={{color:'#6b7280'}}>No quizzes taken yet.</p>
          ) : (
            <div style={{display:'grid', gap:'10px'}}>
              {attempts.map((att) => (
                <div key={att.id} style={{
                  padding: '15px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f9fafb'
                }}>
                  <div>
                    <div style={{fontWeight:'bold', color:'#374151'}}>Quiz #{att.quizId}</div>
                    <div style={{fontSize:'0.85rem', color:'#6b7280', display:'flex', alignItems:'center', gap:'5px'}}>
                      <Clock size={14}/> {new Date(att.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: (att.score / att.totalQuestions) >= 0.5 ? '#059669' : '#ef4444'
                    }}>
                      {att.score} / {att.totalQuestions}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;