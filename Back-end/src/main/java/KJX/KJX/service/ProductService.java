package KJX.KJX.service;

import KJX.KJX.entity.Product;
import KJX.KJX.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue();
    }
    
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        return productRepository.findById(id)
            .map(product -> {
                product.setName(productDetails.getName());
                product.setDescription(productDetails.getDescription());
                product.setCategory(productDetails.getCategory());
                product.setPrice(productDetails.getPrice());
                product.setStock(productDetails.getStock());
                product.setImageUrl(productDetails.getImageUrl());
                product.setFeatured(productDetails.getFeatured());
                return productRepository.save(product);
            })
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
