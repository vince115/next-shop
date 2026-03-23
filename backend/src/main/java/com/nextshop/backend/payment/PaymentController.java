package com.nextshop.backend.payment;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    @Value("${stripe.secret.key:sk_test_placeholder}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @PostMapping("/payment-intent")
    public PaymentResponse createPaymentIntent(@Valid @RequestBody PaymentRequest request) {
        log.info("[STRIPE] Creating DEMO PaymentIntent for orderId: {}", request.orderId());
        
        try {
            // FIXED DEMO AMOUNT: $19.99 (USD) = 1999 cents
            long demoAmount = 1999L;
            String demoCurrency = "usd";

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(demoAmount)
                    .setCurrency(demoCurrency)
                    .putMetadata("order_id", request.orderId().toString())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            
            log.info("[STRIPE] PaymentIntent created: {} (Amount: {})", intent.getId(), demoAmount);
            return new PaymentResponse(intent.getClientSecret());
            
        } catch (StripeException e) {
            log.error("[STRIPE] Error creating PaymentIntent: {}", e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Failed to create PaymentIntent: " + e.getMessage()
            );
        }
    }
}
