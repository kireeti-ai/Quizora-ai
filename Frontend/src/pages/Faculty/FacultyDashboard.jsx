import React, { useState, useEffect } from 'react';
import { getMyQuizzes, togglePublishQuiz } from '../../services/quizService';
import CreateQuizModal from '../../components/CreateQuizModal';
// 1. Ensure this import exists
import Sidebar from '../../components/Sidebar/Sidebar';
import { Plus, Trash2, CheckCircle, XCircle, Share2 } from 'lucide-react';
import './Faculty.css';

const FacultyDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const facultyId = 1; // Note: You should eventually make this dynamic based on login

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await getMyQuizzes(facultyId);
      setQuizzes(data);
    } catch (err) {
      console.error(err);
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

  return (
    <div className="faculty-container">
      {/* 2. REPLACE the hardcoded <aside> block with this component */}
      <Sidebar />

      {/* Main Content */}
      <main className="content-area">
        <header className="page-header">
          <h1>My Quizzes</h1>
          <button onClick={() => setShowModal(true)} className="btn-action">
            <Plus size={20} />
            Create Quiz
          </button>
        </header>

        <div className="grid-container">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <h3>{quiz.title}</h3>
                <span style={{
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: quiz.published ? '#dcfce7' : '#f3f4f6',
                    color: quiz.published ? '#166534' : '#4b5563',
                    fontWeight: '600'
                  }}>
                  {quiz.published ? 'LIVE' : 'DRAFT'}
                </span>
              </div>

              <div className="card-meta">
                <p>⏱ {quiz.duration} mins &nbsp; | &nbsp; 🔄 {quiz.maxAttempts} Attempts</p>
                <p style={{ marginTop: '10px', fontFamily: 'monospace', color: '#4f46e5', fontWeight: 'bold' }}>
                  CODE: {quiz.code}
                </p>
              </div>

              <div className="card-actions">
                <button
                  onClick={() => handlePublishToggle(quiz.id)}
                  className="icon-btn"
                  title={quiz.published ? "Unpublish" : "Publish"}
                >
                  {quiz.published ? <XCircle size={20} color="#d97706" /> : <CheckCircle size={20} color="#059669" />}
                </button>

                <button className="icon-btn" title="Share Code">
                  <Share2 size={20} />
                </button>

                <button className="icon-btn danger" title="Delete">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <CreateQuizModal
          closeModal={() => setShowModal(false)}
          refreshQuizzes={fetchQuizzes}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;