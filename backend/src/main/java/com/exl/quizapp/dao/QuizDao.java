package com.exl.quizapp.dao;

import com.exl.quizapp.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizDao extends JpaRepository<Quiz, Integer> {
    boolean existsByCode(String code);
    List<Quiz> findByCreatedBy(Long createdBy);
}