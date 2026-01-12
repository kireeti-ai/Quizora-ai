package com.exl.quizapp.dao;

import com.exl.quizapp.model.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttemptDao extends JpaRepository<Attempt, Long> {
    List<Attempt> findByUserId(Long userId);
    List<Attempt> findByQuizId(Integer quizId);
    int countByUserIdAndQuizId(Long userId, Integer quizId);
}