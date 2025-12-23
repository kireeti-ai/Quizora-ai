package com.exl.quizapp.controller;


import com.exl.quizapp.model.Users;
import com.exl.quizapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;
    @PostMapping("/register")
    public Users register(@RequestBody Users user){
        return userService.register(user);
    }
    @PostMapping("/login")
    public String login(@RequestBody Users user){
        return  userService.verify(user);
    }
    @GetMapping("/hello")
    public String greet() {
        return "Welcome! If you see this, you are logged in.";
    }

}
