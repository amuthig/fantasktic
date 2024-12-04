package com.fantastik.fantastik.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.test.context.SpringBootTest;

import com.fantastik.fantastik.model.Users;
import com.fantastik.fantastik.repository.UsersRepository;
import com.fantastik.fantastik.util.JwtUtil;

@SpringBootTest
public class UsersServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UsersService usersService;

    private Users user;

    @BeforeEach
    public void setUp() {
        // Initialisation d'un objet de test
        user = new Users();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("testuser@example.com");
        user.setPassword("password123");
        user.setFirstName("John");
        user.setLastName("Doe");
    }

    @Test
    public void testRegisterUser() {
        // Préparer le mock pour les méthodes
        when(passwordEncoder.encode(anyString())).thenReturn("password123");
        when(usersRepository.save(any(Users.class))).thenReturn(user);
        when(jwtUtil.generateToken(anyString())).thenReturn("mockToken");

        // Appeler la méthode registerUser
        String token = usersService.registerUser(user);

        // Vérifier que le mot de passe a été encodé
        verify(passwordEncoder, times(1)).encode(user.getPassword());

        // Vérifier que la méthode save() a bien été appelée
        verify(usersRepository, times(1)).save(user);

        // Vérifier que le token a été généré
        assertEquals("mockToken", token);
    }

    @Test
    public void testRegisterUser_DataIntegrityViolationException() {
        // Simuler une violation d'intégrité (nom d'utilisateur ou email déjà existants)
        when(passwordEncoder.encode(anyString())).thenReturn("password123");
        when(usersRepository.save(any(Users.class))).thenThrow(DataIntegrityViolationException.class);

        // Appeler la méthode registerUser et vérifier l'exception
        assertThrows(DataIntegrityViolationException.class, () -> {
            usersService.registerUser(user);
        });
    }

    @Test
    public void testCreateUser() {
        // Préparer le mock pour la méthode save()
        when(passwordEncoder.encode(anyString())).thenReturn("password123");
        when(usersRepository.save(any(Users.class))).thenReturn(user);

        // Appeler la méthode createUser
        Users createdUser = usersService.createUser(user);

        // Vérifier que le mot de passe a été encodé
        verify(passwordEncoder, times(1)).encode(user.getPassword());

        // Vérifier que la méthode save() a bien été appelée
        verify(usersRepository, times(1)).save(user);

        // Vérifier que l'utilisateur a bien été créé
        assertNotNull(createdUser);
        assertEquals("testuser", createdUser.getUsername());
    }

    @Test
    public void testGetAllUsers() {
        // Tester la méthode getAllUsers()
        when(usersRepository.findAll()).thenReturn(List.of(user));

        // Appeler la méthode
        var usersList = usersService.getAllUsers();

        // Vérifier que la méthode findAll() a été appelée
        verify(usersRepository, times(1)).findAll();

        // Vérifier que la liste des utilisateurs contient l'utilisateur créé
        assertEquals(1, usersList.size());
        assertEquals("testuser", usersList.get(0).getUsername());
    }

    @Test
    public void testGetUserById_Success() {
        // Tester la méthode getUserById() quand l'utilisateur existe
        when(usersRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<Users> retrievedUser = usersService.getUserById(1L);

        // Vérifier que la méthode findById() a été appelée
        verify(usersRepository, times(1)).findById(1L);

        // Vérifier que l'utilisateur a bien été trouvé
        assertTrue(retrievedUser.isPresent());
        assertEquals("testuser", retrievedUser.get().getUsername());
    }

    @Test
    public void testGetUserById_NotFound() {
        // Tester la méthode getUserById() quand l'utilisateur n'existe pas
        when(usersRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Users> retrievedUser = usersService.getUserById(1L);

        // Vérifier que l'utilisateur n'a pas été trouvé
        assertFalse(retrievedUser.isPresent());
    }

    @Test
    public void testGetUserByUsername_Success() {
        // Tester la méthode getUserByUsername() quand l'utilisateur existe
        when(usersRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        Optional<Users> retrievedUser = usersService.getUserByUsername("testuser");

        // Vérifier que la méthode findByUsername() a été appelée
        verify(usersRepository, times(1)).findByUsername("testuser");

        // Vérifier que l'utilisateur a bien été trouvé
        assertTrue(retrievedUser.isPresent());
        assertEquals("testuser", retrievedUser.get().getUsername());
    }

    @Test
    public void testGetUserByUsername_NotFound() {
        // Tester la méthode getUserByUsername() quand l'utilisateur n'existe pas
        when(usersRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        Optional<Users> retrievedUser = usersService.getUserByUsername("testuser");

        // Vérifier que l'utilisateur n'a pas été trouvé
        assertFalse(retrievedUser.isPresent());
    }

    @Test
    public void testUpdateUser_Success() {
        // Préparer le mock pour la méthode findById() et save()
        when(usersRepository.findById(1L)).thenReturn(Optional.of(user));
        when(usersRepository.save(any(Users.class))).thenReturn(user);

        // Modifier les détails de l'utilisateur
        user.setUsername("updatedUser");

        // Appeler la méthode updateUser
        Users updatedUser = usersService.updateUser(1L, user);

        // Vérifier que la méthode save() a bien été appelée
        verify(usersRepository, times(1)).save(user);

        // Vérifier que le nom d'utilisateur a bien été mis à jour
        assertEquals("updatedUser", updatedUser.getUsername());
    }

    @Test
    public void testUpdateUser_NotFound() {
        // Tester la mise à jour d'un utilisateur qui n'existe pas
        when(usersRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usersService.updateUser(1L, user);
        });

        // Vérifier qu'une exception est levée
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    public void testDeleteUser_Success() {
        // Préparer le mock pour la méthode findById() et delete()
        when(usersRepository.findById(1L)).thenReturn(Optional.of(user));

        // Appeler la méthode deleteUser
        usersService.deleteUser(1L);

        // Vérifier que la méthode delete() a bien été appelée
        verify(usersRepository, times(1)).delete(user);
    }

    @Test
    public void testDeleteUser_NotFound() {
        // Tester la suppression d'un utilisateur qui n'existe pas
        when(usersRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usersService.deleteUser(1L);
        });

        // Vérifier qu'une exception est levée
        assertEquals("User not found", exception.getMessage());
    }
}
