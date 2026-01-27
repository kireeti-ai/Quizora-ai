package com.exl.quizapp.controller;


import com.exl.quizapp.model.Users;
import com.exl.quizapp.service.QrCodeService;
import com.exl.quizapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private QrCodeService qrCodeService;

    @PostMapping("/register")
    public Users register(@RequestBody Users user){
        return userService.register(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Users user){
        return userService.verify(user);
    }

    @PostMapping("/verify-otp")
    public Map<String, String> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        String token = userService.verifyOtp(email, otp);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }

    @GetMapping("/api/user/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Map<String, Object> profile = userService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/api/user/qr-code")
    public ResponseEntity<Map<String, String>> getQrCode() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Map<String, Object> profile = userService.getUserProfile(username);
        String userId = profile.get("id").toString();

        // Generate QR code with user ID
        String qrCodeBase64 = qrCodeService.generateQrCode("USER_ID:" + userId);

        Map<String, String> response = new HashMap<>();
        response.put("qrCode", qrCodeBase64);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hello")
    public String greet() {
        return "welcome you are logged in.";
    }

}
