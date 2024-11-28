package com.fantastik.fantastik.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.fantastik.fantastik.model.Users;
import com.fantastik.fantastik.service.UsersService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsersService userService;

    @PostMapping("/signup")
    public Users signUp(@RequestBody Users user) {
        return userService.registerUser(user);
    }

    @PostMapping("/signin")
    public Users signIn(@RequestBody Users user) {
        Optional<Users> existingUser = userService.getUserByUsername(user.getUsername());
        if (existingUser.isPresent()
                && new BCryptPasswordEncoder().matches(user.getPassword(), existingUser.get().getPassword())) {
            return existingUser.get();
        }
        throw new RuntimeException("Invalid credentials");
    }
}