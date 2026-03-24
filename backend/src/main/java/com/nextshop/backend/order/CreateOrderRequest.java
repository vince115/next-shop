package com.nextshop.backend.order;

import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
    @NotNull(message = "CartUuid is required")
    String cartUuid
) {}
