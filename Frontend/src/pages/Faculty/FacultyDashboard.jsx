import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getMyQuizzes, togglePublishQuiz } from '../../services/quizService';
import CreateQuizModal from '../../components/CreateQuizModal';
import QuizResultsModal from '../../components/QuizResultsModal';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Plus, Trash2, CheckCircle, XCircle, Share2, Copy, BarChart2 } from 'lucide-react';
import './Faculty.css';

const FacultyDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuizForResults, setSelectedQuizForResults] = useState(null);

  const facultyId = 1;

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await getMyQuizzes(facultyId);
      setQuizzes(data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  const handlePublishToggle = async (id) => {
    try {
      await togglePublishQuiz(id);
      fetchQuizzes();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/quiz/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert("Failed to delete quiz.");
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code ${code} copied!`);
  };

  return (
    <div className="faculty-container">
      <Sidebar />
      <main className="content-area">
        <header className="page-header">
          <h1>My Quizzes</h1>
          <button onClick={() => setShowCreateModal(true)} className="btn-action">
            <Plus size={20} /> Create Quiz
          </button>
        </header>

        <div className="grid-container">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#111827' }}>{quiz.title}</h3>
                <span style={{
                    fontSize: '0.75rem', padding: '4px 8px', borderRadius: '12px',
                    background: quiz.published ? '#dcfce7' : '#f3f4f6',
                    color: quiz.published ? '#166534' : '#4b5563',
                    fontWeight: '700'
                  }}>
                  {quiz.published ? 'LIVE' : 'DRAFT'}
                </span>
              </div>

              <div className="card-meta">
                <p>⏱ {quiz.duration}m | 🔄 {quiz.maxAttempts} Attempts</p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center', background: '#eef2ff', padding: '8px', borderRadius: '6px', width: 'fit-content' }}>
                  <span style={{ fontFamily: 'monospace', color: '#4f46e5', fontWeight: 'bold' }}>{quiz.code}</span>
                  <Copy size={14} style={{cursor:'pointer', color:'#6366f1'}} onClick={() => copyToClipboard(quiz.code)} />
                </div>
              </div>

              <div className="card-actions" style={{ marginTop: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                <button onClick={() => handlePublishToggle(quiz.id)} className="icon-btn" title="Toggle Publish">
                  {quiz.published ? <XCircle size={20} color="#d97706" /> : <CheckCircle size={20} color="#059669" />}
                </button>

                <button className="icon-btn" title="View Results" onClick={() => setSelectedQuizForResults(quiz)}>
                  <BarChart2 size={20} />
                </button>

                <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(quiz.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCreateModal && <CreateQuizModal closeModal={() => setShowCreateModal(false)} refreshQuizzes={fetchQuizzes} />}

      {selectedQuizForResults && (
        <QuizResultsModal
          quizId={selectedQuizForResults.id}
          quizTitle={selectedQuizForResults.title}
          closeModal={() => setSelectedQuizForResults(null)}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;