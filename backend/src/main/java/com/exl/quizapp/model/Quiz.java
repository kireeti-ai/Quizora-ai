package com.exl.quizapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @ManyToMany
    private List<Question> questions;

    private Long createdBy;
    private String code;
    private boolean isPublished = false;
    private Integer duration;
    private Integer maxAttempts;
}