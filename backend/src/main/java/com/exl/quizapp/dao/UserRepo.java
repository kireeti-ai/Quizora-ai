package com.exl.quizapp.dao;



import com.exl.quizapp.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<Users,Long> {

    Users findByUsername(String username);

}
