package com.nextshop.backend.payment;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record PaymentMethodRequest(

    @NotBlank String paymentToken,
    @NotBlank String brand,
    @NotBlank String last4,

    @NotNull
    @Min(1) @Max(12)
    Integer expMonth,

    @NotNull
    @Min(2025)
    Integer expYear
) {}
