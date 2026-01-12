import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Upload, FileText, CheckCircle, Loader } from 'lucide-react';
import './Faculty.css';

const AIQuestionGenerator = () => {
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!file || !topic) {
      alert("Please upload a file and enter a topic.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("topic", topic);
    formData.append("difficulty", difficulty);
    formData.append("count", count);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8080/ai/generate', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setGeneratedQuestions(res.data);
      alert(`Success! Generated ${res.data.length} questions.`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate questions. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-container">
      <Sidebar />
      <main className="content-area">
        <header className="page-header">
          <h1>AI Question Generator</h1>
        </header>

        <div className="dashboard-card" style={{maxWidth: '800px'}}>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>1. Upload Syllabus / Notes (PDF)</label>
              <div style={{border:'2px dashed #e5e7eb', padding:'20px', borderRadius:'8px', textAlign:'center', cursor:'pointer', position:'relative'}}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} style={{position:'absolute', width:'100%', height:'100%', opacity:0, top:0, left:0, cursor:'pointer'}} />
                <Upload size={32} color="#4f46e5" />
                <p style={{color:'#6b7280', marginTop:'10px'}}>
                  {file ? file.name : "Drag & drop PDF here or click to browse"}
                </p>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
              <div className="form-group">
                <label>2. Topic / Context</label>
                <input type="text" className="form-input" placeholder="e.g. Java Streams" value={topic} onChange={e => setTopic(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>3. Number of Questions</label>
                <input type="number" className="form-input" value={count} onChange={e => setCount(e.target.value)} min="1" max="10" />
              </div>
            </div>

            <div className="form-group">
              <label>4. Difficulty</label>
              <select className="form-input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <button type="submit" className="btn-action" style={{width:'100%', justifyContent:'center', marginTop:'20px'}} disabled={loading}>
              {loading ? <><Loader className="spin" size={20}/> Generating...</> : <><FileText size={20}/> Generate Questions</>}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        {generatedQuestions.length > 0 && (
          <div style={{marginTop:'40px'}}>
            <h2>Generated Questions</h2>
            <div className="grid-container">
              {generatedQuestions.map((q, idx) => (
                <div key={idx} className="card">
                  <h3>{idx+1}. {q.questionTitle}</h3>
                  <div style={{color:'#4b5563', fontSize:'0.9rem', margin:'10px 0'}}>
                    <div>A) {q.option1}</div>
                    <div>B) {q.option2}</div>
                    <div>C) {q.option3}</div>
                    <div>D) {q.option4}</div>
                  </div>
                  <div style={{color:'#059669', fontWeight:'bold', fontSize:'0.9rem'}}>Correct: {q.rightAnswer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIQuestionGenerator;