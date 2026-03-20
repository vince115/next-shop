package com.nextshop.backend.payment;

import com.nextshop.backend.user.User;
import com.nextshop.backend.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
@Slf4j
public class PaymentMethodController {

    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<PaymentMethodResponse> getMyPaymentMethods(Authentication auth) {
        Long userId = getUserId(auth);
        log.info("[DEBUG] Fetching payment methods for email: {}, userId: {}", auth.getName(), userId);
        List<PaymentMethod> methods = paymentMethodRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
        log.info("[DEBUG] Found {} payment methods for userId: {}", methods.size(), userId);
        return methods.stream()
                .map(PaymentMethodResponse::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public PaymentMethodResponse create(Authentication auth, @Valid @RequestBody PaymentMethodRequest request) {
        Long userId = getUserId(auth);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        PaymentMethod pm = new PaymentMethod();
        pm.setUser(user);
        pm.setProvider("stripe"); // Default provider
        pm.setPaymentToken(request.paymentToken());
        pm.setBrand(request.brand());
        pm.setLast4(request.last4());
        pm.setExpMonth(request.expMonth());
        pm.setExpYear(request.expYear());
        pm.setDefault(false);

        // If it's the first card for this user, make it default
        List<PaymentMethod> userCards = paymentMethodRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
        if (userCards.isEmpty()) {
            pm.setDefault(true);
        }

        return PaymentMethodResponse.from(paymentMethodRepository.save(pm));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(Authentication auth, @PathVariable Long id) {
        Long userId = getUserId(auth);
        PaymentMethod pm = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment method not found"));

        if (!pm.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        boolean wasDefault = pm.isDefault();
        paymentMethodRepository.delete(pm);

        if (wasDefault) {
            List<PaymentMethod> remain = paymentMethodRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
            if (!remain.isEmpty()) {
                PaymentMethod next = remain.get(0);
                next.setDefault(true);
                paymentMethodRepository.save(next);
            }
        }
    }

    @PatchMapping("/{id}/default")
    @Transactional
    public void setDefault(Authentication auth, @PathVariable Long id) {
        Long userId = getUserId(auth);
        PaymentMethod target = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment method not found"));

        if (!target.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        // Set all others to false
        paymentMethodRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(oldDefault -> {
                    oldDefault.setDefault(false);
                    paymentMethodRepository.save(oldDefault);
                });

        // Set target to true
        target.setDefault(true);
        paymentMethodRepository.save(target);
    }

    private Long getUserId(Authentication auth) {
        if (auth == null) {
            log.warn("[DEBUG] No authentication found");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("[DEBUG] User not found for email: {}", email);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                });
        log.info("[DEBUG] Resolved userId: {} for email: {}", user.getId(), email);
        return user.getId();
    }
}
