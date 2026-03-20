package com.nextshop.backend.payment;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.time.Instant;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record PaymentMethodResponse(
    Long id,
    String provider,
    String brand,
    String last4,
    Integer expMonth,
    Integer expYear,
    boolean isDefault,
    Instant createdAt
) {
    public static PaymentMethodResponse from(PaymentMethod pm) {
        return new PaymentMethodResponse(
            pm.getId(),
            pm.getProvider(),
            pm.getBrand(),
            pm.getLast4(),
            pm.getExpMonth(),
            pm.getExpYear(),
            pm.isDefault(),
            pm.getCreatedAt()
        );
    }
}
