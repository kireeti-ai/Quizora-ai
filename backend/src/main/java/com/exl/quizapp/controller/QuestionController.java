package com.exl.quizapp.controller;

import com.exl.quizapp.dao.UserRepo;
import com.exl.quizapp.model.Question;
import com.exl.quizapp.model.Users;
import com.exl.quizapp.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("question")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {
    @Autowired
    QuestionService questionService;

    @Autowired
    UserRepo userRepo;

    // UPDATED: Renamed to 'my-questions' and uses Principal
    @GetMapping("my-questions")
    public ResponseEntity<List<Question>> getMyQuestions(Principal principal){
        Users user = userRepo.findByUsername(principal.getName());
        return questionService.getQuestionsByFaculty(user.getId());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Question>> getQuestionByCategory(@PathVariable String category){
        return questionService.getQuestionsByCategory(category);
    }

    // UPDATED: Uses Principal for batch add (AI uses this usually, or manual bulk)
    @PostMapping("add-batch")
    public ResponseEntity<String> addQuestions(@RequestBody List<Question> questions, Principal principal) {
        Users user = userRepo.findByUsername(principal.getName());
        return questionService.addQuestions(questions, user.getId());
    }

    // UPDATED: Uses Principal for single add
    @PostMapping("add")
    public ResponseEntity<String> addQuestion(@RequestBody Question question, Principal principal){
        Users user = userRepo.findByUsername(principal.getName());
        return questionService.addQuestion(question, user.getId());
    }

    @PutMapping("update/{id}")
    public ResponseEntity<String> updateQuestion(@PathVariable Integer id, @RequestBody Question question){
        return questionService.updateQuestion(id, question);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Integer id){
        return questionService.deleteQuestion(id);
    }
}