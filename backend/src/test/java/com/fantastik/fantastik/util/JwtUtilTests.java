package com.fantastik.fantastik.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
    }

    @Test
    void testGenerateToken() {
        String username = "testUser";
        String token = jwtUtil.generateToken(username);

        assertNotNull(token, "Token should not be null");
        assertTrue(token.startsWith("eyJ"), "Token should be a valid JWT");
    }

    @Test
    void testExtractUsername() {
        String username = "testUser";
        String token = jwtUtil.generateToken(username);

        String extractedUsername = jwtUtil.extractUsername(token);

        assertEquals(username, extractedUsername, "Extracted username should match the provided username");
    }

    @Test
    void testExtractExpiration() {
        String token = jwtUtil.generateToken("testUser");

        Date expiration = jwtUtil.extractExpiration(token);

        assertNotNull(expiration, "Expiration should not be null");
        assertTrue(expiration.after(new Date()), "Expiration should be after current time");
    }

    @Test
    void testValidateToken() {
        String username = "testUser";
        String token = jwtUtil.generateToken(username);

        boolean isValid = jwtUtil.validateToken(token, username);

        assertTrue(isValid, "Token should be valid when username matches and the token is not expired");
    }

    @Test
    void testValidateTokenWithIncorrectUsername() {
        String validUsername = "testUser";
        String invalidUsername = "wrongUser";
        String token = jwtUtil.generateToken(validUsername);

        boolean isValid = jwtUtil.validateToken(token, invalidUsername);

        assertFalse(isValid, "Token should be invalid when username does not match");
    }

    @Test
    void testIsTokenExpired() {
        String token = jwtUtil.generateToken("testUser");

        boolean isExpired = jwtUtil.isTokenExpired(token);

        assertFalse(isExpired, "Token should not be expired immediately after generation");
    }

    @Test
    void testExtractAllClaims() {
        String token = jwtUtil.generateToken("testUser");

        Claims claims = jwtUtil.extractAllClaims(token);

        assertNotNull(claims, "Claims should not be null");
        assertEquals("testUser", claims.getSubject(), "Subject in claims should match the username");
    }

    @Test
    void testCreateToken() {
        Map<String, Object> claims = new HashMap<>();
        String subject = "testUser";

        String token = jwtUtil.createToken(claims, subject);

        assertNotNull(token, "Token should not be null");
        assertTrue(token.startsWith("eyJ"), "Token should be a valid JWT");
    }
}
