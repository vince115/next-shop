package com.nextshop.backend.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddCartItemRequest {

    @NotNull
    private Long productId;

    /**
     * ✅ Production SKU Support: Variant Identifier.
     * Prevents 'quantity explosion' collision between different 
     * variants of the same product (Risk 2 Fix).
     */
    private Long variantId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
