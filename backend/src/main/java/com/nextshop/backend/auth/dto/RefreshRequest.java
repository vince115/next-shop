// backend/src/main/java/com/nextshop/backend/auth/dto/RefreshRequest.java
package com.nextshop.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank String refreshToken
) {
}
