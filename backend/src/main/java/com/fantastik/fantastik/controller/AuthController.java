package com.fantastik.fantastik.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.fantastik.fantastik.model.Users;
import com.fantastik.fantastik.service.UsersService;
import com.fantastik.fantastik.util.JwtUtil;

import java.util.Optional;

/**
 * Authentication Controller for handling user signup and login requests.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // Allow CORS for the frontend
public class AuthController {

    @Autowired
    private UsersService userService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Handles user signup requests.
     * 
     * @param user The user details to register.
     * @return ResponseEntity with a JWT token or an error message.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Users user) {
        try {
            // Register the user and generate a JWT token
            String token = userService.registerUser(user);
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (DataIntegrityViolationException ex) {
            // Return conflict status if username or email already exists
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    /**
     * Handles user login requests.
     * 
     * @param user The user credentials.
     * @return ResponseEntity with a JWT token or an error message.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users user) {
        // Retrieve user by username
        Optional<Users> existingUser = userService.getUserByUsername(user.getUsername());
        if (existingUser.isPresent()
                && new BCryptPasswordEncoder().matches(user.getPassword(), existingUser.get().getPassword())) {
            // Generate a JWT token if credentials are valid
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        }
        // Return unauthorized status if credentials are invalid
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}

/**
 * AuthResponse class for encapsulating JWT tokens in responses.
 */
class AuthResponse {
    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
