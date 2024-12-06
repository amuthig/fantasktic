package com.fantastik.fantastik.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fantastik.fantastik.model.Users;
import com.fantastik.fantastik.repository.UsersRepository;
import com.fantastik.fantastik.util.JwtUtil;

/**
 * Service for managing user accounts.
 * Provides methods for CRUD operations and user registration with JWT token
 * generation.
 */
@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository; // Repository for interacting with user data.

    @Autowired
    private PasswordEncoder passwordEncoder; // Encoder for hashing user passwords.

    @Autowired
    private JwtUtil jwtUtil; // Utility for generating JWT tokens.

    /**
     * Registers a new user, encrypting their password and generating a JWT token.
     *
     * @param user The user to register.
     * @return A JWT token for the registered user.
     * @throws DataIntegrityViolationException If the username or email already
     *                                         exists.
     */
    public String registerUser(Users user) {
        try {
            // Encrypt the user's password before saving.
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            usersRepository.save(user);
            // Generate a JWT token for the registered user.
            return jwtUtil.generateToken(user.getUsername());
        } catch (DataIntegrityViolationException ex) {
            // Handle unique constraint violations on username or email.
            throw new DataIntegrityViolationException("Nom d'utilisateur ou email existe déjà.");
        }
    }

    /**
     * CREATE: Adds a new user to the system.
     *
     * @param user The user to add.
     * @return The saved user.
     */
    public Users createUser(Users user) {
        // Encrypt the user's password before saving.
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return usersRepository.save(user);
    }

    /**
     * READ: Retrieves all users in the system.
     *
     * @return A list of all users.
     */
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    /**
     * READ: Retrieves a user by their ID.
     *
     * @param id The ID of the user.
     * @return The user wrapped in an Optional, or an empty Optional if not found.
     */
    public Optional<Users> getUserById(Long id) {
        return usersRepository.findById(id);
    }

    /**
     * READ: Retrieves a user by their username.
     *
     * @param username The username of the user.
     * @return The user wrapped in an Optional, or an empty Optional if not found.
     */
    public Optional<Users> getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    /**
     * UPDATE: Updates the details of an existing user.
     *
     * @param id          The ID of the user to update.
     * @param userDetails The new details for the user.
     * @return The updated user.
     * @throws RuntimeException If the user with the specified ID is not found.
     */
    public Users updateUser(Long id, Users userDetails) {
        // Retrieve the user or throw an exception if not found.
        Users user = usersRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        // Update user details.
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());

        // Update password if provided, after encrypting it.
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return usersRepository.save(user); // Save and return the updated user.
    }

    /**
     * DELETE: Removes a user by their ID.
     *
     * @param id The ID of the user to delete.
     * @throws RuntimeException If the user with the specified ID is not found.
     */
    public void deleteUser(Long id) {
        // Retrieve the user or throw an exception if not found.
        Users user = usersRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        usersRepository.delete(user); // Delete the user from the database.
    }
}
