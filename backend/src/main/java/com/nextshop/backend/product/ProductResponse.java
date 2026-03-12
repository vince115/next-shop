//backend/src/main/java/com/nextshop/backend/product/ProductResponse.java
package com.nextshop.backend.product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer stock,
        List<String> imageUrls,
        Instant createdAt) {
    static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getImages().stream().map(ProductImage::getUrl).toList(),
                p.getCreatedAt());
    }
}
