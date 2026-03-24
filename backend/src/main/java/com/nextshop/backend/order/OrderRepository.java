package com.nextshop.backend.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
            SELECT DISTINCT o
            FROM Order o
            LEFT JOIN FETCH o.items i
            LEFT JOIN FETCH i.product
            ORDER BY o.createdAt DESC
            """)
    List<Order> findAllWithItems();

    @Query("""
            SELECT DISTINCT o
            FROM Order o
            LEFT JOIN FETCH o.items i
            LEFT JOIN FETCH i.product
            WHERE o.id = :id
            """)
    Optional<Order> findByIdWithItems(@Param("id") Long id);

    @Query("""
            SELECT DISTINCT o
            FROM Order o
            LEFT JOIN FETCH o.items i
            LEFT JOIN FETCH i.product
            WHERE o.userId = :userId
            ORDER BY o.createdAt DESC
            """)
    List<Order> findByUserIdWithItems(@Param("userId") Long userId);

    @Query("""
            SELECT DISTINCT o
            FROM Order o
            LEFT JOIN FETCH o.items i
            LEFT JOIN FETCH i.product
            WHERE o.requestId = :requestId
            """)
    Optional<Order> findByRequestIdWithItems(@Param("requestId") String requestId);

    @Query("""
            SELECT DISTINCT o
            FROM Order o
            LEFT JOIN FETCH o.items i
            LEFT JOIN FETCH i.product
            WHERE o.paymentIntentId = :paymentIntentId
            """)
    Optional<Order> findByPaymentIntentIdWithItems(@Param("paymentIntentId") String paymentIntentId);

    @Query("""
            SELECT COALESCE(SUM(i.quantity), 0) FROM OrderItem i
            JOIN i.order o
            WHERE i.product.id = :productId
            AND o.status = 'PAID'
            """)
    long countSoldByProductId(@Param("productId") Long productId);

    @Query("""
            SELECT o FROM Order o
            WHERE o.status = 'PENDING'
            AND o.expiresAt < :now
            """)
    List<Order> findExpiredPendingOrders(@Param("now") java.time.Instant now, org.springframework.data.domain.Pageable pageable);
}
