import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar"; 
import { Plus, Save } from "lucide-react";
import "./Faculty.css";

const QuestionBank = () => {
  console.log("QuestionBank Component Loaded!");
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    questionTitle: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    rightAnswer: '',
    diffcultylevel: 'Easy',
    category: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/question/allQuestions', getAuthHeaders());
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/question/add', formData, getAuthHeaders());
      
      setShowModal(false);
      setFormData({
        questionTitle: '', option1: '', option2: '', option3: '', option4: '',
        rightAnswer: '', diffcultylevel: 'Easy', category: ''
      });
      fetchQuestions();
      alert("Question Added!");
    } catch (error) {
      console.error(error);
      alert("Error adding question");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="faculty-container">
      <Sidebar />
      <div className="content-area">
        <div className="page-header">
          <h1>Question Bank</h1>
          <button className="btn-action" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add Question
          </button>
        </div>

        <div className="grid-container">
          {questions.map((q) => (
            <div key={q.id} className="card">
              <h3>{q.questionTitle}</h3>
              <div className="card-meta">
                <span style={{background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', marginRight: '8px'}}>
                  {q.category}
                </span>
                <span style={{fontSize: '0.85rem'}}>Ans: {q.rightAnswer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{width: '600px'}}>
            <h2 style={{marginBottom: '20px'}}>Add New Question</h2>
            <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div className="form-group" style={{gridColumn: 'span 2'}}>
                <label>Question Text</label>
                <input name="questionTitle" className="form-input" value={formData.questionTitle} onChange={handleChange} required />
              </div>
              
              <div className="form-group"><label>Option 1</label><input name="option1" className="form-input" value={formData.option1} onChange={handleChange} required /></div>
              <div className="form-group"><label>Option 2</label><input name="option2" className="form-input" value={formData.option2} onChange={handleChange} required /></div>
              <div className="form-group"><label>Option 3</label><input name="option3" className="form-input" value={formData.option3} onChange={handleChange} required /></div>
              <div className="form-group"><label>Option 4</label><input name="option4" className="form-input" value={formData.option4} onChange={handleChange} required /></div>

              <div className="form-group"><label>Correct Answer</label><input name="rightAnswer" className="form-input" value={formData.rightAnswer} onChange={handleChange} required /></div>
              <div className="form-group"><label>Category</label><input name="category" className="form-input" value={formData.category} onChange={handleChange} required /></div>
              
              <div className="form-group" style={{gridColumn: 'span 2'}}>
                <button type="submit" className="btn-action" style={{width: '100%', justifyContent: 'center'}}>
                  <Save size={18} /> Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;