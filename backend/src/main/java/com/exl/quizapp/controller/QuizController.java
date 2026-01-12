package com.exl.quizapp.controller;

import com.exl.quizapp.model.*;
import com.exl.quizapp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    @GetMapping("code/{code}")
    public ResponseEntity<QuizStartResponse> getQuizByCode(@PathVariable String code){
        return quizService.getQuizByCode(code);
    }

    @PostMapping("submit/{id}")
    public ResponseEntity<Attempt> submitQuiz(@PathVariable Integer id , @RequestBody List<Response> responses, long userId){
        return quizService.calculateResult(id, responses,userId);
    }
    @GetMapping("result/{id}")
    public ResponseEntity<Attempt> getResult(@PathVariable Long id) {
        // You might want to move this logic to Service, but this is fine for now
        return new ResponseEntity<>(

                quizService.getAttemptById(id),
                HttpStatus.OK
        );
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