import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { XCircle, Home, Trophy } from "lucide-react";
import "./Student.css";

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8080/quiz/result/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResult(res.data);
      } catch (error) {
        console.error("Error fetching result", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) return <div className="loading-spinner">Calculating Results...</div>;
  if (!result) return <div className="error-message">Result not found!</div>;

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const passed = percentage >= 50;

  return (
    <div className="result-container">
      <div className="result-card">
        <div className="result-header">
          {passed ? (
            <Trophy size={64} color="#fbbf24" style={{ marginBottom: '1rem' }} />
          ) : (
            <XCircle size={64} color="#ef4444" style={{ marginBottom: '1rem' }} />
          )}
          <h1>{passed ? "Excellent Work!" : "Keep Practicing!"}</h1>
          <div className="score-highlight">
            {result.score} <span style={{fontSize: '1.5rem', color: '#6b7280', fontWeight: '400'}}>/ {result.totalQuestions}</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Percentage</span>
            <span className={`stat-value ${passed ? "pass" : "fail"}`}>{percentage}%</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Status</span>
            <span className={`stat-value ${passed ? "pass" : "fail"}`}>{passed ? "Passed" : "Failed"}</span>
          </div>
        </div>

        <button className="nav-btn primary" style={{width: '100%', justifyContent: 'center'}} onClick={() => navigate("/student/dashboard")}>
          <Home size={20} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultPage;