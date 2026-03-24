package com.nextshop.backend.cart;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("""
            SELECT DISTINCT c
            FROM Cart c
            LEFT JOIN FETCH c.items i
            LEFT JOIN FETCH i.product
            WHERE c.uuid = :uuid AND c.active = true
            """)
    Optional<Cart> findByUuidWithItems(@Param("uuid") UUID uuid);

    /**
     * ✅ Pessimistic Lock for Merge/Checkout.
     * Prevents 'Risk 3' race conditions between multi-tab edits or checkouts 
     * by locking the cart record at the database level.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Cart c WHERE c.uuid = :uuid")
    Optional<Cart> findByUuidForUpdate(@Param("uuid") UUID uuid);

    @Query("""
            SELECT DISTINCT c
            FROM Cart c
            LEFT JOIN FETCH c.items i
            LEFT JOIN FETCH i.product
            WHERE c.userId = :userId AND c.active = true
            """)
    Optional<Cart> findByUserIdAndActiveTrueWithItems(@Param("userId") Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Cart c WHERE c.userId = :userId AND c.active = true")
    Optional<Cart> findByUserIdAndActiveTrueForUpdate(@Param("userId") Long userId);
}
