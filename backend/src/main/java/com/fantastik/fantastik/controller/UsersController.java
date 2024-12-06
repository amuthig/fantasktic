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

    /**
     * Create a new user.
     * 
     * @param user The user object containing user details.
     * @return ResponseEntity with the created user and HTTP status code.
     */
    @PostMapping
    public ResponseEntity<Users> createUser(@RequestBody Users user) {
        // Validate that the username and password are not null or empty.
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // Create the new user and return it in the response.
        Users newUser = usersService.createUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    /**
     * Retrieve all users.
     * 
     * @return ResponseEntity with a list of all users and HTTP status code.
     */
    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        // Fetch all users from the service layer.
        List<Users> users = usersService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    /**
     * Retrieve a user by their ID.
     * 
     * @param id The ID of the user to retrieve.
     * @return ResponseEntity with the user or a 404 status if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        // Fetch the user by ID. Return 404 if the user does not exist.
        Optional<Users> user = usersService.getUserById(id);
        return user.map(u -> new ResponseEntity<>(u, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Update an existing user.
     * 
     * @param id          The ID of the user to update.
     * @param userDetails The new details to update the user with.
     * @return ResponseEntity with the updated user or a 404 status if not found.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Users> updateUser(@PathVariable Long id, @RequestBody Users userDetails) {
        // Fetch the user to update. Return 404 if the user does not exist.
        Optional<Users> existingUser = usersService.getUserById(id);
        if (!existingUser.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Update user properties if provided in the request.
        if (userDetails.getUsername() != null && !userDetails.getUsername().isEmpty()) {
            existingUser.get().setUsername(userDetails.getUsername());
        }
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            existingUser.get().setPassword(userDetails.getPassword());
        }
        if (userDetails.getFirstName() != null) {
            existingUser.get().setFirstName(userDetails.getFirstName());
        }
        if (userDetails.getLastName() != null) {
            existingUser.get().setLastName(userDetails.getLastName());
        }

        // Save the updated user and return the result.
        Users updatedUser = usersService.updateUser(id, existingUser.get());
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    /**
     * Delete a user by their ID.
     * 
     * @param id The ID of the user to delete.
     * @return ResponseEntity with no content and HTTP status 204.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // Delete the user by ID. No content is returned.
        usersService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Retrieve the current user based on the provided JWT token.
     * 
     * @param token The JWT token from the Authorization header.
     * @return ResponseEntity with the current user or a 404 status if not found.
     */
    @GetMapping("/current")
    public ResponseEntity<Users> getCurrentUser(@RequestHeader("Authorization") String token) {
        // Extract the username from the JWT token.
        String username = jwtUtil.extractUsername(token.substring(7)); // Token is assumed to start with "Bearer "
        // Fetch the user by username. Return 404 if the user does not exist.
        Optional<Users> user = usersService.getUserByUsername(username);
        return user.map(u -> new ResponseEntity<>(u, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
