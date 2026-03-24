package com.nextshop.backend.order;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CartEmptyException extends RuntimeException {
    public CartEmptyException(String cartId) {
        super("Cart is empty: " + cartId);
    }
}
