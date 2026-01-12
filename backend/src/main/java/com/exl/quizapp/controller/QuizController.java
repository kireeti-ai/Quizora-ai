package com.exl.quizapp.controller;

import com.exl.quizapp.dao.UserRepo;
import com.exl.quizapp.model.*;
import com.exl.quizapp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    @Autowired
    QuizService quizService;

    @Autowired
    UserRepo userRepo;

    @PostMapping("create")
    public ResponseEntity<String> createQuiz(
            @RequestParam String category,
            @RequestParam int numQ,
            @RequestParam String title,
            @RequestParam int duration,
            @RequestParam int maxAttempts,
            Principal principal) { // Inject Principal to get logged-in user

        // Get the real user ID from the database using the username in the token
        Users user = userRepo.findByUsername(principal.getName());

        // Pass user.getId() instead of hardcoded 1L
        return quizService.createQuiz(category, numQ, title, duration, maxAttempts, user.getId());
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
    public ResponseEntity<Attempt> submitQuiz(@PathVariable Integer id , @RequestBody List<Response> responses, Principal principal){
        Users user = userRepo.findByUsername(principal.getName());
        return quizService.calculateResult(id, responses, user.getId());
    }

    @GetMapping("result/{id}")
    public ResponseEntity<Attempt> getResult(@PathVariable Long id) {
        return new ResponseEntity<>(quizService.getAttemptById(id), HttpStatus.OK);
    }

    @GetMapping("all")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    // --- NEW ENDPOINT: Get ONLY the logged-in faculty's quizzes ---
    @GetMapping("my-quizzes")
    public ResponseEntity<List<Quiz>> getMyQuizzes(Principal principal) {
        Users user = userRepo.findByUsername(principal.getName());
        return quizService.getQuizzesByFaculty(user.getId());
    }

    @PatchMapping("publish/{id}")
    public ResponseEntity<String> togglePublish(@PathVariable Integer id) {
        return quizService.togglePublish(id);
    }
}