
// src/main/java/com/nextshop/backend/user/UserRepository.java
package com.nextshop.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

  // ✅ 給 Auth / Security 用（一定要有）
    Optional<User> findByEmail(String email);

    // ✅ DTO query（避免 Lazy）
    @Query("""
    SELECT new com.nextshop.backend.user.UserProfileResponse(
        u.id,
        u.email,
        u.name,
        u.phone,
        r.name
    )
    FROM User u
    JOIN u.role r
    """)
    List<UserProfileResponse> findAllUsers();

    @Query("""
    SELECT new com.nextshop.backend.user.UserProfileResponse(
        u.id,
        u.email,
        u.name,
        u.phone,
        r.name
    )
    FROM User u
    JOIN u.role r
    WHERE u.email = :email
    """)
    Optional<UserProfileResponse> findProfileByEmail(@Param("email") String email);

}
