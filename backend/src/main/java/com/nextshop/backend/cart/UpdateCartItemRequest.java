//backend/src/main/java/com/nextshop/backend/cart/UpdateCartItemRequest.java
package com.nextshop.backend.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCartItemRequest {

    @NotNull
    @Min(0)
    private Integer quantity;
}
