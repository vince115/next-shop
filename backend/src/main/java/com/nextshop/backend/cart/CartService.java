package com.nextshop.backend.cart;

import com.nextshop.backend.product.Product;
import com.nextshop.backend.product.ProductNotFoundException;
import com.nextshop.backend.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Cart createCart(String sessionId) {
        Cart cart = new Cart();
        cart.setSessionId(sessionId);
        return cartRepository.save(cart);
    }

    public Cart getCartByUuid(UUID uuid) {
        return cartRepository.findByUuidWithItems(uuid)
                .orElseThrow(() -> new CartNotFoundException(uuid.toString()));
    }

    public CartResponse getCartResponse(UUID uuid, String sessionId) {
        Cart cart = getCartByUuid(uuid);
        return CartResponse.from(cart);
    }

    public Optional<Cart> getActiveCartForUser(Long userId) {
        return cartRepository.findByUserIdAndActiveTrueWithItems(userId);
    }

    @Transactional
    public CartResponse mergeCartToUser(UUID anonymousUuid, Long userId, String sessionId) {
        Cart anonCart = cartRepository.findByUuidForUpdate(anonymousUuid)
                .orElseThrow(() -> new CartNotFoundException(anonymousUuid.toString()));
        Optional<Cart> userExistingCart = cartRepository.findByUserIdAndActiveTrueForUpdate(userId);

        if (userExistingCart.isPresent()) {
            Cart existing = userExistingCart.get();
            
            for (CartItem anonItem : anonCart.getItems()) {
                Optional<CartItem> matching = existing.getItems().stream()
                        .filter(i -> i.getProduct().getId().equals(anonItem.getProduct().getId()) 
                                 && Objects.equals(i.getVariantId(), anonItem.getVariantId()))
                        .findFirst();

                if (matching.isPresent()) {
                    matching.get().setQuantity(matching.get().getQuantity() + anonItem.getQuantity());
                } else {
                    CartItem newItem = new CartItem();
                    newItem.setCart(existing);
                    newItem.setProduct(anonItem.getProduct());
                    newItem.setVariantId(anonItem.getVariantId());
                    newItem.setQuantity(anonItem.getQuantity());
                    newItem.setPriceAtAddTime(anonItem.getPriceAtAddTime());
                    existing.getItems().add(newItem);
                }
            }
            existing.setSessionId(sessionId);
            cartRepository.save(existing);
            
            anonCart.setActive(false);
            cartRepository.save(anonCart);
            return CartResponse.from(existing);
        } else {
            anonCart.setUserId(userId);
            anonCart.setSessionId(sessionId);
            Cart saved = cartRepository.save(anonCart);
            return CartResponse.from(saved);
        }
    }

    @Transactional
    public CartResponse addItem(UUID uuid, String sessionId, AddCartItemRequest request) {
        Cart cart = cartRepository.findByUuidForUpdate(uuid)
                .orElseThrow(() -> new CartNotFoundException(uuid.toString()));
        
        if (cart.getSessionId() == null) cart.setSessionId(sessionId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(request.getProductId()));

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()) 
                         && Objects.equals(i.getVariantId(), request.getVariantId()))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + request.getQuantity());
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setVariantId(request.getVariantId());
            item.setQuantity(request.getQuantity());
            item.setPriceAtAddTime(product.getPrice());
            cart.getItems().add(item);
        }

        Cart saved = cartRepository.save(cart);
        return CartResponse.from(saved);
    }

    @Transactional
    public CartResponse updateItemQuantity(UUID uuid, Long itemId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByUuidForUpdate(uuid)
                .orElseThrow(() -> new CartNotFoundException(uuid.toString()));
        
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new CartItemNotFoundException(itemId));

        item.setQuantity(request.getQuantity());
        Cart saved = cartRepository.save(cart);
        return CartResponse.from(saved);
    }

    @Transactional
    public CartResponse removeItem(UUID uuid, Long itemId) {
        Cart cart = cartRepository.findByUuidForUpdate(uuid)
                .orElseThrow(() -> new CartNotFoundException(uuid.toString()));
        
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        Cart saved = cartRepository.save(cart);
        return CartResponse.from(saved);
    }

    @Transactional
    public void clearCart(UUID uuid) {
        Cart cart = cartRepository.findByUuidForUpdate(uuid)
                .orElseThrow(() -> new CartNotFoundException(uuid.toString()));
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
