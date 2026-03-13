package com.nextshop.backend.auth.dto;

public record AuthUserResponse(
        Long id,
        String email,
        String name,
        String role
) {
}
