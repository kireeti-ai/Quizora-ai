package com.exl.quizapp.model;

import lombok.Data;
import java.util.List;

@Data
public class QuizStartResponse {
    private Integer quizId;
    private String title;
    private Integer duration; // in minutes
    private List<QuestionWrapper> questions;

    public QuizStartResponse(Integer quizId, String title, Integer duration, List<QuestionWrapper> questions) {
        this.quizId = quizId;
        this.title = title;
        this.duration = duration;
        this.questions = questions;
    }
}