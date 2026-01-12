package com.exl.quizapp.service;

import com.exl.quizapp.dao.AttemptDao;
import com.exl.quizapp.dao.QuestionDao;
import com.exl.quizapp.dao.QuizDao;
import com.exl.quizapp.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class QuizService {

    @Autowired
    QuizDao quizDao;
    @Autowired
    QuestionDao questionDao;
    @Autowired
    AttemptDao attemptDao;

    public ResponseEntity<QuizStartResponse> getQuizByCode(String code){
        Optional<Quiz> quizOP= quizDao.findByCode(code);
        if(quizOP.isEmpty()) {
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
        Quiz quiz= quizOP.get();
        List<Question> questionsFromDB = quiz.getQuestions();
        List<QuestionWrapper> questionsForUser =  new ArrayList<>();
        for(Question q: questionsFromDB){
            questionsForUser.add(new QuestionWrapper(q.getId(),q.getQuestionTitle(),q.getOption1(),q.getOption2(),q.getOption3(),q.getOption4()));
        }
        QuizStartResponse response = new QuizStartResponse(quiz.getId(), quiz.getTitle(), quiz.getDuration(), questionsForUser);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public String generateQuizCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random rnd = new Random();
        while (code.length() < 6) {
            int index = (int) (rnd.nextFloat() * chars.length());
            code.append(chars.charAt(index));
        }
        String generatedCode = code.toString();

        if (quizDao.existsByCode(generatedCode)) {
            return generateQuizCode();
        }
        return generatedCode;
    }

    // UPDATED: Now accepts userId
    public ResponseEntity<String> createQuiz(String category, int numQ, String title, int duration, int maxAttempts, Long userId) {
        // Use the random fetcher we added earlier
        List<Question> questions = questionDao.findRandomQuestionsByCategory(category, numQ);

        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setQuestions(questions);
        quiz.setDuration(duration);
        quiz.setMaxAttempts(maxAttempts);
        quiz.setCode(generateQuizCode());

        // Use the actual User ID
        quiz.setCreatedBy(userId);

        quiz.setPublished(false);

        quizDao.save(quiz);

        return new ResponseEntity<>("Success", HttpStatus.CREATED);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        Optional<Quiz> quiz = quizDao.findById(id);
        List<Question> questionsFromDB = quiz.get().getQuestions();
        List<QuestionWrapper> questionsForUser = new ArrayList<>();
        for(Question q : questionsFromDB){
            QuestionWrapper qw = new QuestionWrapper(q.getId(), q.getQuestionTitle(), q.getOption1(), q.getOption2(), q.getOption3(), q.getOption4());
            questionsForUser.add(qw);
        }

        return new ResponseEntity<>(questionsForUser, HttpStatus.OK);
    }

    public Attempt getAttemptById(Long id) {
        return attemptDao.findById(id).orElse(null);
    }

    public ResponseEntity<Attempt> calculateResult(Integer id, List<Response> responses, Long userId) {
        Quiz quiz = quizDao.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
        List<Question> questions = quiz.getQuestions();

        int right = 0;
        int i = 0;
        for(Response response : responses){
            if(i < questions.size() && response.getResponse().equals(questions.get(i).getRightAnswer()))
                right++;
            i++;
        }

        Attempt attempt = new Attempt(userId, id, right, questions.size());
        attemptDao.save(attempt);

        return new ResponseEntity<>(attempt, HttpStatus.OK);
    }

    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return new ResponseEntity<>(quizDao.findAll(), HttpStatus.OK);
    }

    public ResponseEntity<List<Quiz>> getQuizzesByFaculty(Long facultyId) {
        return new ResponseEntity<>(quizDao.findByCreatedBy(facultyId), HttpStatus.OK);
    }

    public ResponseEntity<String> togglePublish(Integer id) {
        Optional<Quiz> quizOptional = quizDao.findById(id);
        if (quizOptional.isPresent()) {
            Quiz quiz = quizOptional.get();
            quiz.setPublished(!quiz.isPublished());
            quizDao.save(quiz);
            return new ResponseEntity<>("Status Updated", HttpStatus.OK);
        }
        return new ResponseEntity<>("Quiz Not Found", HttpStatus.NOT_FOUND);
    }
}