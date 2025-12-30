package com.exl.quizapp.controller;

import com.exl.quizapp.model.QuestionWrapper;
import com.exl.quizapp.model.Quiz;
import com.exl.quizapp.model.Response;
import com.exl.quizapp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    @Autowired
    QuizService quizService;

    @PostMapping("create")
    public ResponseEntity<String> createQuiz(@RequestParam String category, @RequestParam int numQ, @RequestParam String title, @RequestParam int duration, @RequestParam int maxAttempts) {
        return quizService.createQuiz(category, numQ, title, duration, maxAttempts);
    }

    @GetMapping("get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id){
        return quizService.getQuizQuestions(id);
    }

    @PostMapping("submit/{id}")
    public ResponseEntity<Integer> submitQuiz(@PathVariable Integer id , @RequestBody List<Response> responses){
        return quizService.calculateResult(id, responses);
    }

    @GetMapping("all")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("faculty/{id}")
    public ResponseEntity<List<Quiz>> getFacultyQuizzes(@PathVariable Long id) {
        return quizService.getQuizzesByFaculty(id);
    }

    @PatchMapping("publish/{id}")
    public ResponseEntity<String> togglePublish(@PathVariable Integer id) {
        return quizService.togglePublish(id);
    }
}