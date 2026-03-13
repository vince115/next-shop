package com.nextshop.backend.auth.dto;

public record AuthResponse(
        String token,
        AuthUserResponse user
) {
}
