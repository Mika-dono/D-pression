package KJX.KJX.controller;

import KJX.KJX.entity.Product;
import KJX.KJX.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
