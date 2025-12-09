package KJX.KJX.controller;

import KJX.KJX.entity.Post;
import KJX.KJX.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        postService.incrementViewCount(id);
        return postService.getPostById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Post>> getPostsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(postService.getPostsByCategory(category));
    }
    
    @GetMapping("/published")
    public ResponseEntity<List<Post>> getPublishedPosts() {
        return ResponseEntity.ok(postService.getPublishedPosts());
    }
    
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.savePost(post));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        return ResponseEntity.ok(postService.updatePost(id, postDetails));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
