package com.nextshop.backend.user;

public record UserProfileResponse(
        Long id,
        String email,
        String name,
        String phone,
        String role
) {
}
