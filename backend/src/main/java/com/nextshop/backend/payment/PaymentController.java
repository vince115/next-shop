package com.nextshop.backend.payment;

import com.nextshop.backend.order.Order;
import com.nextshop.backend.order.OrderNotFoundException;
import com.nextshop.backend.order.OrderRepository;
import com.nextshop.backend.order.OrderStatus;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Production-safe PaymentIntent creation.
 * Total amount is ALWAYS calculated on backend from Order database.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaymentController {

    private final OrderRepository orderRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostMapping("/payment-intent")
    public Map<String, String> createPaymentIntent(@RequestBody PaymentRequest request) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        log.info("Creating PaymentIntent for orderId={}", request.orderId());

        // 1. Load Order from DB
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new OrderNotFoundException(request.orderId()));

        // 2. Validate Status
        if (order.getStatus() != OrderStatus.PENDING) {
            log.warn("Cannot create PaymentIntent for order id={} with status={}", order.getId(), order.getStatus());
            throw new IllegalStateException("Order must be in PENDING status to process payment. Currently: " + order.getStatus());
        }

        // 3. Calculate amount in cents (Stripe required)
        long amountCents = order.getTotalPrice().multiply(new BigDecimal(100)).longValue();

        log.info("Designing PaymentIntent for orderId={} amount={} (cents) currency=usd", order.getId(), amountCents);

        // 4. Create Stripe PaymentIntent with metadata.orderId
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountCents)
                .setCurrency("usd") // Locked in backend
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .putMetadata("orderId", order.getId().toString())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());

        log.info("Dispatched clientSecret for orderId={} PI ID={}", order.getId(), paymentIntent.getId());

        return response;
    }
}
