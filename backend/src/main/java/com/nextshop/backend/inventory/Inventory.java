package com.nextshop.backend.inventory;

import com.nextshop.backend.product.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "inventories", indexes = {
    @Index(name = "idx_inventory_product_id", columnList = "product_id")
})
@Getter
@Setter
@NoArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "warehouse_code")
    private String warehouseCode;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
