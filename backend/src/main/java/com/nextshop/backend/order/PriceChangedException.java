package com.nextshop.backend.order;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import java.math.BigDecimal;

@ResponseStatus(HttpStatus.CONFLICT)
public class PriceChangedException extends RuntimeException {
    public PriceChangedException(Long productId, BigDecimal expected, BigDecimal actual) {
        super(String.format("Price changed for product %d: expected %s, but is now %s. Please refresh your cart.", 
            productId, expected, actual));
    }
}
