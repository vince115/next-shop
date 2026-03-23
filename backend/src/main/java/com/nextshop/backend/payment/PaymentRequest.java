package com.nextshop.backend.payment;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
    @NotNull(message = "OrderId is required")
    Long orderId
) {}
