// src/main/java/com/nextshop/backend/user/UserProfileResponse.java
package com.nextshop.backend.user;

public record UserProfileResponse(
        Long id,
        String email,
        String name,
        String phone,
        String role
) {
}
