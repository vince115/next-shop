package com.nextshop.backend.order;

import com.nextshop.backend.cart.Cart;
import com.nextshop.backend.cart.CartRepository;
import com.nextshop.backend.cart.CartItem;
import com.nextshop.backend.product.Product;
import com.nextshop.backend.product.InsufficientStockException;
import com.nextshop.backend.product.ProductNotFoundException;
import com.nextshop.backend.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public List<OrderResponse> listOrders() {
        return orderRepository.findAllWithItems().stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse checkout(Long cartId) {
        Cart cart = cartRepository.findByIdWithItems(cartId)
                .orElseThrow(() -> new com.nextshop.backend.cart.CartNotFoundException(cartId));

        if (cart.getItems().isEmpty()) {
            throw new CartEmptyException(cartId);
        }

        Order order = new Order();

        // Re-check stock under lock, then decrement stock (avoid oversell)
        for (CartItem cartItem : cart.getItems()) {
            Product locked = productRepository.findByIdForUpdate(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ProductNotFoundException(cartItem.getProduct().getId()));

            int requested = cartItem.getQuantity();
            int available = locked.getStock();
            if (requested > available) {
                throw new InsufficientStockException(locked.getId(), requested, available);
            }

            locked.setStock(available - requested);
        }

        List<OrderItem> items = cart.getItems().stream()
                .map(ci -> toOrderItem(order, ci))
                .toList();

        order.getItems().addAll(items);

        int totalItems = items.stream().mapToInt(OrderItem::getQuantity).sum();
        BigDecimal totalPrice = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalItems(totalItems);
        order.setTotalPrice(totalPrice);
        order.setStatus(OrderStatus.PENDING);

        Order saved = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return OrderResponse.from(saved);
    }

    private OrderItem toOrderItem(Order order, CartItem cartItem) {
        Product product = cartItem.getProduct();

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setPrice(product.getPrice());
        item.setQuantity(cartItem.getQuantity());
        item.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        return item;
    }
}
