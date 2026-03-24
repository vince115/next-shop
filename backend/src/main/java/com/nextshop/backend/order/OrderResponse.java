package com.nextshop.backend.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        List<OrderItemResponse> items,
        int totalItems,
        BigDecimal totalPrice,
        OrderStatus status,
        String paymentIntentId,
        String clientSecret,
        Instant createdAt,
        Instant updatedAt
) {
    static OrderResponse from(Order order) {
        return from(order, null);
    }

    static OrderResponse from(Order order, String clientSecret) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(OrderItemResponse::from)
                .toList();

        return new OrderResponse(
                order.getId(),
                items,
                order.getTotalItems(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getPaymentIntentId(),
                clientSecret,
                order.getCreatedAt(),
                order.getUpdatedAt());
    }
}
