package com.nextshop.backend.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "admin_action_logs")
@Getter
@Setter
@NoArgsConstructor
public class AdminActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_id", nullable = false)
    private String adminId; // Using String for username/email

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "request_id", unique = true)
    private String requestId;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private Instant timestamp;

    @PrePersist
    void prePersist() {
        this.timestamp = Instant.now();
    }
}
