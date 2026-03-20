package com.nextshop.backend.category;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        Long parentId
) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(
                c.getId(),
                c.getName(),
                c.getSlug(),
                c.getParent() != null ? c.getParent().getId() : null
        );
    }
}
