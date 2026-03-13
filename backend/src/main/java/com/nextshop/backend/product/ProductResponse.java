//backend/src/main/java/com/nextshop/backend/product/ProductResponse.java
package com.nextshop.backend.product;

import com.nextshop.backend.category.CategoryResponse;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer stock,
        CategoryResponse category,
        List<String> imageUrls,
        Instant createdAt) {
    static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getCategory() == null ? null : CategoryResponse.from(p.getCategory()),
                p.getImages().stream().map(ProductImage::getUrl).toList(),
                p.getCreatedAt());
    }
}
