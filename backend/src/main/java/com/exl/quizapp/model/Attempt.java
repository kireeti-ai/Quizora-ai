package com.exl.quizapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Attempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;    // The ID of the student
    private Integer quizId; // The ID of the quiz taken
    private Integer score;  // The score obtained
    private Integer totalQuestions; // Max possible score

    private LocalDateTime timestamp;

    public Attempt() {
        this.timestamp = LocalDateTime.now();
    }

    public Attempt(Long userId, Integer quizId, Integer score, Integer totalQuestions) {
        this.userId = userId;
        this.quizId = quizId;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.timestamp = LocalDateTime.now();
    }
}