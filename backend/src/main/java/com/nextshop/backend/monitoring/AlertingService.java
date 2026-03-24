package com.nextshop.backend.monitoring;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * ✅ Observability Layer: Alerting Service (Step 3 requirements).
 * Centralizes critical Failure notifications for payment mismatches or 
 * reconciliation discrepancies.
 */
@Slf4j
@Service
public class AlertingService {

    public void triggerAlert(String category, String message) {
        // Log critical failure immediately
        log.error("CRITICAL_ALERT [{}]: {}", category, message);
        
        // Potential external notification (email / webhooks) integration point (Step 3 requirements)
        // sendToDiscord(message);
        // sendToOpsEmail(message);
    }

    public void triggerAlert(String category, String message, Throwable cause) {
        log.error("CRITICAL_ALERT [{}]: {}. Cause: {}", category, message, cause.getMessage());
    }
}
