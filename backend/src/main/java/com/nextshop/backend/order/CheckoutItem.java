package com.nextshop.backend.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CheckoutItem {

    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
