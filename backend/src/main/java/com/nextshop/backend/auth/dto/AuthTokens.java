// backend/src/main/java/com/nextshop/backend/auth/dto/AuthTokens.java
package com.nextshop.backend.auth.dto;

/**
 * Internal DTO (Service layer)
 */
public record AuthTokens(
        String accessToken,
        String refreshToken
) {
}