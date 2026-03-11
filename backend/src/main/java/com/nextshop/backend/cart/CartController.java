//backend/src/main/java/com/nextshop/backend/cart/CartController.java
package com.nextshop.backend.cart;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse createCart() {
        return cartService.createCart();
    }

    @GetMapping("/{cartId}")
    public CartResponse getCart(@PathVariable Long cartId) {
        return cartService.getCart(cartId);
    }

    @PostMapping("/{cartId}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse addItem(@PathVariable Long cartId,
            @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(cartId, request);
    }

    @PatchMapping("/{cartId}/items/{itemId}")
    public CartResponse updateItem(@PathVariable Long cartId,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateItemQuantity(cartId, itemId, request);
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    public CartResponse removeItem(@PathVariable Long cartId,
            @PathVariable Long itemId) {
        return cartService.removeItem(cartId, itemId);
    }

    @DeleteMapping("/{cartId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(@PathVariable Long cartId) {
        cartService.clearCart(cartId);
    }
}
