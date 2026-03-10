package com.nextshop.backend.cart;

public class CartNotFoundException extends RuntimeException {
    public CartNotFoundException(Long id) {
        super("Cart not found: " + id);
    }
}
