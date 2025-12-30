import React, { useState } from 'react';

import { createQuiz } from '../services/quizService'; 

import '../pages/Faculty/Faculty.css'; 


const CreateQuizModal = ({ closeModal, refreshQuizzes }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Java',
    numQ: 5,
    duration: 30,
    maxAttempts: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQuiz(
        formData.category,
        formData.numQ,
        formData.title,
        formData.duration,
        formData.maxAttempts
      );
      refreshQuizzes();
      closeModal();
    } catch (err) {
      alert('Error creating quiz');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Quiz</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quiz Title</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              placeholder="e.g. Java Basics Mid-Term"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Questions</label>
              <input 
                type="number" 
                className="form-input"
                value={formData.numQ}
                onChange={(e) => setFormData({...formData, numQ: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration (min)</label>
              <input 
                type="number" 
                className="form-input"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Max Attempts</label>
            <input 
              type="number" 
              className="form-input"
              value={formData.maxAttempts}
              onChange={(e) => setFormData({...formData, maxAttempts: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button 
              type="button" 
              onClick={closeModal}
              style={{ padding: '10px 20px', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-action"
              style={{ padding: '10px 20px', borderRadius: '6px' }}
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizModal;