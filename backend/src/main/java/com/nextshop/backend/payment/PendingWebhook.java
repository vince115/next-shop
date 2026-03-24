package com.nextshop.backend.payment;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * ✅ Pending Webhook Fallback (Step 3 requirements):
 * Stores Stripe webhooks that arrive before their corresponding Order is committed.
 */
@Entity
@Table(name = "pending_webhooks", indexes = {
    @Index(name = "idx_pending_webhook_id", columnList = "event_id", unique = true),
    @Index(name = "idx_pending_pi_id", columnList = "payment_intent_id")
})
@Getter
@Setter
@NoArgsConstructor
public class PendingWebhook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", unique = true, nullable = false)
    private String eventId;

    @Column(name = "payment_intent_id", nullable = false)
    private String paymentIntentId;

    @Column(name = "payload", columnDefinition = "TEXT")
    private String payload;

    @Column(name = "retry_count", nullable = false)
    private int retryCount = 0;

    @Column(name = "status", nullable = false)
    private String status = "PENDING"; // PENDING, DEAD

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        this.createdAt = Instant.now();
    }
}
