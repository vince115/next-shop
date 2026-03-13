//backend/src/main/java/com/nextshop/backend/order/OrderController.java
package com.nextshop.backend.order;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderResponse> list() {
        return orderService.listOrders();
    }

    @GetMapping("/{orderId}")
    public OrderResponse get(@PathVariable Long orderId) {
        return orderService.getOrder(orderId);
    }

    @PostMapping("/checkout/{cartId}")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@PathVariable Long cartId) {
        return orderService.checkout(cartId);
    }

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        return orderService.getMyOrders(authentication.getName());
    }
}
