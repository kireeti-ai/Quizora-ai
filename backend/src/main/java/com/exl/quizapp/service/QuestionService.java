package com.exl.quizapp.service;

import com.exl.quizapp.model.Question;
import com.exl.quizapp.dao.QuestionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {
    @Autowired
    QuestionDao questionDao;


    public ResponseEntity<List<Question>> getAllQuestions(){
        try {
            return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);

    }
    public ResponseEntity<List<Question>> getQuestionsByCategory(String category){
        try{
        return  new ResponseEntity<>(questionDao.findByCategory(category),HttpStatus.OK );
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);


    }

    public ResponseEntity<String> addQuestions(List<Question> questions) {
        try{
        questionDao.saveAll(questions);
        return new ResponseEntity<>("Success: Added " + questions.size() + " questions",HttpStatus.CREATED);}
        catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed to add questions", HttpStatus.BAD_REQUEST);

    }

    public ResponseEntity<String> addQuestion(Question question) {
        try{
        questionDao.save(question);
        return  new ResponseEntity<>("success",HttpStatus.CREATED);}
         catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed to add questions", HttpStatus.BAD_REQUEST);
    }
}
