import axios from 'axios';

const API_URL = 'http://localhost:8080/quiz';

export const createQuiz = async (category, numQ, title, duration, maxAttempts) => {
  const params = new URLSearchParams();
  params.append('category', category);
  params.append('numQ', numQ);
  params.append('title', title);
  params.append('duration', duration);
  params.append('maxAttempts', maxAttempts);

  const response = await axios.post(`${API_URL}/create`, params);
  return response.data;
};

export const getMyQuizzes = async (facultyId) => {
  const response = await axios.get(`${API_URL}/faculty/${facultyId}`);
  return response.data;
};

export const togglePublishQuiz = async (quizId) => {
  const response = await axios.patch(`${API_URL}/publish/${quizId}`);
  return response.data;
};