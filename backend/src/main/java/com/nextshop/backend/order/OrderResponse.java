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
        Instant createdAt,
        Instant updatedAt
) {
    static OrderResponse from(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(OrderItemResponse::from)
                .toList();

        return new OrderResponse(
                order.getId(),
                items,
                order.getTotalItems(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt());
    }
}
