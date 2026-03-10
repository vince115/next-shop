package com.nextshop.backend.cart;

import com.nextshop.backend.product.Product;
import com.nextshop.backend.product.ProductNotFoundException;
import com.nextshop.backend.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
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
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(request.getProductId()));

        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst()
                .ifPresentOrElse(
                        existing -> existing.setQuantity(existing.getQuantity() + request.getQuantity()),
                        () -> {
                            CartItem item = new CartItem();
                            item.setCart(cart);
                            item.setProduct(product);
                            item.setQuantity(request.getQuantity());
                            cart.getItems().add(item);
                        }
                );

        return CartResponse.from(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItemQuantity(Long cartId, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrThrow(cartId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new CartItemNotFoundException(itemId));

        item.setQuantity(request.getQuantity());
        return CartResponse.from(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(Long cartId, Long itemId) {
        Cart cart = getOrThrow(cartId);
        boolean removed = cart.getItems().removeIf(i -> i.getId().equals(itemId));
        if (!removed) throw new CartItemNotFoundException(itemId);
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
