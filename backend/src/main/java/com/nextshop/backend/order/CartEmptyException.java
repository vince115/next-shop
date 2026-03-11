package com.nextshop.backend.order;

public class CartEmptyException extends RuntimeException {
    public CartEmptyException(Long cartId) {
        super("Cart is empty: " + cartId);
    }
}
