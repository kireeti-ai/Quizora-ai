import axios from 'axios';

const API_URL = 'http://localhost:8080/quiz';

// Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const createQuiz = async (category, numQ, title, duration, maxAttempts) => {
  const params = new URLSearchParams();
  params.append('category', category);
  params.append('numQ', numQ);
  params.append('title', title);
  params.append('duration', duration);
  params.append('maxAttempts', maxAttempts);

  // Send Token in Headers
  const response = await axios.post(`${API_URL}/create`, params, getAuthHeaders());
  return response.data;
};

// Updated: No arguments needed, backend uses token
export const getMyQuizzes = async () => {
  const response = await axios.get(`${API_URL}/my-quizzes`, getAuthHeaders());
  return response.data;
};

export const togglePublishQuiz = async (quizId) => {
  const response = await axios.patch(`${API_URL}/publish/${quizId}`, {}, getAuthHeaders());
  return response.data;
};