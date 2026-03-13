//backend/src/main/java/com/nextshop/backend/product/ProductService.java
package com.nextshop.backend.product;

import com.nextshop.backend.category.Category;
import com.nextshop.backend.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;

    public Page<ProductResponse> findAll(int page, int size, String sort, String categorySlug) {
        Pageable pageable = PageRequest.of(page, size, mapSort(sort));
        Page<Product> result = (categorySlug == null || categorySlug.isBlank())
                ? productRepository.findAll(pageable)
                : productRepository.findAllByCategory_Slug(categorySlug, pageable);
        return result.map(ProductResponse::from);
    }

    private Sort mapSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        return switch (sort) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    public ProductResponse findById(Long id) {
        return ProductResponse.from(getOrThrow(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        replaceImages(saved, request.getImageUrls());
        return ProductResponse.from(getOrThrow(saved.getId()));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getOrThrow(id);
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        replaceImages(saved, request.getImageUrls());
        return ProductResponse.from(getOrThrow(saved.getId()));
    }

    @Transactional
    public void delete(Long id) {
        getOrThrow(id);
        productImageRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }

    private Product getOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    private void applyRequest(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());

        if (request.getCategorySlug() == null || request.getCategorySlug().isBlank()) {
            product.setCategory(null);
        } else {
            Category category = categoryRepository.findBySlugAndDeletedAtIsNull(request.getCategorySlug())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategorySlug()));
            product.setCategory(category);
        }
    }

    private void replaceImages(Product product, List<String> imageUrls) {
        if (imageUrls == null) {
            return;
        }

        productImageRepository.deleteByProductId(product.getId());

        for (int i = 0; i < imageUrls.size(); i++) {
            String url = imageUrls.get(i);
            if (url == null || url.isBlank()) {
                continue;
            }

            ProductImage img = new ProductImage();
            img.setProduct(product);
            img.setUrl(url);
            img.setPosition(i);
            productImageRepository.save(img);
        }
    }
}
