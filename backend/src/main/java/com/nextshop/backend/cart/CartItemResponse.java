package com.nextshop.backend.cart;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        BigDecimal price,
        Integer quantity,
        BigDecimal subtotal
) {
    static CartItemResponse from(CartItem item) {
        BigDecimal price = item.getProduct().getPrice();
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                price,
                item.getQuantity(),
                price.multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }
}
