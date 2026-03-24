package com.nextshop.backend.cart;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record CartResponse(
        Long id,
        String uuid, // ✅ Frontend key for secure API interaction
        List<CartItemResponse> items,
        int totalItems,
        BigDecimal totalPrice,
        Instant createdAt,
        Instant updatedAt
) {
    static CartResponse from(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(CartItemResponse::from)
                .toList();

        int totalItems = items.stream().mapToInt(CartItemResponse::quantity).sum();
        BigDecimal totalPrice = items.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(cart.getId(), cart.getUuid().toString(), items, totalItems, totalPrice,
                cart.getCreatedAt(), cart.getUpdatedAt());
    }
}
