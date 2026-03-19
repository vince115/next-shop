// src/main/java/com/nextshop/backend/user/UserController.java
package com.nextshop.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // ✅ 取得目前登入者
    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(Authentication authentication) {

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        return userRepository.findProfileByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    // 🔥 取得所有使用者（admin）
    @GetMapping
    public List<UserProfileResponse> getUsers(Authentication authentication) {

        System.out.println(authentication.getAuthorities());

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        // ✅ 正確權限判斷（關鍵修正：用 anyMatch）
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        // 📦 直接回 DTO（不碰 entity）
        return userRepository.findAllUsers();
    }
}