//backend/src/main/java/com/nextshop/backend/cart/CartItemRepository.java
package com.nextshop.backend.cart;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
