package com.exl.quizapp.service;

import com.exl.quizapp.dao.UserRepo;
import com.exl.quizapp.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    public Users register(Users user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public String verify(Users user) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                user.getPassword()
                        )
                );

        if (authentication.isAuthenticated()) {
            // 1. Fetch the full user object from DB to get the role
            Users dbUser = userRepo.findByUsername(user.getUsername());

            // 2. Pass username AND role to the token generator
            // Default to "STUDENT" if role is null to prevent errors
            String role = (dbUser.getRole() != null) ? dbUser.getRole() : "STUDENT";

            return jwtService.generateToken(user.getUsername(), role);
        }

        throw new RuntimeException("Invalid credentials");
    }
}