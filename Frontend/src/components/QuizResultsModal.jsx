import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, AlertCircle } from 'lucide-react';

const QuizResultsModal = ({ quizId, quizTitle, closeModal }) => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/quiz/attempts/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAttempts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px', width:'90%'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <h2 style={{fontSize:'1.5rem', margin:0, color:'#111827'}}>Results: {quizTitle}</h2>
          <button onClick={closeModal} style={{background:'none', border:'none', cursor:'pointer'}}>
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div style={{padding:'20px', textAlign:'center'}}>Loading data...</div>
        ) : attempts.length === 0 ? (
          <div style={{textAlign:'center', padding:'40px', color:'#6b7280'}}>
            <AlertCircle size={40} style={{marginBottom:'10px', opacity:0.5}} />
            <p>No students have attempted this quiz yet.</p>
          </div>
        ) : (
          <div style={{maxHeight:'60vh', overflowY:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', textAlign:'left'}}>
              <thead>
                <tr style={{borderBottom:'2px solid #e5e7eb', color:'#6b7280', fontSize:'0.85rem', textTransform:'uppercase'}}>
                  <th style={{padding:'12px'}}>Student ID</th>
                  <th style={{padding:'12px'}}>Date</th>
                  <th style={{padding:'12px'}}>Score</th>
                  <th style={{padding:'12px'}}>Result</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((att) => {
                  const pct = Math.round((att.score / att.totalQuestions) * 100);
                  const passed = pct >= 50;
                  return (
                    <tr key={att.id} style={{borderBottom:'1px solid #f3f4f6'}}>
                      <td style={{padding:'12px', fontWeight:'500'}}>#{att.userId}</td>
                      <td style={{padding:'12px', color:'#4b5563'}}>
                        {new Date(att.timestamp).toLocaleDateString()}
                      </td>
                      <td style={{padding:'12px', fontWeight:'bold'}}>
                        {att.score} / {att.totalQuestions}
                      </td>
                      <td style={{padding:'12px'}}>
                        <span style={{
                          padding:'4px 8px',
                          borderRadius:'12px',
                          fontSize:'0.75rem',
                          fontWeight:'bold',
                          background: passed ? '#dcfce7' : '#fee2e2',
                          color: passed ? '#166534' : '#991b1b'
                        }}>
                          {passed ? 'PASS' : 'FAIL'} ({pct}%)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResultsModal;