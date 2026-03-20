// backend/src/main/java/com/nextshop/backend/auth/dto/TokenRefreshResult.java
package com.nextshop.backend.auth.dto;

import com.nextshop.backend.auth.RefreshToken;

public record TokenRefreshResult(String accessToken, RefreshToken refreshToken) {
}
