package com.exl.quizapp.service;


import com.exl.quizapp.dao.UserRepo;
import com.exl.quizapp.model.UserPrinicipal;
import com.exl.quizapp.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;



@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepo userRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users =  userRepo.findByUsername(username);
        if(users==null){
            System.out.println("Not found");
            throw new UsernameNotFoundException("not found");
        }
        return new UserPrinicipal(users);
    }
}
