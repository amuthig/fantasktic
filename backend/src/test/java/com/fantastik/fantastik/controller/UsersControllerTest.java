package com.fantastik.fantastik.controller;

import com.fantastik.fantastik.model.Users;
import com.fantastik.fantastik.service.UsersService;
import com.fantastik.fantastik.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class UsersControllerTest {

    @Mock
    private UsersService usersService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UsersController usersController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateUser_Success() throws Exception {
        // Arrange
        Users newUser = new Users();
        newUser.setUsername("john_doe");
        newUser.setPassword("password123");
        newUser.setFirstName("John");
        newUser.setLastName("Doe");

        Users createdUser = new Users();
        createdUser.setId(1L);
        createdUser.setUsername("john_doe");
        createdUser.setPassword("password123");
        createdUser.setFirstName("John");
        createdUser.setLastName("Doe");

        // Simuler la création d'utilisateur
        when(usersService.createUser(any(Users.class))).thenReturn(createdUser);

        // Act: Appeler la méthode du contrôleur pour créer un utilisateur
        ResponseEntity<Users> response = usersController.createUser(newUser);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("john_doe", response.getBody().getUsername());
    }

    @Test
    void testGetAllUsers_Success() {
        // Arrange
        Users user1 = new Users();
        user1.setId(1L);
        user1.setUsername("john_doe");

        Users user2 = new Users();
        user2.setId(2L);
        user2.setUsername("jane_doe");

        // Simuler l'appel au service pour récupérer tous les utilisateurs
        when(usersService.getAllUsers()).thenReturn(Arrays.asList(user1, user2));

        // Act: Appeler la méthode du contrôleur pour récupérer tous les utilisateurs
        ResponseEntity<List<Users>> response = usersController.getAllUsers();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertEquals("john_doe", response.getBody().get(0).getUsername());
        assertEquals("jane_doe", response.getBody().get(1).getUsername());
    }

    @Test
    void testGetUserById_Success() {
        // Arrange
        Long userId = 1L;
        Users user = new Users();
        user.setId(userId);
        user.setUsername("john_doe");

        // Simuler l'appel au service pour récupérer un utilisateur par ID
        when(usersService.getUserById(userId)).thenReturn(Optional.of(user));

        // Act: Appeler la méthode du contrôleur pour récupérer un utilisateur par ID
        ResponseEntity<Users> response = usersController.getUserById(userId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("john_doe", response.getBody().getUsername());
    }

    @Test
    void testUpdateUser_Success() throws Exception {
        // Arrange
        Long userId = 1L;

        // Créer un utilisateur avec les nouvelles informations
        Users updatedUser = new Users();
        updatedUser.setId(userId);
        updatedUser.setUsername("john_doe_updated");
        updatedUser.setFirstName("John");
        updatedUser.setLastName("Doe");

        // Utilisateur existant
        Users existingUser = new Users();
        existingUser.setId(userId);
        existingUser.setUsername("john_doe");

        // Simuler l'appel au service pour récupérer l'utilisateur existant et le mettre
        // à jour
        when(usersService.getUserById(userId)).thenReturn(Optional.of(existingUser));
        when(usersService.updateUser(eq(userId), any(Users.class))).thenReturn(updatedUser);

        // Act: Appeler la méthode du contrôleur pour mettre à jour un utilisateur
        ResponseEntity<Users> response = usersController.updateUser(userId, updatedUser);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("john_doe_updated", response.getBody().getUsername());
    }

    @Test
    void testDeleteUser_Success() {
        // Arrange
        Long userId = 1L;

        // Act: Appeler la méthode du contrôleur pour supprimer un utilisateur
        ResponseEntity<Void> response = usersController.deleteUser(userId);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(usersService, times(1)).deleteUser(userId);
    }

}
