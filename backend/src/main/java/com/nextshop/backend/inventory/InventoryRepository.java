package com.nextshop.backend.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    /**
     * ✅ Atomic Inventory Deduction Model (Step 2 requirements):
     * High-performance 'Update-then-Check' flow.
     * Prevents overselling by only updating if stock >= qty.
     */
    @Modifying
    @Query("""
        UPDATE Inventory i 
        SET i.stock = i.stock - :qty 
        WHERE i.product.id = :productId 
        AND i.stock >= :qty
    """)
    int deductStockAtomic(@Param("productId") Long productId, @Param("qty") int qty);

    @Modifying
    @Query("""
        UPDATE Inventory i 
        SET i.stock = i.stock + :qty 
        WHERE i.product.id = :productId
    """)
    int restoreStock(@Param("productId") Long productId, @Param("qty") int qty);

    @Query("SELECT i FROM Inventory i WHERE i.product.id = :productId")
    Optional<Inventory> findByProductId(@Param("productId") Long productId);
}
