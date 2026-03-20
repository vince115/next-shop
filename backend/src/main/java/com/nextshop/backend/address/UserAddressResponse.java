package com.nextshop.backend.address;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record UserAddressResponse(
    Long id,
    String name,
    String phone,
    String addressLine1,
    String addressLine2,
    String city,
    String postalCode,
    String country,
    boolean isDefault
) {
    public static UserAddressResponse from(UserAddress address) {
        return new UserAddressResponse(
            address.getId(),
            address.getName(),
            address.getPhone(),
            address.getAddressLine1(),
            address.getAddressLine2(),
            address.getCity(),
            address.getPostalCode(),
            address.getCountry(),
            address.isDefault()
        );
    }
}
