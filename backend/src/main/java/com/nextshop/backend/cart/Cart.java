//backend/src/main/java/com/nextshop/backend/cart/Cart.java
package com.nextshop.backend.cart;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "carts", indexes = {
    @Index(name = "idx_cart_uuid", columnList = "uuid")
}, uniqueConstraints = {
    /**
     * ✅ Lifecycle Enforcement: Single Active Cart.
     * Prevents database bloat and 'Risk 3' state inconsistency 
     * by ensuring a user id only ever has ONE active record.
     */
    @UniqueConstraint(name = "uk_cart_user_active", columnNames = {"user_id", "active"})
})
@Getter
@Setter
@NoArgsConstructor
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, updatable = false)
    private UUID uuid = UUID.randomUUID();

    /**
     * ✅ Security Identifier: Temporary Guard.
     * Prevents cross-browser hijacks while a guest, but remains secondary to userId.
     */
    @Column(name = "session_id", nullable = true)
    private String sessionId;

    /**
     * ✅ Identity Identifier: Final Ownership.
     * If userId is present, this cart follows the user across devices/sessions (Risk 1 Fix).
     */
    @Column(name = "user_id", nullable = true)
    private Long userId;

    @Column(nullable = false)
    private boolean active = true;

    /**
     * ✅ Concurrency Safety: Optimistic Locking.
     * Prevents 'Risk 3' race conditions between multi-tab edits or checkouts.
     */
    @Version
    private Long version;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.uuid == null) {
            this.uuid = UUID.randomUUID();
        }
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
