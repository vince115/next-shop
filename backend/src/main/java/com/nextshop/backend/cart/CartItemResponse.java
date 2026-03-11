//backend/src/main/java/com/nextshop/backend/cart/CartItemResponse.java
package com.nextshop.backend.cart;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        ProductSummary product,
        Integer quantity,
        BigDecimal subtotal) {

    static CartItemResponse from(CartItem item) {

        BigDecimal price = item.getProduct().getPrice();

        return new CartItemResponse(
                item.getId(),
                new ProductSummary(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImageUrl(),
                        price),
                item.getQuantity(),
                price.multiply(BigDecimal.valueOf(item.getQuantity())));
    }
}
