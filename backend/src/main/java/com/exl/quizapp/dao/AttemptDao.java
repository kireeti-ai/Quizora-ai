package com.exl.quizapp.dao;

import com.exl.quizapp.model.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttemptDao extends JpaRepository<Attempt, Long> {
    // Fetch all attempts for a specific student (for Student Dashboard)
    List<Attempt> findByUserId(Long userId);

    // Fetch all attempts for a specific quiz (for Faculty Analytics)
    List<Attempt> findByQuizId(Integer quizId);
}