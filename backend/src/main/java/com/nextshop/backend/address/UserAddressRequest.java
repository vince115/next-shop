package com.nextshop.backend.address;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.NotBlank;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record UserAddressRequest(
    @NotBlank String name,
    @NotBlank String phone,
    @NotBlank String addressLine1,
    String addressLine2,
    @NotBlank String city,
    @NotBlank String postalCode,
    @NotBlank String country,
    boolean isDefault
) {}
