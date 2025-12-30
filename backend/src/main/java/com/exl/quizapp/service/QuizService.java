package com.exl.quizapp.service;

import com.exl.quizapp.dao.QuestionDao;
import com.exl.quizapp.dao.QuizDao;
import com.exl.quizapp.model.Question;
import com.exl.quizapp.model.QuestionWrapper;
import com.exl.quizapp.model.Quiz;
import com.exl.quizapp.model.Response;
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

    public ResponseEntity<String> createQuiz(String category, int numQ, String title, int duration, int maxAttempts) {
        List<Question> questions = questionDao.findByCategory(category);
        if(questions.size() > numQ){
            questions = questions.subList(0, numQ);
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setQuestions(questions);
        quiz.setDuration(duration);
        quiz.setMaxAttempts(maxAttempts);
        quiz.setCode(generateQuizCode());
        quiz.setCreatedBy(1L);
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

    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {
        Quiz quiz = quizDao.findById(id).get();
        List<Question> questions = quiz.getQuestions();
        int right = 0;
        int i = 0;
        for(Response response : responses){
            if(response.getResponse().equals(questions.get(i).getRightAnswer()))
                right++;

            i++;
        }
        return new ResponseEntity<>(right, HttpStatus.OK);
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