import axios from 'axios';

// Create an axios instance configured for your backend
const api = axios.create({
  baseURL: 'http://localhost:8081', // Your Spring Boot app's address
});

// --- Quiz Endpoints ---

/**
 * Fetches all quizzes from the backend.
 * Corresponds to GET /quiz/all
 */
export const fetchAllQuizzes = () => api.get('/quiz/all');

/**
 * Creates a new quiz.
 * Corresponds to POST /quiz/create
 * @param {string} title - The title of the quiz.
 * @param {string} category - The category of the quiz.
 * @param {number} numQ - The number of questions.
 */
export const createNewQuiz = (title, category, numQ) => {
  // Use URLSearchParams to send data as @RequestParam
  const params = new URLSearchParams();
  params.append('title', title);
  params.append('category', category);
  params.append('numQ', numQ);
  
  return api.post('/quiz/create', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

/**
 * Deletes a quiz by its ID.
 * Corresponds to DELETE /quiz/delete/{id}
 * @param {number} id - The ID of the quiz to delete.
 */
export const deleteQuizById = (id) => api.delete(`/quiz/delete/${id}`);

/**
 * Fetches the questions for a specific quiz.
 * Corresponds to GET /quiz/get/{id}
 * @param {number} id - The ID of the quiz.
 */
export const fetchQuizQuestions = (id) => api.get(`/quiz/get/${id}`);

/**
 * Submits the user's answers for a quiz and gets the result.
 * Corresponds to POST /quiz/submit/{id}
 * @param {number} id - The ID of the quiz.
 * @param {Array<object>} responses - An array of response objects, e.g., [{ id: 1, response: "Option 1" }]
 */
export const submitQuizResult = (id, responses) => api.post(`/quiz/submit/${id}`, responses);

// --- Question Endpoints (if you need them) ---

/**
 * Fetches all questions.
 * Corresponds to GET /question/allQuestions
 */
export const fetchAllQuestions = () => api.get('/question/allQuestions');

/**
* Adds a batch of questions.
* Corresponds to POST /question/add-batch
* @param {Array<object>} questions - An array of Question objects.
*/
export const addQuestionsBatch = (questions) => api.post('/question/add-batch', questions);
/**
 * Updates an existing quiz's title.
 * Corresponds to PUT /quiz/update/{id}
 * @param {number} id - The ID of the quiz to update.
 * @param {string} title - The new title for the quiz.
 */
export const updateQuizById=(id,title)=>{
    const params=new URLSearchParams();
    params.append('title',title);
    return api.put(`/quiz/update/${id}`,null,{
        params:params
    });
}