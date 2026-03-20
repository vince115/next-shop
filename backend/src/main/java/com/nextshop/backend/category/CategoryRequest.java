package com.nextshop.backend.category;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank String name,
        @NotBlank String slug,
        Long parentId          // nullable — null means root category
) {}
