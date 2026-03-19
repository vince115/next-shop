// backend/src/main/java/com/nextshop/backend/auth/dto/RefreshTokenRepository.java

package com.nextshop.backend.auth;

import com.nextshop.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    @Query("SELECT rt FROM RefreshToken rt " +
            "JOIN FETCH rt.user u " +
            "LEFT JOIN FETCH u.role " +
            "WHERE rt.token = :token")
    Optional<RefreshToken> findByTokenWithUser(@Param("token") String token);

    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);
}
