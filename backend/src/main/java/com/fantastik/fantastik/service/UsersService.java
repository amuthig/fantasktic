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

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String registerUser(Users user) {
        try {
            // Chiffrer le mot de passe
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            usersRepository.save(user);
            // Générer un token JWT
            return jwtUtil.generateToken(user.getUsername());
        } catch (DataIntegrityViolationException ex) {
            throw new DataIntegrityViolationException("Nom d'utilisateur ou email existe déjà.");
        }
    }

    /**
     * CREATE: Ajouter un nouvel utilisateur.
     *
     * @param user L'utilisateur à ajouter.
     * @return L'utilisateur ajouté.
     */
    public Users createUser(Users user) {
        // Encoder le mot de passe avant d'enregistrer l'utilisateur
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return usersRepository.save(user);
    }

    /**
     * READ: Récupérer tous les utilisateurs.
     *
     * @return La liste des utilisateurs.
     */
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    /**
     * READ: Récupérer un utilisateur par son ID.
     *
     * @param id L'ID de l'utilisateur.
     * @return L'utilisateur trouvé ou une exception si introuvable.
     */
    public Optional<Users> getUserById(Long id) {
        return usersRepository.findById(id);
    }

    /**
     * READ: Récupérer un utilisateur par son username.
     *
     * @param username Le nom d'utilisateur.
     * @return L'utilisateur trouvé ou une exception si introuvable.
     */
    public Optional<Users> getUserByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    /**
     * UPDATE: Mettre à jour les informations d'un utilisateur.
     *
     * @param id          L'ID de l'utilisateur à mettre à jour.
     * @param userDetails Les nouvelles informations de l'utilisateur.
     * @return L'utilisateur mis à jour.
     */
    public Users updateUser(Long id, Users userDetails) {
        Users user = usersRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        return usersRepository.save(user);
    }

    /**
     * DELETE: Supprimer un utilisateur par son ID.
     *
     * @param id L'ID de l'utilisateur à supprimer.
     */
    public void deleteUser(Long id) {
        Users user = usersRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        usersRepository.delete(user);
    }
}