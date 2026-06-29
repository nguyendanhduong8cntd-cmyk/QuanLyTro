package com.goldenboat.quanlytro.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@Slf4j
public class JwtTokenProvider {

    private final SecretKey key;
    private final long accessTokenExpirationMs;
    private final long refreshTokenExpirationMs;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-expiration-ms}") long accessTokenExpirationMs,
            @Value("${app.jwt.refresh-token-expiration-ms}") long refreshTokenExpirationMs) {
        this.key = buildKey(secret);
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    private SecretKey buildKey(String secret) {
        byte[] keyBytes;
        try {
            // Uu tien giai ma base64; neu khong phai base64 thi dung byte tho
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (Exception e) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenExpirationMs);
        return Jwts.builder()
                .subject(String.valueOf(principal.getId()))
                .claim("username", principal.getUsername())
                .claim("role", principal.getRole().name())
                .claim("type", "ACCESS")
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + refreshTokenExpirationMs);
        return Jwts.builder()
                .subject(String.valueOf(principal.getId()))
                .claim("type", "REFRESH")
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public Integer getUserIdFromToken(String token) {
        Claims claims = parseClaims(token);
        return Integer.valueOf(claims.getSubject());
    }

    public String getTokenType(String token) {
        return parseClaims(token).get("type", String.class);
    }

    public long getAccessTokenExpirationMs() {
        return accessTokenExpirationMs;
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("JWT khong hop le: {}", e.getMessage());
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
