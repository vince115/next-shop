package com.nextshop.backend.order;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * ✅ Operational Safety Layer: Admin Order Recovery APIs (Step 1 requirements).
 * Enforces ROLE_ADMIN and administrative idempotency (Step 4 requirements).
 */
@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@PreAuthorize("hasRole('ADMIN')")
public class OrderAdminController {

    private final OrderService orderService;

    @PostMapping("/{id}/mark-paid")
    public OrderResponse markAsPaid(
            @PathVariable Long id, 
            @RequestParam(name = "requestId") String requestId,
            Authentication authentication) {
        String adminId = (authentication != null) ? authentication.getName() : "ADMIN_USER";
        return orderService.paymentSuccess(id, adminId, requestId);
    }

    @PostMapping("/{id}/mark-failed")
    public OrderResponse markAsFailed(
            @PathVariable Long id, 
            @RequestParam(name = "requestId") String requestId,
            Authentication authentication) {
        String adminId = (authentication != null) ? authentication.getName() : "ADMIN_USER";
        return orderService.paymentFailed(id, adminId, requestId);
    }

    @PostMapping("/{id}/restore-stock")
    public void restoreStock(
            @PathVariable Long id, 
            @RequestParam(name = "requestId") String requestId,
            Authentication authentication) {
        String adminId = (authentication != null) ? authentication.getName() : "ADMIN_USER";
        orderService.manualStockRestoration(id, adminId, requestId);
    }
}
