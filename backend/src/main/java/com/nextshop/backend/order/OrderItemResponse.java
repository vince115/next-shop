package com.nextshop.backend.order;

import com.nextshop.backend.cart.ProductSummary;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        ProductSummary product,
        Integer quantity,
        BigDecimal price,
        BigDecimal subtotal
) {
    static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                new ProductSummary(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImageUrl(),
                        item.getPrice()),
                item.getQuantity(),
                item.getPrice(),
                item.getSubtotal());
    }
}
