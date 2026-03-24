package com.nextshop.backend.order;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * ✅ Automated Order Expiration (Step 5 requirements):
 * Regularly identifies and cancels 'PENDING' orders that have exceeded the 15-minute 
 * threshold, releasing physical stock back to the inventory pools.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrderExpirationScheduler {

    private final OrderService orderService;

    @Scheduled(fixedDelay = 60000) // Runs every minute
    public void runMaintenanceTasks() {
        log.debug("Starting order maintenance tasks...");
        try {
            // Task A: Resolve out-of-order webhooks
            orderService.processPendingWebhooks();
            
            // Task B: Reconcile PENDING orders with Stripe truth (Step 2 Goal 2)
            orderService.reconcilePayments();

            // Task C: Audit and cancel expired orders
            orderService.autoCancelExpiredOrders();
        } catch (Exception e) {
            log.error("Failed to run order maintenance tasks: {}", e.getMessage());
        }
    }

    @Scheduled(fixedDelay = 3600000) // Runs every hour
    public void runIntegrityAudit() {
        log.info("Starting long-term data integrity audit...");
        try {
            orderService.validateDataIntegrity();
        } catch (Exception e) {
            log.error("Failed to run integrity audit: {}", e.getMessage());
        }
        log.info("Integrity audit completed.");
    }
}
