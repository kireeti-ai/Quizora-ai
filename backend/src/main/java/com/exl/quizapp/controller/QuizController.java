package com.exl.quizapp.controller;

import com.exl.quizapp.dao.UserRepo; // Import UserRepo
import com.exl.quizapp.model.*;
import com.exl.quizapp.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal; // Import Principal
import java.util.List;

@RestController
@RequestMapping("quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    @Autowired
    QuizService quizService;

    @Autowired
    UserRepo userRepo; // Inject UserRepo to find user by username

    @PostMapping("create")
    public ResponseEntity<String> createQuiz(@RequestParam String category, @RequestParam int numQ, @RequestParam String title, @RequestParam int duration, @RequestParam int maxAttempts) {
        return quizService.createQuiz(category, numQ, title, duration, maxAttempts);
    }

    @GetMapping("get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id){
        return quizService.getQuizQuestions(id);
    }

    // FIX #1: Get User from Token (Principal)
    @GetMapping("code/{code}")
    public ResponseEntity<QuizStartResponse> getQuizByCode(@PathVariable String code, Principal principal){
        Users user = userRepo.findByUsername(principal.getName());
        return quizService.getQuizByCode(code, user.getId());
    }

    // FIX #1: Get User from Token (Principal)
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

    @GetMapping("faculty/{id}")
    public ResponseEntity<List<Quiz>> getFacultyQuizzes(@PathVariable Long id) {
        return quizService.getQuizzesByFaculty(id);
    }

    @PatchMapping("publish/{id}")
    public ResponseEntity<String> togglePublish(@PathVariable Integer id) {
        return quizService.togglePublish(id);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Integer id){
        return quizService.deleteQuiz(id);
    }

    // FIX #1: Get User from Token (Principal) & Removed {userId} from URL
    @GetMapping("attempts/student")
    public ResponseEntity<List<Attempt>> getStudentAttempts(Principal principal){
        Users user = userRepo.findByUsername(principal.getName());
        return quizService.getStudentAttempts(user.getId());
    }

    @GetMapping("attempts/quiz/{quizId}")
    public ResponseEntity<List<Attempt>> getQuizAttempts(@PathVariable Integer quizId){
        return quizService.getQuizAttempts(quizId);
    }
}