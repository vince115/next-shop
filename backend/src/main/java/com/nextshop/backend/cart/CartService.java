//backend/src/main/java/com/nextshop/backend/cart/CartService.java
package com.nextshop.backend.cart;

import com.nextshop.backend.product.Product;
import com.nextshop.backend.product.InsufficientStockException;
import com.nextshop.backend.product.ProductNotFoundException;
import com.nextshop.backend.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CartResponse createCart() {
        return CartResponse.from(cartRepository.save(new Cart()));
    }

    public CartResponse getCart(Long cartId) {
        return CartResponse.from(getOrThrow(cartId));
    }

    @Transactional
    public CartResponse addItem(Long cartId, AddCartItemRequest request) {
        Cart cart = getOrThrow(cartId);

        Long productId = Objects.requireNonNull(request.getProductId(), "productId");
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        int currentQty = existing != null ? existing.getQuantity() : 0;
        int newQty = currentQty + request.getQuantity();

        if (newQty > product.getStock()) {
            throw new InsufficientStockException(product.getId(), newQty, product.getStock());
        }

        if (existing != null) {
            existing.setQuantity(newQty);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            cart.getItems().add(item);
        }

        return CartResponse.from(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItemQuantity(Long cartId, Long itemId, UpdateCartItemRequest request) {

        Cart cart = getOrThrow(cartId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new CartItemNotFoundException(itemId));

        int quantity = request.getQuantity();

        // 防止 quantity <= 0 造成錯誤
        if (quantity <= 0) {
            cart.getItems().removeIf(i -> i.getId().equals(itemId));
        } else {
            int stock = item.getProduct().getStock();
            if (quantity > stock) {
                throw new InsufficientStockException(item.getProduct().getId(), quantity, stock);
            }
            item.setQuantity(quantity);
        }

        return CartResponse.from(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(Long cartId, Long itemId) {
        Cart cart = getOrThrow(cartId);
        boolean removed = cart.getItems().removeIf(i -> i.getId().equals(itemId));
        if (!removed)
            throw new CartItemNotFoundException(itemId);
        return CartResponse.from(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(Long cartId) {
        Cart cart = getOrThrow(cartId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrThrow(Long cartId) {
        return cartRepository.findByIdWithItems(cartId)
                .orElseThrow(() -> new CartNotFoundException(cartId));
    }
}
