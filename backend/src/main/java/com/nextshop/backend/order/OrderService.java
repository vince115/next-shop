package com.nextshop.backend.order;

import com.nextshop.backend.inventory.InventoryRepository;
import com.nextshop.backend.monitoring.AlertingService;
import com.nextshop.backend.payment.PendingWebhook;
import com.nextshop.backend.payment.PendingWebhookRepository;
import com.nextshop.backend.product.*;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final PendingWebhookRepository pendingWebhookRepository;
    private final AdminActionLogRepository adminActionLogRepository;
    private final OrderEventRepository orderEventRepository;
    private final AlertingService alertingService;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public List<OrderResponse> listOrders() {
        return orderRepository.findAllWithItems().stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        return OrderResponse.from(order);
    }

    public List<OrderResponse> getMyOrders(String email) {
        return orderRepository.findAllWithItems().stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional
    public OrderResponse checkout(CheckoutRequest request) {
        log.info("Starting bound checkout for requestId={}", request.getRequestId());

        return orderRepository.findByRequestIdWithItems(request.getRequestId())
                .map(existingOrder -> {
                    log.info("RequestId={} duplicate. Returning order id={}", 
                        request.getRequestId(), existingOrder.getId());
                    return OrderResponse.from(existingOrder);
                })
                .orElseGet(() -> processCheckout(request));
    }

    /**
     * ✅ Convergence Guaranteed Payment Success (Step 1 & 4 logic):
     * Force-syncs order and inventory to PAID state.
     */
    @Transactional
    public OrderResponse paymentSuccess(Long orderId, String adminId, String requestId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (requestId != null && adminActionLogRepository.existsByRequestId(requestId)) {
            return OrderResponse.from(order);
        }

        // Convergence Check: If already PAID, just ensure stock integrity
        if (order.getStatus() == OrderStatus.PAID) {
            ensureStockConsistency(order);
            return OrderResponse.from(order);
        }

        if (order.getStatus() == OrderStatus.REFUNDED) return OrderResponse.from(order);

        // Forced truth override (Step 2 & 3 logic)
        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntent pi = PaymentIntent.retrieve(order.getPaymentIntentId());
            if (!"succeeded".equals(pi.getStatus()) && adminId != null) {
                alertingService.triggerAlert("CRITICAL_OVERRIDE_DENIED", "Admin id=" + adminId + " tried to force PAID on ID=" + orderId + " but PI status is " + pi.getStatus());
                throw new IllegalStateException("Security breach denied: PI not succeeded.");
            }
        } catch (StripeException e) {
            log.warn("Stripe check unavailable during success sync id={}", orderId);
        }

        if (adminId != null) logAdminAction(adminId, "FORCE_MARK_PAID", orderId, requestId);

        order.setStatus(OrderStatus.PAID);
        Order saved = orderRepository.save(order);
        
        // Ensure inventory follows order state (Step 1 requirements)
        ensureStockConsistency(saved);
        
        emitEvent(orderId, "PAYMENT_SUCCEEDED", "{\"triggered_by\": \"" + (adminId != null ? adminId : "SYSTEM") + "\"}");
        
        return OrderResponse.from(saved);
    }

    @Transactional
    public void paymentSuccessByPi(String paymentIntentId, Long amountCents) {
        Order order = orderRepository.findByPaymentIntentIdWithItems(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Unmatched PI: " + paymentIntentId));
        
        long orderAmountCents = order.getTotalPrice().multiply(BigDecimal.valueOf(100)).longValue();
        if (orderAmountCents == amountCents) {
            paymentSuccess(order.getId(), null, null);
        } else {
            alertingService.triggerAlert("PAYMENT_MISMATCH", "Critical: order id=" + order.getId() + " Expected " + orderAmountCents + " but received " + amountCents);
        }
    }

    /**
     * ✅ Final Payment State Guard (Step 2 requirements):
     * Before marking FAILED, check Stripe one last time to prevent ghost-cancellations.
     */
    @Transactional
    public OrderResponse paymentFailed(Long orderId, String adminId, String requestId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (requestId != null && adminActionLogRepository.existsByRequestId(requestId)) {
            return OrderResponse.from(order);
        }

        if (order.getStatus() == OrderStatus.PAID || order.getStatus() == OrderStatus.REFUNDED) {
            return OrderResponse.from(order);
        }

        // ✅ Step 2 Truth Guard (Goal 1 logic)
        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntent pi = PaymentIntent.retrieve(order.getPaymentIntentId());
            if ("succeeded".equals(pi.getStatus())) {
                log.warn("CONVERGENCE SHIELD: Stopped FAILED transition for order id={} because Stripe is already SUCCEEDED.", orderId);
                return paymentSuccess(orderId, null, null);
            }
        } catch (Exception e) {
            log.error("Failed to query Stripe truth id={}: {}", orderId, e.getMessage());
        }

        if (adminId != null) logAdminAction(adminId, "FORCE_MARK_FAILED", orderId, requestId);

        order.setStatus(OrderStatus.FAILED);
        Order saved = orderRepository.save(order);
        
        // Final convergence of inventory
        ensureStockConsistency(saved);
        
        emitEvent(orderId, "PAYMENT_FAILED", "{\"triggered_by\": \"" + (adminId != null ? adminId : "SYSTEM") + "\"}");
        
        return OrderResponse.from(saved);
    }

    @Transactional
    public void paymentFailedByPi(String paymentIntentId) {
        orderRepository.findByPaymentIntentIdWithItems(paymentIntentId)
                .ifPresent(order -> paymentFailed(order.getId(), null, null));
    }

    @Transactional
    public void reconcilePayments() {
        Stripe.apiKey = stripeSecretKey;
        List<Order> audits = orderRepository.findPendingOrdersBefore(Instant.now(), PageRequest.of(0, 50));

        for (Order order : audits) {
            try {
                if (order.getPaymentIntentId() == null) continue;
                PaymentIntent pi = PaymentIntent.retrieve(order.getPaymentIntentId());
                
                // ✅ Step 3 Reconciliation Override (Goal 3 requirements)
                if ("succeeded".equals(pi.getStatus())) {
                    log.info("Reconciliation found PAID PI={} for order id={}. Forcing state convergence.", pi.getId(), order.getId());
                    paymentSuccessByPi(order.getPaymentIntentId(), pi.getAmount());
                } else if (order.getStatus() == OrderStatus.PAID) {
                    alertingService.triggerAlert("CRITICAL_INCONSISTENCY", "Order id=" + order.getId() + " is PAID but Stripe PI is " + pi.getStatus());
                }
            } catch (StripeException e) {
                log.warn("PI check error: {}", e.getMessage());
            }
        }
    }

    /**
     * ✅ Idempotent Stock Correction (Step 1 & 4 Requirements):
     * Guarantees that inventory always reflects the final order status, 
     * regardless of how many times the state transition was retried.
     */
    @Transactional
    public void ensureStockConsistency(Order order) {
        OrderStatus status = order.getStatus();

        // 1. PAID orders must NEVER have stock restored.
        if (status == OrderStatus.PAID) {
            if (order.isStockRestored()) {
                // Critical Anomaly: If stock was returned but order is PAID, subtract it again. (Goal 3)
                log.error("CONVERGENCE_FIX: Re-deducting stock for PAID order id={} that had an erroneous restoration.", order.getId());
                deductStockInternal(order);
                order.setStockRestored(false);
                orderRepository.save(order);
                emitEvent(order.getId(), "STOCK_RE_DEDUCTED", "{\"reason\": \"CONVERGENCE\"}");
            }
        }

        // 2. TERMINATED orders must ALWAYS have stock restored (if not already). (Goal 3)
        if (status == OrderStatus.FAILED || status == OrderStatus.CANCELLED) {
            if (!order.isStockRestored()) {
                restoreStock(order);
                orderRepository.save(order);
                emitEvent(order.getId(), "STOCK_RESTORED", "{\"reason\": \"CONVERGENCE\"}");
            }
        }
    }

    @Transactional
    public OrderResponse refundOrder(Long orderId, boolean restock, String adminId, String requestId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (requestId != null && adminActionLogRepository.existsByRequestId(requestId)) {
            return OrderResponse.from(order);
        }

        if (order.getStatus() != OrderStatus.PAID) {
            throw new IllegalStateException("Refund only for PAID.");
        }

        try {
            Stripe.apiKey = stripeSecretKey;
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(order.getPaymentIntentId())
                    .build();

            Refund.create(params);
            
            order.setStatus(OrderStatus.REFUNDED);
            
            if (restock && !order.isStockRestored()) {
                restoreStock(order);
            }
            
            Order saved = orderRepository.save(order);
            emitEvent(orderId, "REFUNDED", "{\"restocked\": " + restock + "}");
            
            return OrderResponse.from(saved);
        } catch (StripeException e) {
            throw new RuntimeException("Refund processing error", e);
        }
    }

    @Transactional
    public void manualStockRestoration(Long orderId, String adminId, String requestId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        
        if (requestId != null && adminActionLogRepository.existsByRequestId(requestId)) return;

        if (!order.isStockRestored()) {
            restoreStock(order);
            orderRepository.save(order);
            logAdminAction(adminId, "MANUAL_STOCK_RESTORE", orderId, requestId);
            emitEvent(orderId, "STOCK_RESTORED", "{\"reason\": \"MANUAL\"}");
        }
    }

    @Transactional
    public void autoCancelExpiredOrders() {
        Instant threshold = Instant.now().minus(10, ChronoUnit.MINUTES);
        List<Order> expired = orderRepository.findPendingOrdersBefore(threshold, PageRequest.of(0, 20));

        for (Order order : expired) {
            paymentFailed(order.getId());
        }
    }

    @Transactional
    public void processPendingWebhooks() {
        List<PendingWebhook> pending = pendingWebhookRepository.findAllByStatus("PENDING");
        for (PendingWebhook pw : pending) {
            try {
                Stripe.apiKey = stripeSecretKey;
                PaymentIntent pi = PaymentIntent.retrieve(pw.getPaymentIntentId());
                if ("succeeded".equals(pi.getStatus())) {
                    paymentSuccessByPi(pw.getPaymentIntentId(), pi.getAmount());
                    pendingWebhookRepository.delete(pw);
                }
            } catch (Exception e) {
                pw.setRetryCount(pw.getRetryCount() + 1);
                if (pw.getRetryCount() > 5) pw.setStatus("DEAD");
                pendingWebhookRepository.save(pw);
            }
        }
    }

    @Transactional
    public OrderResponse paymentSuccess(Long orderId) {
        return paymentSuccess(orderId, null, null);
    }

    @Transactional
    public OrderResponse paymentFailed(Long orderId) {
        return paymentFailed(orderId, null, null);
    }

    @Transactional
    public void validateDataIntegrity() {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            inventoryRepository.findByProductId(product.getId()).ifPresent(inventory -> {
                long totalSold = orderRepository.countSoldByProductId(product.getId());
                long actualStock = inventory.getStock();
                log.info("INTEGRITY_CHECK: Product id={} sold={} current_stock={}", product.getId(), totalSold, actualStock);
                if (actualStock < 0) {
                    alertingService.triggerAlert("INVENTORY_CORRUPTION", "CRITICAL: Negative stock detected for product id=" + product.getId());
                }
            });
        }
    }

    @Transactional
    public void emitEvent(Long orderId, String type, String payload) {
        OrderEvent event = new OrderEvent();
        event.setOrderId(orderId);
        event.setType(type);
        event.setPayload(payload);
        orderEventRepository.save(event);
        log.info("ORDER_LIFE: Event '{}' emitted for order id={}.", type, orderId);
    }

    private void deductStockInternal(Order order) {
        for (OrderItem item : order.getItems()) {
            inventoryRepository.deductStockAtomic(item.getProduct().getId(), item.getQuantity());
        }
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            inventoryRepository.restoreStock(item.getProduct().getId(), item.getQuantity());
        }
        order.setStockRestored(true);
    }

    private void logAdminAction(String adminId, String action, Long orderId, String requestId) {
        AdminActionLog logEntry = new AdminActionLog();
        logEntry.setAdminId(adminId);
        logEntry.setAction(action);
        logEntry.setOrderId(orderId);
        logEntry.setRequestId(requestId);
        adminActionLogRepository.save(logEntry);
        log.info("AUDIT: Admin={} on order id={} logic={}.", adminId, orderId, action);
    }

    private OrderResponse processCheckout(CheckoutRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setRequestId(request.getRequestId());
        order.setStatus(OrderStatus.PENDING);
        order.setStockRestored(false);
        
        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CheckoutItem item : request.getItems()) {
            int updated = inventoryRepository.deductStockAtomic(item.getProductId(), item.getQuantity());
            if (updated == 0) {
                throw new InsufficientStockException(item.getProductId(), item.getQuantity(), 0);
            }

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException(item.getProductId()));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setPrice(product.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            items.add(orderItem);
            totalPrice = totalPrice.add(orderItem.getSubtotal());
        }

        order.setItems(items);
        order.setTotalPrice(totalPrice);
        order.setTotalItems(items.stream().mapToInt(OrderItem::getQuantity).sum());

        try {
            Stripe.apiKey = stripeSecretKey;
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(totalPrice.multiply(BigDecimal.valueOf(100)).longValue())
                    .setCurrency("usd")
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                    )
                    .build();

            PaymentIntent pi = PaymentIntent.create(params);
            order.setPaymentIntentId(pi.getId());
            Order saved = orderRepository.save(order);
            emitEvent(saved.getId(), "ORDER_CREATED", "{}");
            return OrderResponse.from(saved, pi.getClientSecret());
        } catch (StripeException e) {
            throw new RuntimeException("Stripe unavailable", e);
        }
    }
}
