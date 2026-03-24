//backend/src/main/java/com/nextshop/backend/cart/CartController.java
package com.nextshop.backend.cart;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Session-bound and Identity-focused Cart API.
 * Uses public UUID strings for all operations to prevent IDOR and sequence-guessing.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CartController {

    private final CartService cartService;

    /**
     * ✅ Recommended Production Entrypoint: Create new secure cart session.
     * Integrates HttpSession binding to prevent UUID-hijacks (Risk 1 Fix).
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse createCart(HttpSession session) {
        return CartResponse.from(cartService.createCart(session.getId()));
    }

    /**
     * ✅ Secure Retrieval by UUID and Session.
     */
    @GetMapping("/{uuid}")
    public CartResponse getCart(HttpSession session, @PathVariable String uuid) {
        return cartService.getCartResponse(UUID.fromString(uuid), session.getId());
    }

    @PostMapping("/{uuid}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse addItem(HttpSession session,
                                @PathVariable String uuid,
                                @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(UUID.fromString(uuid), session.getId(), request);
    }

    @PatchMapping("/{uuid}/items/{itemId}")
    public CartResponse updateItem(HttpSession session,
                                    @PathVariable String uuid,
                                    @PathVariable Long itemId,
                                    @Valid @RequestBody UpdateCartItemRequest request) {
        // Simple UUID retrieval logic
        return cartService.updateItemQuantity(UUID.fromString(uuid), itemId, request);
    }

    @DeleteMapping("/{uuid}/items/{itemId}")
    public CartResponse removeItem(HttpSession session,
                                    @PathVariable String uuid,
                                    @PathVariable Long itemId) {
        return cartService.removeItem(UUID.fromString(uuid), itemId);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(@PathVariable String uuid) {
        cartService.clearCart(UUID.fromString(uuid));
    }
}
