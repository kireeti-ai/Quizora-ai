package com.exl.quizapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send OTP email to user
     */
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Quizora - Your OTP Code");
            message.setText(
                    "Hello,\n\n" +
                    "Your OTP code for login is: " + otp + "\n\n" +
                    "This code will expire in 5 minutes.\n\n" +
                    "If you did not request this code, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "Quizora Team"
            );

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }
}
