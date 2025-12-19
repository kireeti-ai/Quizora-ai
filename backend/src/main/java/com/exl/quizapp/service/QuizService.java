package com.exl.quizapp.service;

import com.exl.quizapp.model.Question;
import com.exl.quizapp.model.QuestionWrapper;
import com.exl.quizapp.model.Quiz;
import com.exl.quizapp.model.Response;
import com.exl.quizapp.dao.QuestionDao;
import com.exl.quizapp.dao.QuizDao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService {
    @Autowired
    QuizDao quizDao;
    @Autowired
    QuestionDao questionDao;

    // Change return type to ResponseEntity<String>
    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {
        try {
            List<Question> questions = questionDao.findRandomQuestionsByCategory(category, numQ);
            Quiz quiz = new Quiz();
            quiz.setTitle(title);
            quiz.setQuestions(questions);
            quizDao.save(quiz);
            return new ResponseEntity<>("Success", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create quiz", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        try {
            Optional<Quiz> quiz = quizDao.findById(id);
            if (quiz.isPresent()) {
                List<Question> questionsFromDb = quiz.get().getQuestions();
                List<QuestionWrapper> questionsForUser = new ArrayList<>();
                for (Question q : questionsFromDb) {
                    QuestionWrapper qw = new QuestionWrapper(q.getId(), q.getQuestionTitle(), q.getOption1(), q.getOption2(), q.getOption3(), q.getOption4());
                    questionsForUser.add(qw);
                }
                return new ResponseEntity<>(questionsForUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {
        try {

            Optional<Quiz> quizOptional = quizDao.findById(id);
            if (quizOptional.isEmpty()) {

                return new ResponseEntity<>(0, HttpStatus.NOT_FOUND);
            }

            List<Question> questions = quizOptional.get().getQuestions();
            Map<Integer, String> answerMap = questions.stream()
                    .collect(Collectors.toMap(Question::getId, Question::getRightAnswer));
            int right = 0;
            for (Response response : responses) {

                if (response.getResponse().equals(answerMap.get(response.getId()))) {
                    right++;
                }
            }
            return new ResponseEntity<>(right, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();

            return new ResponseEntity<>(-1, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        try {
            return new ResponseEntity<>(quizDao.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> deleteQuiz(Integer id) {
        try {
            if (quizDao.existsById(id)) {
                quizDao.deleteById(id);
                return new ResponseEntity<>("Quiz deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Quiz not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error deleting quiz", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public ResponseEntity<Quiz> updateQuiz(Integer id,String newTitle){
        try{
            Optional<Quiz> quizOptional = quizDao.findById(id);
            if(quizOptional.isEmpty()){
                return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
            }
            Quiz quiz  = quizOptional.get();
            quiz.setTitle(newTitle);
            Quiz updatedQuiz = quizDao.save(quiz);
            return new ResponseEntity<>(updatedQuiz,HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}