package com.nextshop.backend.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderResponse> list() {
        return orderService.listOrders();
    }

    @GetMapping("/{orderId}")
    public OrderResponse get(@PathVariable Long orderId) {
        return orderService.getOrder(orderId);
    }

    /**
     * ✅ Atomic Checkout Model (Step 3 requirements):
     * Deducts stock immediately and creates a PENDING order.
     */
    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@Valid @RequestBody CheckoutRequest request) {
        return orderService.checkout(request);
    }

    /**
     * ✅ Payment Success Endpoint (Step 6 requirements):
     * Confirms the transaction and marks the order as PAID.
     */
    @PostMapping("/{id}/payment-success")
    public OrderResponse paymentSuccess(@PathVariable("id") Long id) {
        return orderService.paymentSuccess(id);
    }

    /**
     * ✅ Payment Failure/Restore Endpoint (Step 6 requirements):
     * Restores physical stock and marks the order as FAILED.
     */
    @PostMapping("/{id}/payment-failed")
    public OrderResponse paymentFailed(@PathVariable("id") Long id) {
        return orderService.paymentFailed(id);
    }

    /**
     * ✅ Official Refund flow:
     * Reverses the Stripe transaction and selectively restores stock.
     */
    @PostMapping("/{id}/refund")
    public OrderResponse refund(
            @PathVariable("id") Long id,
            @RequestBody RefundRequest request,
            @RequestParam(name = "requestId") String requestId,
            Authentication authentication) {
        String adminId = (authentication != null) ? authentication.getName() : "SYSTEM_USER";
        return orderService.refundOrder(id, request.isRestock(), adminId, requestId);
    }

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        return orderService.getMyOrders(authentication.getName());
    }
}
