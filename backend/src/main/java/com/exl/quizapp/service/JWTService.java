package com.exl.quizapp.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map; // Import Map

@Service
public class JWTService {

    private static final String SECRET =
            "mysecretkeymysecretkeymysecretkey12"; // 32+ chars

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    // 1. Update signature to accept 'role'
    public String generateToken(String username, String role) {

        // 2. Add claims
        Map<String, Object> claims = Map.of("role", role);

        return Jwts.builder()
                .claims(claims) // Add custom claims
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token, String username) {
        return extractUsername(token).equals(username)
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiry = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();

        return expiry.before(new Date());
    }
}