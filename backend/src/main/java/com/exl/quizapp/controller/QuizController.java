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
public class QuizController {

    @Autowired
    QuizService quizService;


    @GetMapping("/exm")
    public String try3(){
        return "yes";
    }


    @PostMapping("create")
    public ResponseEntity<String> createQuiz(@RequestParam String category, @RequestParam int numQ, @RequestParam String title) {
        return quizService.createQuiz(category, numQ, title);
    }
    @GetMapping("get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id){
        return quizService.getQuizQuestions(id);

    }
    @PostMapping("/submit/{id}")
    public ResponseEntity<Integer> submitQuiz(@PathVariable Integer id , @RequestBody List<Response> responses){
        return quizService.calculateResult(id,responses);
    }

    @GetMapping("all")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Integer id) {
        return quizService.deleteQuiz(id);
    }
    @PutMapping("update/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Integer id,@RequestParam String title){
        return quizService.updateQuiz(id,title);
    }
}
