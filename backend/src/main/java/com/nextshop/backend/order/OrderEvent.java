package com.nextshop.backend.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "order_events", indexes = {
    @Index(name = "idx_order_event_order_id", columnList = "order_id")
})
@Getter
@Setter
@NoArgsConstructor
public class OrderEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "type", nullable = false)
    private String type; // e.g., ORDER_CREATED, PAYMENT_SUCCEEDED, etc.

    @Column(name = "payload", columnDefinition = "TEXT")
    private String payload; // JSON representation of the event data

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }
}
