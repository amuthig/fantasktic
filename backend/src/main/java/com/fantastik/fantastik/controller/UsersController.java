package com.fantastik.fantastik.controller;

import com.fantastik.fantastik.model.Users;
import com.fantastik.fantastik.service.UsersService;
import com.fantastik.fantastik.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtUtil jwtUtil;

    // CREATE
    @PostMapping
    public ResponseEntity<Users> createUser(@RequestBody Users user) {
        Users newUser = usersService.createUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    // READ - Get all users
    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> users = usersService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // READ - Get a user by ID
    @GetMapping("/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        Optional<Users> user = usersService.getUserById(id);
        return user.map(u -> new ResponseEntity<>(u, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Users> updateUser(@PathVariable Long id, @RequestBody Users userDetails) {
        Users updatedUser = usersService.updateUser(id, userDetails);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        usersService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // READ - Get the current user
    @GetMapping("/current")
    public ResponseEntity<Users> getCurrentUser(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7)); // Supposons que le token commence par "Bearer "
        Optional<Users> user = usersService.getUserByUsername(username);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
