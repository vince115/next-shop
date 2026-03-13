package com.nextshop.backend.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("select c from Category c where c.deletedAt is null order by c.name asc")
    List<Category> findAllActiveOrderByName();

    Optional<Category> findBySlugAndDeletedAtIsNull(String slug);
}
