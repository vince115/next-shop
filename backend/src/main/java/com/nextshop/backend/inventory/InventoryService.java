package com.nextshop.backend.inventory;

import com.nextshop.backend.product.ProductNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public Inventory getInventory(Long productId) {
        return inventoryRepository.findByProductId(productId)
                    .orElseThrow(() -> new ProductNotFoundException(productId));
    }
}
