package com.nextshop.backend.cart;

import com.nextshop.backend.product.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /**
     * ✅ Production Future-Proofing: Variant Support.
     * Prevents 'quantity explosion' collision between different 
     * variants of the same product (e.g., iPhone Black vs White).
     */
    @Column(name = "variant_id", nullable = true)
    private Long variantId;

    @Column(nullable = false)
    private Integer quantity;

    /**
     * ✅ Pricing Consistency: Record the price when the item was added.
     * Crucial for detecting price changes during the checkout lifecycle (Risk 4).
     */
    @Column(name = "price_at_add_time", nullable = false)
    private BigDecimal priceAtAddTime;

    @PrePersist
    @PreUpdate
    void syncPrice() {
        if (this.priceAtAddTime == null && this.product != null) {
            this.priceAtAddTime = this.product.getPrice();
        }
    }
}
