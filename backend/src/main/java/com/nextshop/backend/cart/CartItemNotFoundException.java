package com.nextshop.backend.cart;

public class CartItemNotFoundException extends RuntimeException {
    public CartItemNotFoundException(Long id) {
        super("Cart item not found: " + id);
    }
}
