package com.nextshop.backend.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    void deleteByProductId(Long productId);

    void deleteByProduct(Product product);
}
