package com.exl.quizapp.service;

import com.exl.quizapp.dao.QuestionDao;
import com.exl.quizapp.model.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    @Autowired
    QuestionDao questionDao;

    // UPDATED: Now fetches only the logged-in user's questions
    public ResponseEntity<List<Question>> getQuestionsByFaculty(Long userId){
        try {
            return new ResponseEntity<>(questionDao.findByCreatedBy(userId), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<List<Question>> getQuestionsByCategory(String category){
        try{
            return new ResponseEntity<>(questionDao.findByCategory(category), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    // UPDATED: Accepts userId for Batch Import (AI Generator)
    public ResponseEntity<String> addQuestions(List<Question> questions, Long userId) {
        try{
            // Set the owner for every question in the list
            for(Question q : questions) {
                q.setCreatedBy(userId);
            }
            questionDao.saveAll(questions);
            return new ResponseEntity<>("Success: Added " + questions.size() + " questions", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed to add questions", HttpStatus.BAD_REQUEST);
    }

    // UPDATED: Accepts userId for Manual Add
    public ResponseEntity<String> addQuestion(Question question, Long userId) {
        try{
            if (question.getQuestionTitle() == null || question.getQuestionTitle().trim().isEmpty()) {
                return new ResponseEntity<>("Question title is required", HttpStatus.BAD_REQUEST);
            }
            // Set Owner
            question.setCreatedBy(userId);

            questionDao.save(question);
            return new ResponseEntity<>("success", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed to add question", HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> updateQuestion(Integer id, Question question) {
        try{
            Optional<Question> existingQuestion = questionDao.findById(id);
            if (existingQuestion.isEmpty()) {
                return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
            }
            // Preserve the original creator
            question.setCreatedBy(existingQuestion.get().getCreatedBy());
            question.setId(id);

            questionDao.save(question);
            return new ResponseEntity<>("Question updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed to update question", HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> deleteQuestion(Integer id) {
        try{
            Optional<Question> existingQuestion = questionDao.findById(id);
            if (existingQuestion.isEmpty()) {
                return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
            }
            questionDao.deleteById(id);
            return new ResponseEntity<>("Question deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("Failed to delete question", HttpStatus.BAD_REQUEST);
    }
}