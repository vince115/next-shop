// backend/src/main/java/com/nextshop/backend/auth/dto/RefreshTokenService.java

package com.nextshop.backend.auth;

import com.nextshop.backend.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshTokenSeconds;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${jwt.refresh-token-seconds:604800}") long refreshTokenSeconds
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenSeconds = refreshTokenSeconds;
    }

    public RefreshToken create(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(generateToken());
        refreshToken.setExpiresAt(Instant.now().plusSeconds(refreshTokenSeconds));
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken rotate(RefreshToken existing) {
        RefreshToken replacement = create(existing.getUser());
        refreshTokenRepository.delete(existing);
        return replacement;
    }

    public RefreshToken validate(String tokenValue) {
        String trimmed = tokenValue == null ? null : tokenValue.trim();
        System.out.println("REFRESH TOKEN INPUT: [" + trimmed + "]");

        RefreshToken refreshToken = refreshTokenRepository.findByTokenWithUser(trimmed)
                .orElseThrow(() -> {
                    System.out.println("REFRESH TOKEN: not found in DB");
                    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
                });

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            System.out.println("REFRESH TOKEN: expired at " + refreshToken.getExpiresAt());
            refreshTokenRepository.delete(refreshToken);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        System.out.println("REFRESH TOKEN: valid, user=" + refreshToken.getUser().getEmail());
        return refreshToken;
    }

    public void delete(String tokenValue) {
        if (tokenValue == null || tokenValue.isBlank()) {
            return;
        }

        refreshTokenRepository.findByToken(tokenValue)
                .ifPresent(refreshTokenRepository::delete);
    }

    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    private String generateToken() {
        byte[] bytes = new byte[48];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
