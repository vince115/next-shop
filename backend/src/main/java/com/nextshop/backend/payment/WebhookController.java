package com.nextshop.backend.payment;

import com.nextshop.backend.monitoring.AlertingService;
import com.nextshop.backend.order.OrderService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class WebhookController {

    private final OrderService orderService;
    private final WebhookEventRepository webhookEventRepository;
    private final PendingWebhookRepository pendingWebhookRepository;
    private final AlertingService alertingService;

    @Value("${stripe.webhook.secret:whsec_placeholder}")
    private String endpointSecret;

    @PostMapping("/webhook")
    public String handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        log.info("Received Stripe Webhook payload length={}", payload.length());

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            log.error("Stripe Webhook signature verification FAILED: {}", e.getMessage());
            return "Invalid signature";
        }

        // Webhook Deduplication
        if (webhookEventRepository.existsByEventId(event.getId())) {
            log.info("Duplicate Stripe event id={} detected. Skipping.", event.getId());
            return "OK";
        }

        log.info("Processing Stripe Event: code={} id={}", event.getType(), event.getId());

        Optional<StripeObject> stripeObject = event.getDataObjectDeserializer().getObject();

        if (stripeObject.isPresent() && stripeObject.get() instanceof PaymentIntent paymentIntent) {
            String piId = paymentIntent.getId();
            Long amount = paymentIntent.getAmount();

            try {
                switch (event.getType()) {
                    case "payment_intent.succeeded":
                        orderService.paymentSuccessByPi(piId, amount);
                        log.info("Bound payment success for PI={}", piId);
                        break;
                    
                    case "payment_intent.payment_failed":
                        orderService.paymentFailedByPi(piId);
                        log.info("Bound payment failure for PI={}. Stock release initiated.", piId);
                        break;

                    default:
                        log.info("Event '{}' for PI={} ignored.", event.getType(), piId);
                        break;
                }
            } catch (Exception e) {
                if ("payment_intent.succeeded".equals(event.getType())) {
                    log.warn("Target order for PI={} not found. Buffering success event.", piId);
                    storePendingWebhook(event, piId, payload);
                    
                    // Alerting for unmatched (Step 3 requirements)
                    alertingService.triggerAlert("WEBHOOK_UNMATCHED", "Success webhook received for PI=" + piId + " but no order found. Buffering for retry.");
                } else {
                    log.error("Failed to process event {} for PI={}: {}", event.getType(), piId, e.getMessage());
                }
            }
        }

        // Marken event as processed
        WebhookEvent processed = new WebhookEvent();
        processed.setEventId(event.getId());
        webhookEventRepository.save(processed);

        return "OK";
    }

    private void storePendingWebhook(Event event, String piId, String payload) {
        PendingWebhook pw = new PendingWebhook();
        pw.setEventId(event.getId());
        pw.setPaymentIntentId(piId);
        pw.setPayload(payload);
        pendingWebhookRepository.save(pw);
    }
}
