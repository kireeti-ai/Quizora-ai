import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Plus, Save, Edit, Trash2 } from "lucide-react";
import Sidebar from '../../components/Sidebar/Sidebar';
import "./Faculty.css";

const QuestionBank = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    questionTitle: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    rightAnswer: '',
    difficultylevel: 'Easy',
    category: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:8080/question/my-questions', getAuthHeaders());
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const validateForm = () => {
    if (!formData.questionTitle || !formData.option1 || !formData.option2 ||
        !formData.option3 || !formData.option4 || !formData.rightAnswer || !formData.category) {
      alert("Please fill in all fields");
      return false;
    }

    const options = [formData.option1, formData.option2, formData.option3, formData.option4];
    if (!options.includes(formData.rightAnswer)) {
      alert("Correct answer must match exactly one of the four options!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/question/update/${editingId}`, formData, getAuthHeaders());
        alert("Question Updated!");
      } else {
        await axios.post('http://localhost:8080/question/add', formData, getAuthHeaders());
        alert("Question Added!");
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({
        questionTitle: '', option1: '', option2: '', option3: '', option4: '',
        rightAnswer: '', difficultylevel: 'Easy', category: ''
      });
      fetchQuestions();
    } catch (error) {
      console.error(error);
      alert(`Error ${editingId ? 'updating' : 'adding'} question: ${error.response?.data || error.message}`);
    }
  };

  const handleEdit = (question) => {
    setFormData({
      questionTitle: question.questionTitle,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      rightAnswer: question.rightAnswer,
      difficultylevel: question.difficultylevel || 'Easy',
      category: question.category
    });
    setEditingId(question.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/question/delete/${id}`, getAuthHeaders());
      alert("Question Deleted!");
      fetchQuestions();
    } catch (error) {
      console.error(error);
      alert("Error deleting question: " + (error.response?.data || error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      questionTitle: '', option1: '', option2: '', option3: '', option4: '',
      rightAnswer: '', difficultylevel: 'Easy', category: ''
    });
  };

  return (
    <div className="faculty-container">
      {/* Sidebar Component Used Here */}
      <Sidebar />

      {/* Main Content */}
      <div className="content-area">
        <div className="page-header">
          <h1>Question Bank</h1>
          <button className="btn-action" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add Question
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{textAlign: 'center', padding: '60px', fontSize: '18px', color: '#6b7280'}}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #4f46e5',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }}></div>
            Loading questions...
          </div>
        ) : (
          <div className="grid-container">
            {questions.length === 0 ? (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#9ca3af'}}>
                <p style={{fontSize: '18px', marginBottom: '8px'}}>No questions found</p>
                <p style={{fontSize: '14px'}}>Click "Add Question" to create your first question!</p>
              </div>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="card">
                  <h3 style={{marginBottom: '12px', color: '#111827', lineHeight: '1.4'}}>{q.questionTitle}</h3>
                  <div style={{margin: '12px 0', fontSize: '0.85rem', color: '#4b5563'}}>
                    <div style={{padding: '4px 0'}}><strong>A:</strong> {q.option1}</div>
                    <div style={{padding: '4px 0'}}><strong>B:</strong> {q.option2}</div>
                    <div style={{padding: '4px 0'}}><strong>C:</strong> {q.option3}</div>
                    <div style={{padding: '4px 0'}}><strong>D:</strong> {q.option4}</div>
                  </div>
                  <div className="card-meta" style={{display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px'}}>
                    <span style={{background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600'}}>
                      {q.category}
                    </span>
                    <span style={{background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600'}}>
                      {q.difficultylevel || 'Easy'}
                    </span>
                    <span style={{fontSize: '0.8rem', color: '#059669', fontWeight: '600', marginLeft: 'auto'}}>
                      ✓ {q.rightAnswer}
                    </span>
                  </div>
                  <div style={{display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb'}}>
                    <button
                      onClick={() => handleEdit(q)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{width: '650px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h2 style={{marginBottom: '24px', fontSize: '1.5rem', color: '#111827'}}>
              {editingId ? '✏️ Edit Question' : '➕ Add New Question'}
            </h2>
            <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div className="form-group" style={{gridColumn: 'span 2'}}>
                <label>Question Text <span style={{color: '#ef4444'}}>*</span></label>
                <textarea
                  name="questionTitle"
                  className="form-input"
                  value={formData.questionTitle}
                  onChange={handleChange}
                  required
                  rows="3"
                  style={{resize: 'vertical', fontFamily: 'inherit'}}
                  placeholder="Enter your question here..."
                />
              </div>

              <div className="form-group">
                <label>Option 1 <span style={{color: '#ef4444'}}>*</span></label>
                <input name="option1" className="form-input" value={formData.option1} onChange={handleChange} required placeholder="First option" />
              </div>
              <div className="form-group">
                <label>Option 2 <span style={{color: '#ef4444'}}>*</span></label>
                <input name="option2" className="form-input" value={formData.option2} onChange={handleChange} required placeholder="Second option" />
              </div>
              <div className="form-group">
                <label>Option 3 <span style={{color: '#ef4444'}}>*</span></label>
                <input name="option3" className="form-input" value={formData.option3} onChange={handleChange} required placeholder="Third option" />
              </div>
              <div className="form-group">
                <label>Option 4 <span style={{color: '#ef4444'}}>*</span></label>
                <input name="option4" className="form-input" value={formData.option4} onChange={handleChange} required placeholder="Fourth option" />
              </div>

              <div className="form-group">
                <label>Correct Answer <span style={{color: '#ef4444'}}>*</span></label>
                <input
                  name="rightAnswer"
                  className="form-input"
                  value={formData.rightAnswer}
                  onChange={handleChange}
                  required
                  placeholder="Must match one of the options exactly"
                />
                <small style={{color: '#6b7280', fontSize: '0.75rem', display: 'block', marginTop: '4px'}}>
                  Must match one of the 4 options above exactly
                </small>
              </div>

              <div className="form-group">
                <label>Category <span style={{color: '#ef4444'}}>*</span></label>
                <input
                  name="category"
                  className="form-input"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Java, Python, Math"
                />
              </div>

              <div className="form-group" style={{gridColumn: 'span 2'}}>
                <label>Difficulty Level <span style={{color: '#ef4444'}}>*</span></label>
                <select
                  name="difficultylevel"
                  className="form-input"
                  value={formData.difficultylevel}
                  onChange={handleChange}
                  required
                  style={{cursor: 'pointer'}}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div style={{gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '8px'}}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#4b5563'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#6b7280'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-action"
                  style={{flex: 1, justifyContent: 'center', fontSize: '15px'}}
                >
                  <Save size={18} /> {editingId ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QuestionBank;