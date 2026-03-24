package com.nextshop.backend.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CheckoutRequest {

    @NotNull
    private Long userId;

    /**
     * ✅ Idempotency Key (Step 3 requirements): Unique Request ID.
     * Prevents duplicate orders and double stock deduction under retries.
     */
    @NotNull
    private String requestId;

    @NotEmpty
    @Valid
    private List<CheckoutItem> items;
}
