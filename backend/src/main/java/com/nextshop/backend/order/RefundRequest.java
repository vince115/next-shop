package com.nextshop.backend.order;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RefundRequest {
    private boolean restock = true; // Default to true for safety
}
