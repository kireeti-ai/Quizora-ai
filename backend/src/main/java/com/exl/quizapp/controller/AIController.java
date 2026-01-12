package com.exl.quizapp.controller;

import com.exl.quizapp.dao.UserRepo;
import com.exl.quizapp.model.Question;
import com.exl.quizapp.model.Users;
import com.exl.quizapp.service.AIService;
import com.exl.quizapp.service.PdfService;
import com.exl.quizapp.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private AIService aiService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserRepo userRepo; // Inject UserRepo

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuestions(
            @RequestParam("file") MultipartFile file,
            @RequestParam("topic") String topic,
            @RequestParam("difficulty") String difficulty,
            @RequestParam("count") int count,
            Principal principal // Get the User!
    ) {
        try {
            Users user = userRepo.findByUsername(principal.getName());
            String contextText = pdfService.extractTextFromPdf(file);
            List<Question> generatedQuestions = aiService.generateQuestions(contextText, topic, difficulty, count);

            questionService.addQuestions(generatedQuestions, user.getId());

            return ResponseEntity.ok(generatedQuestions);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}