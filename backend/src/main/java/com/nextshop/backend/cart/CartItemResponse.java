//backend/src/main/java/com/nextshop/backend/cart/CartItemResponse.java
package com.nextshop.backend.cart;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        ProductSummary product,
        Long variantId, // ✅ Support for variant tracking (Risk 2)
        Integer quantity,
        BigDecimal priceAtAddTime, // ✅ Pricing baseline (Risk 4)
        BigDecimal currentPrice, 
        BigDecimal subtotal) {

    static CartItemResponse from(CartItem item) {
        BigDecimal currentPrice = item.getProduct().getPrice();
        BigDecimal priceAtAdd = item.getPriceAtAddTime() != null ? item.getPriceAtAddTime() : currentPrice;

        return new CartItemResponse(
                item.getId(),
                new ProductSummary(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImageUrl(),
                        currentPrice),
                item.getVariantId(),
                item.getQuantity(),
                priceAtAdd,
                currentPrice,
                currentPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
    }
}
