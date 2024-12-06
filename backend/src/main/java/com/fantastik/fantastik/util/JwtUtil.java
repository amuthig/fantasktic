package com.fantastik.fantastik.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utility class for generating, parsing, and validating JWT tokens.
 */
@Component
public class JwtUtil {

    // Secret key used for signing and validating JWT tokens.
    private String SECRET_KEY = "qsdfhgjhefzYHGJUYKLDSGFHJKLANTOINEMUTHIGYJOMASDUBOISeffezfefezdzdzdzdzzdzdzfsdlfsekjfzeopfijqzsdfngfbv";

    /**
     * Extracts the username (subject) from a JWT token.
     *
     * @param token The JWT token.
     * @return The username (subject) contained in the token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the expiration date from a JWT token.
     *
     * @param token The JWT token.
     * @return The expiration date of the token.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from a JWT token using a resolver function.
     *
     * @param token          The JWT token.
     * @param claimsResolver A function to resolve the desired claim.
     * @param <T>            The type of the claim.
     * @return The extracted claim.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Parses the JWT token and retrieves all claims.
     *
     * @param token The JWT token.
     * @return All claims contained in the token.
     */
    public Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    /**
     * Checks if a JWT token has expired.
     *
     * @param token The JWT token.
     * @return True if the token has expired, false otherwise.
     */
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Generates a JWT token for a specific username.
     *
     * @param username The username to associate with the token.
     * @return The generated JWT token.
     */
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>(); // No additional claims.
        return createToken(claims, username);
    }

    /**
     * Creates a JWT token with claims and a subject.
     *
     * @param claims  The claims to include in the token.
     * @param subject The subject (e.g., username) of the token.
     * @return The generated JWT token.
     */
    public String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims) // Include additional claims.
                .setSubject(subject) // Set the subject of the token.
                .setIssuedAt(new Date(System.currentTimeMillis())) // Set the issue time.
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Set expiration (10 hours).
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // Sign with the secret key.
                .compact(); // Return the compact token.
    }

    /**
     * Validates a JWT token by checking the username and expiration date.
     *
     * @param token    The JWT token.
     * @param username The expected username.
     * @return True if the token is valid, false otherwise.
     */
    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}
