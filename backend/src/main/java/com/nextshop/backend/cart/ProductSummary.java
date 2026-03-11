//backend/src/main/java/com/nextshop/backend/cart/ProductSummary.java
package com.nextshop.backend.cart;

import java.math.BigDecimal;

public record ProductSummary(
        Long id,
        String name,
        String imageUrl,
        BigDecimal price) {
}