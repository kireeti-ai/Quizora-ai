package com.exl.quizapp.service;

import com.exl.quizapp.dao.UserRepo;
import com.exl.quizapp.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EncryptionService encryptionService;

    public Users register(Users user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Encrypt email before saving
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            user.setEmail(encryptionService.encrypt(user.getEmail()));
        }
        
        return userRepo.save(user);
    }

    public Map<String, Object> verify(Users user) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                user.getPassword()
                        )
                );

        Map<String, Object> response = new HashMap<>();

        if (authentication.isAuthenticated()) {
            // Fetch the full user object from DB
            Users dbUser = userRepo.findByUsername(user.getUsername());

            // Generate OTP
            String otp = otpService.generateOtp(user.getUsername());

            // Send OTP to user's email (username is used as email)
            String userEmail = user.getUsername();
            try {
                emailService.sendOtpEmail(userEmail, otp);
                
                response.put("otpRequired", true);
                response.put("message", "OTP sent to your email");
                response.put("email", user.getUsername());
            } catch (Exception e) {
                // If email sending fails, log the error and fail authentication
                // NOTE: For development/testing, you may temporarily want to display the OTP,
                // but this should NEVER be done in production as it bypasses email verification
                System.err.println("Failed to send OTP email: " + e.getMessage());
                throw new RuntimeException("Failed to send OTP. Please check email configuration.");
            }

            return response;
        }

        throw new RuntimeException("Invalid credentials");
    }

    public String verifyOtp(String email, String otp) {
        // Validate OTP
        if (!otpService.validateOtp(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // Fetch user
        Users dbUser = userRepo.findByUsername(email);
        if (dbUser == null) {
            throw new RuntimeException("User not found");
        }

        // Generate JWT token
        String role = (dbUser.getRole() != null) ? dbUser.getRole() : "STUDENT";
        return jwtService.generateToken(email, role);
    }

    public Map<String, Object> getUserProfile(String username) {
        Users user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("name", user.getName());
        profile.put("role", user.getRole());
        
        // Decrypt email if it exists
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            try {
                profile.put("email", encryptionService.decrypt(user.getEmail()));
            } catch (Exception e) {
                profile.put("email", user.getUsername()); // fallback to username
            }
        } else {
            profile.put("email", user.getUsername());
        }

        return profile;
    }
}