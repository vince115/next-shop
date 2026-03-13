package com.nextshop.backend.product;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

import jakarta.persistence.LockModeType;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Override
    @EntityGraph(attributePaths = {"images", "category"})
    @NonNull
    org.springframework.data.domain.Page<Product> findAll(@NonNull org.springframework.data.domain.Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"images", "category"})
    @NonNull
    Optional<Product> findById(@NonNull Long id);

    @EntityGraph(attributePaths = {"images", "category"})
    @NonNull
    org.springframework.data.domain.Page<Product> findAllByCategory_Slug(
            @NonNull String slug,
            @NonNull org.springframework.data.domain.Pageable pageable
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);
}
