import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import "./Student.css";

const QuizPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData } = location.state || {};

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quizData?.duration ? quizData.duration * 60 : 0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!quizData) {
      navigate("/student/dashboard");
    }
  }, [quizData, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleOptionSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const responses = quizData.questions.map((q) => ({
      id: q.id,
      response: selectedAnswers[q.id] || "",
    }));

    try {
      const token = localStorage.getItem("token");

      // Removed query param '?userId=1' - Backend now extracts it from Token
      const res = await axios.post(
        `http://localhost:8080/quiz/submit/${quizData.quizId}`,
        responses,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Server Response:", res.data);

      let resultId = null;

      if (res.data && res.data.id) {
        resultId = res.data.id;
      } else if (typeof res.data === 'number') {
        resultId = res.data;
      }

      if (resultId) {
        navigate(`/student/result/${resultId}`);
      } else {
        console.error("Result ID missing:", res.data);
        alert("Quiz Submitted, but result ID is missing. Check console.");
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error("Submission failed", error);
      alert("Error submitting quiz. Check console.");
      setIsSubmitting(false);
    }
  };

  if (!quizData) return null;

  const currentQ = quizData.questions[currentQIndex];
  const isLastQuestion = currentQIndex === quizData.questions.length - 1;

  return (
    <div className="quiz-player-container">
      <header className="player-header">
        <div>
          <h2 className="quiz-title">{quizData.title}</h2>
          <span className="q-count">
            Question {currentQIndex + 1} of {quizData.questions.length}
          </span>
        </div>
        <div className={`timer ${timeLeft < 60 ? "danger" : ""}`}>
          <Clock size={20} />
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="question-card">
        <div className="question-text">{currentQ.questionTitle}</div>

        <div className="options-grid">
          {[currentQ.option1, currentQ.option2, currentQ.option3, currentQ.option4].map((opt, idx) => (
            <div
              key={idx}
              className={`option-item ${selectedAnswers[currentQ.id] === opt ? "selected" : ""}`}
              onClick={() => handleOptionSelect(currentQ.id, opt)}
            >
              <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="opt-text">{opt}</span>
              {selectedAnswers[currentQ.id] === opt && <CheckCircle size={18} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
            </div>
          ))}
        </div>
      </div>

      <footer className="player-footer">
        <button
          className="nav-btn"
          disabled={currentQIndex === 0}
          onClick={() => setCurrentQIndex((prev) => prev - 1)}
        >
          <ChevronLeft size={20} /> Previous
        </button>

        {!isLastQuestion ? (
          <button
            className="nav-btn primary"
            onClick={() => setCurrentQIndex((prev) => prev + 1)}
          >
            Next <ChevronRight size={20} />
          </button>
        ) : (
          <button className="nav-btn submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'} <CheckCircle size={20} />
          </button>
        )}
      </footer>
    </div>
  );
};

export default QuizPlayer;