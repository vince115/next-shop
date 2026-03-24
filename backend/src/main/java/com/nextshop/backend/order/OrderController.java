package com.nextshop.backend.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;
    
    /**
     * ✅ In-Memory Rate Limiting (Concurrency Guard):
     * Limits the number of simultaneous checkout requests to 10.
     * 
     * ⚠️ LIMITATION:
     * This Semaphore is local to the current JVM instance. In a multi-instance 
     * (horizontally scaled) deployment, each instance will have its own limit of 10,
     * effectively making the total cluster limit = (10 * instances).
     * 
     * TODO: For multi-instance deployments:
     * 1. Replace with a distributed rate limiter (e.g., Redis-based Bucket4j or Redisson).
     * 2. Or implement rate limiting at the API Gateway / Load Balancer level.
     */
    private final Semaphore checkoutSemaphore = new Semaphore(10);

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
        int activeBefore = 10 - checkoutSemaphore.availablePermits();
        
        boolean acquired = false;
        try {
            acquired = checkoutSemaphore.tryAcquire(2, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Checkout process Interrupted");
        }

        if (!acquired) {
            log.warn("[RATE LIMIT] active={}/10 requestId={} action=REJECT", 
                activeBefore, request.getRequestId());
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Concurrent checkout limit reached. Please try again later.");
        }
        
        int activeAfter = 10 - checkoutSemaphore.availablePermits();
        log.info("[RATE LIMIT] active={}/10 requestId={} action=ACQUIRE", 
            activeAfter, request.getRequestId());
        
        try {
            log.info("=== CONTROLLER CHECKOUT START ===");
            log.info("CONTROLLER_REQUEST: requestId={}, userId={}, itemsCount={}", 
                request.getRequestId(), request.getUserId(), request.getItems().size());
            request.getItems().forEach(item -> 
                log.info("CONTROLLER_REQUEST_ITEM: productId={}, quantity={}", 
                    item.getProductId(), item.getQuantity()));
            
            OrderResponse response = orderService.checkout(request);
            log.info("=== CONTROLLER CHECKOUT SUCCESS ===");
            log.info("CONTROLLER_RESPONSE: orderId={}", response.id());
            return response;
        } catch (Exception e) {
            log.error("=== CONTROLLER CHECKOUT FAILED ===");
            log.error("CONTROLLER_ERROR: type={}, message={}", e.getClass().getSimpleName(), e.getMessage());
            log.error("CONTROLLER_REQUEST_CONTEXT: requestId={}, userId={}", 
                request.getRequestId(), request.getUserId());
            log.error("CONTROLLER_STACK_TRACE:", e);
            throw e;
        } finally {
            checkoutSemaphore.release();
            int activeFinally = 10 - checkoutSemaphore.availablePermits();
            log.info("[RATE LIMIT] active={}/10 requestId={} action=RELEASE", 
                activeFinally, request.getRequestId());
        }
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
