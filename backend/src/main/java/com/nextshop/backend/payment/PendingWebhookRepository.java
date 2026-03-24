package com.nextshop.backend.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface PendingWebhookRepository extends JpaRepository<PendingWebhook, Long> {

    boolean existsByEventId(String eventId);

    List<PendingWebhook> findAllByStatus(String status);
}
